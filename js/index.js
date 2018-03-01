import $ from "jquery";
import moment from "moment";
moment.locale('zh-cn');

document.addEventListener("WeixinJSBridgeReady", function() {
  video.play();
  video.pause();
}, false)

$(function() {
  var $container = $("#hot-container");
  console.log("$container", $("#hot-container"));
  $.ajax({
    url: '../mock.json',
    success: (res) => {
      console.log("res", res);
      res.map(item => {
        item.publishTime = moment(item.publishTime).startOf('hour').fromNow();
        $("#hot-container").append('<section class="hot-section"><div class="video-content"><video class="video" controls x-webkit-airplay="true" webkit-playsinline="true" src=' + item.videoSrc + ' poster=' + item.videoPoster + '></video><div class="video-controls"><img class="controls-volume" src="../assets/volume.svg" alt=""><span class="controls-time">' + item.videoTime + '</span></div></div><div class="video-info"><p class="info-title">' + item.videoName + '</p><p class="info-other"><span class="info-name">' + item.creater + '</span><span class="info-playCounts">' + item.playCount + '次播放</span><span class="info-publishTime">' + item.publishTime + '</span></p></div></section>')
      });
    }
  });

  console.log("video", $("video"));
  var video = $('video');
  console.log("wp-video-shortcode", $(".wp-video-shortcode"))
  video.hover(function() {
    video[1].play() // play() 和 pause() 是HTML5中video自带的API函数，哈哈，方便吧？
  }, function() {
    video[0].pause()
  });


  //全局变量，触摸开始位置  
  var startX = 0,
    startY = 0;

  //touchstart事件  
  function touchSatrtFunc(evt) {
    try {
      //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  

      var touch = evt.touches[0]; //获取第一个触点  
      var x = Number(touch.pageX); //页面触点X坐标  
      var y = Number(touch.pageY); //页面触点Y坐标  
      //记录触点初始位置  
      startX = x;
      startY = y;

      var text = 'TouchStart事件触发：（' + x + ', ' + y + '）';
      document.getElementById("result").innerHTML = text;
      document.getElementsByClassName("video")[0].play();
    } catch (e) {
      alert('touchSatrtFunc：' + e.message);
    }
  }

  //touchmove事件，这个事件无法获取坐标
  function touchMoveFunc(evt) {
    try {
      //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
      var touch = evt.touches[0]; //获取第一个触点  
      var x = Number(touch.pageX); //页面触点X坐标  
      var y = Number(touch.pageY); //页面触点Y坐标  

      var text = 'TouchMove事件触发：（' + x + ', ' + y + '）';

      //判断滑动方向  
      if (x - startX != 0) {
        text += '<br/>左右滑动';
      }
      if (y - startY != 0) {
        text += '<br/>上下滑动';
      }

      document.getElementById("result").innerHTML = text;
      document.getElementsByClassName("video")[0].play();
    } catch (e) {
      alert('touchMoveFunc：' + e.message);
    }
  }

  //touchend事件  
  function touchEndFunc(evt) {
    try {
      //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  

      var text = 'TouchEnd事件触发';
      document.getElementById("result").innerHTML = text;
    } catch (e) {
      alert('touchEndFunc：' + e.message);
    }
  }

  //绑定事件  
  function bindEvent() {
    document.addEventListener('touchstart', touchSatrtFunc, false);
    document.addEventListener('touchmove', touchMoveFunc, false);
    document.addEventListener('touchend', touchEndFunc, false);
  }

  //判断是否支持触摸事件  
  function isTouchDevice() {
    document.getElementById("version").innerHTML = navigator.appVersion;

    try {
      document.createEvent("TouchEvent");
      alert("支持TouchEvent事件！");

      bindEvent(); //绑定事件  
    } catch (e) {
      alert("不支持TouchEvent事件！" + e.message);
    }
  }
  window.onload = isTouchDevice();

})