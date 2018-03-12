import "../styles/reset.css";
import "../styles/index.css";
// 获取设备宽度，设置根font-size
(function(doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function() {
      var clientWidth = docEl.clientWidth;
      console.log("clientWidth", clientWidth)
      if (!clientWidth) return;
      if (clientWidth) {
        if (clientWidth > 1024) {
          docEl.style.fontSize = 273 + 'px';
        } else {
          docEl.style.fontSize = clientWidth / 3.75 + 'px';
        }
      }
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);