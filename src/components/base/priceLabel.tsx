"use client"

import React, { useMemo } from 'react';
import { Tooltip } from 'antd';
import { formatUnits } from 'viem';
import { formatAmount } from '@dapp/utils/formatAmount';
import { cn } from '@/lib/utils';

export interface PriceTextProps {
    price: string | number | bigint;
    symbol?: string;
    decimals?: number;
    precision?: number;
    showSymbol?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    unitPosition?: 'left' | 'right';
    responsive?: boolean;
}


const PriceLabel: React.FC<PriceTextProps> = ({
    price,
    symbol = 'ETH',
    decimals = 18,
    precision = 3,
    showSymbol = true,
    className = '',
    size = 'sm',
    unitPosition = 'right',
    responsive = true,
}) => {
    const formattedPrice = useMemo(() => {
        try {
            const formatted = formatAmount(price, decimals, precision);
            // If the decimal part is all 0, only display the integer
            // Handle the case with suffix (e.g. "1.00K", "2.00M")
            const hasSuffix = /[KM]$/.test(formatted);
            if (hasSuffix) {
                // Extract the number part and suffix
                const match = formatted.match(/^([\d.]+)([KM])$/);
                if (match) {
                    const numStr = match[1];
                    const suffix = match[2];
                    const numValue = parseFloat(numStr);
                    // If it is an integer, only display the integer part and suffix
                    if (Number.isInteger(numValue)) {
                        return `${numValue}${suffix}`;
                    }
                    // Check if the decimal part is all 0
                    const parts = numStr.split('.');
                    if (parts.length === 2 && /^0+$/.test(parts[1])) {
                        return `${parts[0]}${suffix}`;
                    }
                }
                return formatted;
            }

            // Handle normal number format (e.g. "1.000")
            const numValue = parseFloat(formatted);
            if (Number.isInteger(numValue)) {
                return numValue.toString();
            }
            // Check if the decimal part is all 0
            const parts = formatted.split('.');
            if (parts.length === 2) {
                const fractionalPart = parts[1];
                // If the decimal part is all 0, only return the integer part
                if (/^0+$/.test(fractionalPart)) {
                    return parts[0];
                }
            }
            return formatted;
        } catch (error) {
            console.error('Failed to format price:', error);
            return '0';
        }
    }, [price, decimals, precision]);

    // Get style configuration based on size
    const sizeConfig_price = useMemo(() => {
        return {
            sm: 'text-xs md:text-sm lg:text-base',
            md: 'text-sm md:text-md lg:text-lg',
            lg: 'text-lg md:text-xl lg:text-2xl',
            xl: 'text-xl md:text-2xl lg:text-3xl',
        };
    }, [size]);
    const sizeConfig_symbol = useMemo(() => {
        return {
            sm: 'text-xs md:text-sm',
            md: 'text-sm md:text-base ',
            lg: 'text-md md:text-lg ',
            xl: 'text-lg md:text-xl ',
        };
    }, [size]);

    // Get full price (for Tooltip)
    const fullPrice = useMemo(() => {
        try {
            const priceValue = typeof price === 'bigint'
                ? price
                : typeof price === 'string'
                    ? (price.includes('n') ? BigInt(price.replace('n', '')) : BigInt(price))
                    : BigInt(Math.floor(Number(price) || 0));

            return formatUnits(priceValue, decimals);
        } catch {
            return formattedPrice;
        }
    }, [price, decimals, formattedPrice]);

    // Build price text
    const priceElement = (
        <p className={cn("text-white", sizeConfig_price[size], className)}>
            {formattedPrice}
        </p>
    );

    // Symbol element
    const symbolElement = showSymbol && symbol ? (
        <p className={cn(sizeConfig_symbol[size], "text-muted-foreground")}>
            {symbol}
        </p>
    ) : null;

    // Build content array
    const contentElements = [];

    if (unitPosition === 'left' && symbolElement) {
        contentElements.push(symbolElement);
    }

    // Wrap price text (if the full price is different, display Tooltip)
    const priceWithTooltip = fullPrice !== formattedPrice ? (
        <Tooltip title={fullPrice}>
            {priceElement}
        </Tooltip>
    ) : priceElement;

    contentElements.push(priceWithTooltip);

    if (unitPosition === 'right' && symbolElement) {
        contentElements.push(symbolElement);
    }

    return (
        <div
            className={cn(
                'inline-flex items-end',
                responsive ? 'gap-2' : 'gap-1',
                'font-mono'
            )}
        >
            {contentElements.map((element, index) => (
                <React.Fragment key={`price-label-${index}`}>
                    {element}
                </React.Fragment>
            ))}
        </div>
    );
};

export default PriceLabel; 