import { 
    network, 
    end,
} from './gateway';
import { getCurrentGatewayUrl } from './current';

/**

 * Input url:
 * 1. "bafkreiccjb4uhzhze2pyehnoo7qwkk73yhjl6k6scbzxss6idqkhghznom"
 * 2. "bafkreiccjb4uhzhze2pyehnoo7qwkk73yhjl6k6scbzxss6idqkhghznom/"
 * 3. "ipfs://bafkreianmtw7x22zb3iawia3rcmfm67iiupytrxj3ytljxojlichfaictm"
 * 4. "ipfs://bafkreianmtw7x22zb3iawia3rcmfm67iiupytrxj3ytljxojlichfaictm/"
 * 5. "QmQ5r39mUzZSA1xQsZSVzZQPtS3BfykAz6rt45gDqWXKeL"
 * 6. "QmQ5r39mUzZSA1xQsZSVzZQPtS3BfykAz6rt45gDqWXKeL/"
 * 7. "ipfs://QmQ5r39mUzZSA1xQsZSVzZQPtS3BfykAz6rt45gDqWXKeL"
 * 8. "ipfs://QmQ5r39mUzZSA1xQsZSVzZQPtS3BfykAz6rt45gDqWXKeL/"
 * 
 * @param uri - IPFS URI or CID
 * @returns string Full IPFS gateway URL
 * @throws If input is not a valid IPFS URI or CID
 */
export const ipfsCidToUrl = (uri: string): string => {
    if (!uri) {
        return '';
    }

    // Remove trailing slash
    // const cleanUri = uri.endsWith('/') ? uri.slice(0, -1) : uri;
    let cleanUri = uri;
    if (cleanUri.endsWith(end) && cleanUri.startsWith(network)) {
        return cleanUri;
    } else if (cleanUri.endsWith('.ipfs.w3s.link/')) {
        // Remove .ipfs.w3s.link/
        cleanUri = cleanUri.slice(0, -15);
    } else if (cleanUri.endsWith('/')) {
        cleanUri = cleanUri.slice(0, -1);
    }

    let cid: string;
    if (cleanUri.startsWith('ipfs://')) {
        cid = cleanUri.substring(7);
    } else if (cleanUri.startsWith('bafkre')) {
        cid = cleanUri;
    } else if (cleanUri.startsWith('Qm')) {
        cid = cleanUri;
    } else if (cleanUri.startsWith('https://')) {
        cid = cleanUri.substring(8);
    } else {
        cid = cleanUri;
    }
    // if (import.meta.env.DEV) {
    //     console.log('cleanUri:', cleanUri);
    //     console.log('cid:', cid);
    // }

    // if (!isValidCid(cid)) {
    //     throw new Error('Invalid IPFS CID format');
    // }

    // Use the current best gateway (maintained by polling mechanism)
    return getCurrentGatewayUrl(cid);
};

/**
 * Validate CID format
 * @param cid - CID to validate
 * @returns Whether the CID is valid
 */
const isValidCid = (cid: string): boolean => {
    // CID v0 format: Qm starts with, 46 characters
    // "QmQ5r39mUzZSA1xQsZSVzZQPtS3BfykAz6rt45gDqWXKeL"
    const cidV0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;

    // CID v1 format: bafkre starts with, 59 characters
    // "bafkreiccjb4uhzhze2pyehnoo7qwkk73yhjl6k6scbzxss6idqkhghznom"
    const cidV1Regex = /^bafkre[1-9A-HJ-NP-Za-km-z]{52}$/;

    return cidV0Regex.test(cid) || cidV1Regex.test(cid);
};

/**
 * Extract CID from URL
 * @param url - IPFS gateway URL
 * @returns Extracted CID or null
 */
export const extractCidFromUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const cidIndex = pathParts.indexOf('ipfs') + 1;

        if (cidIndex > 0 && cidIndex < pathParts.length) {
            const cid = pathParts[cidIndex];
            if (isValidCid(cid)) {
                return cid;
            }
        }
    } catch (e) {
        // URL parsing failed
    }
    return null;
};

/**
 * Check if URL is an IPFS gateway URL
 * @param url - URL to check
 * @returns Whether the URL is an IPFS gateway URL
 */
export const isIpfsGatewayUrl = (url: string): boolean => {
    try {
        const urlObj = new URL(url);
        return urlObj.pathname.includes('/ipfs/');
    } catch (e) {
        return false;
    }
};

/**
 * Convert IPFS gateway URL to original CID
 * @param url - IPFS gateway URL
 * @returns Original CID or null
 */
export const urlToCid = (url: string): string | null => {
    if (!isIpfsGatewayUrl(url)) {
        return null;
    }
    return extractCidFromUrl(url);
};