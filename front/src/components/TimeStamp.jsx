// components/common/TimeStamp.jsx
import { format } from 'date-fns';


const TimeStamp = ({ time, lowercase = true }) => {
    try {
        const parsed = new Date(time);
        if (!isNaN(parsed)) {
            let formatted = format(parsed, 'h:mm a');
            if (lowercase) formatted = formatted.toLowerCase();

            return <>{formatted}</>;
        }

    } catch (err) {

        return null;
    }
};

export default TimeStamp;
