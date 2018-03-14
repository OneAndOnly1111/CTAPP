import $ from "jquery";
import moment from "moment";
moment.locale('zh-cn');
import loading_gif from "../assets/loading.gif";

var lastIndex;
var topValue = 0;
var interval = null;
var scrollDirection;

//获取视频
function queryVideoList(last) {
  $.ajax({
    // url: "../mock.json",
    url: '/video/get_video_list?last=' + last,
    beforeSend: function() {
      $('.ajax_loading').html('<img class="loading_gif" src=' + loading_gif + ' alt="">加载中...').show(); //显示加载时候的提示
    },
    success: (res) => {
      if (res) {
        if (res.noMore) {
          res.data.map(item => {
            item.publishTime = moment(item.publishTime).startOf('hour').fromNow();
            $("#hot-container").append('<section class="hot-section"><div class="video-content"><video class="video" muted loop x-webkit-airplay="true" webkit-playsinline="true" data-originalSrc=' + item.videoOriginal + ' src=' + item.videoPreview + ' poster=' + item.videoPoster + '></video><div class="video-controls"><span class="controls-time">' + item.videoTime + '</span></div></div><div class="video-info"><p class="info-title">' + item.videoName + '</p><p class="info-other"><span class="info-name">' + item.creater + '</span><span class="info-playCounts">' + item.playCount + '次播放</span><span class="info-publishTime">' + item.publishTime + '</span></p></div></section>')
          });
          $("video.video")[0].play();
          $('.ajax_loading').text("没有更多数据了...");
        } else {
          $('.ajax_loading').hide() //请求成功,隐藏加载提示
          res.data.map(item => {
            item.publishTime = moment(item.publishTime).startOf('hour').fromNow();
            $("#hot-container").append('<section class="hot-section"><div class="video-content"><video class="video" muted loop x-webkit-airplay="true" webkit-playsinline="true" data-originalSrc=' + item.videoOriginal + ' src=' + item.videoPreview + ' poster=' + item.videoPoster + '></video><div class="video-controls"><span class="controls-time">' + item.videoTime + '</span></div></div><div class="video-info"><p class="info-title">' + item.videoName + '</p><p class="info-other"><span class="info-name">' + item.creater + '</span><span class="info-playCounts">' + item.playCount + '次播放</span><span class="info-publishTime">' + item.publishTime + '</span></p></div></section>')
          });
          $("video.video")[0].play();
        }
        res.data.length ? lastIndex = queryMinIndex(res.data) : null;
        console.log("lastIndex", lastIndex)
      } else {
        $('.ajax_loading').text("服务器开小差了...");
      }
    },
    error: (err) => {
      $('.ajax_loading').text("服务器开小差了...");
    }
  });
}

//获取最小列表的最新id
function queryMinIndex(data) {
  data.sort(function(item1, item2) {
    return (+item1.id) > (+item2.id)
  });
  return data[0].id;
}

//获取屏幕课件区域内的中心video并播放
function getCenterVideo() {
  let visibleVideo = [];
  for (var i = 0; i < $("video.video").length; i++) {
    $("video.video")[i].pause();
    let rect = $("video.video")[i].getBoundingClientRect();
    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth) {
      visibleVideo.push($("video.video")[i]);
    }
  }
  console.log("visibleVideo", visibleVideo)
  if (visibleVideo.length) {
    if (visibleVideo.length == 1) {
      visibleVideo[0].play();
    } else {
      if (scrollDirection == 'top') {
        visibleVideo[0].play();
      } else if (scrollDirection == 'bottom') {
        visibleVideo[visibleVideo.length - 1].play();
      }
    }
  }
}

// 获取最靠近中心的video元素，并播放
function calculateCenter() {
  var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
  const visibleArr = [];
  const inVisibleArr = [];
  for (var i = 0; i < $("video.video").length; i++) {
    $("video.video")[i].pause();
    const rect = $("video.video")[i].getBoundingClientRect();
    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth) {
      visibleArr.push($("video.video")[i]);
    }
  }
  console.log("visibleArr", visibleArr)
  if (visibleArr.length) {
    if (visibleArr.length == 1) {
      visibleArr[0].play();
    } else {
      visibleArr.sort((ele1, ele2) => {
        const position1 = ele1.getBoundingClientRect();
        const position2 = ele2.getBoundingClientRect();
        const innerHeight = window.innerHeight / 2;
        const distancefromCenter1 = Math.abs((position1.top + position1.height) - innerHeight);
        const distancefromCenter2 = Math.abs((position2.top + position2.height) - innerHeight);
        // console.log("position1", position1, position1.top + position1.height, "innerHeight", distancefromCenter1, Math.abs((position1.top + position1.height) - innerHeight));
        // console.log("position2", position2, position2.top + position2.height, "innerHeight", distancefromCenter2, Math.abs((position2.top + position2.height) - innerHeight));
        if (distancefromCenter1 < distancefromCenter2) {
          console.log("ele1", ele1)
          ele1.play();
        } else if (distancefromCenter1 > distancefromCenter2) {
          console.log("ele2", ele2)
          ele2.play();
        }
      });
    }
  }
}

/*滚动停止（计算到顶部的距离）*/
function scrollStop() {
  if (document.documentElement.scrollTop == topValue) { // 判断此刻到顶部的距离是否和1秒前的距离相等
    console.log("滚动停止", document.documentElement.scrollTop, topValue)
    clearInterval(interval);
    interval = null;
    // getCenterVideo();
    calculateCenter(); // 获取最靠近中心的video元素，并且播放
  }
}

/*下拉刷新步骤*/
function slideDownStep1(dist) {
  var sd1 = document.getElementById("sd1"),
    sd2 = document.getElementById("sd2");
  sd2.style.display = "none";
  sd1.style.display = "block";
  sd1.style.height = 1 - parseInt(dist) + "px";
  // sd1.style.height = 70 + 'px'
}

function slideDownStep2() {
  var sd1 = document.getElementById("sd1"),
    sd2 = document.getElementById("sd2");
  sd1.style.display = "none";
  sd1.style.height = "20px";
  sd2.style.display = "block";
}

function slideDownStep3() {
  var sd1 = document.getElementById("sd1"),
    sd2 = document.getElementById("sd2");
  sd1.style.display = "none";
  sd2.style.display = "none";
}

/*touch监听函数*/
function kt_touch(contentId, way) {
  var _start = 0,
    _end = 0,
    _content = document.getElementById(contentId);
  document.addEventListener("touchstart", touchStart, false);
  document.addEventListener("touchmove", touchMove, false);
  document.addEventListener("touchend", touchEnd, false);

  function touchStart(event) {
    event.preventDefault();
    if (!event.touches.length) return;
    var touch = event.touches[0];
    if (way == "x") {
      _start = touch.pageX;
    } else {
      _start = touch.pageY;
    }
  }

  function touchMove(event) {
    event.preventDefault();
    if (!event.touches.length) return;
    var touch = event.touches[0];
    if (way == "x") {
      _end = (_start - touch.pageX);
    } else {
      _end = (_start - touch.pageY);
      if (_end < 0) {
        slideDownStep1(_end);
      }
    }
  }

  function touchEnd(event) {
    if (_end > 0) { //左滑或上滑
      slideDownStep2();
      slideDownStep3();
    } else { //右滑下滑
      slideDownStep2();
      slideDownStep3();
      if ($(this).scrollTop() == 0) { //如果无滚动，下拉的时候清空数据 重新加载列表
        $("#hot-container").empty();
        queryVideoList(-1);
      }
    }
  }
}


$(function() {
  /*首次获取视频*/
  queryVideoList(-1);
  /*监听touch事件*/
  // kt_touch('hot-container', 'y');
  /*滚动事件*/
  $(window).scroll(function() {
    // console.log("滚轮滚动...");
    var scrollHeight = $(this).scrollTop(); //滚动高度
    var contentHeight = $(document).height(); //内容高度
    var windowHeight = $(this).height(); //可见高度
    if (scrollHeight + windowHeight == contentHeight) { //console.log("滑到底了")
      console.log("滑到底了------");
      console.log("scrollHeight", scrollHeight, "contentHeight", contentHeight, "windowHeight", windowHeight);
      queryVideoList(lastIndex);
    }

    if (topValue > scrollHeight) { //console.log("向上滑动")
      scrollDirection = "top";
    }

    if (topValue < scrollHeight) { //console.log("向下滑动");
      scrollDirection = "bottom"
    }

    if (interval == null) // 未发起时，启动定时器，1秒1执行
      interval = setInterval(scrollStop, 1000);
    topValue = document.documentElement.scrollTop;
  });

  //点击视频事件
  $("#hot-container").on("click", "video", function(e) {
    console.log("click--video", e.target)
    var url = $(e.target).attr("data-originalSrc");
    e.target.pause();
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

});



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
          $("#hot-container").append('<section class="hot-section"><div class="video-content"><video class="video" muted autoplay loop x-webkit-airplay="true" webkit-playsinline="true" data-originalSrc="http://cloudtropy.com" src=' + item.videoSrc + ' poster=' + item.videoPoster + '></video><div class="video-controls"><img class="volume_icon" src="../assets/volume.svg" alt=""><span class="controls-time">' + item.videoTime + '</span></div></div><div class="video-info"><p class="info-title">' + item.videoName + '</p><p class="info-other"><span class="info-name">' + item.creater + '</span><span class="info-playCounts">' + item.playCount + '次播放</span><span class="info-publishTime">' + item.publishTime + '</span></p></div></section>')
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
          $("#hot-container").append('<section class="hot-section"><div class="video-content"><video class="video" muted autoplay loop x-webkit-airplay="true" webkit-playsinline="true" data-originalSrc="http://cloudtropy.com" src=' + item.videoSrc + ' poster=' + item.videoPoster + '></video><div class="video-controls"><img class="volume_icon" src="../assets/volume.svg" alt=""><span class="controls-time">' + item.videoTime + '</span></div></div><div class="video-info"><p class="info-title">' + item.videoName + '</p><p class="info-other"><span class="info-name">' + item.creater + '</span><span class="info-playCounts">' + item.playCount + '次播放</span><span class="info-publishTime">' + item.publishTime + '</span></p></div></section>')
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

/*
   for (var i = 0; i < $("video.video").length; i++) {
     // console.log("video-item", $("video.video")[i].getBoundingClientRect().top);
     let rect = $("video.video")[i].getBoundingClientRect();
     console.log("rect", rect, window.innerHeight, window.innerHeight * 0.5);
     let top = $("video.video")[i].getBoundingClientRect().top;
     let bottom = $("video.video")[i].getBoundingClientRect().bottom;
     let innerHeight = window.innerHeight * 0.5;
     // let innerHeight = window.innerHeight / 2 + 100;
     // let minHeight = window.innerHeight / 2 + 100;
     // console.log("top", "innerHeight", top, innerHeight);

     if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth) {
       $("video.video")[i].play();
       console.log("video--top---", top, "bottom", bottom, "innerHeight", innerHeight, $("video.video")[i].offsetTop)
     } else {
       $("video.video")[i].pause();
     }
     // if (bottom > innerHeight && top < innerHeight) {
     //   console.log("video--top---", top, "bottom", bottom, "innerHeight", innerHeight, $("video.video")[i].offsetTop)
     //   $("video.video")[i].play();
     // } else {
     //   $("video.video")[i].pause();
     // }
   }
   */