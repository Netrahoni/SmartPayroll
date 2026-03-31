import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        default: 'Manager'
    },
    department: {
        type: String,
        default: 'Administration'
    },
    phone: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    bankName: {
        type: String,
        default: ''
    },
    bankAccount: {
        type: String,
        default: ''
    },
    routingNumber: {
        type: String,
        default: ''
    },
    resetOtp: {
        type: String
    },
    resetOtpExpire: {
        type: Date
    },
    employeeId: { type: String, default: '' },
    homeAddress: { type: String, default: '' },
    startDate: { type: Date, default: Date.now },
    manager: { type: String, default: '' },
    officeLocation: { type: String, default: '' },
    emergencyContactName: { type: String, default: '' },
    emergencyContactRelation: { type: String, default: '' },
    emergencyContactPhone: { type: String, default: '' }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property to get the full name
UserSchema.virtual('fullName').get(function() {
    return [this.firstName, this.middleName, this.lastName].filter(Boolean).join(' ');
});

const User = mongoose.model('User', UserSchema);

export default User;