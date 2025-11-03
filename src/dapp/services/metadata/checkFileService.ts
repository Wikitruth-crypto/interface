// import {
//   MinterDataType,
// } from '@/dapp/types/metadata/index';

// /**
//  * 数据类型枚举
//  */
// export enum DataTypeEnum {
//   MINTER_DATA = 'MINTER_DATA',
//   UNKNOWN = 'UNKNOWN'
// }

// /**
//  * 类型检查结果接口
//  */
// export interface TypeCheckResult {
//   type: DataTypeEnum;
//   isValid: boolean;
//   data?:  MinterDataType ;
//   errors?: string[];
// }

// export const checkFileService = {

//   /**
//    * 检查是否为 MinterDataType 类型
//    */
//   checkMinterData: (data: object): TypeCheckResult => {
//     const errors: string[] = [];
    
//     try {
//       const obj = data as MinterDataType;
      
//       // 检查必需字段
//       if (!obj.name || typeof obj.name !== 'string') {
//         errors.push('name 字段缺失或类型错误');
//       }
//       if (!obj.project || typeof obj.project !== 'string') {
//         errors.push('project 字段缺失或类型错误');
//       }
//       if (!obj.website || typeof obj.website !== 'string') {
//         errors.push('website 字段缺失或类型错误');
//       }
//       if (!obj.boxId || typeof obj.boxId !== 'string') {
//         errors.push('boxId 字段缺失或类型错误');
//       }
//       if (!obj.mintMode || typeof obj.mintMode !== 'string') {
//         errors.push('mintMode 字段缺失或类型错误');
//       }
//       if (!obj.title || typeof obj.title !== 'string') {
//         errors.push('title 字段缺失或类型错误');
//       }
//       if (!obj.country || typeof obj.country !== 'string') {
//         errors.push('country 字段缺失或类型错误');
//       }
//       if (!obj.state || typeof obj.state !== 'string') {
//         errors.push('state 字段缺失或类型错误');
//       }
//       if (!obj.fileCID || typeof obj.fileCID !== 'string') {
//         errors.push('fileCID 字段缺失或类型错误');
//       }
//       if (!obj.fileName || typeof obj.fileName !== 'string') {
//         errors.push('fileName 字段缺失或类型错误');
//       }
//       if (!obj.password || typeof obj.password !== 'string') {
//         errors.push('password 字段缺失或类型错误');
//       }
//       if (!obj.publicKey_minter || typeof obj.publicKey_minter !== 'string') {
//         errors.push('publicKey_minter 字段缺失或类型错误');
//       }
//       if (!obj.privateKey_minter || typeof obj.privateKey_minter !== 'string') {
//         errors.push('privateKey_minter 字段缺失或类型错误');
//       }
//       if (!obj.timestamp || typeof obj.timestamp !== 'string') {
//         errors.push('timestamp 字段缺失或类型错误');
//       }
//       if (!obj.eventDate || typeof obj.eventDate !== 'string') {
//         errors.push('eventDate 字段缺失或类型错误');
//       }
//       if (!obj.createDate || typeof obj.createDate !== 'string') {
//         errors.push('createDate 字段缺失或类型错误');
//       }

//       // 检查特定标识符
//       if (obj.name !== 'Truth Box') {
//         errors.push('name 字段值不匹配 MinterDataType');
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
//         errors: ['数据格式错误，无法解析为 MinterDataType']
//       };
//     }
//   },

//   /**
//    * 自动检测数据类型并返回检查结果
//    */
//   detectDataType: (data: object): TypeCheckResult => {
//     // 首先尝试检查是否为数组类型（OfficeKeyPairType[]）
//     if (Array.isArray(data)) {
//       return checkFileService.checkOfficeKeyPairArray(data);
//     }

//     // 然后根据特征字段判断类型
//     const obj = data as any;


//     // 检查是否为 MinterDataType（特征：有 mintMode 和 publicKey_minter 字段）
//     if (obj.mintMode && obj.publicKey_minter && obj.name === 'Truth Box') {
//       return checkFileService.checkMinterData(data);
//     }


//     const minterCheck = checkFileService.checkMinterData(data);
//     if (minterCheck.isValid) {
//       return minterCheck;
//     }

//     // 如果都不匹配，返回未知类型
//     return {
//       type: DataTypeEnum.UNKNOWN,
//       isValid: false,
//       errors: ['无法识别数据类型，数据不符合任何已知格式']
//     };
//   },



// }; 