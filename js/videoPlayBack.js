$(function() {
  // 初始化视频
  // 获取所有摄像头数据
  getAllList();
  // 获取所有摄像头分组
  getGroups();
});

$(".header_left ul").html(
  template("menuList", {
    list: JSON.parse(window.localStorage.getItem("menuList"))
  })
);
$(".username").html(window.localStorage.getItem("username"));

var layer = "";
var useVlc = getBrowserInfo().indexOf("IE") != -1;
var VLC = document.getElementById("vlcObj");

layui.use("layer", function() {
  layer = layui.layer;
  (function() {
    if (useVlc) {
      if (!VLC.VersionInfo) {
        if (getPlatform() == "win32") {
          layer.confirm(
            "当前浏览器暂未安装视频播放插件，点击确定安装",
            {
              btn: ["确定", "取消"]
            },
            function() {
              window.open("../codebase/vlc-2.2.4-win32.exe");
            }
          );
        } /* else if (platform == "win64") {
          layer.confirm(
            "当前浏览器暂未安装视频播放插件，点击确定安装",
            {
              btn: ["确定", "取消"]
            },
            function() {
              window.open("http://47.96.19.54:8080/vlc/vlc-2.2.4-win64.exe");
            }
          );
        } */
      }
    }
  })();
});

// 绑定倍速
$("#beisu").on("change", function() {
  speed = 1000
  var v = $(this).val();
  speed = speed * (1/v)
  getCurrentTime(totalTime,speed)
  if (useVlc) {
    VLC.input.rate = v;
  } else {
    VIDEO.playbackRate = v;
  }
});
// 点击播放按钮
var tempTime
var videoFlag = false
function palyOrStop(node) {
  if(!videoFlag){
    return
  }
  if ($(node).hasClass("fa-play-circle")) {
    VLC.playlist.play();
    currentTime = tempTime
    getCurrentTime(totalTime,speed)
    $(node)
      .removeClass("fa-play-circle")
      .addClass("fa-stop-circle");
  } else {
    VLC.playlist.pause();
    tempTime = currentTime
    console.log(tempTime)
    clearInterval(getTimeId)
    $(node)
      .removeClass("fa-stop-circle")
      .addClass("fa-play-circle");
  }
}

// 播放
function playVideo(url) {
  if (useVlc) {
    url ? VLC.playlist.add(url) : "";
    VLC.playlist.play();
  } else {
    url ? (VIDEO.src = url) : "";
    VIDEO.networkState != 3 ? VIDEO.play() : "";
  }
}

// 暂停播放
function zanting() {
  if (useVlc) {
    VLC.playlist.pause();
  } else {
    VIDEO.pause();
  }
}

// 快进10秒播放
function kuaijin() {
  if(!videoFlag){
    return
  }
  currentTime+= 10
  VLC.input.time += 10000;
  /* if (useVlc) {
    VLC.input.time += 10000;
  } else {
    VIDEO.currentTime += 10;
  } */
}

// 快退10秒播放
function kuaitui() {
  if(!videoFlag){
    return
  }
  VLC.input.time -= 10000;
  currentTime -= 10
  /* if (useVlc) {
    VLC.input.time -= 10000;
  } else {
    VIDEO.currentTime -= 10;
  } */
}

// 点击分组
// clickGroups()
$(".groups").on("click", "p", function() {
  let spanNode = $(this)
    .find("span")
    .eq(0);
  if (spanNode.hasClass("fa-caret-right")) {
    $(this)
      .next()
      .show();
    spanNode.removeClass("fa-caret-right").addClass("fa-caret-down");
  } else {
    $(this)
      .next()
      .hide();
    spanNode.removeClass("fa-caret-down").addClass("fa-caret-right");
  }
});

$(".groups").on("click", "li", function() {
  let spanNode = $(this)
    .find("span")
    .eq(0);
  if (spanNode.hasClass("fa-caret-right")) {
    $(this)
      .next()
      .children("ul")
      .show();
    spanNode.removeClass("fa-caret-right").addClass("fa-caret-down");
  } else {
    $(this)
      .next()
      .children("ul")
      .hide();
    spanNode.removeClass("fa-caret-down").addClass("fa-caret-right");
  }
});

// 点击分组中的每一个li
$(".groups").on("click", ".videos", function() {
  $(".videos").each(function(index, item) {
    $(item).removeClass("show");
  });
  $(this).addClass("show");
  var id = $(this).attr("data-id");

  $http_get({ url: "video/get?" + new Date().getTime(), data: { id: id } }, function(res) {
    if (res.code === 0) {
      $('.modal_img').fadeIn()
      console.log(res.videoURL);
      var videoUrl = res.videoURL;
      VLC.playlist.clear();
      VLC.playlist.add(videoUrl);
      VLC.playlist.playItem(VLC.playlist.items.count - 1);
      videoFlag = true
      clearInterval(getTimeId)
      getVideoTime();
      $(".playIcon")
        .removeClass("fa-play-circle")
        .addClass("fa-stop-circle");
    }
  });
});

var getTimeId;
var speed = 1000
var totalTime;
var timeId;
var currentTime;
function getVideoTime() {
  clearInterval(timeId);
  timeId = setInterval(function() {
    if (VLC.input.hasVout) {
      $('.modal_img').fadeOut()
      currentTime = 0;
      totalTime = parseInt(VLC.input.length / 1000);
      $(".total_time").html(formatTime(totalTime));
      getCurrentTime(totalTime,speed);
      clearInterval(timeId);
    } else {
    }
  }, 100);
}

// 时间格式化函数
function formatTime(time) {
  var second = time % 60;
  var minute = parseInt((time / 60) % 60);
  var hour = parseInt(time / 3600);
  hour = hour > 9 ? hour : "0" + hour;
  minute = minute > 9 ? minute : "0" + minute;
  second = second > 9 ? second : "0" + second;

  return hour + ":" + minute + ":" + second;
}

// 当前时间函数
function getCurrentTime(time,speed) {
  clearInterval(getTimeId);
  var percentage = 0;
  getTimeId = setInterval(function() {
    currentTime++;
    if(currentTime >= time){
      currentTime = 0
      tempTime = currentTime
      $('.playIcon').removeClass("fa-stop-circle").addClass("fa-play-circle");
      clearInterval(getTimeId)
    }
    $(".now_time").html(formatTime(currentTime));
    percentage = (currentTime / time).toFixed(2) * 100 + "%";
    $(".timeBar").css({ width: percentage });
  }, speed);
}

// 调用时间插件，获取时间
laydate.render({
  elem: ".start_date", //指定元素
  type: "datetime"
});
laydate.render({
  elem: ".end_date", //指定元素
  type: "datetime"
});


// 音量控制
var current_volume = parseInt($('.top_line').width())
VLC.audio.volume = current_volume
var current_width = parseInt($('.top_line').width())
$('.voice').on('click',function(e){
  current_width = e.offsetX
  if(current_width != 0){
    $('.voice_auto').removeClass('glyphicon-volume-off').addClass('glyphicon-volume-up')
  }else{
    $('.voice_auto').removeClass('glyphicon-volume-up').addClass('glyphicon-volume-off')
  }
  $('.top_line').css({width:current_width})
  current_volume = e.offsetX
  VLC.audio.volume = current_volume
})
$('.voice_auto').on('click',function(){
  if($(this).hasClass('glyphicon-volume-up')){
    $(this).removeClass('glyphicon-volume-up').addClass('glyphicon-volume-off')
    $('.top_line').css({width:0})
    VLC.audio.volume = 0
  }else{
    $(this).removeClass('glyphicon-volume-off').addClass('glyphicon-volume-up')
    VLC.audio.volume = current_volume
    $('.top_line').css({width:current_width})
  }
})

// -----------------请求数据的函数-------------------------
// 查看所有摄像头的列表
// var token = document.cookie.split("=")[1];
var queryInfo = {
  searchKeyWord: ""
};
function getAllList() {
  $http_get(
    { url: "video/get/param?" + new Date().getTime(), data: queryInfo },
    function(res) {
      if (res.code === 0) {
        if(res.list.length === 0) return
        var allList = {
          name: [],
          devices: [],
          videos: []
        };
        for (var i = 0; i < res.list.length; i++) {
          for (var key in res.list[i]) {
            var item = res.list[i][key];
            allList.name.push(key);
            allList.devices[i] = [];
            for (var value in item) {
              allList.devices[i].push(value);
              allList.videos.push(item[value]);
            }
          }
        }
        var html1 = template("videoTitle", allList);
        var html2 = template("deviceLists", allList);
        var html3 = template("videoLists", allList);

        var html1s = html1.match(/<p>[\s\S]*?<\/p>/g);
        var html2s = html2.match(/<ul>[\s\S]*?<\/ul>/g);
        var html3s = html3.match(
          /<li>[\s\S]*?<ul>[\s\S]*?<\/ul>[\s\S]*?<\/li>/g
        );

        var count = -1;
        var result = html2.replace(/<li>[\s\S]*?<\/li>/g, function(data) {
          count++;
          return data + html3s[count];
        });

        var resultArr = result.split("@#$%");

        let html = "";
        for (var j = 0; j < html1s.length; j++) {
          html += html1s[j] + "" + resultArr[j];
        }
        $(".groups").html(html);
      }
    }
  );
}
// 获取所有列表
function getGroups() {
  $http_get({ url: "group/getAll?" + new Date().getTime() }, function(res) {
    var html = template("video_groups", res.page);
    $(".video_groups").html(html);
  });
}

// 根据关键字，查询对应分组
function searchByWord() {
  queryInfo = {
    searchKeyWord: $(".search input").val()
  };
  getAllList();
}

// 根据时间段，搜索录频
function searchBackTime() {
  queryInfo = {};
  queryInfo.searchKeyWord = $(".search input").val();
  if ($(".video_groups").val()) {
    queryInfo.groupId = $(".video_groups").val();
  }
  if ($(".start_date").val()) {
    queryInfo.startTime = $(".start_date").val();
  }
  if ($(".end_date").val()) {
    queryInfo.stopTime = $(".end_date").val();
  }
  getAllList();
}

// 获取浏览器类型
function getBrowserInfo() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
  var isIE = window.ActiveXObject || "ActiveXObject" in window;
  var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
  var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
  var isSafari =
    userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
  var isChrome =
    userAgent.indexOf("Chrome") > -1 &&
    userAgent.indexOf("Safari") > -1 &&
    !isEdge; //判断Chrome浏览器
  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (userAgent.indexOf("MSIE 6.0") != -1) {
      return "IE6";
    } else if (fIEVersion == 7) {
      return "IE7";
    } else if (fIEVersion == 8) {
      return "IE8";
    } else if (fIEVersion == 9) {
      return "IE9";
    } else if (fIEVersion == 10) {
      return "IE10";
    } else if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) {
      return "IE11";
    } else {
      return "0";
    } //IE版本过低
  } //isIE end

  if (isFF) {
    return "FF";
  }
  if (isOpera) {
    return "Opera";
  }
  if (isSafari) {
    return "Safari";
  }
  if (isChrome) {
    return "Chrome";
  }
  if (isEdge) {
    return "Edge";
  }
}

// 获取浏览器32位还是64位，安装对应的vlc
function getPlatform() {
  var agent = navigator.platform.toLowerCase();
  if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
    return "win64";
  } else if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
    return "win32";
  }
}
