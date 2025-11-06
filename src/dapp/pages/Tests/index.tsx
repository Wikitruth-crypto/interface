"use client";

import React, { } from 'react';
import { Container } from '@/components/Container';
// import TruthBoxEventsSynchronizer from '@/dapp/store_sapphire/query/TruthBoxEventsSynchronizer';
// import { useReadContract } from '@dapp/hooks/readContracts/useReadContract';
// import { ContractName } from '@dapp/contractsConfig';
import HooksTest from './hooksTest';

const TestsPage = () => {

    return (
        <Container className="p-6">
            <HooksTest />
        </Container>
    );
};

export default TestsPage;

