/*
 *jsHint is a best tool that helps to detect errors and potential problems in your javascript cod
 *https://github.com/jshint/jshint
 *hasScrollbar https://tylercipriani.com/2014/07/12/crossbrowser-javascript-scrollbar-detection.html
 */

var _e = (function(window, document) {
  var qix = {};
  qix.scrollFix = function(option) {
    var elem = option.scrollElm;
    if (!elem) return;
    event.initEvent("touchmove", false, true); //envent init:eventType,冒泡,是否允许preventDefault
    var _elem = Array.apply(null, document.querySelectorAll(elem));
    _elem.forEach(function(obj) {
      obj.addEventListener("touchmove", function(ev) {
        ev.stopPropagation(); //停止冒泡
      }, false);
    });
    document.addEventListener("touchmove", function(evt) {
      evt.preventDefault(); //阻止默认事件
    }, false);
    elem = Array.apply(null, document.querySelectorAll(elem));
    elem.forEach(function(elm) {
      // Handle the start of interactions
      elm.addEventListener('touchstart', function(event) {
        var startY, startTopScroll;
        startY = event.touches[0].pageY;
        startTopScroll = elm.scrollTop;
        if (startTopScroll <= 0)
		elm.scrollTop = 1;
        if (startTopScroll + elm.offsetHeight >= elm.scrollHeight)
          elm.scrollTop = elm.scrollHeight - elm.offsetHeight - 1;
      }, false);
    });
  };
  qix.msgBox=function(option){
        var msg = option.hasOwnProperty("msg")?option.msg:"";
        var timeout = option.hasOwnProperty("timeout")?option.timeout:2000;
        var className=option.hasOwnProperty("className")?option.className:"default";

        var msgElement=document.createElement("div");
        msgElement.className="e-msg-bar animated fadeInDown alert-"+className;
        msgElement.innerHTML=msg;
        document.getElementsByTagName("body")[0].appendChild(msgElement);
        setTimeout((function(){
            return function(){
                msgElement.className="e-msg-bar animated fadeOutUp alert-"+className;
            }
        })(this),timeout);
        setTimeout((function(){
            return function(){
                msgElement.parentNode.removeChild(msgElement);
            }
        })(this),timeout+1000)
    };
return qix
})(window, document);
