"use client"
import { Modal, InputNumber, message, Typography, Divider } from 'antd';
import { parseUnits,} from 'viem';
import { useState, useEffect, useMemo } from 'react';
import { ACCEPTED_TOKENS } from '@dapp/config/contractsConfig';
import { useBoxDetailStore } from '../store/boxDetailStore';
import TokenSelector from '../components/tokenSelector';
import { CommonSelectOption } from '@/components/base/CommonSelect';
import PriceLabel from '@/components/base/priceLabel';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
// import Paragraph from '@/components/base/paragraph';
import type { BoxActionController } from '../actions/types';
import TextP from '@/components/base/text_p';

interface Props {
    listedMode: 'Sell' | 'Auction';
    controller: BoxActionController;
    onClose: () => void;
}

const ModalSellAuction: React.FC<Props> = ({ onClose, listedMode, controller }) => {
    const updateModalStatus = useBoxDetailStore(state => state.updateModalStatus);
    const { roles } = useBoxDetailStore(state => state.userState);
    const { boxId, box } = useBoxDetailContext();

    const defaultToken = ACCEPTED_TOKENS[0].address;
    const defaultDecimals = ACCEPTED_TOKENS[0].decimals;

    const [price, setPrice] = useState<string>('');
    const [accpetTokenAddress, setAccpetTokenAddress] = useState<string>(defaultToken);
    const [decimals, setDecimals] = useState<number>(defaultDecimals);

    useEffect(() => {
        updateModalStatus('SellAuction', 'open');
    }, []);

    const handleOk = async () => {
        if (controller.isSuccessed) {
            handleClose();
            return;
        }
        if (!box) return;

        let tokenAddress = accpetTokenAddress as `0x${string}`;
        let priceBigInt: bigint = BigInt(0);

        if (roles.includes('Minter')) {
            if (!accpetTokenAddress) {
                message.error('Token is required');
                return;
            }
            priceBigInt = price && Number(price) > 0 ? parseUnits(String(price), decimals) : BigInt(0);
        }

        await controller.execute({
            customArgs: {
                acceptedToken: tokenAddress,
                price: priceBigInt,
            },
        });
    };

    const handleToken = (token: CommonSelectOption | null) => {
        setAccpetTokenAddress(token?.value as string);
        setDecimals(token?.decimals as number);
    };

    const handlePriceChange = (value: number | string | null) => {
        if (value === null || value === undefined) {
            setPrice('');
        } else {
            setPrice(String(value));
        }
    };

    const handleClose = () => {
        updateModalStatus('SellAuction', 'close');
        onClose();
    };

    if (!box) {
        return <div>loading...</div>;
    }

    const isMinter = roles.includes('Minter');

    return (
        <Modal
            title={listedMode === 'Sell' ? 'Sell Truth Box' : 'Auction Truth Box'}
            centered
            open={true}
            closable={false}
            maskClosable={false}
            onOk={handleOk}
            onCancel={handleClose}
            okButtonProps={{ disabled: controller.isLoading }}
            cancelButtonProps={{ disabled: controller.isLoading }}
            okText={controller.isLoading ? 'Processing...' : controller.isSuccessed ? 'Success' : 'Submit'}
            cancelText="Close"
            width={450}
        >
            <div className='flex flex-col gap-2'>

                <div className='flex flex-col gap-2 text-foreground'>
                    <TextP>boxId:{boxId}</TextP>
                    <div className='flex flex-row gap-2 items-baseline'>
                        <TextP>Current Price:</TextP>
                        <PriceLabel
                            price={box.price}
                            symbol={ACCEPTED_TOKENS[0].symbol}
                            decimals={ACCEPTED_TOKENS[0].decimals}
                        />
                    </div>
                    <hr className='my-2' />
                    {isMinter ? (
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2 items-start'>
                                <TextP>Accpet Token:</TextP>
                                <TokenSelector onChange={handleToken} />
                            </div>
                            <div className='flex flex-col gap-2 items-baseline'>
                                <TextP>Price:</TextP>
                                <InputNumber
                                    onChange={(value) => handlePriceChange(value)}
                                    value={price ? Number(price) : undefined}
                                    placeholder="Enter price"
                                />
                            </div>
                            <TextP>If you don't enter the price, the default price will be used.</TextP>
                        </div>
                    ) : (
                        <TextP>Only Minter can set price!</TextP>
                    )}
                </div>
                <hr className='my-2' />
            </div>
        </Modal>

    );
}

export default ModalSellAuction;
