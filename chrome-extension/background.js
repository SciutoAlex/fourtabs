


init();

function init() {
  var orderedListOfUrls = [];
  var id = "";
  getIdentification(function(val) {
    id = val;
    console.log('User random id is ' + id);
  });

  var myFirebaseRef = new Firebase("https://blinding-fire-8644.firebaseio.com/");

  console.log('extension started!');


  chrome.tabs.onHighlighted.addListener(function(highlightInfo){
    chrome.tabs.get(highlightInfo.tabIds[0], function(tab) {
      updateURLinList(orderedListOfUrls, tab.url);
      console.log(orderedListOfUrls);
    });
  });

  chrome.tabs.onRemoved.addListener(function(highlightInfo){
    chrome.tabs.get(highlightInfo, function(tab) {
      console.log(tab);
      removeURLfromListofURLS(orderedListOfUrls, tab.url);
      console.log(orderedListOfUrls);
    });
  });
}



// Get the stored id of the user. A random string
// ==============================================
function getIdentification(cb) {
  chrome.storage.sync.get('userRandId', function(items) {
      var userRandId = items.userRandId;
      if (userRandId) {
        useToken(userRandId);
      } else {
        userRandId = getRandomToken();
        chrome.storage.sync.set({userRandId: userRandId}, function() {
          useToken(userRandId);
        });
      }
      function useToken(userRandId) {
        cb(userRandId);
      }
  });
}


function removeURLfromListofURLS(list, url) {
  var url = sanitizeUrl(url);
  if(url && list.indexOf(url) != -1) {
    list.splice(list.indexOf(url),1);
  }
}

function updateURLinList(list, url) {
  var url = sanitizeUrl(url);
  if(url && list.indexOf(url) != -1) {
    list.splice(list.indexOf(url),1);
    list.push(url);
  } else {
    list.push(url);
  }
}

function addURLtoListofURLS(list, url) {
  var url = sanitizeUrl(url);
  if(url) {
    list.push(url);
    return true;
  }
  return false;
}


var hostnamesToExclude = [
  "www.linkedin.com",
  "www.glassdoor.com",
  "www.quora.com",
  "www.google.com"
];

var protocolsToInclude = [
  "http:",
  "https:"
]

// Remove sensitive URLs
// ---------------------
function sanitizeUrl(urlString) {
  var urlParts = document.createElement('a');
  urlParts.href = urlString;

  var urlToReturn = "";
  if (
      (_.indexOf(hostnamesToExclude, urlParts.hostname) == -1) &&
      (_.indexOf(protocolsToInclude, urlParts.protocol) != -1)
    ) {
    urlToReturn = urlString;
  }
  return encodeURI(urlToReturn);
}


// Get all the URLs from all the pages
// cb([urlStrings])
// -----------------------------------

function getAllUrls(cb) {
  var arrayToReturn = [];
  chrome.windows.getAll({"populate" : true}, function(windows) {
    for(var i = 0; i < windows.length; i++) {
      for(var j = 0; j < windows[i].tabs.length; j++) {
        console.log(windows[i].tabs[j]);
        var url = sanitizeUrl(windows[i].tabs[j].url);
        if(url) {
          arrayToReturn.push(url);
        }
       }
     }
     cb(arrayToReturn);
  });
}


// Create a Unique ID for each user
// ================================
function getRandomToken() {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
    return hex;
}
