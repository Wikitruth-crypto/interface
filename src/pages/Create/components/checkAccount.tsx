import { useWalletContext } from "@dapp/contexts/web3Context/useAccount/WalletContext";
import { useEffect, useState } from "react";
import { cn } from '@/lib/utils';
import AlertCustom from "@/components/base/alertCustom";
import { Address_Admin } from '@/constants';

export const CheckAccount = () => {
    const { address } = useWalletContext();
    const [tips, setTips] = useState<string>('')

    useEffect(() => {
        const fatch = () => {
            if (address?.toLowerCase() !== Address_Admin.toLowerCase()) {
                setTips('')
            } else {
                setTips('The current account cannot perform this operation. Please switch to a different account.')
            }
        }
        fatch();
    }, [address])

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
