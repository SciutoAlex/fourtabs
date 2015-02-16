init();



function init() {

  var orderedListOfUrls = [];

  Object.observe(orderedListOfUrls, function() {
    console.log('list::::::::');
    orderedListOfUrls.map(function(m) {
      console.log(m.id + "-" + m.url);
    })
  })

  var id = "";
  getIdentification(function(val) {
    id = val;
    console.log('User random id is ' + id);
  });

  var myFirebaseRef = new Firebase("https://blinding-fire-8644.firebaseio.com/");

  console.log('extension started!');

  // Listen for when a message is sent from a page that the url has changed.
  // Then update the url for that tab.
  // -------------------
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('url updated ' + sender.tab.id);
    var indexToUpdate = _.findIndex(orderedListOfUrls, { 'id': sender.tab.id });
    if(indexToUpdate != -1) {
      orderedListOfUrls[indexToUpdate].url = sanitizeUrl(sender.url);
    }

    // orderedListOfUrls.map(function(m) {
    //   console.log(m.id + "-" + m.url);
    // });
  });

  // Listen for when a tab has been activated--brought to the front.
  // Then reorder the array placing it at the end.
  // -------------------
  chrome.tabs.onActivated.addListener(function(activatedTab){
    console.log("tab activated - " + activatedTab.tabId);
    // console.log('tab id ' + activatedTab.tabId);
    var indexToBringToTop = _.findIndex(orderedListOfUrls, { 'id': activatedTab.tabId });
    // console.log("moved index: " + indexToBringToTop);
    if (indexToBringToTop != -1) {
      var objMoving = orderedListOfUrls[indexToBringToTop];
      orderedListOfUrls.splice(indexToBringToTop,1);
      orderedListOfUrls.push(objMoving);
    } else {
      chrome.tabs.get(activatedTab.tabId, function(tab) {
        // console.log('tab added id:')
        // console.log(tab.id);
        orderedListOfUrls.push({
          id : tab.id,
          url : sanitizeUrl(tab.url)
        });
      })
    }
  });

  // Listen for when a tab is created.
  // Then add a new entry to the orderedList array.
  // -------------------
  chrome.tabs.onCreated.addListener(function(tab) {
    console.log('tab added - ' + tab.id);
    orderedListOfUrls.push({
      url : null,
      id : tab.id
    });
  });

  // Listen for when a tab is removed.
  // Then remove that entry to the orderedList array.
  // -------------------
  chrome.tabs.onRemoved.addListener(function(tabId) {
    console.log('tab removed - ' + tabId);
    // console.log(tabId);
    var indexToRemove = _.findIndex(orderedListOfUrls, { 'id': tabId });
    // console.log(indexToRemove);
    if(indexToRemove != -1) {
      orderedListOfUrls.splice(indexToRemove,1);
    }
  });

  // Google tries to preload pages, and because of this, the tabId sometimes changes.
  // Check when an Id has changed and then update the id.
  // -------------------
  chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
    console.log('tab onReplaced - added:'+addedTabId+' replaced: '+removedTabId);
    var indexToChange = _.findIndex(orderedListOfUrls, { 'id': removedTabId });
    orderedListOfUrls[indexToChange].id = addedTabId;
  });

  // In search results, Google preloads pages, this fires when Google pre-loads a result.
  // Check when an Id has changed and then update the id.
  // -------------------

  // chrome.webNavigation.onTabReplaced.addListener(function(removedTabId, addedTabId) {
  //   console.log('webnav onReplaced - added:'+addedTabId+' replaced: '+removedTabId);
  //   var indexToChange = _.findIndex(orderedListOfUrls, { 'id': removedTabId });
  //   orderedListOfUrls[indexToChange].id = addedTabId;
  // });

}
