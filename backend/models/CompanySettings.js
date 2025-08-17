import mongoose from 'mongoose';

const companySettingsSchema = new mongoose.Schema({
    companyName: { type: String, default: 'Example Corp' },
    companyEmail: { type: String, default: 'contact@example.com' },
    companyPhone: { type: String, default: '123-456-7890' },
    companyAddress: { type: String, default: '123 Main St, Anytown, CA 12345' },
    timezone: { type: String, default: 'PST' },
    // Corrected to 24-hour format
    workStartTime: { type: String, default: '09:00' }, 
    workEndTime: { type: String, default: '17:00' },
    currency: { type: String, default: 'CAD' },
    payrollFrequency: { type: String, default: 'Bi-Weekly' },
    overtimeRateMultiplier: { type: Number, default: 1.5 },
    defaultBreakDuration: { type: Number, default: 60 },
}, { timestamps: true });

const CompanySettings = mongoose.model('CompanySettings', companySettingsSchema);

export default CompanySettings;