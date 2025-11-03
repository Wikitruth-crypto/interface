import React from 'react';
// import { Result, ConfigProvider } from 'antd';
// import { ResultStatusType } from 'antd/es/result';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// 定义一个类型，只能有这些。

interface Props {
    args: string,
}

const ResultIcon: React.FC<Props> = ({ args }) => (

    <div style={{ textAlign: 'center' }}>
        {args === 'success' && <FaCheckCircle size={30} className="text-primary" />}
        {args === 'error' && <FaExclamationCircle size={30} className="text-destructive" />}
        {/* <h2>{status === 'success' ? 'Operation Successful!' : 'Something Went Wrong'}</h2> */}
    </div>
);

export default ResultIcon;