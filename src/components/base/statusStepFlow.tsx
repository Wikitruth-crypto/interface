"use client"

import React, { useCallback, useMemo, useEffect } from 'react';
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
import StatusLabel from './statusLabel';
import { BoxStatus } from '@dapp/types/typesDapp/contracts/truthBox';

// Status step interface
export interface StatusStepFlowProps {
    status: BoxStatus;
    listedMode: 'Selling' | 'Auctioning';
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    responsive?: boolean;
    showControls?: boolean;
    showBackground?: boolean;
    draggable?: boolean;
    fixedSize?: boolean;

}

// Simple custom node component, with明确的 handles
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

// Node type definition
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
    // Check if the status is activated
    const isStatusActive = useCallback((checkStatus: BoxStatus): boolean => {
        if (!status) return false;

        // Define status path
        const statusPaths: Record<BoxStatus, BoxStatus[]> = {
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

    // Get node position configuration based on size
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

    const buildNodes = useCallback((): Node[] => {
        const positions = getPositions();
        return [
            {
                id: 'storing',
                position: positions.storing,
                data: {
                    status: 'Storing' as BoxStatus,
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
                    status: 'Selling' as BoxStatus,
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
                    status: 'Auctioning' as BoxStatus,
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
                    status: 'Paid' as BoxStatus,
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
                    status: 'InSecrecy' as BoxStatus,
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
                    status: 'Refunding' as BoxStatus,
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
                    status: 'Published' as BoxStatus,
                    isActive: isStatusActive('Published'),
                    isCurrent: status === 'Published',
                    size,
                    responsive
                },
                type: 'statusNode'
            }
        ];
    }, [getPositions, isStatusActive, status, size, responsive]);

    // Minimal edge configuration - remove all custom styles
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

    // Use React Flow official recommended status management
    const [nodes, setNodes, onNodesChange] = useNodesState(buildNodes());
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // When status/listedMode/size/responsive changes, synchronize the node activation state
    useEffect(() => {
        setNodes(buildNodes());
    }, [buildNodes, setNodes]);

    // Connection processing function
    const onConnect = useCallback(
        (params: any) => setEdges((eds: Edge[]) => addEdge(params, eds)),
        []
    );

    // Get container height based on size
    const getContainerHeight = useCallback(() => {
        const heightConfigs = {
            sm: '80px',
            md: '120px', 
            lg: '160px'
        };
        return heightConfigs[size] || heightConfigs.md;
    }, [size]);

    // Get container width based on size
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
