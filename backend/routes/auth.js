import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Configure NodeMailer with lazy initialization for Vercel serverless environments
let transporterPromise = null;
const getTransporter = () => {
    if (!transporterPromise) {
        transporterPromise = nodemailer.createTestAccount().then(account => {
            console.log('✅ Nodemailer Email Transporter Ready');
            return nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: { user: account.user, pass: account.pass }
            });
        });
    }
    return transporterPromise;
};

// Password strength validator
const isStrongPassword = (pwd) => {
    const minLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
};

// @route   POST api/auth/send-otp
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email is required' });
    
    try {
        const transporter = await getTransporter();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        const info = await transporter.sendMail({
            from: '"SmartPayroll Security" <security@smartpayroll.local>',
            to: email,
            subject: 'SmartPayroll Verification Code',
            text: `Your 6-digit verification code is: ${otp}`,
            html: `<div style="font-family: sans-serif; text-align: center; padding: 20px;">
                    <h2>SmartPayroll</h2>
                    <p>Your email verification code is:</p>
                    <h1 style="letter-spacing: 5px; color: #06b6d4;">${otp}</h1>
                   </div>`
        });
        
        console.log('📬 OTP Email sent! Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.json({ msg: 'Verification code sent', otp });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to send email' });
    }
});

// @route   POST api/auth/register
router.post('/register', async (req, res) => {
    const { firstName, lastName, company, email, password, inviteCode } = req.body;

    // 1. Invite code gate — supports multiple comma-separated codes
    const validCodes = (process.env.INVITE_CODES || '')
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);
    if (!inviteCode || !validCodes.includes(inviteCode.trim())) {
        return res.status(403).json({ msg: 'Invalid invite code. Registration is restricted to authorized users only.' });
    }

    // 2. Field validation
    if (!firstName || firstName.trim().length < 2) {
        return res.status(400).json({ msg: 'First name must be at least 2 characters.' });
    }
    if (!lastName || lastName.trim().length < 2) {
        return res.status(400).json({ msg: 'Last name must be at least 2 characters.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ msg: 'Please provide a valid email address.' });
    }

    // 3. Strong password check
    if (!isStrongPassword(password)) {
        return res.status(400).json({ msg: 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'An account with this email already exists.' });

        user = new User({ firstName, lastName, company, email, password });
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            const userResponse = { ...user.toObject() };
            delete userResponse.password;
            res.json({ token, user: userResponse });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/auth/change-password
router.put('/change-password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid current password' });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/user
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/auth/user
router.put('/user', auth, async (req, res) => {
    const { firstName, middleName, lastName, email, phone, department, position } = req.body;
    const profileFields = { firstName, middleName, lastName, email, phone, department, position };
    try {
        let user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/auth/avatar
router.put('/avatar', auth, async (req, res) => {
    const { avatar } = req.body;
    if (avatar === undefined) return res.status(400).json({ msg: 'No image data provided.' });
    // Allow empty string (to remove avatar); otherwise validate format
    if (avatar !== '' && !avatar.startsWith('data:image/')) {
        return res.status(400).json({ msg: 'Invalid image format.' });
    }
    // Limit: ~5MB base64 ≈ 7,000,000 chars
    if (avatar.length > 7_000_000) {
        return res.status(400).json({ msg: 'Image is too large. Please use an image under 5MB.' });
    }
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { avatar } },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;