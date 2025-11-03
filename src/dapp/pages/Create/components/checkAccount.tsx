
// import { useNFTCreateStore } from "../store/useNFTCreateStore";
import { Address_0 } from "@/dapp/constants/addressRoles";
import { useWalletContext } from "@dapp/context/useAccount/WalletContext";
import { useEffect, useState } from "react";
import { cn } from '@/lib/utils';
import { Alert } from "antd";

export const CheckAccount = () => {
    const { address, accountRole } = useWalletContext();
    // const updateBoxInfoForm = useNFTCreateStore(state => state.updateBoxInfoForm);
    const [tips, setTips] = useState<string>('')

    useEffect(() => {
        const fatch = () => {
            if (accountRole === 'User') {
                // updateBoxInfoForm('minter', address)
                setTips('')
            } else if (accountRole === 'Admin') {
                // updateBoxInfoForm('minter', null)
                setTips('The current account cannot perform this operation. Please switch to a different account.')
            } else {
                // updateBoxInfoForm('minter', null)
                setTips('Current wallet is not connected. Please connect your wallet.')
            }
        }
        fatch();
    }, [address, accountRole])

    return (
        <div className={cn("flex flex-row w-full py-3 md:py-6 items-center justify-center", "px-1 leading-tight")}>
            {tips ? (
                <Alert
                    type="error"
                    description={tips} />
            ) : (
                <Alert
                    type="success"
                    description="You can create Truth Box!"
                />
            )}
        </div>
    )

}

