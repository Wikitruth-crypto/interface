/**
 * Safely convert string to BigInt
 * Handle strings in scientific notation format (e.g. "2.8377840380332334e+22")
 */
export function parseAmountToBigInt(amountStr: string): bigint {
    // If string contains scientific notation markers (e or E)
    if (/[eE]/.test(amountStr)) {
        // Parse scientific notation: convert "2.8377840380332334e+22" to integer string
        const [base, exponent] = amountStr.split(/[eE]/);
        const exp = parseInt(exponent, 10);
        
        // Separate integer and decimal parts
        const [intPart, decimalPart = ''] = base.split('.');
        
        // Calculate required decimal places
        const decimalDigits = decimalPart.length;
        const totalDigits = intPart.length + decimalDigits;
        
        // If exponent is positive, expand the number
        if (exp > 0) {
            // Combine integer and decimal parts
            const fullNumber = intPart + decimalPart;
            // Calculate number of zeros to add
            const zerosToAdd = exp - decimalDigits;
            
            if (zerosToAdd > 0) {
                // Add zeros and convert to BigInt
                return BigInt(fullNumber + '0'.repeat(zerosToAdd));
            } else if (zerosToAdd < 0) {
                // If exponent is smaller than decimal places, truncate (should not happen, but for safety)
                const truncated = fullNumber.slice(0, fullNumber.length + zerosToAdd);
                return BigInt(truncated || '0');
            } else {
                // Exact match
                return BigInt(fullNumber);
            }
        } else {
            // Negative exponent case (should not appear in amounts, handled for completeness)
            return BigInt(intPart);
        }
    }
    
    // If not scientific notation, convert directly
    // Remove possible decimal point and following digits (if any)
    const integerStr = amountStr.split('.')[0];
    return BigInt(integerStr);
}
