// make the word neonvectors colored "propery"
// raw js


ready(function () {
  var coloredContent = '<span style="color: rgb(217, 120, 240);">n</span><span style="color: rgb(156, 184, 248);">e</span><span style="color: rgb(230, 107, 239);">o</span><span style="color: rgb(119, 222, 253);">n</span><span style="color: rgb(144, 197, 250);">v</span><span style="color: rgb(132, 209, 252);">e</span><span style="color: rgb(242, 94, 237);">c</span><span style="color: rgb(168, 171, 247);">t</span><span style="color: rgb(205, 132, 242);">o</span><span style="color: rgb(193, 145, 244);">r</span><span style="color: rgb(181, 158, 245);">s</span><span style="color: rgb(180, 180, 180);">.io</span>';
  var els = document.getElementsByClassName('vectorize');
  var i = 0;
  [].forEach.call(els, function (el){

    if (el.innerHTML.indexOf('neonvectors.io' >= 0)) {
      el.innerHTML = coloredContent;
    }
  });

});




// document.ready ie9+ (all I care about)
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading')
        fn();
    });
  }
}
