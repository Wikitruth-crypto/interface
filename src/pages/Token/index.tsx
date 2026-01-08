import TokenContent from './tokenContent';
import { Radio } from 'antd';
import Faucet from './faucet';
import { useState } from 'react';
import { Container } from '@/components/Container';

export default function TokenPage() {
    const [activeTab, setActiveTab] = useState<'token' | 'faucet' | 'accountQueryTest'>('token');
    return (
        <Container>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Radio.Group buttonStyle='solid' value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
                    <Radio.Button value="token">Token</Radio.Button>
                    <Radio.Button value="faucet">Faucet</Radio.Button>
                </Radio.Group>
            </div>
            {activeTab === 'token' && <TokenContent />}
            {activeTab === 'faucet' && <Faucet />}
        </Container>
    );
}