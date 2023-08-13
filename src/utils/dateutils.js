import moment from 'moment';

export function secondsFormat(s) {
    // var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
    //                                        // Math.floor() is rounded down
    // var hour = Math.floor((s - day * 24 * 3600) / 3600);
    // var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
    // var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
    if(s!=""){
      var currentTime = new Date()
      var time = new Date(s)
      var displaySeconds = 1000,
          displayMinutes = displaySeconds * 60,
          displayHours = displayMinutes * 60,
          displayDays = displayHours * 24,
          displayMonths = displayDays * 30,
          displayYears = displayDays * 365;

      var elapsedMilliseconds = currentTime - time;
      var duration = moment.duration(elapsedMilliseconds);

      displayYears = duration._data.year;
      displayMonths = duration._data.months;
      displayDays = duration._data.days;
      displayHours = duration._data.hours;
      displayMinutes = duration._data.minutes;
      displaySeconds = duration._data.seconds;

      displayYears = displayYears > 0 ? (displayYears > 1 ? displayYears + ' Years ' : displayYears + ' Year '): '';
      displayMonths = displayMonths > 0 ? (displayMonths > 1 ? displayMonths + ' Months ' : displayMonths + ' Month ') : '';
      displayDays = displayDays > 0 ? (displayDays > 1 ? displayDays + ' Days ' : displayDays + ' Day ') : '';
      displayHours = displayHours > 0 ? (displayHours > 1 ? displayHours + ' Hours ' : displayHours + ' Hour ') : '';
      displayMinutes = displayMinutes > 0 ? displayMinutes + ' Minutes ' : '';
      displaySeconds = displaySeconds > 0 ? displaySeconds + ' Seconds' : '';

      const returnValue =
          displayYears +
          displayMonths +
              displayDays +
              displayHours +
              displayMinutes +
              displaySeconds;
      return returnValue
    }else{
      return "";
    }
  }