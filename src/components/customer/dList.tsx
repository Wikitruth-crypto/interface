

// "use client"

// import { useBrandColorStore } from "@/store/storeBrandColor";

// interface DlListProps {
//     data: {
//         name: string;
//         description: string;
//         icon?: React.ElementType | null;
//     }[];
//     nameColor?: string;
//     descriptionColor?: string;
//     nameSize?: "small" | "medium" | "large";
//     descriptionSize?: "small" | "medium" | "large";
//     iconColor?: string;
// }

// export default function DlList({
//     data,
//     nameColor = "white",
//     descriptionColor = "white",
//     nameSize = "medium",
//     descriptionSize = "medium",
//     iconColor = "indigo-500"
// }: DlListProps) {

//     const { brandColor } = useBrandColorStore();

//     let nameColorClass = nameColor;
//     if (nameColor === "default") {
//         nameColorClass = brandColor;
//     }

//     let descriptionColorClass = descriptionColor;
//     if (descriptionColor === "default") {
//         descriptionColorClass = brandColor;
//     }

//     let nameSizeClass = '';
//     if (nameSize === "small") {
//         nameSizeClass = "text-xs";
//     } else if (nameSize === "medium") {
//         nameSizeClass = "text-sm";
//     } else if (nameSize === "large") {
//         nameSizeClass = "text-lg";
//     }

//     let descriptionSizeClass = '';
//     if (descriptionSize === "small") {
//         descriptionSizeClass = "text-xs";
//     } else if (descriptionSize === "medium") {
//         descriptionSizeClass = "text-sm";
//     } else if (descriptionSize === "large") {
//         descriptionSizeClass = "text-lg";
//     }

//     let iconColorClass = iconColor;
//     if (iconColor === "default") {
//         iconColorClass = brandColor;
//     }

//     const nameClass = `text-${nameColorClass} ${nameSizeClass}`;
//     const descriptionClass = `text-${descriptionColorClass} ${descriptionSizeClass}`;
//     const iconClass = `bg-${iconColorClass}`;

//     return (
//         <div className="max-w-xl lg:row-start-3 lg:mt-10 lg:max-w-md lg:border-t lg:border-white/10 lg:pt-10">

//             <dl className="max-w-xl space-y-8 text-base/7 text-gray-300 lg:max-w-none">
//                 {data.map((feature) => (
//                     <div key={feature.name} className="relative">
//                         <dt className={`ml-9 inline-block font-semibold ${nameClass}`}>
//                             {feature.icon && <feature.icon aria-hidden="true" className={`absolute top-1 left-1 size-5 ${iconClass}`} />}
//                             {feature.name}
//                         </dt>{' '}
//                         <dd className={`inline ${descriptionClass}`}>{feature.description}</dd>
//                     </div>
//                 ))}
//             </dl>
//         </div>
//     )
// }


