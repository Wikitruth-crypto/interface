"use client"
import {
    // ConfigProvider,
    Modal,
    InputNumber,
} from 'antd';
import {
    useState,
    useEffect,
} from 'react';
import { useAllContractConfigs } from '@dapp/config/contractsConfig';
import { useWriteCustormV2 } from '@/hooks/useWriteCustormV2';
import { useBoxDetailStore } from '../store/boxDetailStore';
// import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
// import { usePermissionContext } from '../useState/permission/PermissionContext';
import TextP from '@/components/base/text_p';

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
                    <TextP>Current boxId:</TextP>
                    <TextP>{boxId}</TextP>
                </div>
                <div className='flex flex-col gap-2'>
                    {/* <Typography.Paragraph className='text-muted-foreground'>Please enter the data from the previously minted files.</Typography.Paragraph> */}
                    <div className='flex flex-col gap-2 w-full'>
                        <TextP>Days:</TextP>
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
            <hr className='my-2' />
        
        </Modal >

    );
}

export default ModalExtend;