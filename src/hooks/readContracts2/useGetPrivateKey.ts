import { useTruthBox } from "../readContracts/useTruthBox";
import { useSimpleSecretStore } from "@dapp/store/simpleSecretStore";
import { useSiweAuth } from "../SiweAuth/useSiweAuth";
// import { CHAIN_ID } from "@dapp/contractsConfig";
import { useWalletContext } from "@dapp/contexts/web3Context/useAccount/WalletContext";

export const useGetPrivateKey = () => {
    const { chainId, address } = useWalletContext();
    const { getPrivateKey_TruthBox, setPrivateKey_TruthBox } = useSimpleSecretStore();
    const { session, isValidateSession, login } = useSiweAuth();
    const { getPrivateData } = useTruthBox();

    const checkPrivateKeyExist = (boxId: string): boolean => {
        const privateKey = getPrivateKey_TruthBox(boxId, chainId, address);
        if (privateKey) {
            return true;
        }
        return false;
    }

    const getPrivateKey = async (boxId: string): Promise<string | null> => {
        const privateKey = getPrivateKey_TruthBox(boxId, chainId, address);
        if (privateKey) {
            return privateKey;
        }
        // Check if the siweToken is valid
        let siweToken: string | null = null;
        if (!isValidateSession) {
            if (import.meta.env.DEV) {
                console.log('SiweToken is not valid, logging in...');
            }
            const siweResult = await login({
                statement: "I want to view the private data of the box",
                resources: [boxId],
            });

            if (siweResult) {
                siweToken = siweResult.token;
            }
        } else {
            siweToken = session.token;
        }
        if (siweToken) {

            const privateData = await getPrivateData(boxId, siweToken);
            if (import.meta.env.DEV) {
                console.log('privateData is:', privateData);
            }
            if (privateData) {
                setPrivateKey_TruthBox(boxId, privateData, chainId, address);
                return privateData;
            }

        }
        return null;
    }

    return { checkPrivateKeyExist, getPrivateKey };
}


