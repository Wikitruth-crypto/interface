import ERC20Token from './erc20Token';
import { Radio } from 'antd';
import Faucet from './faucet';
import { useState } from 'react';
import { Container } from '@/components/Container';

export default function TokenPage() {
    const [activeTab, setActiveTab] = useState<'erc20' | 'faucet' | 'accountQueryTest'>('erc20');
    return (
        <Container>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Radio.Group buttonStyle='solid' value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
                    <Radio.Button value="erc20">ERC20 Token</Radio.Button>
                    <Radio.Button value="faucet">Faucet</Radio.Button>
                </Radio.Group>
            </div>
            {activeTab === 'erc20' && <ERC20Token />}
            {activeTab === 'faucet' && <Faucet />}
        </Container>
    );
}