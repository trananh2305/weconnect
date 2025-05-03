import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//react component to show time ago
dayjs.extend(relativeTime);

const TimeAgo = ({ date, className }) => {
  const now = dayjs();
  const targetDate = dayjs(date);

  const difDays = now.diff(targetDate, "day");

  const timeAgo = targetDate.fromNow();
  const extractTime = targetDate.format("D MMM, YYYY h:mm A");



  if (difDays > 7){
    return <p className={className} title={extractTime}>{extractTime}</p>;
  }

  return <p  className={className} title={extractTime}>{timeAgo}</p>;
};

export default TimeAgo;
