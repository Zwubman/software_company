import React from 'react';

export const Button = ({ children, className, ...props }) => (
    <button className={`from-[#EB6407] to-[#f0932b] text-white py-2 px-6 rounded-full shadow-lg hover:bg-[#d85400] transition-all duration-300 ${className}`} {...props}>
        {children}
    </button>
);
