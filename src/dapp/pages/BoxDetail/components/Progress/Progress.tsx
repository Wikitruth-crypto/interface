import { Progress as AntProgress } from 'antd';

interface ProgressProps {
    progress: number;
}

const Progress: React.FC<ProgressProps> = ({ progress }) => {
    return (
        <div className='w-full p-2'>
            <AntProgress 
                percent={progress} 
                status="active"
                strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                }}
            />
        </div>
    );
}

export default Progress; 