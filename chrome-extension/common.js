

var hostnamesToExclude = [];
var hostnamesToCurtail = [];
var protocolsToInclude = [];
getPrefs(function(values) {
  hostnamesToExclude = stringToArray(values.hostnamesToExclude);
  hostnamesToCurtail = stringToArray(values.hostnamesToCurtail);
  protocolsToInclude = stringToArray(values.protocolsToInclude);
});

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

function checkPrefs(cb) {
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






function getPrefs(cb) {
  var hostnamesToExclude = [
    "linkedin.com",
    "glassdoor.com",
    "www.google.com",
    "citibank.com",
    "usbank.com",
    "vanguard.com",
    "schwab.com"
  ];

  var hostnamesToCurtail = [
    "docs.google.com"
  ];

  var protocolsToInclude = [
    "http:",
    "https:"
  ];
  chrome.storage.sync.get({
      "hostnamesToExclude" : arrayToString(hostnamesToExclude),
      "hostnamesToCurtail" : arrayToString(hostnamesToCurtail),
      "protocolsToInclude" : arrayToString(protocolsToInclude)
    }, function(values) {
    cb(values);
  })
}

function savePrefs(exclude, curtail, cb) {
  chrome.storage.sync.set({
    "hostnamesToExclude" : cleanString(exclude),
    "hostnamesToCurtail" : cleanString(curtail)
  }, function() {
    cb();
  })
}

// Remove sensitive URLs
// ---------------------
function sanitizeUrl(urlString) {


  var urlParts = document.createElement('a');
  urlParts.href = urlString;
  console.log(hostnamesToExclude);
  var urlToReturn = "null";
  if (
      (regexCheck(hostnamesToExclude, urlParts.hostname) == false) &&
      (regexCheck(protocolsToInclude, urlParts.protocol) != false)
    ) {

    urlToReturn = urlString;

    if (
        (regexCheck(hostnamesToCurtail, urlParts.hostname) != false)
      ) {

      urlToReturn = urlParts.hostname;
    }
  }

  return encodeURI(urlToReturn);
}


// Regex Finder
// ----------------
function regexCheck(arrayOfStrings, needle) {
  var found = false;

  arrayOfStrings.map(function(string) {
    var regexstr = new RegExp(string, "ig");
    if(needle.match(regexstr)) {
      found = true;
    }

  })

  return found;
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

function arrayToString(arr) {
  var returnString = "";
  arr.map(function(val, i) {
    if(val.trim()) {
      returnString += val;
      if(i < arr.length-1) {
        returnString += "\n";
      }
    }
  });
  return returnString;
}

function stringToArray(str) {
  var arr = str.split("\n");
  arr.map(function(str,i) {
    if(!str.trim()) {
      arr.splice(i,1);
    }
  });
  return arr;
}

function cleanString(str) {
  var arr = str.split("\n");
  arr.map(function(str,i) {
    if(!str.trim()) {
      arr.splice(i,1);
    }
  });
  return arr.join('\n');
}
