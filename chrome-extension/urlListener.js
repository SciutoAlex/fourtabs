sendUrl();
window.onhashchange = sendUrl;
function sendUrl() {
  console.log('sending url');
  chrome.runtime.sendMessage({url: window.location.host});
}
