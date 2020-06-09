$http_get({url:"/sys/menu/nav"},function(res){
  if(res.code === 0){
    $('.main ul').html(template('workDesk',res.menuList[0]))
    window.localStorage.setItem('menuList',JSON.stringify(res.menuList[0].list))

    $('.currentName').html(window.localStorage.getItem('username'))
    // console.log(JSON.parse(window.localStorage.getItem('menuList')))
  }
})


$('.main').on('click','a',function(e){
  e.preventDefault()
  window.localStorage.setItem('currentUrl', $(this).attr('href'))
  window.location.href = './main.html'
})

$('#changePasswordForm').bootstrapValidator({
  excluded: [],
  feedbackIcons: {
    /* valid: "glyphicon glyphicon-ok",
    invalid: "glyphicon glyphicon-remove",
    validating: "glyphicon glyphicon-refresh" */
  },
  // 配置需要校验的表单元素
  fields: {
    password:{
      validators: {
        notEmpty: {
          message: "原密码不能为空"
        },
        stringLength: {
          min: 6,
          message: '密码长度不能低于6位'
        }
      }
    },
    newPassword:{
      validators: {
        notEmpty: {
          message: "新密码不能为空"
        },
        stringLength: {
          min: 6,
          message: '新密码长度不能低于6位'
        }
      },
    }
  }
}).on("success.form.bv", function(e) {
  e.preventDefault();
  var params = {
    password:$('#oldPassword').val(),
    newPassword:$('#newPassword').val()
  }
  $http_post({
    url:'sys/user/password',
    data:params
  }, function(res) {
    if (res.code === 0) {
      // getUserList()
      // getRoleList()
      // getAllRoleList()
      $("#changePassword").modal("hide");
    }else{
      return alert('更新失败，请确认原始密码是否正确')
    }
  })
})