// import AlertResult from "@/dapp/components/base/alertResult"
// import { useBoxDetailStore } from "../../store/boxDetailStore" 
// import Progress from "./Progress"

// 该组件已经不再需要

// // interface ProgressProps {
// //     step?: string;
// // }

// const ProgressContainer = () => {

//     const workflowState = useBoxDetailStore(state => state.workflowState);

//     return (
//         <div>
//             <Progress progress={workflowState.progress} />
//             <AlertResult
//                 title={workflowState.currentStep}
//                 isLoading={workflowState.status === 'processing' && !workflowState.successed && !workflowState.error}
//                 isComplete={!!workflowState.successed}
//                 error={workflowState.error || null}
//             />
//         </div>
//     )

// }

// export default ProgressContainer;