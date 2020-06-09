var token = window.localStorage.getItem('token')
// console.log(token)
var baseURL = 'http://10.0.0.46:10000/'
// var baseURL = "http://10.0.1.90:8085/";

// get请求
var $http_get = function(options,callback){
  $.ajax({
    url: baseURL + options.url,
    data: options.data,
    headers:{
      token:token
    },
    success:function(res){
      if(res.code === 401){
        alert('登陆失效，请重新登陆')
        window.localStorage.clear()
        window.location.href = '../view/login.html'
        return
      }
      callback(res)
    }
  })
}

// post请求
var $http_post = function(options,callback){
  $.ajax({
    url: baseURL + options.url,
    data: JSON.stringify(options.data),
    contentType: "application/json;charset=UTF-8",
    headers:{
      token:token
    },
    type:'post',
    success:function(res){
      if(res.code === 401){
        alert('登陆失效，请重新登陆')
        window.localStorage.clear()
        window.location.href = '../view/login.html'
        return
      }
      callback(res)
    }
  })
}

// 获取时间
getDate()
function getDate() {
  let time = new Date()
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let day = time.getDate()
  month = month > 9 ? month : '0' + month
  day = day > 9 ? day : '0' + day
  let date = year + '-' + month + '-' + day
  $('.setDate').html(date)
}

// 退出登录功能
function logout(){
  var flag = window.confirm('是否确认退出登录？')
  if(flag){
    window.localStorage.clear()
    $http_post({
      url:'sys/logout',
    },function(res){
      if(res.code === 0){
        window.location.href = '../view/login.html'
      }
    })
  }
}

