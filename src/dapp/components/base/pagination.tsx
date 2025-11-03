import { Pagination } from 'antd';
import type { PaginationProps } from 'antd';

export interface Props {
    total: number; // 总条数
    pageSize: number; // 每页条数（从分页器中选择）
    currentPage: number; // 当前页码
    pageSizeOptions: number[]; // 分页大小选项
    onPageChange: (page: number, pageSize: number) => void;
}

export default function PaginationBase({
    total,
    pageSize,
    currentPage,
    pageSizeOptions,
    onPageChange
}: Props) {

    // 处理页面和页面大小变化
    const handleChange: PaginationProps['onChange'] = (page, pageSize) => {
        onPageChange(page, pageSize);
    };

    return (
        <div className="flex items-center justify-center">
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handleChange}
                pageSizeOptions={pageSizeOptions}
                showSizeChanger
                showTotal={(total) => `Total: ${total}`}
            />
        </div>
    );
}
