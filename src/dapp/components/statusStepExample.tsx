"use client"

import React, { useState } from 'react';
import StatusStepFlow from './base/statusStepFlow';
import { StatusType } from './base/statusLabel';
import StatusStep from './statusStep';

// 使用示例组件
const StatusStepExample: React.FC = () => {
    const [currentStatus, setCurrentStatus] = useState<StatusType>('Paid');

    const statusOptions: StatusType[] = [
        'Storing', 'Selling', 'Auctioning', 'Waiting',
        'Paid', 'Refunding', 'InSecrecy', 'Published'
    ];

    return (
        <div className="space-y-6 p-6">
            <h2 className="text-2xl font-bold">React Flow 状态步骤组件示例</h2>

            {/* 状态选择器 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">选择当前状态：</label>
                <select
                    value={currentStatus || ''}
                    onChange={(e) => setCurrentStatus(e.target.value as StatusType)}
                    className="px-3 py-2 border rounded-md bg-background"
                >
                    <option value="">无状态</option>
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {/* 基础版本 */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">基础版本</h3>
                <StatusStepFlow status={currentStatus} listedMode="Selling" />
            </div>

            {/* 带背景的版本 */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">无背景点阵</h3>
                <StatusStepFlow
                    status={currentStatus}
                    listedMode="Selling"
                    fixedSize={true}
                    // showBackground={false}
                    className="border border-border"
                    // enableHorizontalScroll = {true}
                />
            </div>

            {/* 小尺寸版本 */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">小尺寸版本</h3>
                <StatusStepFlow
                    status={currentStatus}
                    listedMode="Auctioning"
                    size="sm"
                    className="border border-border"
                    fixedSize={true}
                    // enableHorizontalScroll = {true}
                />
            </div>

            {/* 带控制器的版本 */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">带控制器版本</h3>
                <StatusStepFlow
                    status={currentStatus}
                    showControls={true}
                    listedMode="Auctioning"
                    className="border border-border"
                    fixedSize={true}
                    // enableHorizontalScroll = {true}
                />
            </div>

            {/* 滚动版本 */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">滚动版本</h3>
                <StatusStep
                    status={currentStatus}
                    listedMode="Auctioning"
                    size="sm"
                    showBackground={false}
                    enableHorizontalScroll={true}
                />
            </div>
        </div>
    );
};

export default StatusStepExample; 