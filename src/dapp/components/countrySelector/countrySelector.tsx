// import React, { useState, useEffect, useRef } from 'react';
// import { cn } from '@/lib/utils';
// import theworldData from './theworld.json';
// import CommonSelect, { CommonSelectOption } from '@dapp/components/base/CommonSelect';

// // 数据类型定义
// interface State {
//     name: string;
// }

// interface Country {
//     name: string;
//     codes: {
//         phone: string;
//     };
//     states: {
//         [key: string]: State;
//     };
// }

// interface WorldData {
//     [key: string]: Country;
// }

// export interface CountryStateSelection {
//     country: {
//         value: string;
//         number: string;
//         name: string;
//     };
//     state: {
//         value: string;
//         number: string;
//         name: string;
//     };
// }

// export interface CountrySelectorProps {
//     onSelectionChange?: (selection: CountryStateSelection) => void;
//     initialCountry?: string;
//     initialState?: string;
//     className?: string;
//     placeholder?: {
//         country?: string;
//         state?: string;
//     };
//     disabled?: boolean;
//     required?: boolean;
//     countryWidth?: string;
//     stateWidth?: string;
//     searchable?: boolean;
//     searchPlaceholder?: {
//         country?: string;
//         state?: string;
//     };
// }

// /**
//  * CountrySelector - 国家州省选择器组件
//  * 
//  * 一个功能完整的地理位置选择器，支持国家和对应州省的联动选择。
//  * 使用 CommonSelect 通用组件重构，支持搜索功能。
//  */
// const CountrySelector: React.FC<CountrySelectorProps> = ({
//     onSelectionChange,
//     initialCountry,
//     initialState,
//     className,
//     placeholder = { 
//         country: 'Select a country', 
//         state: 'Select a state' 
//     },
//     disabled = false,
//     required = false,
//     countryWidth = "w-48",
//     stateWidth = "w-44",
//     searchable = true,
//     searchPlaceholder = {
//         country: 'Search country...',
//         state: 'Search state...'
//     }
// }) => {
//     const theworld: WorldData = theworldData as WorldData;
    
//     // 工具函数：根据国家名找到国家选项
//     const findCountryOption = (countryName?: string): CommonSelectOption | null => {
//         if (!countryName) return null;
        
//         const countryEntry = Object.entries(theworld).find(
//             ([, country]) => country.name === countryName
//         );
        
//         if (!countryEntry) return null;
        
//         const [countryCode, country] = countryEntry;
//         return {
//             value: countryCode,
//             name: country.name,
//             symbol: `+${country.codes.phone}`,
//             displayText: `${country.name} (${countryCode})`,
//             phoneCode: country.codes.phone
//         };
//     };
    
//     // 工具函数：根据州名找到州选项
//     const findStateOption = (countryOption: CommonSelectOption | null, stateName?: string): CommonSelectOption | null => {
//         if (!countryOption || !stateName) return null;
        
//         const country = theworld[countryOption.value as string];
//         if (!country) return null;
        
//         const stateEntry = Object.entries(country.states).find(
//             ([, state]) => state.name === stateName
//         );
        
//         if (!stateEntry) return null;
        
//         const [stateCode, state] = stateEntry;
//         return {
//             value: stateCode,
//             name: state.name,
//             displayText: `${state.name} (${stateCode})`
//         };
//     };

//     // 初始化选择
//     const initialCountryOption = findCountryOption(initialCountry);
//     const initialStates = initialCountryOption ? theworld[initialCountryOption.value as string].states : {};
    
//     const [selectedCountry, setSelectedCountry] = useState<CommonSelectOption | null>(initialCountryOption);
//     const [selectedState, setSelectedState] = useState<CommonSelectOption | null>(
//         findStateOption(initialCountryOption, initialState)
//     );
//     const [states, setStates] = useState<{ [key: string]: State }>(initialStates);

//     // 避免重复通知的引用
//     const prevSelectionRef = useRef<CountryStateSelection | null>(null);
//     const onSelectionChangeRef = useRef(onSelectionChange);

//     // 更新回调引用
//     useEffect(() => {
//         onSelectionChangeRef.current = onSelectionChange;
//     });

//     // 国家选择处理
//     const handleCountrySelect = (option: CommonSelectOption | null) => {
//         setSelectedCountry(option);
//         setSelectedState(null);
        
//         if (option && theworld[option.value as string]) {
//             setStates(theworld[option.value as string].states);
//         } else {
//             setStates({});
//         }
//     };

//     // 州选择处理
//     const handleStateSelect = (option: CommonSelectOption | null) => {
//         setSelectedState(option);
//     };

//     useEffect(() => {
//         const nextCountryOption = findCountryOption(initialCountry);
//         setSelectedCountry(nextCountryOption);

//         if (nextCountryOption && theworld[nextCountryOption.value as string]) {
//             const nextStates = theworld[nextCountryOption.value as string].states;
//             setStates(nextStates);
//             const nextStateOption = findStateOption(nextCountryOption, initialState);
//             setSelectedState(nextStateOption);
//         } else {
//             setStates({});
//             setSelectedState(null);
//         }
//     }, [initialCountry, initialState]);

//     // 通知父组件选择变化
//     useEffect(() => {
//         if (!onSelectionChangeRef.current) return;

//         const currentSelection: CountryStateSelection = {
//             country: {
//                 value: selectedCountry?.value as string || '',
//                 number: (selectedCountry as any)?.phoneCode || '',
//                 name: selectedCountry?.name || ''
//             },
//             state: {
//                 value: selectedState?.value as string || '',
//                 number: '',
//                 name: selectedState?.name || ''
//             }
//         };

//         // 检查是否与上一次选择相同
//         const prevSelection = prevSelectionRef.current;
//         if (prevSelection && 
//             prevSelection.country.name === currentSelection.country.name && 
//             prevSelection.state.name === currentSelection.state.name) {
//             return;
//         }

//         prevSelectionRef.current = currentSelection;
//         onSelectionChangeRef.current(currentSelection);
//     }, [selectedCountry, selectedState]);

//     // 生成国家选项
//     const countryOptions: CommonSelectOption[] = Object.keys(theworld).map((countryCode) => ({
//         value: countryCode,
//         name: theworld[countryCode].name,
//         symbol: `+${theworld[countryCode].codes.phone}`,
//         displayText: `${theworld[countryCode].name} (${countryCode})`,
//         phoneCode: theworld[countryCode].codes.phone
//     }));

//     // 生成州选项
//     const stateOptions: CommonSelectOption[] = Object.keys(states).map((stateCode) => ({
//         value: stateCode,
//         name: states[stateCode].name,
//         displayText: `${states[stateCode].name} (${stateCode})`
//     }));

//     // 自定义过滤函数（搜索国家名、国家代码、电话号码）
//     const countryFilterFunction = (option: CommonSelectOption, searchTerm: string): boolean => {
//         const searchText = searchTerm.toLowerCase().trim();
//         if (!searchText) return true;
        
//         return (
//             option.name.toLowerCase().includes(searchText) ||
//             (option.value as string).toLowerCase().includes(searchText) ||
//             (option.symbol && option.symbol.includes(searchText)) ||
//             ((option as any).phoneCode && (option as any).phoneCode.includes(searchText))
//         );
//     };

//     // 自定义过滤函数（搜索州名、州代码）
//     const stateFilterFunction = (option: CommonSelectOption, searchTerm: string): boolean => {
//         const searchText = searchTerm.toLowerCase().trim();
//         if (!searchText) return true;
        
//         return (
//             option.name.toLowerCase().includes(searchText) ||
//             (option.value as string).toLowerCase().includes(searchText)
//         );
//     };

//     return (
//         <div className={cn("flex gap-4", className)}>
//             {/* 国家选择器 */}
//             <div className={countryWidth}>
//                 <CommonSelect
//                     options={countryOptions}
//                     value={selectedCountry}
//                     onChange={handleCountrySelect}
//                     placeholder={placeholder.country || 'Select a country'}
//                     disabled={disabled}
//                     searchable={searchable}
//                     searchPlaceholder={searchPlaceholder.country || '搜索国家...'}
//                     filterFunction={countryFilterFunction}
//                     noResultsText="未找到匹配的国家"
//                     maxDisplayOptions={300}
//                 />
//             </div>

//             {/* 州选择器 */}
//             <div className={stateWidth}>
//                 <CommonSelect
//                     options={stateOptions}
//                     value={selectedState}
//                     onChange={handleStateSelect}
//                     placeholder={placeholder.state || 'Select a state'}
//                     disabled={disabled || !selectedCountry}
//                     searchable={searchable}
//                     searchPlaceholder={searchPlaceholder.state || '搜索州省...'}
//                     filterFunction={stateFilterFunction}
//                     noResultsText={selectedCountry ? "未找到匹配的州省" : "请先选择国家"}
//                     maxDisplayOptions={300}
//                 />
//             </div>
//         </div>
//     );
// };

// export default CountrySelector;

// /**
//  * CountrySelector - 国家州省选择器组件使用指南
//  * 
//  * 这是一个基于 CommonSelect 通用组件的地理位置选择器，
//  * 支持国家和州省的联动选择，内置搜索功能。
//  * 
//  * 主要特性：
//  * - 国家和州省联动选择
//  * - 内置搜索功能（支持搜索国家名、代码、电话号码）
//  * - 支持电话区号显示
//  * - 自动清除和状态管理
//  * - 键盘导航支持
//  * - 完全响应式设计
//  * - 符合 shadcn/ui 设计系统
//  * 
//  * 数据来源：
//  * - 基于 theworld.json 文件的全球国家和地区数据
//  * - 包含国家代码、电话区号、州省信息
//  * 
//  * 使用示例：
//  * 
//  * // 基础用法
//  * <CountrySelector
//  *   onSelectionChange={(selection) => {
//  *     console.log('Country:', selection.country.name);
//  *     console.log('State:', selection.state.name);
//  *     console.log('Phone Code:', selection.country.number);
//  *   }}
//  * />
//  * 
//  * // 带初始值和搜索功能
//  * <CountrySelector
//  *   initialCountry="United States"
//  *   initialState="California"
//  *   searchable={true}
//  *   searchPlaceholder={{
//  *     country: "搜索国家...",
//  *     state: "搜索州省..."
//  *   }}
//  *   onSelectionChange={handleLocationChange}
//  * />
//  * 
//  * // 自定义占位符和样式
//  * <CountrySelector
//  *   placeholder={{
//  *     country: "选择国家",
//  *     state: "选择州省"
//  *   }}
//  *   className="mb-4"
//  *   countryWidth="w-56"
//  *   stateWidth="w-48"
//  *   searchable={true}
//  * />
//  * 
//  * // 禁用搜索功能
//  * <CountrySelector
//  *   searchable={false}
//  *   onSelectionChange={handleLocationChange}
//  * />
//  * 
//  * // 在表单中使用
//  * <form>
//  *   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//  *     <div>
//  *       <label className="block text-sm font-medium mb-2">
//  *         Location {required && <span className="text-red-500">*</span>}
//  *       </label>
//  *       <CountrySelector
//  *         onSelectionChange={(selection) => {
//  *           setFormData(prev => ({
//  *             ...prev,
//  *             country: selection.country.name,
//  *             state: selection.state.name,
//  *             countryCode: selection.country.value,
//  *             stateCode: selection.state.value,
//  *             phoneCode: selection.country.number
//  *           }));
//  *         }}
//  *         required={true}
//  *         searchable={true}
//  *       />
//  *     </div>
//  *   </div>
//  * </form>
//  * 
//  * // 在 Truth Box 创建中使用（带搜索）
//  * <CountrySelector
//  *   initialCountry={truthBoxData.country}
//  *   initialState={truthBoxData.state}
//  *   onSelectionChange={(selection) => {
//  *     updateTruthBoxLocation({
//  *       country: selection.country.name,
//  *       state: selection.state.name,
//  *       phoneCode: selection.country.number
//  *     });
//  *   }}
//  *   className="w-full"
//  *   searchable={true}
//  *   searchPlaceholder={{
//  *     country: "搜索国家名称、代码或电话号码...",
//  *     state: "搜索州省名称或代码..."
//  *   }}
//  * />
//  * 
//  * 搜索功能：
//  * 
//  * 国家搜索支持：
//  * - 国家名称（如: "United States", "中国"）
//  * - 国家代码（如: "US", "CN"）
//  * - 电话代码（如: "1", "86"）
//  * 
//  * 州省搜索支持：
//  * - 州省名称（如: "California", "北京"）
//  * - 州省代码（如: "CA", "BJ"）
//  * 
//  * 返回数据格式：
//  * {
//  *   country: {
//  *     value: "US",           // 国家代码
//  *     number: "1",           // 电话区号
//  *     name: "United States"  // 国家名称
//  *   },
//  *   state: {
//  *     value: "CA",           // 州代码
//  *     number: "",            // 州区号（通常为空）
//  *     name: "California"     // 州名称
//  *   }
//  * }
//  * 
//  * 属性说明：
//  * 
//  * - onSelectionChange: 选择变化回调函数
//  * - initialCountry/initialState: 初始选择的国家和州名称
//  * - placeholder: 占位符文字配置
//  * - disabled: 是否禁用整个组件
//  * - required: 是否为必填项（UI 提示）
//  * - countryWidth/stateWidth: 自定义选择器宽度
//  * - searchable: 是否启用搜索功能（默认 true）
//  * - searchPlaceholder: 搜索框的占位符文字
//  * - className: 额外的 CSS 类名
//  * 
//  * 键盘导航：
//  * - ↑↓ 箭头键：在搜索结果中导航
//  * - Enter：选择当前高亮项
//  * - Esc：关闭下拉列表并清空搜索
//  * - Tab：切换焦点到下一个选择器
//  * 
//  * 注意事项：
//  * - theworld.json 文件较大（约400KB），建议在生产环境中考虑懒加载
//  * - 州选择器在未选择国家时会被自动禁用
//  * - 搜索功能支持中英文，大小写不敏感
//  * - 组件会自动处理联动选择和状态同步
//  * - 支持清除功能，选择国家后会自动清除州的选择
//  * - 在移动端会自动适配触摸交互
//  * - 搜索结果会限制显示数量以提升性能
//  */ 
