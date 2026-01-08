import { MintMethodType } from '@dapp/types/typesDapp/metadata/metadataBox';

export interface CountryProps {
    value: string;
    number: string;
    name: string
}

export type FormFieldName =
    'title' |
    'description' |
    'typeOfCrime' |
    'label' |
    'country' |
    'state' |
    'eventDate' |
    'nftOwner' |
    'price' |
    'mintMethod';

export type FileFieldName = 'fileList' | 'boxImageList';

// All input field names
export type AllInputFieldNames = FormFieldName | FileFieldName;

export const BOX_INFO_FIELDS: FormFieldName[] = [
    'title',
    'description',
    'typeOfCrime',
    'label',
    'country',
    'state',
    'eventDate',
    'nftOwner',
    'price',
    'mintMethod',
];

export interface BoxInfoFormType {
    // tokenId: string | null;
    typeOfCrime: string,
    title: string;
    country: string;
    state: string;
    eventDate: string;
    description: string;
    label: string[];
    // ---
    mintMethod: MintMethodType,
    nftOwner: string,
    price: string,
}

export const initialBoxInfoForm: BoxInfoFormType = {
    title: '',
    description: '',
    label: [],
    country: '',
    state: '',
    eventDate: '',
    typeOfCrime: '',
    mintMethod: 'create',
    nftOwner: '',
    price: '',
}
