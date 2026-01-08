"use client"
// import { NftDetailType } from '@dapp/type/contractDate';
import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useAllContractConfigs } from '@dapp/config/contractsConfig';
import { useWriteCustormV2 } from '@/hooks/useWriteCustormV2';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
// import { useUpdateNft_array } from '@dapp/hooks/useUpdateNft_array';
// interface Props {
//     tokenId: number,

// }

type ActiveButton = 'AddBlackList' | 'Unblacklist' | null;

const AdminFunction = () => {
    const { boxId } = useBoxDetailContext();
    const allConfigs = useAllContractConfigs();
    const { writeCustormV2, error, isPending, isSuccessed } = useWriteCustormV2(boxId);
    const [activeButton, setActiveButton] = useState<ActiveButton>(null);
    

    useEffect(() => {
        if (isSuccessed) {
            setActiveButton(null);
        } else if (error || isPending) {
            setActiveButton(null);
        }
    }, [error, isPending, isSuccessed]);

    const handleAddBlackList = async () => {
        setActiveButton('AddBlackList');
        await writeCustormV2({
            contract: allConfigs.TruthBox,
            functionName: 'addBlackTokenId',
            args: [boxId],
        });
    }

    return (
        <>
            <hr className="my-2" />
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
