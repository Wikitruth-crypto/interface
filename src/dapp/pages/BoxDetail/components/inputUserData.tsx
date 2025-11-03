// "use client"
// import {
//     // ConfigProvider,
//     UploadFile,
//     // Button,
// } from 'antd';
// import {
//     useEffect,
//     useState,
// } from 'react';
// import FileUploadButton from '@/dapp/components/fileUploadButton2';
// import RoleSelector from './roleSelector';
// import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
// import Paragraph from '@/components/base/paragraph';
// import InputArea from '@/dapp/components/base/inputArea';

// interface Props {
//     rolesOptions?: string[];
//     onRoleChange?: (role: string) => void;
//     onFileChange: (file: File | null) => void;
//     onPrivateKeyChange: (privateKey: string) => void;
// }

// 该组件已经被弃用

// const InputUserData: React.FC<Props> = ({ rolesOptions, onRoleChange, onFileChange, onPrivateKeyChange }) => {
//     const [role, setRole] = useState<string | null>(null)
//     const {roles} = useBoxDetailStore(state => state.userState)
//     const [privateKey, setPrivateKey] = useState<string>('')

//     useEffect(() => {
//         if (roles.includes('Admin')) {
//             setRole('Office DAO')
//         } else if (roles.includes('Minter')) {
//             setRole('Minter')
//         } else if (roles.includes('Buyer')) {
//             setRole('Buyer')
//         }
//     }, [roles])
    
//     const inputRole = (value: string | null) => {
//         console.log('inputRole value:', value)
//         if (value) {
//             setRole(value)
//             onRoleChange?.(value)
//         }
//     }

//     const inputJsonFile = (fileList: UploadFile[]) => {

//         if (fileList.length > 0) {
//             const uploadFile = fileList[0];

//             if (uploadFile.originFileObj) {
//                 // setFile(uploadFile.originFileObj as File);
//                 onFileChange(uploadFile.originFileObj as File);
//             } else {
//                 alert('File read failed, please select the file again');
//             }
//         } else {
//             // setFile(null);
//             onFileChange(null);
//         }
//     }

//     // const handleFileSuccess = (file: UploadFile) => {

//     // }

//     const inputPrivateKey = (value: string) => {
//         setPrivateKey(value)
//         onPrivateKeyChange(value)
//     }

//     return (

//         <div className='flex flex-col gap-2'>
//             {rolesOptions &&
//                 <div className='flex flex-row gap-2 items-center'>
//                     <Paragraph color='muted-foreground'>Select role:</Paragraph>
//                     <RoleSelector onChange={inputRole} options={rolesOptions} />
//                 </div>
//             }
//             {role && (
//                 <div className='flex flex-row gap-2 items-center'>
//                     <Paragraph color='muted-foreground'>Your role:</Paragraph>
//                     <Paragraph>{role}</Paragraph>
//                 </div>
//             )}
//             <div className='w-full h-[1px]  border-t border-gray-500 my-2'></div>
//             <div className='flex flex-col gap-2'>
//                 <Paragraph color='gray-3' size='lg' className='font-semibold'>You have two options:</Paragraph>
//                 <div className='flex flex-col gap-2 mb-2'>
//                     <Paragraph color='gray-3'>1, Upload json file:</Paragraph>
//                     <FileUploadButton
//                         acceptType="application/json"
//                         buttonText="Upload json file"
//                         maxSize={1}
//                         localOnly={true}
//                         onChange={inputJsonFile}
//                     // onSuccess={handleFileSuccess}
//                     // onError={handleFileError}
//                     />
//                     <Paragraph color='muted-foreground'>"The file name should start with 'TruthMarket'."</Paragraph>
//                 </div>

//                 <div className='flex flex-col gap-2'>
//                     {/* <h4>privateKey: </h4> */}
//                     <Paragraph color='gray-3'>2,Enter the privateKey_{role} from the previously minted files.</Paragraph>
//                     <InputArea
//                         value={privateKey}
//                         placeholder={`The format is: 0x308188648ce...`}
//                         onChange={(value) => inputPrivateKey(value)}
//                     />

//                 </div>
//             </div>

//         </div>

//     );
// }

// export default InputUserData;