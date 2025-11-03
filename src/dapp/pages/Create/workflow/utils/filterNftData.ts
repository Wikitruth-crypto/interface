

interface NftData {
    typeOfCrime:string,
    title:string,
    countryState:string,
    eventDate:string,
    // minter:string,
    createDate:string,
}

export const filterNftData = (obj: object): NftData => {
    const {
        typeOfCrime,
        title,
        country,
        state,
        eventDate,
        // minter,
        createDate
    } = obj as any;

    const countryState = `${country}  ${state}`;

    const Result: NftData = {
        typeOfCrime,
        title,
        countryState,
        eventDate,
        // minter,
        createDate
    };


    return Result; 
}