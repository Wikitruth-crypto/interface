import CryptoJS from 'crypto-js';


export const generateRandomPassword = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString();
};

export const generateRandomFileName = (length: number = 28): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomLength = Math.max(25, Math.min(32, length)); // Limit length between 25-32
  
  for (let i = 0; i < randomLength; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}; 
