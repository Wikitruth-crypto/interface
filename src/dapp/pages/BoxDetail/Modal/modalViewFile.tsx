"use client"
import {
    // ConfigProvider,
    Modal,
    // UploadFile,
    // Button,
} from 'antd';
import {
    useState,
    useEffect,
} from 'react';
import DisplayUriPassword from '@/dapp/components/uriPassword';
import useViewFileTruthBox from '@BoxDetail/hooks/useViewFileTruthBox';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';

interface Props {
    onClose: () => void;
}

const testData = {
    fileCidList: ['QmRz3Z4LbwMwQctEz741JDRiP9g2g5QkepbUa1LvY3zG2m', 'QmRz3Z4LbwMwQctEz741JDRiP9g2g5QkepbUa1LvY3zG2m'],
    password: '123456',
    slicesMetadataCID: 'QmRz3Z4LbwMwQctEz741JDRiP9g2g5QkepbUa1LvY3zG2m',
}

const ModalViewFile: React.FC<Props> = ({ onClose }) => {
    const updateModalStatus = useBoxDetailStore(state => state.updateModalStatus);
    const { box, metadataBox } = useBoxDetailContext();
    const { viewFileTruthBox } = useViewFileTruthBox();
    const [fileCidList, setFileCidList] = useState<string[]>(testData.fileCidList)
    const [password, setPassword] = useState<string>(testData.password)
    const [slicesMetadataCID, setSlicesMetadataCID] = useState<string>(testData.slicesMetadataCID)
    const [isAble, setIsAble] = useState<boolean>(false)
    const [okText, setOkText] = useState<string>('Submit')

    if (!box || !metadataBox) {
        return null;
    }

    useEffect(() => {
        updateModalStatus('ViewFile', 'open');
    }, []);

    const handleView = async () => {
        if (okText !== 'Submit') {
            return;
        }

        setOkText('wait...')
        setIsAble(true)

        // const result = await viewFileTruthBox(privateKey, metadataBox);
        // if (!result) {
        //     alert('Decryption failed!');
        //     setIsAble(false)
        //     setOkText('Submit')
        //     return;
        // }
        // const { fileCIDList, password, slicesMetadataCID } = result;
        // setFileCidList(fileCIDList);
        // setSlicesMetadataCID(slicesMetadataCID);
        // setPassword(password);
    }

    const handleClose = () => {
        updateModalStatus('ViewFile', 'close');
        onClose();
    };

    return (

        <Modal
            title="View File"
            centered
            open={true}
            closable={false}
            maskClosable={false}
            onOk={handleView}
            onCancel={handleClose}
            okButtonProps={{ disabled: isAble }}
            cancelButtonProps={{ disabled: false }}
            okText={okText}
            cancelText="Close"
            width={450}
        >
            <div className='flex flex-col gap-2'>

                <DisplayUriPassword fileCidList={fileCidList} slicesMetadataCID={slicesMetadataCID} password={password} />
            </div>
        </Modal>

    );
}

export default ModalViewFile;