"use client"

import React from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function TextSpan({ children, className }: Props) {


    return (

        <span className={`text-sm font-mono  text-gray-400 hover:text-gray-300 transition ${className}`}>
            {children}
        </span>
    );
}


