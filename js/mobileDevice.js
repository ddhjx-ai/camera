$(function() {
  getAllList();
});

// 存放所有视频的列表
var allListArray = [];
// 存储当前正在播放的视频列表
var objArr = [];

var countWindow = 4;

$(".header_left ul").html(
  template("menuList", {
    list: JSON.parse(window.localStorage.getItem("menuList"))
  })
);
$(".username").html(window.localStorage.getItem("username"));

var layer = "";
var useVlc = getBrowserInfo().indexOf("IE") != -1;
var VLC = document.getElementById("vlcObj0");

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
        }/*  else if (platform == "win64") {
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

// 点击分组
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

// 点击渲染视频
/* var currentCount = 0;
$(".groups").on("click", "li", function() {
  var id = $(this).attr("data-id");
  for (var i = 0; i < allListArray.length; i++) {
    var item = allListArray[i];
    if (item.id == id) {
      var divBox = document.querySelectorAll("#vlc-content div");
      var VLC = divBox[currentCount].querySelector("embed");
      var videoUrl = item.path;
      
      VLC.video.aspectRatio = "5:4";
      VLC.playlist.clear();
      VLC.playlist.add(videoUrl);
      VLC.playlist.playItem(VLC.playlist.items.count - 1);

      for (var i = 0; i < divBox.length; i++) {
        var item = divBox[i].querySelector("embed");
        item.style.border = "transparent";
      }
      VLC.style.border = "1px solid yellow";
    }
    currentCount++;
    if (currentCount >= countWindow) {
      currentCount = 0;
    }
  }
}); */

// 分屏个数
function screenNum(num) {
  objArr = []
  currentCount = 0;
  countWindow = num * num;
  // var fragment = document.createDocumentFragment()
  var html = "";
  for (var i = 0; i < countWindow; i++) {
    var str =
      '<div class="content">' +
      '<embed ondrop="drop(event)" bgcolor="#000" wmode="transparent" src="" ondragover="allowDrop(event)" data-index="'+ i +'" controls=false branding=false id="vlcObj_' + i +
      '" type="application/x-vlc-plugin" pluginspage="http://www.videolan.org" />' +
      "</div>";
    html += str;
    /* var node = document.querySelector('.content').cloneNode(true)
    node.querySelector('embed').setAttribute('id','vlcObj_'+i)
    fragment.appendChild(node)
    console.log(fragment) */
  }
  document.getElementById("vlc-content").innerHTML = html;
  /* document.getElementById("vlc-content").innerHTML = '';
  document.getElementById("vlc-content").appendChild(fragment) */

  var percentage = 100 / num;
  $(".content").css({
    width: percentage + "%",
    height: percentage + "%"
  });
  /* var divBox = document.querySelectorAll("#vlc-content div");
  var len =
    divBox.length >= allListArray.length ? allListArray.length : divBox.length; */
  
  /* for (var i = 0; i < len; i++) {
    var VLC = divBox[i].querySelector("embed");
    VLC.setAttribute("src", allListArray[i].path);
    getVideoStatus(VLC,i,allListArray[i].number)
  } */
}

// 初始化渲染视频
/* function render() {
  var divBox = document.querySelectorAll("#vlc-content div.content");
  var len =
    divBox.length >= allListArray.length ? allListArray.length : divBox.length;
  for (var i = 0; i < len; i++) {
    var VLC = divBox[i].querySelector("embed");
    var videoUrl = allListArray[i].path;
    var currentNum = allListArray[i].number
    
    VLC.playlist.clear();
    VLC.video.aspectRatio = "5:4";
    VLC.playlist.add(videoUrl);
    VLC.playlist.playItem(VLC.playlist.items.count - 1);
    getVideoStatus(VLC,i,currentNum)
  }
} */

// 获取当前VLC是否在播放的状态
var timeId
function getVideoStatus(ele,i,number) {
  // console.log(ele,i,number)
  clearInterval(timeId);
  timeId = setInterval(function() {
    if (ele.input.hasVout) {
      objArr[i] = number
      clearInterval(timeId);
    } else {
    }
  });
}

// 拖拽元素
function drag(ev) {
  console.log(ev.target.dataset.id);
  var data = /* "id="+ ev.target.dataset.id + "&address="+ev.target.dataset.address */
  {
    id:ev.target.dataset.id,
    number:ev.target.dataset.number
  }
  ev.dataTransfer.setData("Text", JSON.stringify(data));
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  var divBox = document.querySelectorAll("#vlc-content div");
  var index = parseInt(ev.target.dataset.index)
  ev.preventDefault();
  var data = JSON.parse(ev.dataTransfer.getData("Text"));
  var VLC = document.getElementById(ev.target.id);
  
  for(var j = 0; j<objArr.length; j++){
    if(objArr[j] == data.number){
      window.alert("该设备已在" + (j+1) + "窗口运行！")
      return
    }
  }
  getVideoStatus(VLC,index,data.number)
  for (var i = 0; i < allListArray.length; i++) {
    var item = allListArray[i];
    if (item.id == data.id) {
      var videoUrl = item.path;
      VLC.video.aspectRatio = "5:4";
      VLC.playlist.clear();
      VLC.playlist.add(videoUrl);
      VLC.playlist.playItem(VLC.playlist.items.count - 1);

      for (var i = 0; i < divBox.length; i++) {
        var item = divBox[i].querySelector("embed");
        item.style.border = "transparent";
      }
      VLC.style.border = "1px solid yellow";
    }
  }
}

// -----------------请求数据的函数-------------------------
// 查看所有摄像头的列表
var queryInfo = {
  searchKeyWord: ""
};
function getAllList() {
  $http_get(
    {
      url: "group/addType?" + new Date().getTime(),
      data: queryInfo
    },
    function(res) {
      if (res.code === 0) {
        var list = {
          name: [],
          videos: []
        };
        if (res.typeList.length === 0) return;
        for (var i = 0; i < res.typeList.length; i++) {
          for (var key in res.typeList[i]) {
            list.name.push(key);
            list.videos.push(res.typeList[i][key]);
          }
        }
        // console.log(list);
        var html1 = template("videoTitle", list);
        var html2 = template("videoLists", list);

        var html1s = html1.match(/<p>[\s\S]*?<\/p>/g);
        var html2s = html2.match(/<ul>[\s\S]*?<\/ul>/g);

        let html = "";
        for (var j = 0; j < html1s.length; j++) {
          html += html1s[j] + "" + html2s[j];
        }
        $(".groups").html(html);
        allListArray = []
        for (var k = 0; k < res.typeList.length; k++) {
          for (var key in res.typeList[k]) {
            for (var h = 0; h < res.typeList[k][key].length; h++) {
              var item = res.typeList[k][key][h];
              allListArray.push(item);
            }
          }
        }
        // render();
      }
    }
  );
}

// 根据关键字搜索列表
function searchByName() {
  queryInfo.searchKeyWord = $(".search input").val();
  getAllList();
}

// 删除分组请求
$(".groups").on("click", ".fa-trash-o", function(e) {
  e.stopPropagation();
  var id = $(this)
    .parent()
    .siblings("ul")
    .find(".videos")
    .eq(0)
    .attr("data-groupId");
  var flag = window.confirm("确定删除当前分组？");
  if (flag) {
    $http_post({ url: "group/delete", data: [id] }, function(res) {
      if (res.code === 0) {
        getAllList();
      }
    });
  }
});

// 编辑分组信息
var groupId;
$(".groups").on("click", ".fa-pencil-square-o", function(e) {
  e.stopPropagation();
  $("#editGroup").fadeIn(200);
  groupId = $(this)
    .parent()
    .next("ul")
    .find("li")
    .eq(0)
    .attr("data-groupId");
  $http_get(
    { url: "group/get?" + new Date().getTime(), data: { id: groupId } },
    function(res) {
      console.log(res)
      if (res.code === 0) {
        $("#groupsName").val(res.group.name);
      }
    }
  );
});
function editGroups() {
  $http_post(
    {
      url: "group/update",
      data: {
        id: groupId,
        name: $.trim($("#groupsName").val())
      }
    },
    function(res) {
      if (res.code === 0) {
        getAllList();
        closeModal();
      }
    }
  );
}

function checkGroupName(){
  var value = $.trim($("#groupsName").val());
  if (value.length === 0){
    $('.editGroupInfo').fadeIn().html('分组名不能为空')
    $('#editGroupBtn').prop('disabled',true)
    return
  }else if(value.length < 2 || value.length > 10){
    $('.editGroupInfo').fadeIn().html('组名长度必须在2-10位之间')
    $('#editGroupBtn').prop('disabled',true)
    return
  }else{
    $('.editGroupInfo').fadeOut()
    $('#editGroupBtn').prop('disabled',false)
  }
}

// 关闭模态框函数
function closeModal() {
  $("#editGroup").fadeOut(200);
  $('.editGroupInfo').fadeOut()
  $('#editGroupBtn').prop('disabled',false)
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
