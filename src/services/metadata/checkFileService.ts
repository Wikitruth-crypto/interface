// import {
//   MinterDataType,
// } from '@/dapp/types/metadata/index';

// /**
//  * Data Type Enum
//  */
// export enum DataTypeEnum {
//   MINTER_DATA = 'MINTER_DATA',
//   UNKNOWN = 'UNKNOWN'
// }

// /**
//  * Type Check Result Interface
//  */
// export interface TypeCheckResult {
//   type: DataTypeEnum;
//   isValid: boolean;
//   data?:  MinterDataType ;
//   errors?: string[];
// }

// export const checkFileService = {

//   /**
//    * Check if it is MinterDataType
//    */
//   checkMinterData: (data: object): TypeCheckResult => {
//     const errors: string[] = [];
    
//     try {
//       const obj = data as MinterDataType;
      
//       // Check required fields
//       if (!obj.name || typeof obj.name !== 'string') {
//         errors.push('name field missing or invalid type');
//       }
//       if (!obj.project || typeof obj.project !== 'string') {
//         errors.push('project field missing or invalid type');
//       }
//       if (!obj.website || typeof obj.website !== 'string') {
//         errors.push('website field missing or invalid type');
//       }
//       if (!obj.boxId || typeof obj.boxId !== 'string') {
//         errors.push('boxId field missing or invalid type');
//       }
//       if (!obj.mintMode || typeof obj.mintMode !== 'string') {
//         errors.push('mintMode field missing or invalid type');
//       }
//       if (!obj.title || typeof obj.title !== 'string') {
//         errors.push('title field missing or invalid type');
//       }
//       if (!obj.country || typeof obj.country !== 'string') {
//         errors.push('country field missing or invalid type');
//       }
//       if (!obj.state || typeof obj.state !== 'string') {
//         errors.push('state field missing or invalid type');
//       }
//       if (!obj.fileCID || typeof obj.fileCID !== 'string') {
//         errors.push('fileCID field missing or invalid type');
//       }
//       if (!obj.fileName || typeof obj.fileName !== 'string') {
//         errors.push('fileName field missing or invalid type');
//       }
//       if (!obj.password || typeof obj.password !== 'string') {
//         errors.push('password field missing or invalid type');
//       }
//       if (!obj.publicKey_minter || typeof obj.publicKey_minter !== 'string') {
//         errors.push('publicKey_minter field missing or invalid type');
//       }
//       if (!obj.privateKey_minter || typeof obj.privateKey_minter !== 'string') {
//         errors.push('privateKey_minter field missing or invalid type');
//       }
//       if (!obj.timestamp || typeof obj.timestamp !== 'string') {
//         errors.push('timestamp field missing or invalid type');
//       }
//       if (!obj.eventDate || typeof obj.eventDate !== 'string') {
//         errors.push('eventDate field missing or invalid type');
//       }
//       if (!obj.createDate || typeof obj.createDate !== 'string') {
//         errors.push('createDate field missing or invalid type');
//       }

//       // Check specific identifier
//       if (obj.name !== 'Truth Box') {
//         errors.push('name field value does not match MinterDataType');
//       }

//       const isValid = errors.length === 0;
      
//       return {
//         type: DataTypeEnum.MINTER_DATA,
//         isValid,
//         data: isValid ? obj : undefined,
//         errors: errors.length > 0 ? errors : undefined
//       };
//     } catch (error) {
//       return {
//         type: DataTypeEnum.MINTER_DATA,
//         isValid: false,
//         errors: ['Data format error, cannot parse as MinterDataType']
//       };
//     }
//   },

//   /**
//    * Automatically detect data type and return check result
//    */
//   detectDataType: (data: object): TypeCheckResult => {
//     // First try to check if it is array type (OfficeKeyPairType[])
//     if (Array.isArray(data)) {
//       return checkFileService.checkOfficeKeyPairArray(data);
//     }

//     // Then determine type based on characteristic fields
//     const obj = data as any;


//     // Check if it is MinterDataType (Characteristic: has mintMode and publicKey_minter fields)
//     if (obj.mintMode && obj.publicKey_minter && obj.name === 'Truth Box') {
//       return checkFileService.checkMinterData(data);
//     }


//     const minterCheck = checkFileService.checkMinterData(data);
//     if (minterCheck.isValid) {
//       return minterCheck;
//     }

//     // If none match, return unknown type
//     return {
//       type: DataTypeEnum.UNKNOWN,
//       isValid: false,
//       errors: ['Unable to recognize data type, data does not match any known format']
//     };
//   },



// }; 