function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    total: t,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  var previousValues = {
    days: parseInt(daysSpan.innerHTML),
    hours: parseInt(hoursSpan.innerHTML),
    minutes: parseInt(minutesSpan.innerHTML),
    seconds: parseInt(secondsSpan.innerHTML),
  };

  function updateClock() {
    var t = getTimeRemaining(endtime);

    if (previousValues.days !== t.days) {
      daysSpan.innerHTML = t.days;
      daysSpan.classList.add('count');
      setTimeout(function () {
        daysSpan.classList.remove('count');
      }, 500);
      previousValues.days = t.days;
    }
    if (previousValues.hours !== t.hours) {
      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      hoursSpan.classList.add('count');
      setTimeout(function () {
        hoursSpan.classList.remove('count');
      }, 500);
      previousValues.hours = t.hours;
    }
    if (previousValues.minutes !== t.minutes) {
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      minutesSpan.classList.add('count');
      setTimeout(function () {
        minutesSpan.classList.remove('count');
      }, 500);
      previousValues.minutes = t.minutes;
    }
    if (previousValues.seconds !== t.seconds) {
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
      secondsSpan.classList.add('count');
      setTimeout(function () {
        secondsSpan.classList.remove('count');
      }, 500);
      previousValues.seconds = t.seconds;
    }

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

// Tính toán thời hạn dựa trên các giá trị ban đầu trong HTML
var initialDays = parseInt(document.querySelector('.days').innerHTML);
var initialHours = parseInt(document.querySelector('.hours').innerHTML);
var initialMinutes = parseInt(document.querySelector('.minutes').innerHTML);
var initialSeconds = parseInt(document.querySelector('.seconds').innerHTML);

var deadline = new Date();
deadline.setDate(deadline.getDate() + initialDays);
deadline.setHours(deadline.getHours() + initialHours);
deadline.setMinutes(deadline.getMinutes() + initialMinutes);
deadline.setSeconds(deadline.getSeconds() + initialSeconds);

initializeClock('clockdiv', deadline);