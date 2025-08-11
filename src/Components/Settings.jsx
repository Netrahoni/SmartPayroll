import React from 'react';
import PageHeader from './PageHeader';
import Card from './Card';

const Settings = () => {
    return (
        <div>
            <PageHeader title="Settings" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
                        <p className="text-sm text-gray-600">Update your account's profile information and email address.</p>
                    </Card>
                     <Card className="mt-8">
                        <h3 className="text-lg font-semibold mb-2">Security</h3>
                        <p className="text-sm text-gray-600">Change your password.</p>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name" defaultValue="Admin User" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" name="email" id="email" defaultValue="admin@company.ca" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                             <div className="flex justify-end">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">Save Changes</button>
                            </div>
                        </form>
                    </Card>
                    <Card className="mt-8">
                         <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="current-password"  className="block text-sm font-medium text-gray-700">Current Password</label>
                                <input type="password" name="current-password" id="current-password"  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="new-password"  className="block text-sm font-medium text-gray-700">New Password</label>
                                <input type="password" name="new-password" id="new-password"  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                             <div className="flex justify-end">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">Update Password</button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;