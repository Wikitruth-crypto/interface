"use client";

import { BoxStatus } from "@/dapp/types/contracts/truthBox";
import { useEffect } from "react";
import { useState } from "react";

/**
 * 状态颜色
 */

// --bg-Storing: #4db325;
// --bg-OnSale: #b0b306;
// --bg-Waiting: #e28b19;
// --bg-Paid: #c7480d;
// --bg-Refunding: #bd0fb4;
// --bg-InSecrecy: #5e0fdd;
// --bg-Published: #3d63e0;


export default function useStatusColor(status: BoxStatus) {

    const [statusColor, setStatusColor] = useState<string>('');

    useEffect(() => {
        switch (status) {
            case 'Storing':
                setStatusColor('var(--bg-Storing)');
                break;
        }
        const statusColor = {
            Storing: 'var(--bg-Storing)',
            OnSale: 'var(--bg-OnSale)',
            Waiting: 'var(--bg-Waiting)',
            Paid: 'var(--bg-Paid)',
            Refunding: 'var(--bg-Refunding)',
            InSecrecy: 'var(--bg-InSecrecy)',
            Published: 'var(--bg-Published)',
        }


        return statusColor;

    }, [status])
}