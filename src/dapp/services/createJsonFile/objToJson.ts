// import fs from 'fs';
// import path from 'path';


export function objToJson(state: Record<string, any>, name:string): File {
    if (!state) {
        throw new Error('State cannot be null or undefined');
    }
    // 1. 将对象转换为 JSON 字符串
    const json = JSON.stringify(state, null, 2);

    // 将状态转换为 JSON 字符串
    const jsonBlob = new Blob([json], { type: 'application/json' });

    const jsonFile = new File([jsonBlob], `${name}.json`, { type: 'application/json' });

    return jsonFile;
}
