import express from 'express';
import CompanySettings from '../models/CompanySettings.js';

const router = express.Router();

// @route   GET api/settings/company
router.get('/company', async (req, res) => {
    try {
        let settings = await CompanySettings.findOne();
        if (!settings) {
            settings = new CompanySettings();
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/settings/company
router.put('/company', async (req, res) => {
    try {
        let settings = await CompanySettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;