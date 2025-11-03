"use client";
import * as React from "react"


interface Props {
    current: number;
    length: number;
    onClick: (index: number) => void;
}

export default function YuanQuan({ current, length, onClick }: Props) {

    return (
        <div className="py-2 text-center text-sm">
            <div className="flex items-center justify-center gap-3">
                {Array.from({ length }).map((_, index) => (
                    <div
                        key={index}
                        onClick={() => onClick(index)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 ${
                            current === index + 1
                                ? "bg-primary w-6"
                                : "bg-transparent border-2 border-gray-700 hover:border-gray-600"
                            }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onClick(index);
                            }
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}