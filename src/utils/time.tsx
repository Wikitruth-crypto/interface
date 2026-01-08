

// export const AddTime = () => {

//     const formatDate = (date: Date): string => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         const hours = String(date.getHours()).padStart(2, '0');
//         const minutes = String(date.getMinutes()).padStart(2, '0');
//         const seconds = String(date.getSeconds()).padStart(2, '0');
//         return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
//     };

//     const dateTime = () => {
//         try {
//             const date = formatDate(new Date());
//             if (date) {
//                 // console.log('create date:', date);
//                 return date;
//             } else {
//                 console.error('date is empty!');
//             }
//         } catch (error) {
//             console.error('Add date error:', error);
//             throw error;
//         }

//     }

//     return dateTime;
// }

    /**
     * Format date display
     */
    // const formatDate = (dateString: string) => {
    //     if (!dateString) return 'N/A';
    //     try {
    //         const date = new Date(dateString);
    //         return date.toLocaleDateString('en-US', {
    //             year: 'numeric',
    //             month: 'long',
    //             day: 'numeric'
    //         });
    //     } catch {
    //         return dateString;
    //     }
    // };


export const timeToDate = (time: number | string) => {

    const formatDate = (time: number | string): string => {
        const timeNumber = typeof time === 'string' ? parseInt(time) : time;
        const milliseconds = timeNumber >= 1e10 ? timeNumber : timeNumber * 1000;

        const date = new Date(milliseconds);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    const date = formatDate(time);
    
    return date;

}
