import $ from "jquery";
import "../styles/fullScreen.css";

window.onload = function() {
  var url = location.search;
  console.log("url", url, url.split("?url="));
  if (url.indexOf("?") != -1) {
    var str = url.split("?url=")[1];
    str = '../' + str
    document.getElementById('fullVideo').src = str;
  }
}