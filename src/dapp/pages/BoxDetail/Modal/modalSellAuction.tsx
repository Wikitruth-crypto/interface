"use client"
import { Modal, InputNumber, message } from 'antd';
import { parseUnits } from 'viem';
import { useState, useEffect, useMemo } from 'react';
import { useSupportedTokens } from '@/dapp/contractsConfig';
import { useBoxDetailStore } from '../store/boxDetailStore';
import TokenSelector from '../components/tokenSelector';
import { CommonSelectOption } from '@/dapp/components/base/CommonSelect';
import PriceLabel from '@/dapp/components/base/priceLabel';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import Paragraph from '@/components/base/paragraph';
import type { BoxActionController } from '../actions/types';

interface Props {
    listedMode: 'Sell' | 'Auction';
    controller: BoxActionController;
    onClose: () => void;
}

const ModalSellAuction: React.FC<Props> = ({ onClose, listedMode, controller }) => {
    const updateModalStatus = useBoxDetailStore(state => state.updateModalStatus);
    const supportedTokens = useSupportedTokens();
    const { roles } = useBoxDetailStore(state => state.userState);
    const { boxId, box } = useBoxDetailContext();

    const officeToken = supportedTokens[0];
    const defaultToken = (box?.acceptedToken as `0x${string}` | undefined) || officeToken?.address || '0x0000000000000000000000000000000000000000';
    const defaultDecimals = useMemo(() => {
        const found = supportedTokens.find(token => token.address === box?.acceptedToken);
        return found?.decimals ?? officeToken?.decimals ?? 18;
    }, [supportedTokens, box?.acceptedToken, officeToken?.decimals]);

    const [price, setPrice] = useState<string>('');
    const [accpetTokenAddress, setAccpetTokenAddress] = useState<string>(defaultToken);
    const [decimals, setDecimals] = useState<number>(defaultDecimals);

    useEffect(() => {
        updateModalStatus('SellAuction', 'open');
    }, []);

    const handleSell = async () => {
        if (!box) return;

        let tokenAddress = accpetTokenAddress as `0x${string}`;
        let priceBigInt: bigint;

        if (roles.includes('Minter')) {
            if (!accpetTokenAddress) {
                message.error('Token is required');
                return;
            }
            // 确保 price 是字符串，parseUnits 需要字符串参数
            const priceStr = String(price || '');
            priceBigInt = priceStr && Number(priceStr) > 0 ? parseUnits(priceStr, decimals) : BigInt(0);
        } else {
            tokenAddress = box.acceptedToken as `0x${string}`;
            priceBigInt = BigInt(box.price || 0);
        }

        await controller.execute({
            customArgs: {
                acceptedToken: tokenAddress,
                price: priceBigInt,
            },
        });
        onClose();
    };

    const handleToken = (token: CommonSelectOption | null) => {
        setAccpetTokenAddress(token?.value as string);
        setDecimals(token?.decimals as number);
    };

    const handlePriceChange = (value: number | string | null) => {
        // InputNumber 的 onChange 可能返回 number | null，需要转换为字符串
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
            onOk={handleSell}
            onCancel={handleClose}
            okButtonProps={{ disabled: controller.isLoading }}
            cancelButtonProps={{ disabled: controller.isLoading }}
            okText={controller.isLoading ? 'Processing...' : 'Submit'}
            cancelText="Close"
            width={450}
        >
            <div className='flex flex-col gap-2'>

                <div className='flex flex-col gap-2 text-foreground'>
                    <div className='flex flex-row gap-2 items-baseline'>
                        <Paragraph color='muted-foreground'>tokenId:</Paragraph>
                        <Paragraph >{boxId}</Paragraph>
                    </div>
                    <div className='flex flex-row gap-2 items-baseline'>
                        <Paragraph color='muted-foreground'>Current Price:</Paragraph>
                        <PriceLabel
                            price={box.price}
                            symbol={officeToken?.symbol}
                            decimals={officeToken?.decimals}
                        />
                    </div>
                    <div className='w-full h-[1px]  border-t border-gray-500 my-2'></div>
                    {isMinter ? (
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2 items-start'>
                                <Paragraph color='muted-foreground'>Accpet Token:</Paragraph>
                                <div className='flex w=full flex-row items-center '>
                                    <TokenSelector onChange={handleToken} />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 items-baseline'>
                                <Paragraph color='muted-foreground'>Price:</Paragraph>
                                <div className='flex flex-row items-center '>
                                    <InputNumber
                                        onChange={(value) => handlePriceChange(value)}
                                        value={price ? Number(price) : undefined}
                                        placeholder="Enter price"
                                    />
                                </div>
                            </div>
                            <Paragraph color='muted-foreground'>If you don't enter the price, the default price will be used.</Paragraph>
                        </div>
                    ) : (
                        <Paragraph color='muted-foreground'>Only Minter can set price!</Paragraph>
                    )}
                </div>
                <div className='w-full h-[1px]  border-t border-gray-500 my-2'></div>
            </div>
        </Modal>

    );
}

export default ModalSellAuction;
