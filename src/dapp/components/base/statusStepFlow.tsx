"use client"

import React, { useCallback, useMemo } from 'react';
import {
    ReactFlow,
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Position,
    NodeTypes,
    Handle
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from '@/lib/utils';
import StatusLabel, { StatusType } from './statusLabel';

// 状态步骤接口
export interface StatusStepFlowProps {
    /** 当前激活的状态 */
    status: StatusType;
    listedMode: 'Selling' | 'Auctioning';
    /** 自定义样式类名 */
    className?: string;
    /** 标签尺寸 */
    size?: 'sm' | 'md' | 'lg';
    /** 是否启用响应式 */
    responsive?: boolean;
    /** 是否显示控制器 */
    showControls?: boolean;
    /** 是否显示背景 */
    showBackground?: boolean;
    // 是否可以拖拽
    draggable?: boolean;
    // 是否固定宽度和高度
    fixedSize?: boolean;

}

// 简单的自定义节点组件，带有明确的 handles
const StatusNode = ({ data }: { data: any }) => {
    return (
        <div className="relative">
            <Handle 
                type="target" 
                position={Position.Left} 
                style={{ background: '#555' }}
            />
            <StatusLabel
                status={data.status}
                size={data.size}
                responsive={data.responsive}
                disabled={!data.isActive}
            />
            <Handle 
                type="source" 
                position={Position.Right} 
                style={{ background: '#555' }}
            />
        </div>
    );
};

// 节点类型定义
const nodeTypes: NodeTypes = {
    statusNode: StatusNode
};

const StatusStepFlow: React.FC<StatusStepFlowProps> = ({
    status = 'Storing',
    listedMode = 'Selling',
    className,
    size = 'md',
    responsive = true,
    showControls = false,
    showBackground = true,
    draggable = false,
    fixedSize = false
}) => {
    // 判断状态是否已激活
    const isStatusActive = useCallback((checkStatus: StatusType): boolean => {
        if (!status) return false;

        // 定义状态路径
        const statusPaths: Record<StatusType, StatusType[]> = {
            'Storing': ['Storing'],
            'Selling': ['Storing', 'Selling'],
            'Auctioning': ['Storing', 'Auctioning'],
            // 'Waiting': ['Storing', listedMode, 'Waiting'],
            'Paid': ['Storing', listedMode, 'Paid'],
            'Refunding': ['Storing', listedMode, 'Paid', 'Refunding'],
            'InSecrecy': ['Storing', listedMode, 'Paid', 'InSecrecy'],
            'Published': ['Storing', listedMode, 'Paid', 'InSecrecy', 'Published'],
            'Blacklisted': ['Storing', 'Blacklisted']
        };

        const activePath = statusPaths[status] || [];
        return activePath.includes(checkStatus);
    }, [status, listedMode]);

    // 根据尺寸获取节点位置配置
    const getPositions = useCallback(() => {
        const positionConfigs = {
            sm: {
                storing: { x: 0, y: 40 },
                selling: { x: 120, y: 20 },
                auctioning: { x: 120, y: 60 },
                paid: { x: 240, y: 40 },
                inSecrecy: { x: 360, y: 20 },
                refunding: { x: 360, y: 60 },
                published: { x: 480, y: 40 }
            },
            md: {
                storing: { x: 0, y: 60 },
                selling: { x: 150, y: 30 },
                auctioning: { x: 150, y: 90 },
                paid: { x: 300, y: 60 },
                inSecrecy: { x: 450, y: 30 },
                refunding: { x: 450, y: 90 },
                published: { x: 600, y: 60 }
            },
            lg: {
                storing: { x: 0, y: 80 },
                selling: { x: 200, y: 40 },
                auctioning: { x: 200, y: 120 },
                paid: { x: 400, y: 80 },
                inSecrecy: { x: 600, y: 40 },
                refunding: { x: 600, y: 120 },
                published: { x: 800, y: 80 }
            }
        };
        
        return positionConfigs[size] || positionConfigs.md;
    }, [size]);

    // 初始节点 - 使用动态位置配置
    const initialNodes: Node[] = useMemo(() => {
        const positions = getPositions();
        
        return [
            {
                id: 'storing',
                position: positions.storing,
                data: {
                    status: 'Storing' as StatusType,
                    isActive: isStatusActive('Storing'),
                    isCurrent: status === 'Storing',
                    size,
                    responsive
                },
                type: 'statusNode'
            },
            {
                id: 'selling',
                position: positions.selling,
                data: {
                    status: 'Selling' as StatusType,
                    isActive: isStatusActive('Selling'),
                    isCurrent: status === 'Selling',
                    size,
                    responsive
                },
                type: 'statusNode'
            },
            {
                id: 'auctioning',
                position: positions.auctioning,
                data: {
                    status: 'Auctioning' as StatusType,
                    isActive: isStatusActive('Auctioning'),
                    isCurrent: status === 'Auctioning',
                    size,
                    responsive
                },
                type: 'statusNode'
            },
            {
                id: 'paid',
                position: positions.paid,
                data: {
                    status: 'Paid' as StatusType,
                    isActive: isStatusActive('Paid'),
                    isCurrent: status === 'Paid',
                    size,
                    responsive
                },
                type: 'statusNode'
            },
            {
                id: 'inSecrecy',
                position: positions.inSecrecy,
                data: {
                    status: 'InSecrecy' as StatusType,
                    isActive: isStatusActive('InSecrecy'),
                    isCurrent: status === 'InSecrecy',
                    size,
                    responsive
                },
                type: 'statusNode'
            },
            {
                id: 'refunding',
                position: positions.refunding,
                data: {
                    status: 'Refunding' as StatusType,
                    isActive: isStatusActive('Refunding'),
                    isCurrent: status === 'Refunding',
                    size,
                    responsive
                },
                type: 'statusNode'
            },
            {
                id: 'published',
                position: positions.published,
                data: {
                    status: 'Published' as StatusType,
                    isActive: isStatusActive('Published'),
                    isCurrent: status === 'Published',
                    size,
                    responsive
                },
                type: 'statusNode'
            }
        ];
    }, [status, size, responsive, isStatusActive, getPositions]);

    // 极简的边配置 - 移除所有自定义样式
    const initialEdges: Edge[] = useMemo(() => [
        {
            id: 'storing-selling',
            source: 'storing',
            target: 'selling'
        },
        {
            id: 'storing-auctioning',
            source: 'storing',
            target: 'auctioning'
        },
        {
            id: 'selling-paid',
            source: 'selling',
            target: 'paid'
        },
        {
            id: 'auctioning-paid',
            source: 'auctioning',
            target: 'paid'
        },
        {
            id: 'paid-inSecrecy',
            source: 'paid',
            target: 'inSecrecy'
        },
        {
            id: 'paid-refunding',
            source: 'paid',
            target: 'refunding'
        },
        {
            id: 'inSecrecy-published',
            source: 'inSecrecy',
            target: 'published'
        },
        {
            id: 'refunding-published',
            source: 'refunding',
            target: 'published'
        }
    ], []);

    // 使用 React Flow 官方推荐的状态管理
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // 连接处理函数
    const onConnect = useCallback(
        (params: any) => setEdges((eds: Edge[]) => addEdge(params, eds)),
        []
    );

    // 根据尺寸获取容器高度
    const getContainerHeight = useCallback(() => {
        const heightConfigs = {
            sm: '80px',
            md: '120px', 
            lg: '160px'
        };
        return heightConfigs[size] || heightConfigs.md;
    }, [size]);

    // 根据尺寸获取容器宽度
    const getContainerWidth = useCallback(() => {
        const widthConfigs = {
            sm: '720px',
            md: '920px',
            lg: '1120px'
        };
        return widthConfigs[size] || widthConfigs.md;
    }, [size]);

    return (
        <div className={cn("bg-background ", className)} style={{ height: fixedSize ? getContainerHeight() : '100%', width: fixedSize ? getContainerWidth() : '100%', position: 'relative', overflow: 'hidden' }}>
            <ReactFlow
                key={`flow-${edges.length}-${nodes.length}`}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                nodesDraggable={draggable}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                preventScrolling={false}
                proOptions={{ 
                    hideAttribution: true 
                }}
            >
                {showBackground && <Background />}
                {showControls && <Controls />}
            </ReactFlow>
        </div>
    );
};

export default StatusStepFlow; 