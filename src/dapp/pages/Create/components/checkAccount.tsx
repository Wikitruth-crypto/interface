
import { useWalletContext } from "@dapp/context/useAccount/WalletContext";
import { useEffect, useState } from "react";
import { cn } from '@/lib/utils';
import AlertCustom from "@/dapp/components/base/alertCustom";

export const CheckAccount = () => {
    const { accountRole } = useWalletContext();
    const [tips, setTips] = useState<string>('')

    useEffect(() => {
        const fatch = () => {
            if (accountRole === 'User') {
                setTips('')
            } else if (accountRole === 'Admin') {
                setTips('The current account cannot perform this operation. Please switch to a different account.')
            } else {
                setTips('Current wallet is not connected. Please connect your wallet.')
            }
        }
        fatch();
    }, [accountRole])

    return (
        <div className={cn("flex flex-row w-full py-3 md:py-6 items-center justify-center", "px-1 leading-tight")}>
            {tips &&
                <AlertCustom
                    type="warning"
                    message={tips} />
            }
        </div>
    );
};
