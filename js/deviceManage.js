var params = {
  currPage: 0,
  pageSize: 10,
  searchKeyWord: ""
};
// 获取所有的设备列表
var allDeviceList = []
$(".header_left ul").html(
  template("menuList", {
    list: JSON.parse(window.localStorage.getItem("menuList"))
  })
);
$(".username").html(window.localStorage.getItem("username"));

// 获取所有的设备函数
getAllDeviceList()
function getAllDeviceList(){
  $http_get({url: "device/get/param?" + new Date().getTime()},function(res){
    if(res.code === 0){
      allDeviceList = res.page.list
      // console.log(allDeviceList)
    }
  })
}

function render() {
  $http_get(
    {
      url: "device/get/param?" + new Date().getTime(),
      data: params
    },
    function(data) {
      if (data.code === 0) {
        $(".totalNum").html("设备总数：" + data.page.totalCount);
        $("tbody").html(template("deviceList", data.page));
        $(".pagination").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          size: "normal",
          currentPage: params.currPage + 1,
          numberOfPages: 3,
          totalPages: Math.ceil(data.page.totalCount / params.pageSize),
          itemTexts: function(type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return page;
            }
          },
          tooltipTitles: function(type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return page;
            }
          },
          onPageClicked: function(event, originalEvent, type, page) {
            params.currPage = page - 1;
            $("th input").prop('checked',false)
            list = []
            render();
          }
        });
      }
    }
  );
}
render();
getGroupsList();

var iWndowType = 0
videoInit()
function videoInit() {
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

// 全选，全不选
var list = [];
$("th input").on("change", function() {
  list = [];
  $("tbody input.indexCheck").prop("checked", $(this).prop("checked"));
  $("tbody input.indexCheck:checked").each(function(index, item) {
    list.push(parseInt($(item).attr("data-id")));
  });
  console.log(list)
});
$("tbody").on("change", "input.indexCheck", function() {
  list = [];
  $("tbody input.indexCheck:checked").each(function(index, item) {
    list.push(parseInt($(item).attr("data-id")));
  });
  if ($("tbody input.indexCheck:checked").length == $("tbody input.indexCheck").length) {
    $("th input").prop("checked", true);
  } else {
    $("th input").prop("checked", false);
  }
  console.log(list)
});

function openModel() {
  if (list.length === 0) {
    alert("请选择删除项");
    return;
  }
  $("#delDevice").modal("show");
}

// 点击删除按钮，删除指定设备
function removeById(node) {
  list = [parseInt($(node).attr("data-id"))];
}

// 勾选删除操作
function delDevice() {
  var params = {
    url: "device/delete",
    data: list
  };
  $http_post(params, function(res) {
    if (res.code === 0) {
      render();
      getAllDeviceList()
      list = [];
      $("#delDevice").modal("hide");
    }
  });
}

// 获取需更新的设备的id,同时查询当前设备,渲染到页面
function getDeviceId(node) {
  var id = parseInt($(node).attr("data-id"));
  var params = {
    url: "/device/get?" + new Date().getTime(),
    data: {
      id: id
    }
  };
  $http_get(params, function(res) {
    if (res.code === 0) {
      if (res.device.addType == 0) {
        $("#editChannel").prop("disabled", true);
        $("#editUsername").prop("disabled", false);
        $("#editPassword").prop("disabled", false);
      } else {
        $("#editChannel").prop("disabled", false);
        $("#editUsername").prop("disabled", true);
        $("#editPassword").prop("disabled", true);
      }
      $("#editId").val(res.device.id);
      $("#editName").val(res.device.name);
      $("#editAddType").val(res.device.addType);
      $("#editAddress").val(res.device.address);
      $("#editPort").val(res.device.port);
      $("#editGroupId").val(res.device.groupId);
      $("#editUsername").val(res.device.username);
      $("#editPassword").val(res.device.password);
      $("#editChannel").val(res.device.number);
      $("#editDevice").modal("show");
    }
  });
}

// 添加设备
$("#addDeviceForm")
  .bootstrapValidator({
    excluded: [":disabled"],
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
            message: "设备名称不能为空"
          },
          stringLength: {
            min: 2,
            max:10,
            message: "设备名称长度必须在2-10位之间"
          }
        }
      },
      channel: {
        validators: {
          notEmpty: {
            message: "通道号不能为空"
          },
          digits: {
            message: '该值只能包含数字'
          },
          stringLength: {
            min: 6,
            max:6,
            message: "通道号长度必须为6位数"
          }
        }
      },
      address: {
        validators: {
          notEmpty: {
            message: "IP/域名不能为空"
          },
          regexp:{
            regexp:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            message: 'IP格式有误，请重新输入'
          }
        }
      },
      port: {
        validators: {
          notEmpty: {
            message: "端口号不能为空"
          },
          digits: {
            message: '该值只能包含数字'
          },
          stringLength: {
            min: 1,
            max:5,
            message: "端口号长度不能大于5位数"
          }
        }
      },
      username: {
        validators: {
          notEmpty: {
            message: "用户名不能为空"
          },
          stringLength: {
            min: 2,
            max:10,
            message: "用户名长度必须在2-10位之间"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max:15,
            message: "密码长度只能是6-15位"
          }
        }
      }
    }
  })
  .on("success.form.bv", function(e) {
    e.preventDefault();
    $('#addDevice .infoMsg').fadeIn()
    var params = {
      data: {
        name: $("#deviceName").val(),
        addType: $("#addAddType").val(),
        address: $("#addAddress").val(),
        port: $("#addPort").val(),
        groupId: $("#addGroupId").val(),
        username: $("#addUsername").val(),
        password: $("#addPassword").val(),
        number: $("#addChannel").val()
      },
      url: "device/save"
    };
    if(params.data.addType == 0){
      WebVideoCtrl.I_Login(
        params.data.address,
        0,
        params.data.port,
        params.data.username,
        params.data.password,
        {
          success: function(){
            console.log('登录成功')
            params.data.deviceStatus = 1
            $http_post(params, function(res) {
              
              if (res.code === 0) {
                render();
                getAllDeviceList()
                $("#addDevice").modal("hide");
              }else{
                $("#addDevice").modal("hide");
                window.alert(res.msg)
              }
            })
          },
          error: function() {
            console.log('登录失败')
            params.data.deviceStatus = 0
            $http_post(params, function(res) {
              
              if (res.code === 0) {
                render();
                getAllDeviceList()
                $("#addDevice").modal("hide");
              }else{
                $("#addDevice").modal("hide");
                window.alert(res.msg)
              }
            })
          }
        }
      )
    }else{
      $http_post(params, function(res) {
        if (res.code === 0) {
          render();
          getAllDeviceList()
          $("#addDevice").modal("hide");
        }else{
          $("#addDevice").modal("hide");
          window.alert(res.msg)
        }
      });
    }
    
  });

// 更新设备
$("#editDeviceForm")
  .bootstrapValidator({
    excluded: [":disabled"],
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
            message: "设备名称不能为空"
          },
          stringLength: {
            min: 2,
            max:10,
            message: "设备名称长度必须在2-10位之间"
          }
        }
      },
      address: {
        validators: {
          notEmpty: {
            message: "IP/域名不能为空"
          },
          regexp:{
            regexp:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            message: 'IP格式有误，请重新输入'
          }
        }
      },
      channel: {
        validators: {
          notEmpty: {
            message: "通道号不能为空"
          },
          digits: {
            message: '该值只能包含数字'
          },
          stringLength: {
            min: 6,
            max:6,
            message: "通道号长度必须为6位数"
          }
        }
      },
      port: {
        validators: {
          notEmpty: {
            message: "端口号不能为空"
          },
          digits: {
            message: '该值只能包含数字'
          },
          stringLength: {
            min: 1,
            max:5,
            message: "端口号长度不能大于5位数"
          }
        }
      },
      username: {
        validators: {
          notEmpty: {
            message: "用户名不能为空"
          },
          stringLength: {
            min: 2,
            max:10,
            message: "用户名长度必须在2-10位之间"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max:15,
            message: "密码长度只能是6-15位"
          }
        }
      }
    }
  })
  .on("success.form.bv", function(e) {
    e.preventDefault();
    $('#editDevice .infoMsg').fadeIn()
    var params = {
      url: "device/update?" + new Date().getTime(),
      data: {
        name: $("#editName").val(),
        addType: $("#editAddType").val(),
        address: $("#editAddress").val(),
        id: $("#editId").val(),
        port: $("#editPort").val(),
        groupId: $("#editGroupId").val(),
        username: $("#editUsername").val(),
        password: $("#editPassword").val(),
        number: $("#editChannel").val()
      }
    };
    // 判断当前 IP 地址是否已存在
    var currentList = allDeviceList.filter(function(item){
      return item.id != params.data.id
    })
    var flag = currentList.some(function(item){
      return params.data.address == item.address
    })
    
    if(flag){
      window.alert('当前设备IP已存在，请重新编辑！')
      $('#editDevice .infoMsg').fadeOut()
      return
    }
    if(params.data.addType == 0){
      WebVideoCtrl.I_Login(
        params.data.address,
        0,
        params.data.port,
        params.data.username,
        params.data.password,
        {
          success: function(){
            console.log('登录成功')
            params.data.deviceStatus = 1
            $http_post(params, function(res) {
              if (res.code === 0) {
                render();
                getAllDeviceList()
                $("#editDevice").modal("hide");
              }else{
                $("#editDevice").modal("hide");
                window.alert(res.msg)
              }
            })
          },
          error: function() {
            console.log('登录失败')
            params.data.deviceStatus = 0
            $http_post(params, function(res) {
              if (res.code === 0) {
                render();
                getAllDeviceList()
                $("#editDevice").modal("hide");
              }else{
                $("#editDevice").modal("hide");
                window.alert(res.msg)
              }
            })
          }
        }
      )
    }else{
      $http_post(params, function(res) {
        if (res.code === 0) {
          render();
          getAllDeviceList()
          $("#editDevice").modal("hide");
        }else{
          $("#editDevice").modal("hide");
          window.alert(res.msg)
        }
      });
    }
  });

// 根据关键字搜索设备列表
function searchByKeyWord() {
  params.currPage = 0;
  params.searchKeyWord = $("#searchByKeyWord").val();
  render();
}

// 获取所有分组列表
function getGroupsList() {
  $http_get({ url: "group/getAll?" + new Date().getTime() }, function(res) {
    if (res.code === 0) {
      $(".allGroups").html(template("groupsList", res.page));
    }
  });
}

// 添加分组
$("#addGroupForm")
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
            message: "分组名称不能为空"
          },
          stringLength: {
            min: 2,
            max:10,
            message: "组名长度必须在2-10位之间"
          }
        }
      }
    }
  })
  .on("success.form.bv", function(e) {
    e.preventDefault();
    var params = {
      url: "group/save",
      data: {
        name: $.trim($("#groupsName").val())
      }
    };
    $http_post(params, function(res) {
      if (res.code === 0) {
        render();
        getGroupsList();
        $("#addGroup").modal("hide");
      }
    });
  });

// 点击按钮开关,开始/关闭录像请求
$(".container-fluid").on("change", ".switch_btn", function() {
  var deviceId = $(this).attr("data-id")
  var value = $(this)
    .parent()
    .siblings(".timeSelect")
    .val();
  var saveParams = {
    deviceId: deviceId,
    time: parseInt(value)
  };
  console.log(saveParams);
  if($(this).prop('checked')){
    $http_get(
      {
        url: "video/yunSave?" + new Date().getTime(),
        data: saveParams
      },
      function(res) {
        console.log(res);
      }
    );
  }else{
    $http_get({
      url:'video/stopSave?deviceId='+deviceId + "&" + new Date().getTime()
    },function(res){

    })
  }
});


// 监听通道号是否可以添加
function addChannelShow(node) {
  $("#addDeviceForm")
    .data("bootstrapValidator")
    .resetForm();
  if ($(node).val() == 1) {
    $("#addChannel").prop("disabled", false);
    $("#addUsername").prop("disabled", true);
    $("#addPassword").prop("disabled", true);
  } else {
    $("#addChannel").prop("disabled", true);
    $("#addUsername").prop("disabled", false);
    $("#addPassword").prop("disabled", false);
  }
}

function editChannelShow(node) {
  $("#editDeviceForm")
    .data("bootstrapValidator")
    .resetForm();
  if ($(node).val() == 1) {
    $("#editChannel").prop("disabled", false);
    $("#editUsername").prop("disabled", true);
    $("#editPassword").prop("disabled", true);
  } else {
    $("#editChannel").prop("disabled", true);
    $("#editUsername").prop("disabled", false);
    $("#editPassword").prop("disabled", false);
  }
}

// 清空添加设备的操作
function clearAddValue() {
  $("#deviceName").val("");
  $("#addAddType").val("0");
  $("#addAddress").val("");
  $("#addPort").val("");
  // $("#addGroupId").val("");
  $("#addUsername").val("");
  $("#addPassword").val("");
  $("#addChannel").val("");
}

// 模态框关闭时，清空表单数据
$("#addDevice").on("hidden.bs.modal", function(e) {
  clearAddValue();
  $("#addDeviceForm")
    .data("bootstrapValidator")
    .resetForm();
  $("#addChannel").prop("disabled", true);
  $("#addUsername").prop("disabled", false);
  $("#addPassword").prop("disabled", false);
  $('#addDevice .infoMsg').fadeOut()
});
$("#addGroup").on("hidden.bs.modal", function(e) {
  $("#groupsName").val("");
  $("#addGroupForm")
    .data("bootstrapValidator")
    .resetForm();
});
$("#delDevice").on("hidden.bs.modal", function() {
  list = [];
  $("th input").prop("checked", false);
  $("td input.indexCheck").prop("checked", false);
});
$("#editDevice").on("hidden.bs.modal", function() {
  $('#editDevice .infoMsg').fadeOut()
  $("#editDeviceForm")
    .data("bootstrapValidator")
    .resetForm();
});
