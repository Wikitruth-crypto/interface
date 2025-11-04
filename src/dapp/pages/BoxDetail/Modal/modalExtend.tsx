"use client"
import {
    // ConfigProvider,
    Modal,
    // Button,
    Typography,
} from 'antd';
import {
    useState,
    useEffect,
} from 'react';
// import './modal.css';
// import { useWriteContract } from 'wagmi';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';
import { useBoxDetailStore } from '../store/boxDetailStore';
// import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import InputNumber from '@dapp/components/base/inputNumber';
import { useBoxContext } from '../contexts/BoxContext';
// import { usePermissionContext } from '../useState/permission/PermissionContext';

interface Props {
    onClose: () => void;
}

const ModalExtend: React.FC<Props> = ({ onClose }) => {
    const { boxId, box } = useBoxContext();
    // const { address } = useWalletContext();
    const updateModalStatus = useBoxDetailStore(state => state.updateModalStatus);
    const { roles } = useBoxDetailStore(state => state.userState);
    const { write_BoxDetail, error, isPending, isSuccessed } = useWrite_BoxDetail();
    const allConfigs = useAllContractConfigs();
    const [isAble, setIsAble] = useState<boolean>(false)
    const [okText, setOkText] = useState<string>('Submit')
    const [timestamp, setTimestamp] = useState<number>(0)
    const [days, setDays] = useState<number>(0)

    if (!box) {
        return <div>loading...</div>
    }

    useEffect(() => {
        updateModalStatus('ExtendDeadline', 'open');
    }, []);

    useEffect(() => {
        if (isSuccessed) {
            setIsAble(false)
            setOkText('Submit')
        } else if (isPending) {
            setIsAble(true)
            setOkText('wait...')
        } else if (error) {
            setIsAble(false)
            setOkText('Submit')
        }

    }, [error, isPending, isSuccessed]);

    const handleInputTime = (value: string) => {
        console.log("value days:", value)
        setDays(Number(value))
        setTimestamp(Number(value) * 24 * 60 * 60)
    }

    const handleExtend = async () => {
        if (timestamp) {
            if (roles.includes('Minter')) {
                await write_BoxDetail({
                    contract: allConfigs.TruthBox,
                    functionName: 'extendDeadline',
                    args: [boxId, timestamp], // 
                });
            } else {
                alert('You can`t do that!');
                return;
            }
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
            width={600}
        >
            <div className='flex flex-col gap-2'>

                <div className='flex flex-row gap-2 items-baseline'>
                    <Typography.Paragraph className='text-gray-300'>Current tokenId:</Typography.Paragraph>
                    <Typography.Paragraph className='text-lg'>{boxId}</Typography.Paragraph>
                </div>
                <div className='flex flex-col gap-2'>
                    {/* <Typography.Paragraph className='text-muted-foreground'>Please enter the data from the previously minted files.</Typography.Paragraph> */}
                    <div className='flex flex-col gap-2 w-full'>
                        <Typography.Paragraph className='text-gray-300'>Days:</Typography.Paragraph>
                        {/* <input
                            className='modalInput'
                            type="text"
                            name="uint256"
                            placeholder="Input timestamp"
                            onChange={(e) => handleInputTime(e.target.value)}
                        /> */}
                        <div className='flex flex-row w-full'>
                            <InputNumber
                                value={days}
                                suffix='days'
                                decimals={0}
                                min={1}
                                step={10}
                                placeholder="Input timestamp"
                                onChange={(value: string) => handleInputTime(value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-[1px]  border-t border-gray-500 my-2'></div>
        
        </Modal >

    );
}

export default ModalExtend;