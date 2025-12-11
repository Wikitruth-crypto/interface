"use client"
import { Modal, InputNumber, message, Typography, Divider } from 'antd';
import { parseUnits,} from 'viem';
import { useState, useEffect, useMemo } from 'react';
import { ACCEPTED_TOKENS } from '@/dapp/contractsConfig';
import { useBoxDetailStore } from '../store/boxDetailStore';
import TokenSelector from '../components/tokenSelector';
import { CommonSelectOption } from '@/dapp/components/base/CommonSelect';
import PriceLabel from '@/dapp/components/base/priceLabel';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
// import Paragraph from '@/components/base/paragraph';
import type { BoxActionController } from '../actions/types';

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
                    <Typography.Paragraph color='muted-foreground'>boxId:{boxId}</Typography.Paragraph>
                    <div className='flex flex-row gap-2 items-baseline'>
                        <Typography.Paragraph color='muted-foreground'>Current Price:</Typography.Paragraph>
                        <PriceLabel
                            price={box.price}
                            symbol={ACCEPTED_TOKENS[0].symbol}
                            decimals={ACCEPTED_TOKENS[0].decimals}
                        />
                    </div>
                    <Divider />
                    {isMinter ? (
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2 items-start'>
                                <Typography.Paragraph color='muted-foreground'>Accpet Token:</Typography.Paragraph>
                                <TokenSelector onChange={handleToken} />
                            </div>
                            <div className='flex flex-col gap-2 items-baseline'>
                                <Typography.Paragraph color='muted-foreground'>Price:</Typography.Paragraph>
                                <InputNumber
                                    onChange={(value) => handlePriceChange(value)}
                                    value={price ? Number(price) : undefined}
                                    placeholder="Enter price"
                                />
                            </div>
                            <Typography.Paragraph color='muted-foreground'>If you don't enter the price, the default price will be used.</Typography.Paragraph>
                        </div>
                    ) : (
                        <Typography.Paragraph color='muted-foreground'>Only Minter can set price!</Typography.Paragraph>
                    )}
                </div>
                <Divider />
            </div>
        </Modal>

    );
}

export default ModalSellAuction;
