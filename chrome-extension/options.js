document.addEventListener('DOMContentLoaded', load_options);


function load_options() {
  getIdentification(function(val) {
    document.getElementById('uid').innerHTML = val;
  });



  getPrefs(function(values) {
    console.log(values);
    document.getElementById('completelyIgnore').value = cleanString(values.hostnamesToExclude);
    document.getElementById('curtailIgnore').value = cleanString(values.hostnamesToCurtail);
  })


  document.getElementById('saveURLPrefs').addEventListener('click', function() {
    savePrefs(document.getElementById('completelyIgnore').value, document.getElementById('curtailIgnore').value, function() {
      console.log('saved');
    })
  });

  document.getElementById('urlToSanitize').addEventListener('keyup', function() {
    console.log('fired')
    var url = document.getElementById('urlToSanitize').value;
    console.log(url);
    document.getElementById('sanitizeOutput').innerHTML = sanitizeUrl(url);
  });
}
