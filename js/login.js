// 获取验证码图片请求
var uuid;

getImg()
function getImg(){
  uuid = Math.random()
  $('#imgCode').attr('src', baseURL +'captcha.jpg?uuid=' + uuid + "&" + new Date().getTime())
}

// 登陆接口
$("#loginForm")
  .bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      // valid: "glyphicon glyphicon-ok",
      // invalid: "glyphicon glyphicon-remove",
      // validating: "glyphicon glyphicon-refresh" 9a23c2a761fc9325e2a11911f071b5b0 24e5c2fa233e004e164a9d40b5d81ccf
    },
    // 配置需要校验的表单元素
    fields:{
      username: {
        validators: {
          notEmpty: {
            message: "用户名不能为空"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          }
        }
      },
      verificationCode:{
        validators: {
          notEmpty: {
            message: "验证码不能为空"
          }
        }
      }
    }
  })
  .on("success.form.bv", function(e) {
    e.preventDefault();
    var params = {
      url:"sys/login",
      data:{
        username:$('#username').val(),
        password:$('#password').val(),
        uuid:uuid,
        captcha:$('#verificationCode').val()
      }
    }
    $http_post(params, function(res) {
      if (res.code === 0) {
        window.localStorage.setItem('token', res.token)
        window.localStorage.setItem('username',$('#username').val())
        window.location.href = './workDesk.html'
      }else{
        return alert(res.msg)
      }
    })
  })