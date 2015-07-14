//jshint browser: true
window.addEventListener('load', function () {
  "use strict";
  var input, btn, interval;
  interval = window.setInterval(function () {
    input = document.querySelector("[name=userAddress]");
    if (input !== null) {
      window.clearInterval(interval);
      input.value = "me@" + window.location.host;
      btn   = document.querySelector("[name=connect]");
      btn.removeAttribute('disabled');
      btn.dispatchEvent(new MouseEvent('click', { 'view': window, 'bubbles': true, 'cancelable': true }));
    }
  }, 100);
});
