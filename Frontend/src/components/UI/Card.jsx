import React from 'react';

export const Card = ({ children, className }) => (
    <div className={`p-4 shadow-lg rounded-2xl bg-white ${className}`}>
        {children}
    </div>
);

export const CardContent = ({ children }) => (
    <div>
        {children}
    </div>
);
