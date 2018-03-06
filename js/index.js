import $ from "jquery";
import moment from "moment";
import MeScroll from "mescroll.js"

import MiniRefreshTools from 'minirefresh';
import '../node_modules/minirefresh/dist/debug/minirefresh.css'

moment.locale('zh-cn');

var lastIndex;

function queryVideoList(last) {
  $.ajax({
    // url: '../mock.json',
    url: '/video/get_video_list?last=' + last,
    beforeSend: function() {
      $('.ajax_loading').html('<img class="loading_gif" src="../assets/loading.gif" alt="">加载中...').show(); //显示加载时候的提示
    },
    success: (res) => {
      if (res.noMore) {
        res.data.map(item => {
          item.publishTime = moment(item.publishTime).startOf('hour').fromNow();
          $("#hot-container").append('<section class="hot-section"><div class="video-content"><video class="video" muted loop x-webkit-airplay="true" webkit-playsinline="true" data-fullSrc="http://cloudtropy.com" src=' + item.videoSrc + ' poster=' + item.videoPoster + '></video><div class="video-controls"><img class="volume_icon" src="../assets/volume.svg" alt=""><span class="controls-time">' + item.videoTime + '</span></div></div><div class="video-info"><p class="info-title">' + item.videoName + '</p><p class="info-other"><span class="info-name">' + item.creater + '</span><span class="info-playCounts">' + item.playCount + '次播放</span><span class="info-publishTime">' + item.publishTime + '</span></p></div></section>')
        });
        $("video.video")[0].play();
        $('.ajax_loading').text("没有更多数据了...");
      } else {
        $('.ajax_loading').hide() //请求成功,隐藏加载提示
        res.data.map(item => {
          item.publishTime = moment(item.publishTime).startOf('hour').fromNow();
          $("#hot-container").append('<section class="hot-section"><div class="video-content"><video class="video" muted loop x-webkit-airplay="true" webkit-playsinline="true" data-fullSrc="http://cloudtropy.com" src=' + item.videoSrc + ' poster=' + item.videoPoster + '></video><div class="video-controls"><img class="volume_icon" src="../assets/volume.svg" alt=""><span class="controls-time">' + item.videoTime + '</span></div></div><div class="video-info"><p class="info-title">' + item.videoName + '</p><p class="info-other"><span class="info-name">' + item.creater + '</span><span class="info-playCounts">' + item.playCount + '次播放</span><span class="info-publishTime">' + item.publishTime + '</span></p></div></section>')
        });
        $("video.video")[0].play();
      }
      res.data.length ? lastIndex = queryMinIndex(res.data) : null;
      console.log("lastIndex", lastIndex)
    }
  });
}

function queryMinIndex(data) {
  console.log("data--", data);
  data.sort(function(item1, item2) {
    return item1.id > item2.id
  });
  console.log("data", data);
  return data[0].id;
}


$(function() {

  /*首次获取视频*/
  queryVideoList(-1);

  //点击视频事件
  $("#hot-container").on("click", "video", function(e) {
    // e.target.play();
    console.log("e", e.target)
    // var url = $(e.target).attr("src");
    var url = $(e.target).attr("data-fullSrc");
    alert("即将跳转到:" + url + "");
    // window.location.href = url;
  });

  //控制音量
  $("#hot-container").on("click", "img.volume_icon", function(e) {
    e.stopPropagation();
    console.log("event", e.target, $(e.target).parent("div.video-controls").siblings("video")[0]);
    const target = $(e.target).parent("div.video-controls").siblings("video")[0];
    const muted = $(e.target).parent("div.video-controls").siblings("video")[0].muted;
    if (target.muted) {
      for (var i = 0; i < $("video.video").length; i++) {
        $("video.video")[i].muted = true; //静音
      }
      target.muted = false;
      console.log("target", target.src);
      // $(target).attr("src", "../assets/volume.png")
    } else {
      // target.muted = true;
      for (var i = 0; i < $("video.video").length; i++) {
        $("video.video")[i].muted = true; //静音
      }
      console.log("target", target.src);
      $(target).attr("src", "../assets/volume_no.svg")
    }
  });

  //滚动事件
  $(window).scroll(function() {
    console.log("滚轮滚动...");

    for (var i = 0; i < $("video.video").length; i++) {
      // console.log("video-item", $("video.video")[i].getBoundingClientRect().top);
      let rect = $("video.video")[i].getBoundingClientRect();
      console.log("rect", rect);
      let top = $("video.video")[i].getBoundingClientRect().top;
      let innerHeight = window.innerHeight / 2 + 100;
      let minHeight = window.innerHeight / 2 + 100;
      console.log("top", "innerHeight", top, innerHeight);
      if (top < innerHeight && top < minHeight) {
        console.log("video--top---", $("video.video")[i].getBoundingClientRect().top, window.innerHeight, document.documentElement.clientHeight)
        $("video.video")[i].play();
      } else {
        $("video.video")[i].pause();
      }
    }


    var scrollTop = $(this).scrollTop();
    // console.log("scrollTop", scrollTop);
    var scrollHeight = $(document).height();
    var windowHeight = $(this).height();
    if (scrollTop + windowHeight == scrollHeight) {
      queryVideoList(lastIndex);
    }

  });


})


/*

  var mescroll = new MeScroll("hot-container", { //第一个参数"mescroll"对应上面布局结构div的id
    //如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
    //解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
    down: {
      auto: false,
      htmlContent: ' ',
      callback: function(ms) {
        console.log('down');
        mescroll.endErr(); // 使用endError把下拉的效果关闭（内容回到原位）， mescroll内部会自动恢复原来的页码,时间等变量
      }
    },
    up: {
      noMoreSize: 1,
      htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>',
      htmlNodata: '<p class="upwarp-nodata">-- 没有数据啦 --</p>',
      callback: function() {
        console.log("up");
      }, //上拉加载的回调
      isBounce: false //如果您的项目是在iOS的微信,QQ,Safari等浏览器访问的,建议配置此项.解析(必读)
    }
  });

  function downCallback() {
    $.ajax({
      url: '../mock.json',
      success: (res) => {
        mescroll.endSuccess(); //无参
        res.map(item => {
          item.publishTime = moment(item.publishTime).startOf('hour').fromNow();
          $("#hot-container").append('<section class="hot-section"><div class="video-content"><video class="video" muted autoplay loop x-webkit-airplay="true" webkit-playsinline="true" data-fullSrc="http://cloudtropy.com" src=' + item.videoSrc + ' poster=' + item.videoPoster + '></video><div class="video-controls"><img class="volume_icon" src="../assets/volume.svg" alt=""><span class="controls-time">' + item.videoTime + '</span></div></div><div class="video-info"><p class="info-title">' + item.videoName + '</p><p class="info-other"><span class="info-name">' + item.creater + '</span><span class="info-playCounts">' + item.playCount + '次播放</span><span class="info-publishTime">' + item.publishTime + '</span></p></div></section>')
        });
      },
      error: () => {
        mescroll.endErr();
      }
    });
  }

  function upCallback() {
    // alert("加载更多")
    $.ajax({
      url: '../mock.json',
      success: (res) => {
        res.map(item => {
          item.publishTime = moment(item.publishTime).startOf('hour').fromNow();
          $("#hot-container").append('<section class="hot-section"><div class="video-content"><video class="video" muted autoplay loop x-webkit-airplay="true" webkit-playsinline="true" data-fullSrc="http://cloudtropy.com" src=' + item.videoSrc + ' poster=' + item.videoPoster + '></video><div class="video-controls"><img class="volume_icon" src="../assets/volume.svg" alt=""><span class="controls-time">' + item.videoTime + '</span></div></div><div class="video-info"><p class="info-title">' + item.videoName + '</p><p class="info-other"><span class="info-name">' + item.creater + '</span><span class="info-playCounts">' + item.playCount + '次播放</span><span class="info-publishTime">' + item.publishTime + '</span></p></div></section>')
        });
        mescroll.endSuccess(); //无参
      },
      error: () => {
        mescroll.endErr();
      }
    });
  }

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
    // document.addEventListener('touchstart', touchSatrtFunc, false);
    // document.addEventListener('touchmove', touchMoveFunc, false);
    // document.addEventListener('touchend', touchEndFunc, false);
  }

  //判断是否支持触摸事件  
  function isTouchDevice() {
    document.getElementById("version").innerHTML = navigator.appVersion;

    try {
      document.createEvent("TouchEvent");
      // alert("支持TouchEvent事件！");

      bindEvent(); //绑定事件  
    } catch (e) {
      alert("不支持TouchEvent事件！" + e.message);
    }
  }

  // window.onload = isTouchDevice();

*/