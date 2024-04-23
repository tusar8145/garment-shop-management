import React from 'react';


const convertToMonth = (number) => {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    // Check if the number is within a valid range
    if (number >= 1 && number <= 12) {
        return months[number - 1];
    } else {
        return 'Invalid Month';
    }
};



export default convertToMonth;