
"use client"

import React, { useState, useCallback } from 'react';
import { Input, Tag, Typography } from 'antd';
import { cn } from "@/lib/utils";
import TextP from './base/text_p';

export interface InputLabelProps {
    value: string[];
    onChange: (labels: string[]) => void;
    maxLabels?: number;
    maxLabelLength?: number;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

/**
 * Label input component
 *
 * Function:
 * - Support inputting multiple labels (comma separated)
 * - Automatically split labels when losing focus
 * - Display the list of added labels
 * - Support deleting a single label
 * - Support maximum label count and length limit
 */
const InputLabel: React.FC<InputLabelProps> = ({
    value = [],
    onChange,
    maxLabels = 10,
    maxLabelLength = 20,
    placeholder = "Enter labels separated by commas (e.g., fraud, corruption, insider trading)",
    className,
    disabled = false
}) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [error, setError] = useState<string>('');

    /**
     * Handle input change (optimized version)
     * Real-time check duplicate labels, provide immediate feedback
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const newValue = rawValue.replace(/[^A-Za-z\s\u00C0-\u024F\u0370-\u03FF\u0400-\u04FF\u4E00-\u9FFF,;，；]+/g, ' ');
        setInputValue(newValue);
        
        // Real-time check duplicates (only when inputting, not blocking input)
        if (newValue.trim()) {
            const currentLabels = newValue
                .split(/[,;，；]+/)
                .map(label => label.trim())
                .filter(label => label.length > 0);
            
            if (currentLabels.length > 1) {
                const duplicates = currentLabels.filter((label, index) => 
                    currentLabels.findIndex(l => l.toLowerCase() === label.toLowerCase()) !== index
                );
                
                if (duplicates.length > 0) {
                    setError(`Duplicate in input: ${[...new Set(duplicates)].join(', ')}`);
                    return;
                }
            }
        }
        
        setError('');
    };

    /**
     * Validate and add labels (optimized version)
     * 
 * Improvements:
     * - Case-insensitive duplicate check
     * - Check duplicates between new input labels
     * - More intelligent error
     * - Performance optimization
     */
    const addLabels = useCallback((input: string) => {
        if (!input.trim()) {
            setInputValue('');
            return;
        }

        // Split labels (support comma, semicolon, space)
        const newLabels = input
            .split(/[^A-Za-z\s\u00C0-\u024F\u0370-\u03FF\u0400-\u04FF\u4E00-\u9FFF]+/)
            .map(label => label.trim())
            .filter(label => label.length > 0);

        if (newLabels.length === 0) {
            setInputValue('');
            return;
        }

        // Create lowercase mapping for current labels, for fast lookup
        const existingLabelsLower = value.map(label => label.toLowerCase());
        
        // Validate labels
        const validLabels: string[] = [];
        const errors: string[] = [];
        const duplicateLabels: string[] = [];
        const newLabelsLower = new Set<string>(); // Used to check duplicates between new labels

        for (const label of newLabels) {
            const labelLower = label.toLowerCase();
            
            // Check label length
            if (label.length > maxLabelLength) {
                errors.push(`"${label}" exceeds ${maxLabelLength} characters`);
                continue;
            }

            // Check if there are duplicates between new labels
            if (newLabelsLower.has(labelLower)) {
                duplicateLabels.push(label);
                continue;
            }
            newLabelsLower.add(labelLower);

            // Check if there are duplicates with existing labels (case-insensitive)
            if (existingLabelsLower.includes(labelLower)) {
                // Find the original label (keep original case)
                const originalLabel = value.find(existingLabel => 
                    existingLabel.toLowerCase() === labelLower
                );
                duplicateLabels.push(originalLabel || label);
                continue;
            }

            // Check label count limit
            if (value.length + validLabels.length >= maxLabels) {
                errors.push(`Maximum ${maxLabels} labels allowed`);
                break;
            }

            validLabels.push(label);
        }

        // Update label list
        if (validLabels.length > 0) {
            onChange([...value, ...validLabels]);
        }

        // Intelligent error提示
        if (errors.length > 0 || duplicateLabels.length > 0) {
            let errorMessage = '';
            
            if (duplicateLabels.length > 0) {
                const uniqueDuplicates = [...new Set(duplicateLabels)];
                if (uniqueDuplicates.length === 1) {
                    errorMessage = `"${uniqueDuplicates[0]}" already exists`;
                } else {
                    errorMessage = `Duplicates found: ${uniqueDuplicates.slice(0, 3).join(', ')}${uniqueDuplicates.length > 3 ? '...' : ''}`;
                }
            }
            
            if (errors.length > 0) {
                errorMessage = errorMessage 
                    ? `${errorMessage} | ${errors[0]}` 
                    : errors[0];
            }
            
            setError(errorMessage);
        } else {
            setError(''); // Clear error
        }

        // Clear input box
        setInputValue('');
    }, [value, onChange, maxLabels, maxLabelLength]);

    /**
     * Handle losing focus
     */
    const handleBlur = () => {
        addLabels(inputValue);
    };

    /**
     * Handle key events
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addLabels(inputValue);
        } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
                // If the input box is empty and the backspace key is pressed, delete the last label
            e.preventDefault();
            const newLabels = [...value];
            newLabels.pop();
            onChange(newLabels);
        }
    };

    /**
     * Delete specified label
     */
    const removeLabel = (indexToRemove: number) => {
        const newLabels = value.filter((_, index) => index !== indexToRemove);
        onChange(newLabels);
        setError('');
    };

    return (
        <div className={cn("w-full space-y-3", className)}>
            {/* Title */}
            <div className="flex items-center gap-2">
                <span className="font-mono text-sm">Labels:</span>
                <span className="text-xs text-muted-foreground">
                    ({value.length}/{maxLabels})
                </span>
            </div>

            {/* Hint information */}
            <TextP size="sm" type="secondary">
                Separate multiple labels with commas. Press Enter or blur to add.
                {value.length === 0 && " (e.g., fraud, corruption, insider trading)"}
            </TextP>

            {/* Input box */}
            <div className="relative">
                <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || value.length >= maxLabels}
                    maxLength={maxLabelLength * 2} // Allow inputting multiple labels
                    className={cn(
                        error && "border-destructive focus:ring-destructive",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                />
            </div>

            {/* Error message */}
            {error && (
                <Typography.Text type="danger">
                    {error}
                </Typography.Text>
            )}

            {/* Label list */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-md border border-border">
                    {value.map((label, index) => (
                        <Tag
                            key={index}
                            closable={!disabled}
                            onClose={() => removeLabel(index)}
                            className={cn(
                                "group flex items-center gap-1.5 px-3 py-1.5",
                                "hover:bg-secondary/80 transition-colors",
                                disabled && "opacity-50"
                            )}
                        >
                            <span className="text-sm">{label}</span>
                        </Tag>
                    ))}
                </div>
            )}

            
        </div>
    );
};

export default InputLabel;
