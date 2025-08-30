import React from 'react';

const PageHeader = ({ title, action }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      
      {/* This div will render whatever buttons are passed in */}
      <div>
        {action}
      </div>
    </div>
  );
};

export default PageHeader;