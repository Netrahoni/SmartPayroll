import React, { useState } from 'react';
import Icon from './Icon';
import { ICONS } from '../icons';

const LoginPage = ({ setToken }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        company: '',
        email: '',
        password: '',
    });
    const { fullName, company, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const url = isSignUp ? '/api/auth/register' : '/api/auth/login';
        const body = isSignUp ? { fullName, company, email, password } : { email, password };

        try {
            const res = await fetch(`http://localhost:5000${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
            } else {
                alert(data.msg || 'An error occurred.');
            }
        } catch (err) {
            alert('Server error. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-400 to-blue-500 p-4">
            <div className="text-center mb-8 text-white">
                <div className="inline-block p-4 bg-white bg-opacity-20 rounded-xl mb-4">
                    <Icon path={ICONS.office} className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold">SmartPayroll</h1>
                <p className="text-lg opacity-90">Admin Portal Access</p>
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800">Welcome</h2>
                <p className="text-center text-gray-500 mb-6">Access your payroll management dashboard</p>

                <div className="flex bg-gray-100 rounded-full p-1 mb-6">
                    <button onClick={() => setIsSignUp(false)} className={`w-1/2 py-2 rounded-full font-semibold transition-colors ${!isSignUp ? 'bg-white shadow' : 'text-gray-600'}`}>
                        Sign In
                    </button>
                    <button onClick={() => setIsSignUp(true)} className={`w-1/2 py-2 rounded-full font-semibold transition-colors ${isSignUp ? 'bg-white shadow' : 'text-gray-600'}`}>
                        Sign Up
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    {isSignUp && (
                        <>
                            <InputField name="fullName" value={fullName} onChange={onChange} placeholder="John Doe" icon={ICONS.user} label="Full Name" />
                            <InputField name="company" value={company} onChange={onChange} placeholder="Company Name" icon={ICONS.office} label="Company" />
                        </>
                    )}
                    <InputField name="email" type="email" value={email} onChange={onChange} placeholder="admin@company.com" icon={ICONS.mail} label="Email" />
                    <InputField name="password" type="password" value={password} onChange={onChange} placeholder="Enter your password" icon={ICONS.lock} label="Password" />

                    <button type="submit" className="w-full py-3 mt-4 font-semibold text-white bg-gradient-to-r from-teal-400 to-green-500 rounded-lg shadow-md hover:from-teal-500 hover:to-green-600 transition-all">
                        {isSignUp ? 'Create Account' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const InputField = ({ label, icon, ...props }) => (
    <div>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon path={icon} className="w-5 h-5 text-gray-400" />
            </div>
            <input {...props} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
        </div>
    </div>
);

export default LoginPage;
