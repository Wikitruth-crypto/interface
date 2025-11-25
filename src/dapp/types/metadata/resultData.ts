import { MintMethodType } from "./metadataBox";

export interface ResultDataType {
    title: string;
    project: string;
    website: string;
    type: string;
    mintMethod: MintMethodType;
    fileCidList: string[];
    cidList: string[];
    isSuccess: boolean;
    timestamp: number | string;
}

export const initialResultData: ResultDataType = {
    title: "Failed Mint CID",
    project: "Wiki Truth",
    website: "https://wikitruth.eth.limo/",
    type: "Mint",
    mintMethod: 'create',
    fileCidList: [],
    cidList: [],
    isSuccess: false,
    timestamp: 0
}; 