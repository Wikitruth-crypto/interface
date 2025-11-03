"use client"
import {
    Modal,
} from 'antd';
import { parseUnits } from 'viem';
import {
    useState,
    useEffect,
} from 'react';
// import InputText from '@dapp/components/InputBox';
import { useAllContractConfigs, useSupportedTokens } from '@/dapp/contractsConfig';
import { useBoxDetailStore } from '../store/boxDetailStore';
import TokenSelector from '../components/tokenSelector';
import { CommonSelectOption } from '@/dapp/components/base/CommonSelect';
// import { useQueryStore } from '@/dapp/store/useQueryStore';
import PriceLabel from '@/dapp/components/base/priceLabel';
import { useCurrentBox } from '../hooks/useCurrentBox';
import InputNumber from '@/dapp/components/base/inputNumber';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import Paragraph from '@/components/base/paragraph';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';
interface Props {
    listedMode: 'Sell' | 'Auction';
    onClose: () => void;
}

const ModalSellAuction: React.FC<Props> = ({ onClose, listedMode }) => {
    const { address } = useWalletContext();
    const tokenId = useBoxDetailStore(state => state.tokenId);
    const updateModalStatus = useBoxDetailStore(state => state.updateModalStatus);
    const allConfigs = useAllContractConfigs();
    const supportedTokens = useSupportedTokens();
    const { roles } = useBoxDetailStore(state => state.userState);
    const { write_BoxDetail, error, isPending, isSuccessed } = useWrite_BoxDetail();
    const { box } = useCurrentBox();
    const [cancelAble, setCancelAble] = useState<boolean>(false)
    const [okAble, setOkAble] = useState<boolean>(false)
    const [buttonText, setButtonText] = useState<string>('Submit')

    const [price, setPrice] = useState<string>('0')
    const officeToken = supportedTokens[0];
    const [accpetTokenAddress, setAccpetTokenAddress] = useState<string>(supportedTokens[0].address)
    
    const [decimals, setDecimals] = useState<number>(supportedTokens[0].decimals)

    useEffect(() => {
        updateModalStatus('SellAuction', 'open');
    }, []);

    useEffect(() => {
        if (isSuccessed) {
            setCancelAble(true)
            setOkAble(false)
            setButtonText('Success')
        } else if (isPending) {
            setCancelAble(true)
            setOkAble(true)
            setButtonText('wait...')
        } else if (error) {
            setCancelAble(false)
            setOkAble(false)
            setButtonText('Submit')
        }
    }, [error, isPending, isSuccessed])

    const handleSell = async () => {
        if (buttonText === 'Success') {
            onClose()
            return;
        }

        console.log("price:", price)
        console.log("accpetTokenAddress:", accpetTokenAddress)
        console.log("decimals:", decimals)
        console.log("listedMode:", listedMode)

        if (accpetTokenAddress) {
            let priceBigInt: bigint = BigInt(0);
            if (Number(price) > 0) {
                priceBigInt = parseUnits(price, decimals);
            }
            if (listedMode === 'Sell') {
                await write_BoxDetail({
                    contract: allConfigs.Exchange,
                    functionName: 'sell',
                    args: [tokenId, accpetTokenAddress, priceBigInt],
                });
            } else if (listedMode === 'Auction') {
                await write_BoxDetail({
                    contract: allConfigs.Exchange,
                    functionName: 'auction',
                    args: [tokenId, accpetTokenAddress, priceBigInt],
                });
            }

        } else {
            alert("Empty data!")
        }

    }

    const handleToken = (token: CommonSelectOption | null) => {
        // console.log("acceptTokenAddress:", token?.value)
        // console.log("acceptTokenDecimals:", token?.decimals)

        setAccpetTokenAddress(token?.value as string)
        setDecimals(token?.decimals as number)
    }

    const handlePriceChange = (value: string) => {
        // console.log("price:", value)
        setPrice(value)
    }

    const handleClose = () => {
        updateModalStatus('SellAuction', 'close');
        onClose();
    };

    if (!box) {
        return <div>loading...</div>;
    }

    return (

        <Modal
            title={listedMode === 'Sell' ? "Sell Truth Box" : "Auction Truth Box"}
            centered
            open={true}
            closable={false}
            maskClosable={false}
            onOk={handleSell}
            onCancel={handleClose}
            okButtonProps={{ disabled: okAble }}
            cancelButtonProps={{ disabled: cancelAble }}
            okText={buttonText}
            cancelText="Close"
            width={600}
        >
            <div className='flex flex-col gap-2'>

                <div className='flex flex-col gap-2 text-foreground'>
                    <div className='flex flex-row gap-2 items-baseline'>
                        <Paragraph color='muted-foreground'>tokenId:</Paragraph>
                        <Paragraph >{tokenId}</Paragraph>
                    </div>
                    <div className='flex flex-row gap-2 items-baseline'>
                        <Paragraph color='muted-foreground'>Current Price:</Paragraph>
                        <PriceLabel
                            price={box.price}
                            symbol={officeToken.symbol}
                            decimals={officeToken.decimals}
                        />
                    </div>
                    <div className='w-full h-[1px]  border-t border-gray-500 my-2'></div>
                    {roles.includes('Minter') ? (
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
                                        onChange={handlePriceChange}
                                        value={price}
                                        placeholder={`Enter price`}
                                    />
                                </div>
                                {/* {error && <p className={styles.error}>{error}</p>} */}
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