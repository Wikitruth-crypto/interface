

export function mergeArrays<T>(...arrays: T[][]): T[] {
    return arrays.reduce((acc, curr) => acc.concat(curr), []);
}

// const allFiles = mergeArrays(fileList1, fileList2);