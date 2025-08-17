import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import Card from './Card';
import Icon from './Icon';
import { ICONS } from '../icons';

// Main Settings Component
const Settings = () => {
    const [activeTab, setActiveTab] = useState('Profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'Profile': return <ProfileSettings />;
            case 'Security': return <SecuritySettings />;
            case 'Company': return <CompanySettings />;
            case 'Notifications': return <NotificationSettings />;
            default: return <ProfileSettings />;
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-['Inter',_sans-serif]">
            <PageHeader title="Settings" subtitle="Manage your account and company settings" />

            {/* --- TABS --- */}
            <div className="mb-6 border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <TabButton name="Profile" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Security" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Company" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Notifications" activeTab={activeTab} setActiveTab={setActiveTab} />
                </nav>
            </div>

            {renderContent()}
        </div>
    );
};

// --- Reusable Helper Components ---

const TabButton = ({ name, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(name)}
        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === name
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        }`}
    >
        {name}
    </button>
);

const InputField = ({ label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input name={name} id={name} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
);

const SelectField = ({ label, name, children, ...props }) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <select name={name} id={name} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
            {children}
        </select>
    </div>
);

const ToggleSwitch = ({ label, description, enabled, setEnabled }) => (
    <div className="flex items-center justify-between">
        <div>
            <h4 className="font-medium text-slate-800">{label}</h4>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


// --- FORM COMPONENTS FOR EACH TAB ---

const ProfileSettings = () => {
    return (
        <Card>
            <div className="flex items-center mb-6">
                <Icon path={ICONS.user} className="w-6 h-6 text-slate-500 mr-3" />
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Profile Settings</h3>
                    <p className="text-sm text-slate-500">Update your personal information.</p>
                </div>
            </div>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Display Name" name="displayName" placeholder="John Admin" />
                    <InputField label="Email" name="email" type="email" placeholder="admin@company.ca" disabled />
                    <InputField label="Phone Number" name="phone" type="tel" placeholder="Enter your phone number" />
                    <InputField label="Department" name="department" placeholder="HR" />
                </div>
                <InputField label="Position" name="position" placeholder="HR Manager" />
                <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">Update Profile</button>
                </div>
            </form>
        </Card>
    );
};

const SecuritySettings = () => {
    return (
        <Card>
            <div className="flex items-center mb-6">
                <Icon path={ICONS.lock} className="w-6 h-6 text-slate-500 mr-3" />
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Security Settings</h3>
                    <p className="text-sm text-slate-500">Manage your account security.</p>
                </div>
            </div>
            <form className="space-y-4 max-w-lg">
                <InputField label="Current Password" name="currentPassword" type="password" />
                <InputField label="New Password" name="newPassword" type="password" />
                <InputField label="Confirm New Password" name="confirmPassword" type="password" />
                <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">Change Password</button>
                </div>
            </form>
        </Card>
    );
};

const CompanySettings = () => {
    const [settings, setSettings] = useState({});
    
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/settings/company');
                const data = await res.json();
                setSettings(data);
            } catch (error) {
                console.error("Failed to fetch company settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:5000/api/settings/company', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            alert('Company settings updated!');
        } catch (error) {
            alert('Failed to update settings.');
        }
    };

    return (
        <Card>
            <div className="flex items-center mb-6">
                <Icon path={ICONS.office} className="w-6 h-6 text-slate-500 mr-3" />
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Company Settings</h3>
                    <p className="text-sm text-slate-500">Configure company-wide settings.</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Company Name" name="companyName" value={settings.companyName || ''} onChange={handleChange} />
                    <InputField label="Company Email" name="companyEmail" type="email" value={settings.companyEmail || ''} onChange={handleChange} />
                    <InputField label="Company Phone" name="companyPhone" type="tel" value={settings.companyPhone || ''} onChange={handleChange} />
                    <SelectField label="Timezone" name="timezone" value={settings.timezone || 'UTC'} onChange={handleChange}>
                        <option>UTC</option><option>PST</option><option>EST</option>
                    </SelectField>
                    <InputField label="Work Start Time" name="workStartTime" type="time" value={settings.workStartTime || '09:00'} onChange={handleChange} />
                    <InputField label="Work End Time" name="workEndTime" type="time" value={settings.workEndTime || '17:00'} onChange={handleChange} />
                    <SelectField label="Currency" name="currency" value={settings.currency || 'USD'} onChange={handleChange}>
                        <option value="USD">USD - US Dollar</option><option value="CAD">CAD - Canadian Dollar</option>
                    </SelectField>
                    <SelectField label="Payroll Frequency" name="payrollFrequency" value={settings.payrollFrequency || 'Monthly'} onChange={handleChange}>
                        <option>Weekly</option><option>Bi-Weekly</option><option>Monthly</option>
                    </SelectField>
                    <InputField label="Overtime Rate Multiplier" name="overtimeRateMultiplier" type="number" step="0.1" value={settings.overtimeRateMultiplier || 1.5} onChange={handleChange} />
                    <InputField label="Default Break Duration (minutes)" name="defaultBreakDuration" type="number" value={settings.defaultBreakDuration || 60} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company Address</label>
                    <textarea name="companyAddress" value={settings.companyAddress || ''} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">Update Company Settings</button>
                </div>
            </form>
        </Card>
    );
};

const NotificationSettings = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [clockReminders, setClockReminders] = useState(true);
    const [payrollAlerts, setPayrollAlerts] = useState(false);
    const [overtimeWarnings, setOvertimeWarnings] = useState(true);

    return (
        <Card>
            <div className="flex items-center mb-6">
                <Icon path={ICONS.bell} className="w-6 h-6 text-slate-500 mr-3" />
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Notification Preferences</h3>
                    <p className="text-sm text-slate-500">Configure how you receive notifications.</p>
                </div>
            </div>
            <div className="space-y-6 max-w-lg">
                <ToggleSwitch label="Email Notifications" description="Receive notifications via email" enabled={emailNotifications} setEnabled={setEmailNotifications} />
                <ToggleSwitch label="Clock In/Out Reminders" description="Get reminded to clock in or out" enabled={clockReminders} setEnabled={setClockReminders} />
                <ToggleSwitch label="Payroll Alerts" description="Notifications about payroll processing" enabled={payrollAlerts} setEnabled={setPayrollAlerts} />
                <ToggleSwitch label="Overtime Warnings" description="Get notified when approaching overtime" enabled={overtimeWarnings} setEnabled={setOvertimeWarnings} />
            </div>
            <div className="flex justify-end pt-6 mt-6 border-t">
                <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">Save Preferences</button>
            </div>
        </Card>
    );
};

export default Settings;
