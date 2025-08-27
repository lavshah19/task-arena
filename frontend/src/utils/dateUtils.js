// src/utils/dateUtils.js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime); // this line extends dayjs with the relativeTime plugin

export const getTimeFromNow = (date) => {
  if (!date) {
    return "Invalid date";
  }
  // check due date is in the future or past
  const now = dayjs();
  const dueDate = dayjs(date);
     if (dueDate.isSame(now.add(1, 'day'), 'day')) {
    return "Due tomorrow";
  }
  if (dueDate.isAfter(now)) {
    return "Due " + dueDate.fromNow();
  }
  if (dueDate.isBefore(now)) {
    return "Was due " + dueDate.fromNow();
  }


 
 
};
export const passedDueDate = (date) => {
  if (!date) {
    return false;
  }
  const now = dayjs();
  const dueDate = dayjs(date);
  return dueDate.isBefore(now);
};



export const formatDate = (date) => {
  return dayjs(date).format("MMMM D, YYYY")
};