import DataLabel, { DataType } from "./base/dataLabel";

interface GlobalDataProps {
    data?: DataType[];
}

export default function GlobalData({ data }: GlobalDataProps) {

    const defaultData: DataType[] = [
        {
            label: 'All',
            value: 5861,
        },
        {
            label: 'Storing',
            value: 5861,
        },
        {
            label: 'OnSale',
            value: 5861,
        },

        {
            label: 'Delivered',
            value: 5861,
        },
        {
            label: 'Refunding',
            value: 5861,
        },
        {
            label: 'Completed',
            value: 5861,
        },
        {
            label: 'Published',
            value: 5861,
        },
        {
            label: 'Total',
            value: 5861,
            suffix: '$'
        },
    ]

    const data2 = data || defaultData;

    return (
        <div className="flex flex-wrap lg:flex-nowrap gap-1 sm:gap-2">
            {
                data2.map((item, index) => {
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
    )
}