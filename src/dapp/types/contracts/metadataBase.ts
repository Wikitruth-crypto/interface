export interface ProjectDataType {
    project: string,
    website: string[],
}

export const projectDataStore: ProjectDataType = {
    project: "Wiki Truth",
    website: ["https://wikitruth.eth.limo/"],
};

// export interface MetadataBaseType {
//     name: string;
//     tokenId: string;
//     typeOfCrime: string;
//     title: string;
//     image: string;
//     country: string;
//     state: string;
//     description: string;
// }

// export const metadataBaseType: MetadataBaseType = {
//     name: "",
//     tokenId: "",
//     typeOfCrime: "",
//     title: "",
//     image: "",
//     country: "",
//     state: "",
//     description: "",
// };
