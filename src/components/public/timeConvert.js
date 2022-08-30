import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo('en-US');


export const TimeConvert = (time) => {
    let bob = "";
    console.log(bob)
    return timeAgo.format(time * 1000);
  }