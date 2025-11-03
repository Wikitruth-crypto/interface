// "use client"
// import {
//     // ConfigProvider,
//     Modal,
//     // UploadFile,
//     // Button,
// } from 'antd';
// import {
//     useState,
//     useEffect,
// } from 'react';
// import DisplayUriPassword from '@/dapp/components/uriPassword';
// import useViewFile from '../hooks/useViewFile';
// import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
// // import FileUploadButton from '@/dapp/components/FileUploadButton';
// import { ViewFileRoleType } from '@BoxDetail/types/stateType';
// import InputUserData from '../components/inputUserData';

// interface Props {
//     onClose: () => void;
// }

// const ModalViewFile: React.FC<Props> = ({ onClose }) => {
//     const tokenId = useBoxDetailStore(state => state.tokenId);
//     const updateModalStatus = useBoxDetailStore(state => state.updateModalStatus);
//     // const { roles } = useBoxDetailStore(state => state.userState)
//     const { viewFile } = useViewFile();
//     // const { write, error, isPending, isConfirmed } = useWriteCustorm();
//     const [fileCid, setFileCid] = useState<string>('')
//     const [password, setPassword] = useState<string>('')
//     const [isAble, setIsAble] = useState<boolean>(false)
//     const [okText, setOkText] = useState<string>('Submit')

//     const [role, setRole] = useState<ViewFileRoleType | null>(null)
//     const [file, setFile] = useState<File | null>(null)
//     const [privateKey_user, setPrivateKey_user] = useState<string | null>(null)

//     useEffect(() => {
//         updateModalStatus('ViewFile', 'open');
//     }, []);

//     useEffect(() => {
//         if (fileCid && password) {
//             setIsAble(false)
//             setOkText('Success')
//         }
//     }, [fileCid, password]);

//     const handleView = async () => {
//         if (!file && !privateKey_user) {
//             alert('Please upload the file or enter the private key!');
//             return;
//         }

//         if (!role) {
//             alert('Please select the role!');
//             return;
//         }

//         if (okText !== 'Submit') {
//             return;
//         }

//         setOkText('wait...')
//         setIsAble(true)

//         const result = await viewFile(String(tokenId), role, file, privateKey_user);
//         if (!result) {
//             alert('Decryption failed!');
//             setIsAble(false)
//             setOkText('Submit')
//             return;
//         }
//         const { fileCID, password } = result;
//         setFileCid(fileCID);
//         setPassword(password);
//     }

//     const handleClose = () => {
//         updateModalStatus('ViewFile', 'close');
//         onClose();
//     };

//     return (

//         <Modal
//             title="View File"
//             centered
//             open={true}
//             closable={false}
//             maskClosable={false}  
//             onOk={handleView}
//             onCancel={handleClose}
//             okButtonProps={{ disabled: isAble }}
//             cancelButtonProps={{ disabled: false }}
//             okText={okText}
//             cancelText="Close"
//             width={600}
//         >
//             <div className='flex flex-col gap-2'>

//                 <InputUserData
//                     rolesOptions={['Minter', 'Buyer']}
//                     onRoleChange={(role: string) => setRole(role as ViewFileRoleType)}
//                     onFileChange={setFile}
//                     onPrivateKeyChange={setPrivateKey_user}
//                 />
//                 <div className='w-full h-[1px]  border-t border-gray-500 my-2'></div>
//                 <DisplayUriPassword fileCid={fileCid} password={password} />
//                 <div className='w-full h-[1px]  border-t border-gray-500 my-2'></div>
//             </div>
//         </Modal>

//     );
// }

// export default ModalViewFile;