// var token = document.cookie.split("=")[1];
// 获取所有网关数据
var params = {
  equalName: "",
  currPage: 0,
  pageSize: 10
};
$('.header_left ul').html(template('menuList',{list:JSON.parse(window.localStorage.getItem('menuList'))}))
$('.username').html(window.localStorage.getItem('username'))

function render() {
  $http_get(
    {
   
      url: "gateway/get/param?" + new Date().getTime(),
      data: params
    },
    function(data) {
      if (data.code === 0) {
        // if(data.page.list.length === 0) return
        $("tbody").html(template("gateWayList", data.page));
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
          // 设置鼠标悬停的title
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
          // 为操作按钮绑定click事件:
          onPageClicked: function(event, originalEvent, type, page) {
            params.currPage = page - 1;
            render();
          }
        });
      }
    }
  );
}
render();

// 获取网关详情
function gateWayDetail(node) {
  var id = $(node).attr("data-id");
  $http_get(
    {
      url: "gateway/get?" + new Date().getTime(),
      data: {
        id: id
      }
    },
    function(res) {
      if (res.code === 0) {
        $("#gateWayDetail .modal-body").html(template("detail", res.gateway));
        $("#gateWayDetail").modal("show");
      } else {
      }
    }
  );
}

// 移除网关
function removeGateWay(node) {
  var id = parseInt($(node).attr("data-id"));
  var flag = window.confirm("确定删除当前网关？");
  if (flag) {
    $http_post(
      {
        url: "gateway/delete",
        data: [id]
      },
      function(res) {
        if (res.code === 0) {
          render();
        }
      }
    );
  }
}

// 校验规则
var fields = {
  gatewayName: {
    validators: {
      notEmpty: {
        message: "网关名称不能为空"
      },
      stringLength: {
        min: 2,
        max:10,
        message: "网关名称长度必须在2-10位之间"
      }
    }
  },
  channelCodingId: {
    validators: {
      notEmpty: {
        message: "视频通道编码ID不能为空"
      }
    }
  },
  connectType: {
    validators: {
      notEmpty: {
        message: "平台接入方式不能为空"
      }
    }
  },
  nativeSipPort: {
    validators: {
      notEmpty: {
        message: "本地SIP端口不能为空"
      },
      digits: {
        message: "该值只能包含数字。"
      }
    }
  },
  sipServerId: {
    validators: {
      notEmpty: {
        message: "SIP服务器ID不能为空"
      },
      regexp:{
        regexp:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
        message: 'IP格式有误，请重新输入'
      }
    }
  },
  sipServerRegion: {
    validators: {
      notEmpty: {
        message: "SIP服务器域不能为空"
      }
    }
  },
  sipServerAddress: {
    validators: {
      notEmpty: {
        message: "SIP服务器地址不能为空"
      }
    }
  },
  sipServerPort: {
    validators: {
      notEmpty: {
        message: "该值不能为空"
      },
      digits: {
        message: "该值只能包含数字。"
      }
    }
  },
  sipUserName: {
    validators: {
      notEmpty: {
        message: "该值不能为空"
      }
    }
  },
  password: {
    validators: {
      notEmpty: {
        message: "该值不能为空"
      },
      stringLength: {
        min: 6,
        max:15,
        message: "密码长度只能是6-15位"
      }
    }
  },
  confirmPassword: {
    validators: {
      notEmpty: {
        message: "该值不能为空"
      },
      identical: {
        field: "password",
        message: "两次输入的密码不一致"
      }
    }
  },
  registerValidity: {
    validators: {
      notEmpty: {
        message: "该值不能为空"
      },
      digits: {
        message: "该值只能包含数字。"
      }
    }
  },
  heartbeatCycle: {
    validators: {
      notEmpty: {
        message: "该值不能为空"
      },
      digits: {
        message: "该值只能包含数字。"
      }
    }
  },
  heartbeatNumber: {
    validators: {
      notEmpty: {
        message: "该值不能为空"
      },
      digits: {
        message: "该值只能包含数字。"
      }
    }
  },
  speedType: {
    validators: {
      notEmpty: {
        message: "该值不能为空"
      }
    }
  },
  rate: {
    validators: {
      notEmpty: {
        message: "该值不能为空"
      },
      digits: {
        message: "该值只能包含数字。"
      }
    }
  },
  sipUserId: {
    validators: {
      notEmpty: {
        message: "该值不能为空"
      }
    }
  }
};

// 编辑网关
function updateModal(node) {
  var id = $(node).attr("data-id");
  $http_get(
    {
      url: "gateway/get?" + new Date().getTime(),
      data: {
        id: id
      }
    },
    function(res) {
      if (res.code === 0) {
        $("#updateGateway").modal("show");
        var data = res.gateway;
        $("#gateId").val(data.id);
        $("#gatewayName").val(data.gatewayName);
        $("#channelCodingId").val(data.channelCodingId);
        $("#connectType").val(data.connectType);
        $("#nativeSipPort").val(data.nativeSipPort);
        $("#sipServerId").val(data.sipServerId);
        $("#sipServerRegion").val(data.sipServerRegion);
        $("#sipServerAddress").val(data.sipServerAddress);
        $("#sipServerPort").val(data.sipServerPort);
        $("#sipUserName").val(data.sipUserName);
        $("#password").val(data.password);
        $("#confirmPassword").val(data.confirmPassword);
        $("#registerValidity").val(data.registerValidity);
        $("#heartbeatCycle").val(data.heartbeatCycle);
        $("#heartbeatNumber").val(data.heartbeatNumber);
        $("#speedType").val(data.speedType);
        $("#rate").val(data.rate);
        $("#sipUserId").val(data.sipUserId);
      } else {
      }
    }
  );
}
$("#updateForm")
  .bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      /* valid: "glyphicon glyphicon-ok",
      invalid: "glyphicon glyphicon-remove",
      validating: "glyphicon glyphicon-refresh" */
    },
    // 配置需要校验的表单元素
    fields: fields
  })
  .on("success.form.bv", function(e) {
    e.preventDefault();
    var params = {
      id: $("#gateId").val(),
      gatewayName: $("#gatewayName").val(),
      channelCodingId: $("#channelCodingId").val(),
      connectType: $("#connectType").val(),
      nativeSipPort: $("#nativeSipPort").val(),
      sipServerId: $("#sipServerId").val(),
      sipServerRegion: $("#sipServerRegion").val(),
      sipServerAddress: $("#sipServerAddress").val(),
      sipServerPort: $("#sipServerPort").val(),
      sipUserName: $("#sipUserName").val(),
      password: $("#password").val(),
      confirmPassword: $("#confirmPassword").val(),
      registerValidity: $("#registerValidity").val(),
      heartbeatCycle: $("#heartbeatCycle").val(),
      heartbeatNumber: $("#heartbeatNumber").val(),
      speedType: $("#speedType").val(),
      rate: $("#rate").val(),
      sipUserId: $("#sipUserId").val()
    };
    $http_post({ url: "gateway/update", data: params}, function(
      res
    ) {
      if (res.code === 0) {
        $("#updateGateway").modal("hide");
        params.currPage = 0;
        render();
      }
    });
  });

// 新增网关
$("#addForm")
  .bootstrapValidator({
    excluded: [],
    feedbackIcons: {
     /*  valid: "glyphicon glyphicon-ok",
      invalid: "glyphicon glyphicon-remove",
      validating: "glyphicon glyphicon-refresh" */
    },
    // 配置需要校验的表单元素
    fields: fields
  })
  .on("success.form.bv", function(e) {
    e.preventDefault();
    var params = {
      gatewayName: $("#addGatewayName").val(),
      channelCodingId: $("#addChannelCodingId").val(),
      connectType: $("#addConnectType").val(),
      nativeSipPort: $("#addNativeSipPort").val(),
      sipServerId: $("#addSipServerId").val(),
      sipServerRegion: $("#addSipServerRegion").val(),
      sipServerAddress: $("#addSipServerAddress").val(),
      sipServerPort: $("#addSipServerPort").val(),
      sipUserName: $("#addSipUserName").val(),
      password: $("#addPassword").val(),
      confirmPassword: $("#addConfirmPassword").val(),
      registerValidity: $("#addRegisterValidity").val(),
      heartbeatCycle: $("#addHeartbeatCycle").val(),
      heartbeatNumber: $("#addHeartbeatNumber").val(),
      speedType: $("#addSpeedType").val(),
      rate: $("#addRate").val(),
      sipUserId: $("#addSipUserId").val()
    };
    $http_post({ url: "gateway/save", data: params}, function(
      res
    ) {
      if (res.code === 0) {
        $("#addGateWay").modal("hide");
        params.currPage = 0;
        render();
      }
    });
  });

// 网关查询
function searchByKeyWord() {
  params.currPage = 0;
  params.equalName = $("#keyWord").val();
  render();
}

// 模态框关闭，清空校验规则和模态框中数据
$("#updateGateway").on("hidden.bs.modal", function(e) {
  $("#updateForm")
    .data("bootstrapValidator")
    .resetForm();
});

$("#addGateWay").on("hidden.bs.modal", function(e) {
  $("#addForm")
    .data("bootstrapValidator")
    .resetForm();

  $("#addGatewayName").val("");
  $("#addChannelCodingId").val("");
  $("#addConnectType").val("");
  $("#addNativeSipPort").val("");
  $("#addSipServerId").val("");
  $("#addSipServerRegion").val("");
  $("#addSipServerAddress").val("");
  $("#addSipServerPort").val("");
  $("#addSipUserName").val("");
  $("#addPassword").val("");
  $("#addConfirmPassword").val("");
  $("#addRegisterValidity").val("");
  $("#addHeartbeatCycle").val("");
  $("#addHeartbeatNumber").val("");
  $("#addSpeedType").val("");
  $("#addRate").val("");
  $("#addSipUserId").val("");
});
