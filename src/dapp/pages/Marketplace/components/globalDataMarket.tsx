"use client"

import React from 'react';
import { useGlobalData } from '../hooks/useGlobalData';
import GlobalData from '@/dapp/components/globalData';
import DataLabel, { DataType } from '@/dapp/components/base/dataLabel';

const GlobalDataMarket: React.FC = () => {

    // 获取全局数据（新的Hook）
    const {
        data: globalData,
        isLoading: globalLoading,
        isError: globalError,
    } = useGlobalData();

    const data: DataType[] = [
        {
            label: 'Supply',
            value: globalData?.totalSupply || 0,
        },
        {
            label: 'Storing',
            value: globalData?.totalStoring || 0,
        },
        {
            label: 'OnSale',
            value: globalData?.totalOnSale || 0,
        },

        {
            label: 'Swaping',
            value: globalData?.totalSwaping || 0,
        },
        {
            label: 'InSecrecy',
            value: globalData?.totalInSecrecy || 0,
        },
        {
            label: 'Published',
            value: globalData?.totalPublished || 0,
        },
        {
            label: 'Volume',
            value: 5861,
            suffix: '$'
        },
    ]

    return (
        <div className="flex flex-wrap lg:flex-nowrap gap-1 sm:gap-2">
            {/* {globalError&& (
                <div>
                    <h4 className="font-medium mb-1">全局数据错误:</h4>
                    <pre className="text-sm text-red-200 overflow-auto">
                        {globalError ? globalError.message : String(globalError)}
                    </pre>
                </div>
            )} */}

            {
                data.map((item, index) => {
                    return (
                        <DataLabel
                            key={`dataCard-${index}`}
                            data={item}
                            variant="outline"
                            size="sm"
                            minWidth="120px"
                            className="flex-1 lg:min-w-[120px] w-[calc(50%-0.125rem)] sm:w-[calc(25%-0.375rem)] md:w-[calc(33.33%-0.33rem)] lg:w-auto"
                        />
                    )
                })
            }
        </div>
    );
};

export default GlobalDataMarket; 