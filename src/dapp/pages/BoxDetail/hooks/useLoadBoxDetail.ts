import { useDappStore } from "@/dapp/store/dappStore";
import { TIME_OUT_5_MINUTES } from "@/dapp/constants/timeOut";

export const useLoadBoxDetail = () => {

    return {
        loadBoxDetail: async () => {
            return true;
        },
        loading: false,
        error: null,
    }
}
