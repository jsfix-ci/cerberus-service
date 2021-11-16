// Third party imports
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Calculate difference between booking date and departure date 
 */
const targetDatetimeDifference = (bookingDatimeDifference) => {
    const datetimeArray = bookingDatimeDifference.split(",").filter(x => x.length > 0);
    // Date at index 0, is the booking date.
    if (datetimeArray.length > 1) {
        return "Booked " + dayjs(datetimeArray[1]).from(datetimeArray[0], true) + " before travel";
    }
    return "";
};

export default targetDatetimeDifference;