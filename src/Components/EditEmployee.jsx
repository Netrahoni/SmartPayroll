import React, { useState, useEffect } from 'react';

const EditEmployee = ({ onNavigate, employeeId }) => {
    // State for form fields
    const [formData, setFormData] = useState({
        employeeName: '',
        address: '',
        sin: '',
        department: '',
        position: '',
        hourlyRate: 0,
        hoursWorked: 0,
    });
    const [loading, setLoading] = useState(true);

    // Fetch the employee's data when the component loads
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`);
                if (!response.ok) throw new Error('Could not fetch employee data');
                const data = await response.json();
                setFormData(data);
            } catch (error) {
                console.error(error);
                alert("Failed to load employee data.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [employeeId]);

    // Handle changes in form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission to update the employee
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed to update employee');
            alert('Employee updated successfully!');
            onNavigate('Payroll');
        } catch (error) {
            console.error(error);
            alert('Failed to update employee.');
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading Employee Details...</div>;
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <form onSubmit={handleSubmit}>
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Employee Record</h2>
                </header>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="space-y-6">
                        {/* Employee Information */}
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Employee Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Employee Name</label>
                                    <input type="text" name="employeeName" value={formData.employeeName} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md" rows="2"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">NI Number (SIN)</label>
                                    <input type="text" name="sin" value={formData.sin} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md" required />
                                </div>
                            </div>
                        </section>
                        {/* Company & Payroll Information */}
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Company & Payroll</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <select name="department" value={formData.department} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md bg-white">
                                        <option>Engineering</option><option>Sales</option><option>HR</option><option>Marketing</option><option>Unassigned</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Position</label>
                                    <select name="position" value={formData.position} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md bg-white">
                                        <option>Senior Developer</option><option>Project Manager</option><option>UI/UX Designer</option><option>QA Tester</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                                    <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} step="0.01" className="w-full mt-1 px-3 py-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hours Worked</label>
                                    <input type="number" name="hoursWorked" value={formData.hoursWorked} onChange={handleChange} step="0.1" className="w-full mt-1 px-3 py-2 border rounded-md" />
                                </div>
                            </div>
                        </section>
                    </div>
                    {/* Form Buttons */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                        <button type="button" onClick={() => onNavigate('Payroll')} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
                        <button type="submit" className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700">Save Changes</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditEmployee;