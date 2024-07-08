import moment from 'moment';
import React from 'react'


const formattedDate = (timestamp) => {
    if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        return moment(date).format('MMMM Do YYYY, h:mm:A');
    }
    return 'Invalid date';
};

export { formattedDate }