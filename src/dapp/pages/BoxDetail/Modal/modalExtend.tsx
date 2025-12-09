"use client"
import {
    // ConfigProvider,
    Modal,
    Divider,
    Typography,
    InputNumber,
} from 'antd';
import {
    useState,
    useEffect,
} from 'react';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useWriteCustormV2 } from '@/dapp/hooks/useWriteCustormV2';
import { useBoxDetailStore } from '../store/boxDetailStore';
// import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
// import { usePermissionContext } from '../useState/permission/PermissionContext';
// import type { BoxActionController } from '../actions/types';

interface Props {
    // controller: BoxActionController;
    onClose: () => void;
}

const ModalExtend: React.FC<Props> = ({ onClose}) => {
    const { boxId, box } = useBoxDetailContext();
    // const { address } = useWalletContext();
    const updateModalStatus = useBoxDetailStore(state => state.updateModalStatus);
    // const { roles } = useBoxDetailStore(state => state.userState);
    const { writeCustormV2, error, isLoading, isSuccessed } = useWriteCustormV2(boxId);
    const allConfigs = useAllContractConfigs();
    const [isAble, setIsAble] = useState<boolean>(false)
    const [okText, setOkText] = useState<string>('Submit')
    const [days, setDays] = useState<string>('')

    if (!box) {
        return <div>loading...</div>
    }

    useEffect(() => {
        updateModalStatus('ExtendDeadline', 'open');
    }, []);

    useEffect(() => {
        if (isSuccessed) {
            setIsAble(false)
            setOkText('Success')
        } else if (isLoading) {
            setIsAble(true)
            setOkText('wait...')
        } else if (error) {
            setIsAble(false)
            setOkText('Submit')
        }

    }, [error, isLoading, isSuccessed]);

    const handleInputTime = (value: string) => {
        if (import.meta.env.DEV) {
            console.log("value days:", value)
        }
        setDays(value)
    }

    const handleExtend = async () => {
        if (days && Number(days) > 0) {
            const timestamp = Number(days) * 24 * 60 * 60;
            await writeCustormV2({
                contract: allConfigs.TruthBox,
                functionName: 'extendDeadline',
                args: [boxId, timestamp], // 
            });
        } else {
            alert('Empty data!')
        }
    }

    const handleClose = () => {
        updateModalStatus('ExtendDeadline', 'close');
        onClose();
    };

    return (

        <Modal
            title="Extend Deadline"
            centered
            open={true}
            closable={false}
            maskClosable={false}
            onOk={handleExtend}
            onCancel={handleClose}
            okButtonProps={{ disabled: isAble }}
            cancelButtonProps={{ disabled: isAble }}
            okText={okText}
            cancelText="Close"
            width={450}
        >
            <div className='flex flex-col gap-2'>

                <div className='flex flex-row gap-2 items-baseline'>
                    <Typography.Paragraph className='text-gray-300'>Current boxId:</Typography.Paragraph>
                    <Typography.Paragraph className='text-lg'>{boxId}</Typography.Paragraph>
                </div>
                <div className='flex flex-col gap-2'>
                    {/* <Typography.Paragraph className='text-muted-foreground'>Please enter the data from the previously minted files.</Typography.Paragraph> */}
                    <div className='flex flex-col gap-2 w-full'>
                        <Typography.Paragraph className='text-gray-300'>Days:</Typography.Paragraph>
                        <div className='flex flex-row w-full'>
                            <InputNumber
                                value={days}
                                suffix='days'
                                precision={0}
                                min="1"
                                step={10}
                                placeholder="Input timestamp"
                                onChange={(value) => handleInputTime(value || '')}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
        
        </Modal >

    );
}

export default ModalExtend;