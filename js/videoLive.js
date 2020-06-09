$(function() {
  // 初始化监控设备
  videoInit();
  // 请求数据，获取所有监控列表
  getAllList();
});

$('.header_left ul').html(template('menuList',{list:JSON.parse(window.localStorage.getItem('menuList'))}))
$('.username').html(window.localStorage.getItem('username'))

// 存放所有视频的列表
var allListArray = [];
// 存储当前播放的视频列表
var deviceListArray = [];
var objArr = []

// 全局变量
var g_iWndIndex = 0; //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
var iWndowType = 3; //设置3*3方格
var iPTZSpeed = 3; // 设置默认步长
// 初始化视频函数
function videoInit() {
  // 检查插件是否已经安装过
  if (-1 == WebVideoCtrl.I_CheckPluginInstall()) {
    alert("您还未安装过插件，请下载WebComponents.exe安装！");
    return;
  }
  // 初始化插件参数及插入插件
  WebVideoCtrl.I_InitPlugin("100%", "100%", {
    iWndowType: iWndowType,
    cbSelWnd: function(xmlDoc) {
      g_iWndIndex = $(xmlDoc)
        .find("SelectWnd")
        .eq(0)
        .text();
    }
  });
  WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
}

// 登陆函数
function clickLogin(deviceList) {
  for (let i = 0; i < deviceList.length; i++) {
    let index = deviceList[i];
    if ("" == index.address || "" == index.port) {
      continue;
    }
    var iRet = WebVideoCtrl.I_Login(
      index.address,
      0,
      index.port,
      index.username,
      index.password,
      {
        success: function(xmlDoc) {
          // console.log(index.address + " login success！");
          setTimeout(function() {
            clickStartRealPlay(index.address, g_iWndIndex);
            g_iWndIndex++;
          }, 500);
        },
        error: function() {}
      }
    );
    if (-1 == iRet) {
      // console.log(index.address + " login already !");
      // clickStartRealPlay(index.address, g_iWndIndex);
    }
  }
}
// 开始预览
function clickStartRealPlay(address, g_iWndIndex) {
  // let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  console.log('预览ip：'+address);
  if ("" == address) {
    return;
  }
  let iRet = WebVideoCtrl.I_StartRealPlay(address, {
    iWndIndex: g_iWndIndex
  });
  if (0 == iRet) {
    objArr[g_iWndIndex] = address
    console.log("预览成功");
  } else {
    g_iWndIndex--;
    // objArr.splice(g_iWndIndex,1)
    console.log("预览失败");
  }
}

// 显示单个视频函数
function getOneVideo(deviceList) {
  console.log(objArr)
  if (g_iWndIndex > (iWndowType * iWndowType - 1)) {
    g_iWndIndex = 0;
  }
  for(var i = 0; i < objArr.length; i++){
    if(deviceList.address == objArr[i]){
      alert('当前设备已显示在'+ (i+1) +'号窗口')
      return
    }
  }
  objArr[g_iWndIndex] = deviceList.address
  if (deviceListArray[g_iWndIndex]) {
    clickStopRealPlay(g_iWndIndex);
    clickLogout(deviceListArray[g_iWndIndex]);
  }
  deviceListArray[g_iWndIndex] = deviceList;
  var iRet = WebVideoCtrl.I_Login(
    deviceList.address,
    0,
    deviceList.port,
    deviceList.username,
    deviceList.password,
    {
      success: function(xmlDoc) {
        
        setTimeout(function() {
          clickStartRealPlay(deviceList.address, g_iWndIndex);
          g_iWndIndex++;
        }, 500);
        
      },
      error: function() {}
    }
  );
  if (-1 == iRet) {
    /* setTimeout(function() {
      clickStartRealPlay(deviceList.address, g_iWndIndex);
      g_iWndIndex++;
    }, 500);
    if (g_iWndIndex >= iWndowType * iWndowType) {
      g_iWndIndex = 0;
    } */
  }
}
// 点击控制摄像头方向函数
function mouseDownPTZControl(iPTZIndex) {
  g_iWndIndex = 0
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  if (oWndInfo != null) {
    WebVideoCtrl.I_PTZControl(iPTZIndex, false, {
      iPTZSpeed: iPTZSpeed,
      success: function(xmlDoc) {
        console.log("操作成功");
      },
      error: function() {
        // showOPInfo( " start PTZ failed！");
      }
    });
  }
}
// 鼠标抬起，取消方向控制
function mouseUpPTZControl() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  if (oWndInfo != null) {
    WebVideoCtrl.I_PTZControl(1, true, {
      success: function(xmlDoc) {
        // showOPInfo(oWndInfo.address + " stop PTZ success！");
      },
      error: function() {
        // showOPInfo(oWndInfo.address + " stop PTZ failed！");
      }
    });
  }
}
// 放大缩小动作
function PTZZoomIn() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  if (oWndInfo != null) {
    WebVideoCtrl.I_PTZControl(10, false, {
      iWndIndex: g_iWndIndex,
      success: function(xmlDoc) {
        // showOPInfo(oWndInfo.szIP + " 调焦+成功！");
      },
      error: function() {
        // showOPInfo(oWndInfo.szIP + "  调焦+失败！");
      }
    });
  }
}
function PTZZoomout() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  if (oWndInfo != null) {
    WebVideoCtrl.I_PTZControl(11, false, {
      iWndIndex: g_iWndIndex,
      success: function(xmlDoc) {
        // showOPInfo(oWndInfo.szIP + " 调焦-成功！");
      },
      error: function() {
        // showOPInfo(oWndInfo.szIP + "  调焦-失败！");
      }
    });
  }
}
// 取消放大缩小动作
function PTZZoomStop() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  if (oWndInfo != null) {
    WebVideoCtrl.I_PTZControl(11, true, {
      iWndIndex: g_iWndIndex,
      success: function(xmlDoc) {
        // showOPInfo(oWndInfo.szIP + " 调焦停止成功！");
      },
      error: function() {
        // showOPInfo(oWndInfo.szIP + "  调焦停止失败！");
      }
    });
  }
}
// 获取步长函数
function getSpeed(node) {
  iPTZSpeed = $(node).val();
  console.log(iPTZSpeed);
}
// 聚焦函数
function PTZFocusIn() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  if (oWndInfo != null) {
    WebVideoCtrl.I_PTZControl(12, false, {
      iWndIndex: g_iWndIndex,
      success: function(xmlDoc) {
        // showOPInfo(oWndInfo.szIP + " focus+success！");
      },
      error: function() {
        // showOPInfo(oWndInfo.szIP + "  focus+failed！");
      }
    });
  }
}
function PTZFoucusOut() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  if (oWndInfo != null) {
    WebVideoCtrl.I_PTZControl(13, false, {
      iWndIndex: g_iWndIndex,
      success: function(xmlDoc) {
        // showOPInfo(oWndInfo.szIP + " focus-success！");
      },
      error: function() {
        // showOPInfo(oWndInfo.szIP + "  focus-failed！");
      }
    });
  }
}
// 取消聚焦
function PTZFoucusStop() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  if (oWndInfo != null) {
    WebVideoCtrl.I_PTZControl(12, true, {
      iWndIndex: g_iWndIndex,
      success: function(xmlDoc) {
        // showOPInfo(oWndInfo.szIP + " stop focus success！");
      },
      error: function() {
        // showOPInfo(oWndInfo.szIP + "  stop focus failed！");
      }
    });
  }
}
// 操作光圈函数
function PTZIrisIn() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  if (oWndInfo != null) {
    WebVideoCtrl.I_PTZControl(14, false, {
      iWndIndex: g_iWndIndex,
      success: function(xmlDoc) {
        // showOPInfo(oWndInfo.szIP + " Iris+success！");
      },
      error: function() {
        // showOPInfo(oWndInfo.szIP + "  Iris+failed！");
      }
    });
  }
}
function PTZIrisOut() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  if (oWndInfo != null) {
    WebVideoCtrl.I_PTZControl(15, false, {
      iWndIndex: g_iWndIndex,
      success: function(xmlDoc) {
        // showOPInfo(oWndInfo.szIP + " Iris-success！");
      },
      error: function() {
        // showOPInfo(oWndInfo.szIP + "  Iris-failed！");
      }
    });
  }
}
// 取消光圈操作函数
function PTZIrisStop() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  if (oWndInfo != null) {
    WebVideoCtrl.I_PTZControl(14, true, {
      iWndIndex: g_iWndIndex,
      success: function(xmlDoc) {
        // showOPInfo(oWndInfo.szIP + " stop Iris success！");
      },
      error: function() {
        // showOPInfo(oWndInfo.szIP + "  stop Iris failed！");
      }
    });
  }
}
// 停止预览
function clickStopRealPlay(i) {
  // var oWndInfo = WebVideoCtrl.I_GetWindowStatus(i)
  // if (oWndInfo != null) {
  var iRet = WebVideoCtrl.I_Stop(i);
  if (0 == iRet) {
    console.log("停止预览成功！");
    // szInfo = "停止预览成功！";
  } else {
    // szInfo = "停止预览失败！";
  }
  // }
}
// 退出登陆
function clickLogout(item) {
  var szIP = item.address;
  if (szIP == "") {
    return;
  }
  var iRet = WebVideoCtrl.I_Logout(szIP);
  if (0 == iRet) {
    // szInfo = "退出成功！";
    console.log("退出成功");
    // $("#ip option[value='" + szIP + "']").remove();
    // getChannelInfo();
  } else {
    // szInfo = "退出失败！";
  }
}
// 打开选择框 0：文件夹  1：文件
function clickOpenFileDlg(id, iType) {
  var szDirPath = WebVideoCtrl.I_OpenFileDlg(iType);
  if (szDirPath != -1 && szDirPath != "" && szDirPath != null) {
    $("#" + id).val(szDirPath);
  }
  clickSetLocalCfg();
}

// 开始录像
function clickStartRecord() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  console.log(oWndInfo)
  if (oWndInfo != null) {
    var szFileName =
      oWndInfo.szIP + "_" + oWndInfo.iIndex + "_" + new Date().getTime();
    var iRet = WebVideoCtrl.I_StartRecord(szFileName);

    console.log(iRet)
    if (0 == iRet) {
      $(".messageBox")
        .stop()
        .fadeIn(500)
        .delay(1000)
        .fadeOut(500)
        .html("开始录屏!");
      // console.log('开始录像成功')
    } else {
      // szInfo = "开始录像失败！";
    }
  }
}
// 停止录像
function clickStopRecord() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
  if (oWndInfo != null) {
    var iRet = WebVideoCtrl.I_StopRecord();
    if (0 == iRet) {
      // szInfo = "停止录像成功！";
      $(".messageBox")
        .stop()
        .fadeIn(500)
        .delay(1000)
        .fadeOut(500)
        .html("停止录屏!");
    } else {
      // szInfo = "停止录像失败！";
    }
  }
}
// 设置本地参数
function clickSetLocalCfg() {
  var arrXml = [];
  arrXml.push("<RecordPath>" + $("#recordPath").val() + "</RecordPath>");
  /* arrXml.push("<LocalConfigInfo>");
	arrXml.push("<PackgeSize>" + $("#packSize").val() + "</PackgeSize>");
	arrXml.push("<PlayWndType>" + $("#wndSize").val() + "</PlayWndType>");
	arrXml.push("<BuffNumberType>" + $("#netsPreach").val() + "</BuffNumberType>");
	arrXml.push("<RecordPath>" + $("#recordPath").val() + "</RecordPath>");
	arrXml.push("<CapturePath>" + $("#previewPicPath").val() + "</CapturePath>");
	arrXml.push("<PlaybackFilePath>" + $("#playbackFilePath").val() + "</PlaybackFilePath>");
	arrXml.push("<PlaybackPicPath>" + $("#playbackPicPath").val() + "</PlaybackPicPath>");
	arrXml.push("<DownloadPath>" + $("#downloadPath").val() + "</DownloadPath>");
	arrXml.push("<IVSMode>" + $("#rulesInfo").val() + "</IVSMode>");
	arrXml.push("<CaptureFileFormat>" + $("#captureFileFormat").val() + "</CaptureFileFormat>");
  arrXml.push("<ProtocolType>" + $("#protocolType").val() + "</ProtocolType>");
	arrXml.push("</LocalConfigInfo>"); */
  var iRet = WebVideoCtrl.I_SetLocalCfg(arrXml.join(""));
  if (0 == iRet) {
    console.log("本地配置设置成功");
  } else {
    console.log("本地配置设置失败");
  }
}
// 获取本地参数
function clickGetLocalCfg() {
  var xmlDoc = WebVideoCtrl.I_GetLocalCfg();
  $("#recordPath").val(
    $(xmlDoc)
      .find("RecordPath")
      .eq(0)
      .text()
  );
}
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
// 点击分组中的每一个li
$(".groups").on("click", "li", function() {
  if($(this).find('span').hasClass('fa-ban')){
    window.alert('该设备无法联通，请检查后再试')
    return
  }
  var id = $(this).attr("data-id");
  for (var i = 0; i < allListArray.length; i++) {
    var item = allListArray[i];
    if (item.id == id) {
      getOneVideo(item);
    }
  }
});

// 设置分屏个数
function screenNum(num) {
  WebVideoCtrl.I_ChangeWndNum(num);
  objArr = []
  g_iWndIndex = 0
  iWndowType = num;
  var number = num*num
  var count = number >= allListArray.length ? allListArray.length : number
  
  for(var i = 0; i<deviceListArray.length; i++){
    clickStopRealPlay(i);
    clickLogout(deviceListArray[i]);
  }

  deviceListArray = allListArray.slice(0,count)
  console.log(deviceListArray)
  // let deviceList = oneArrayToTwoArray(deviceListArray);
  clickLogin(deviceListArray);

  /* for(var m = 0; m < deviceListArray.length; m++){
    objArr[m] = deviceListArray[m].address
  }
  objArr.length = number */
  // console.log(objArr)
}
// 全屏
function clickFullScreen() {
  WebVideoCtrl.I_FullScreen(true);
}

// -----------------请求数据的函数-------------------------
// 查看所有摄像头的列表
var queryInfo = {
  searchKeyWord: ""
};
function getAllList() {
  $http_get(
    {
      url: "group/get/param?"+ new Date().getTime(),
      data: queryInfo
    },
    function(res) {
      if (res.code === 0) {
        var list = {
          name: [],
          videos: []
        };
        for (var i = 0; i < res.groupList.length; i++) {
          for (var key in res.groupList[i]) {
            list.name.push(key);
            list.videos.push(res.groupList[i][key]);
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
        deviceListArray = []
        for (var k = 0; k < res.groupList.length; k++) {
          for (var key in res.groupList[k]) {
            for (var h = 0; h < res.groupList[k][key].length; h++) {
              var item = res.groupList[k][key][h];
              if(item.deviceStatus == 1){
                deviceListArray.push(res.groupList[k][key][h]);
                allListArray.push(item);
              }
            }
          }
        }
        deviceListArray.length = deviceListArray.length >=9 ? 9 : deviceListArray.length;
        // console.log(deviceListArray)
        clickLogin(deviceListArray);
        
        /* for(var m = 0; m < deviceListArray.length; m++){
          objArr[m] = deviceListArray[m].address
        } */
      }
    }
  );
}

/* $('#searchName').on('keydown',function(){
  searchByName()
}) */

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
    $http_post({ url: "group/delete", data: [id]}, function(res) {
      if (res.code === 0) {
        getAllList();
      }
    });
  }
});

// 编辑分组信息
var id;
$(".groups").on("click", ".fa-pencil-square-o", function(e) {
  e.stopPropagation();
  $("#editGroup").fadeIn(200);
  id = $(this)
    .parent()
    .next('ul')
    .find("li")
    .eq(0)
    .attr("data-groupId");
    console.log(id)
  $http_get(
    { url: "group/get?" + new Date().getTime(), data: { id: id }},
    function(res) {
      if (res.code === 0) {
        $("#groupsName").val(res.group.name);
      }
    }
  );
});

$('#editGroupForm')
.bootstrapValidator({
  excluded: [],
  feedbackIcons: {
    /* valid: "glyphicon glyphicon-ok",
    invalid: "glyphicon glyphicon-remove",
    validating: "glyphicon glyphicon-refresh" */
  },
  // 配置需要校验的表单元素
  fields: {
    name: {
      validators: {
        notEmpty: {
          message: "分组名不能为空"
        },
        stringLength: {
          min: 2,
          max:10,
          message: "分组长度必须在2-10位之间"
        }
      }
    }
  }
})
.on("success.form.bv", function(e) {
  e.preventDefault();
  var value = $.trim($("#groupsName").val());
  $http_post(
    {
      url: "group/update",
      data: {
        id: id,
        name: value
      }
    },
    function(res) {
      console.log(1)
      if (res.code === 0) {
        getAllList();
        closeModal();
      }
    }
  );
});

// 关闭模态框函数
function closeModal() {
  $("#editGroup").fadeOut(200);
  $('#editGroupForm').data("bootstrapValidator").resetForm();
}

$("#editGroup").on("hidden.bs.modal", function(e) {
  $('#editGroupForm').data("bootstrapValidator").resetForm();
})