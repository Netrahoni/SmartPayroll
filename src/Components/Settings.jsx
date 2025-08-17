import React, { useState, useEffect } from 'react';

// ... (ICONS and other helper components remain the same)
const ICONS = { user: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", lock: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z", office: "M4 6h16v2H4zm0 3h16v2H4zm0 3h16v2H4zm0 3h16v2H4zM2 4c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4z", bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" };
const Icon = ({ path, className = 'w-6 h-6' }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d={path}></path></svg> );
const PageHeader = ({ title, subtitle }) => ( <div className="mb-8"><h1 className="text-3xl font-bold text-slate-800">{title}</h1><p className="text-slate-500 mt-1">{subtitle}</p></div> );
const Card = ({ children }) => ( <div className="bg-white rounded-lg shadow-md p-6">{children}</div> );
const TabButton = ({ name, activeTab, setActiveTab }) => ( <button onClick={() => setActiveTab(name)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${ activeTab === name ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300' }`}>{name}</button> );
const InputField = ({ label, name, ...props }) => ( <div><label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label><input name={name} id={name} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" /></div> );
const SelectField = ({ label, name, children, ...props }) => ( <div><label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label><select name={name} id={name} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">{children}</select></div> );
const ToggleSwitch = ({ label, description, enabled, setEnabled }) => ( <div className="flex items-center justify-between"><div><h4 className="font-medium text-slate-800">{label}</h4><p className="text-sm text-slate-500">{description}</p></div><button onClick={() => setEnabled(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} /></button></div> );


const ProfileSettings = ({ user, setUser }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        position: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                department: user.department || '',
                position: user.position || ''
            });
        }
    }, [user]);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formData)
            });
            const updatedUser = await res.json();
            if (res.ok) {
                setUser(updatedUser); // Update the global user state in App.jsx
                setMessage('Profile updated successfully!');
            } else {
                setMessage(updatedUser.msg || 'Failed to update profile.');
            }
        } catch (error) {
            setMessage('Server error.');
        }
    };

    return (
        <Card>
            <div className="flex items-center mb-6">
                <Icon path={ICONS.user} className="w-6 h-6 text-slate-500 mr-3" />
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Profile Settings</h3>
                    <p className="text-sm text-slate-500">Update your personal information.</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Display Name" name="fullName" value={formData.fullName} onChange={onChange} />
                    <InputField label="Email" name="email" type="email" value={formData.email} onChange={onChange} disabled />
                    <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={onChange} placeholder="Enter your phone number" />
                    <InputField label="Department" name="department" value={formData.department} onChange={onChange} />
                </div>
                <InputField label="Position" name="position" value={formData.position} onChange={onChange} />
                {message && <p className="text-sm text-center text-green-600">{message}</p>}
                <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">Update Profile</button>
                </div>
            </form>
        </Card>
    );
};


// ... (SecuritySettings and other components remain the same as the previous step)
const SecuritySettings = () => {
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const { currentPassword, newPassword, confirmPassword } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async e => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match');
            setIsError(true);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.msg);
                setIsError(false);
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage(data.msg || 'An error occurred.');
                setIsError(true);
            }
        } catch (err) {
            setMessage('Server error. Please try again later.');
            setIsError(true);
        }
    };
    return ( <Card><div className="flex items-center mb-6"><Icon path={ICONS.lock} className="w-6 h-6 text-slate-500 mr-3" /><div><h3 className="text-lg font-semibold text-slate-800">Security Settings</h3><p className="text-sm text-slate-500">Manage your account security.</p></div></div><form onSubmit={handleSubmit} className="space-y-4 max-w-lg"><InputField label="Current Password" name="currentPassword" type="password" value={currentPassword} onChange={onChange} required /><InputField label="New Password" name="newPassword" type="password" value={newPassword} onChange={onChange} required /><InputField label="Confirm New Password" name="confirmPassword" type="password" value={confirmPassword} onChange={onChange} required />{message && ( <p className={`text-sm text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p> )}<div className="flex justify-end pt-2"><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">Change Password</button></div></form></Card> );
};

const CompanySettings = () => {
    const [settings, setSettings] = useState({});
    useEffect(() => { const fetchSettings = async () => { try { const res = await fetch('http://localhost:5000/api/settings/company'); const data = await res.json(); setSettings(data); } catch (error) { console.error("Failed to fetch company settings:", error); } }; fetchSettings(); }, []);
    const handleChange = (e) => { setSettings({ ...settings, [e.target.name]: e.target.value }); };
    const handleSubmit = async (e) => { e.preventDefault(); try { await fetch('http://localhost:5000/api/settings/company', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings), }); alert('Company settings updated!'); } catch (error) { alert('Failed to update settings.'); } };
    return ( <Card><div className="flex items-center mb-6"><Icon path={ICONS.office} className="w-6 h-6 text-slate-500 mr-3" /><div><h3 className="text-lg font-semibold text-slate-800">Company Settings</h3><p className="text-sm text-slate-500">Configure company-wide settings.</p></div></div><form onSubmit={handleSubmit} className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><InputField label="Company Name" name="companyName" value={settings.companyName || ''} onChange={handleChange} /><InputField label="Company Email" name="companyEmail" type="email" value={settings.companyEmail || ''} onChange={handleChange} /><InputField label="Company Phone" name="companyPhone" type="tel" value={settings.companyPhone || ''} onChange={handleChange} /><SelectField label="Timezone" name="timezone" value={settings.timezone || 'UTC'} onChange={handleChange}><option>UTC</option><option>PST</option><option>EST</option></SelectField><InputField label="Work Start Time" name="workStartTime" type="time" value={settings.workStartTime || '09:00'} onChange={handleChange} /><InputField label="Work End Time" name="workEndTime" type="time" value={settings.workEndTime || '17:00'} onChange={handleChange} /><SelectField label="Currency" name="currency" value={settings.currency || 'USD'} onChange={handleChange}><option value="USD">USD - US Dollar</option><option value="CAD">CAD - Canadian Dollar</option></SelectField><SelectField label="Payroll Frequency" name="payrollFrequency" value={settings.payrollFrequency || 'Monthly'} onChange={handleChange}><option>Weekly</option><option>Bi-Weekly</option><option>Monthly</option></SelectField><InputField label="Overtime Rate Multiplier" name="overtimeRateMultiplier" type="number" step="0.1" value={settings.overtimeRateMultiplier || 1.5} onChange={handleChange} /><InputField label="Default Break Duration (minutes)" name="defaultBreakDuration" type="number" value={settings.defaultBreakDuration || 60} onChange={handleChange} /></div><div><label className="block text-sm font-medium text-gray-700">Company Address</label><textarea name="companyAddress" value={settings.companyAddress || ''} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea></div><div className="flex justify-end pt-2"><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">Update Company Settings</button></div></form></Card> );
};

const NotificationSettings = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [clockReminders, setClockReminders] = useState(true);
    const [payrollAlerts, setPayrollAlerts] = useState(false);
    const [overtimeWarnings, setOvertimeWarnings] = useState(true);
    return ( <Card><div className="flex items-center mb-6"><Icon path={ICONS.bell} className="w-6 h-6 text-slate-500 mr-3" /><div><h3 className="text-lg font-semibold text-slate-800">Notification Preferences</h3><p className="text-sm text-slate-500">Configure how you receive notifications.</p></div></div><div className="space-y-6 max-w-lg"><ToggleSwitch label="Email Notifications" description="Receive notifications via email" enabled={emailNotifications} setEnabled={setEmailNotifications} /><ToggleSwitch label="Clock In/Out Reminders" description="Get reminded to clock in or out" enabled={clockReminders} setEnabled={setClockReminders} /><ToggleSwitch label="Payroll Alerts" description="Notifications about payroll processing" enabled={payrollAlerts} setEnabled={setPayrollAlerts} /><ToggleSwitch label="Overtime Warnings" description="Get notified when approaching overtime" enabled={overtimeWarnings} setEnabled={setOvertimeWarnings} /></div><div className="flex justify-end pt-6 mt-6 border-t"><button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">Save Preferences</button></div></Card> );
};

// Main App Component
const App = ({ user, setUser }) => { // Accept user and setUser from props
    const [activeTab, setActiveTab] = useState('Profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'Profile': return <ProfileSettings user={user} setUser={setUser} />; // Pass props down
            case 'Security': return <SecuritySettings />;
            case 'Company': return <CompanySettings />;
            case 'Notifications': return <NotificationSettings />;
            default: return <ProfileSettings user={user} setUser={setUser} />;
        }
    };

    return (
        <div className="p-4 sm:p-8 bg-slate-50 min-h-screen font-['Inter',_sans-serif]">
            <PageHeader title="Settings" subtitle="Manage your account and company settings" />
            <div className="mb-6 border-b border-slate-200">
                <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
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

export default App;