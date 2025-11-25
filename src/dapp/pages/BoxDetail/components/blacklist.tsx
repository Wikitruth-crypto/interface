"use client"
// import { NftDetailType } from '@dapp/type/contractDate';
import { useState, useEffect } from 'react';
import { Button } from 'antd';
import Line from '@/components/base/line';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useBoxContext } from '../contexts/BoxDetailContext';
// import { useUpdateNft_array } from '@dapp/hooks/useUpdateNft_array';
// interface Props {
//     tokenId: number,

// }

type ActiveButton = 'AddBlackList' | 'Unblacklist' | null;

const AdminFunction = () => {
    const { boxId } = useBoxContext();
    const allConfigs = useAllContractConfigs();
    const { write_BoxDetail, error, isPending, isSuccessed } = useWrite_BoxDetail();
    const [activeButton, setActiveButton] = useState<ActiveButton>(null);
    

    useEffect(() => {
        if (isSuccessed) {
            setActiveButton(null);
            // updateNft_array([nftDetail.tokenId])
        } else if (error || isPending) {
            setActiveButton(null);
        }
    }, [error, isPending, isSuccessed]);

    const handleAddBlackList = async () => {
        setActiveButton('AddBlackList');
        await write_BoxDetail({
            contract: allConfigs.TruthBox,
            functionName: 'addBlackTokenId',
            args: [boxId],
        });
    }

    return (
        <>
            <Line />
            <div className="flex justify-center">
                <span className="flex gap-4">
                    <Button
                        color='primary'
                        variant='outlined'
                        onClick={handleAddBlackList}
                        loading={activeButton === 'AddBlackList'}
                        disabled={activeButton !== null && activeButton !== 'AddBlackList'}
                    >
                        AddBlackList
                    </Button>

                    {/* No Unblacklist button */}
                </span>
            </div>
        </>
    );
}

export default AdminFunction;
