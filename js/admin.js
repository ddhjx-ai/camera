$(function(){
  // 用户列表
  getUserList()
  // 角色名列表
  getRoleList()
  // 分组列表
  getGroupsList()
  // 获取角色详情列表
  getAllRoleList()
})

$('.header_left ul').html(template('menuList',{list:JSON.parse(window.localStorage.getItem('menuList'))}))
$('.updateRoleChecked').html(template('menuRoleList',{list:JSON.parse(window.localStorage.getItem('menuList'))}))
$('.addRoleChecked').html(template('menuRoleList',{list:JSON.parse(window.localStorage.getItem('menuList'))}))

$('.currentName').html(window.localStorage.getItem('username'))
// 全局用户列表0/角色列表1显示的标识符,默认为0显示用户列表
var showFlag = 0

var userQueryInfo = {
  username:''
}
var roleQueryInfo = {
  roleName:''
}
// 获取所有用户请求
function getUserList(){
  $http_get({
    url:'sys/user/list?'+ new Date().getTime(),
    data:userQueryInfo
  },function(res){
    if(res.code === 0){
      $('.userList tbody').html(template('userList',res.page))
    }
  })
}

// 获取角色详情列表
function getAllRoleList(){
  $http_get({
    url:'sys/role/list?'+ new Date().getTime(),
    data:roleQueryInfo
  },function(res){
    if(res.code === 0){
      $('.rolesList tbody').html(template('getAllRoleList',res.page))
    }
  })
}

// 获取角色名列表
function getRoleList(){
  $http_get({
    url:'sys/role/select?'+ new Date().getTime()
  },function(res){
    if(res.code === 0){
      $('.roles').html(template('roleList',res))
    }
  })
}

// 获取所有分组列表
function getGroupsList(){
  $http_get({
    url:'group/getAll?'+ new Date().getTime()
  },function(res){
    if(res.code === 0){
      $('.updateGroupsList ul').html(template('groupsList',res.page))
      $('.addGroupsList ul').html(template('groupsList',res.page))
    }
  })
}

// 编辑用户
function updateModal(node){
  var id = $(node).attr('data-id')
  // $("#updateUser").modal('show')
  $http_get({url:'sys/user/info/'+ id + '?' + new Date().getTime()},function(res){
    if(res.code === 0){
      $("#updateUser").modal('show')

      $('#userId').val(res.user.userId)
      $('#updateUserName').val(res.user.username)
      $('#updateRoleList').val(res.user.roleIdList[0])

      var groupList = res.user.groupList
      $('.updateGroupsList li input').each(function(index,item){
        for(var i = 0; i<groupList.length; i++){
          if($(item).val() == groupList[i]){
            $(item).prop('checked',true)
          }
        }
      })
    }
  })
}
// 修改用户
$('#updateUserForm').bootstrapValidator({
  excluded: [],
  feedbackIcons: {
    /* valid: "glyphicon glyphicon-ok",
    invalid: "glyphicon glyphicon-remove",
    validating: "glyphicon glyphicon-refresh" */
  },
  // 配置需要校验的表单元素
  fields: {
    username:{
      validators: {
        notEmpty: {
          message: "用户名不能为空"
        },
        stringLength: {
          min: 2,
          max:10,
          message: '用户名只能在2-10位之间'
        }
      }
    }
  }
}).on("success.form.bv", function(e) {
  e.preventDefault();
  var groupList = []
  $('.updateGroupsList li input').each(function(index,item){
    if($(item).prop('checked')){
      groupList.push(parseInt($(item).val()))
    }
  })
  if(groupList.length === 0){
    $('.updateUserInfo').fadeIn(100)
    return
  }else{
    $('.updateUserInfo').fadeOut(100)
  }
  var params = {
    userId:parseInt($('#userId').val()),
    roleIdList:[parseInt($('#updateRoleList').val())],
    username:$('#updateUserName').val(),
    groupList:groupList
  }
  $http_post({
    url:'sys/user/update',
    data:params
  }, function(res) {
    if (res.code === 0) {
      getUserList()
      $("#updateUser").modal("hide");
    }else{
      return alert(res.msg)
    }
  })
})

// 删除用户
function removeUser(node){
  var userId = parseInt($(node).attr('data-id'))
  var flag = window.confirm('确定删除当前用户？')
  if(flag){
    $http_post({
      url:'sys/user/delete',
      data:[userId]
    },function(res){
      if(res.code === 0){
        getUserList()
      }
    })
  }
}

// 新增用户请求
$('#addUserForm').bootstrapValidator({
  excluded: [],
  feedbackIcons: {
   /*  valid: "glyphicon glyphicon-ok",
    invalid: "glyphicon glyphicon-remove",
    validating: "glyphicon glyphicon-refresh" */
  },
  // 配置需要校验的表单元素
  fields:{
    username:{
      validators: {
        notEmpty: {
          message: "用户名不能为空"
        },
        stringLength: {
          min: 2,
          max:10,
          message: '用户名只能在2-10位之间'
        }
      }
    },
    group:{
      validators: {
        choice: {
          min: 1,
          message: '必须勾选一个权限'
        }
      }
    },
    roleIdList:{
      validators: {
        choice: {
          min: 1,
          message: '必须勾选一个角色'
        }
      }
    },
    password:{
      validators: {
        notEmpty: {
          message: "密码不能为空"
        },
        stringLength: {
          min: 6,
          message: '密码长度不能低于6位'
        }
      }
    },
    confirmPassword:{
      validators: {
        identical: {
          field: 'password',
          message: '两次密码不一致'
        },
        notEmpty: {
          message: "密码不能为空"
        }
      }
    }
  }
}).on("success.form.bv", function(e) {
  console.log(123123123)
  e.preventDefault();
  var groupsList = []
  $('.addGroupsList li input').each(function(index,item){
    if($(item).prop('checked')){
      groupsList.push(parseInt($(item).val()))
    }
  })
  if(groupsList.length === 0){
    $('.addUserInfo').fadeIn(100)
    return
  }else{
    $('.addUserInfo').fadeOut(100)
  }
  var params = {
    roleIdList:[parseInt($('#addRoleList').val())],
    username:$('#addUserName').val(),
    password:$('#addPassword').val(),
    groupList:groupsList
  }
  console.log(params)
  $http_post({
    url:'sys/user/save',
    data:params
  }, function(res) {
    if (res.code === 0) {
      getUserList()
      $("#addUser").modal("hide");
    }else{
      return alert(res.msg)
    }
  })
})

// 新增角色请求
$('#addRoleForm').bootstrapValidator({
  excluded: [],
  feedbackIcons: {
    /* valid: "glyphicon glyphicon-ok",
    invalid: "glyphicon glyphicon-remove",
    validating: "glyphicon glyphicon-refresh" */
  },
  // 配置需要校验的表单元素
  fields: {
    roleName: {
      validators: {
        notEmpty: {
          message: "角色名称不能为空"
        },
        stringLength: {
          min: 2,
          max:10,
          message: '角色名只能在2-10位之间'
        }
      }
    },
    remark:{
      validators: {
        notEmpty: {
          message: "备注内容不能为空"
        }
      }
    }
  }
}).on("success.form.bv", function(e) {
  e.preventDefault();
  var roleList = []
  $('.addRoleChecked .checked').each(function(index,item){
    if($(item).prop('checked')){
      roleList.push(parseInt($(item).val()))
    }
  })
  if(roleList.length === 0){
    $('.addRoleInfo').fadeIn(100)
    return
  }else{
    $('.addRoleInfo').fadeOut(100)
  }
  var params = {
    menuIdList:roleList,
    roleName:$('#addRoleName').val(),
    remark:$('#addRemark').val(),
  }
  console.log(params)
  $http_post({
    url:'sys/role/save',
    data:params
  }, function(res) {
    if (res.code === 0) {
      // getUserList()
      getRoleList()
      getAllRoleList()
      $("#addRole").modal("hide");
    }else{
      return alert(res.msg)
    }
  })
})

// 打开编辑角色模态框，渲染角色状态
function updateRoleModal(node){
  var id = $(node).attr('data-id')
  $('#updateRole').modal('show')
  $http_get({url:'sys/role/info/'+id+'?'+new Date().getTime()},function(res){
    if(res.code === 0){
      $('#updateRoleId').val(res.role.roleId)
      $('#updateRoleName').val(res.role.roleName)
      $('#updateRemark').val(res.role.remark)

      var roleList = res.role.menuIdList
      $('.updateRoleChecked input').each(function(index,item){
        for(var i = 0; i<roleList.length; i++){
          if($(item).val() == roleList[i]){
            $(item).prop('checked',true)
          }
        }
      })
    }
  })
}
// 编辑角色
$('#updateRoleForm').bootstrapValidator({
  excluded: [],
  feedbackIcons: {
    /* valid: "glyphicon glyphicon-ok",
    invalid: "glyphicon glyphicon-remove",
    validating: "glyphicon glyphicon-refresh" */
  },
  // 配置需要校验的表单元素
  fields: {
    roleName:{
      validators: {
        notEmpty: {
          message: "角色名内容不能为空"
        },
        stringLength: {
          min: 2,
          max:10,
          message: '角色名只能在2-10位之间'
        }
      }
    },
    remark:{
      validators: {
        notEmpty: {
          message: "备注内容不能为空"
        }
      }
    }
  }
}).on("success.form.bv", function(e) {
  e.preventDefault();
  var roleList = []
  $('.updateRoleChecked .checked').each(function(index,item){
    if($(item).prop('checked')){
      roleList.push(parseInt($(item).val()))
    }
  })
  if(roleList.length === 0){
    $('.updateRoleInfo').fadeIn(100)
    return
  }else{
    $('.updateRoleInfo').fadeOut(100)
  }
  var params = {
    menuIdList:roleList,
    roleName:$('#updateRoleName').val(),
    remark:$('#updateRemark').val(),
    roleId:$('#updateRoleId').val()
  }
  console.log(params)
  $http_post({
    url:'sys/role/update',
    data:params
  }, function(res) {
    if (res.code === 0) {
      // getUserList()
      getRoleList()
      getAllRoleList()
      $("#updateRole").modal("hide");
    }else{
      return alert(res.msg)
    }
  })
})

// 删除角色
function removeRole(node){
  var id = $(node).attr('data-id')
  var flag = window.confirm('确认删除当前角色？')
  if(flag){
    $http_post({
      url:'sys/role/delete',
      data:[id]
    },function(res){
      if(res.code === 0){
        getAllRoleList()
        getRoleList()
      }
    })
  }
}

// 更新密码请求
/* $('#changePasswordForm').bootstrapValidator({
  excluded: [],
  feedbackIcons: {
    valid: "glyphicon glyphicon-ok",
    invalid: "glyphicon glyphicon-remove",
    validating: "glyphicon glyphicon-refresh"
  },
  // 配置需要校验的表单元素
  fields: {
    password:{
      validators: {
        notEmpty: {
          message: "原密码不能为空"
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
          message: '密码长度不能低于6位'
        }
      },
    }
  }
}).on("success.form.bv", function(e) {
  e.preventDefault();
  var params = {
    password:$('#oldPassword').val(),
    newPassword:$(('#newPassword')).val()
  }
  $http_post({
    url:'sys/user/password',
    data:params
  }, function(res) {
    if (res.code === 0) {
      getUserList()
      getAllRoleList()
      $("#changePassword").modal("hide");
    }else{
      return alert('更新失败，请确认原始密码是否正确')
    }
  })
}) */

// 搜索用户名/角色名
function searchByName(){
  if(showFlag === 0){
    userQueryInfo.username = $('#searchName').val()
    getUserList()
  }else if(showFlag === 1){
    roleQueryInfo.roleName = $('#searchName').val()
    getAllRoleList()
  }
}

// 打开角色列表
function showRoleList(){
  $('#roleListModal').fadeIn(100)
  $('.user_list').fadeOut(100)
  showFlag = 1
  $('#searchName').val('')
  roleQueryInfo.roleName=''
  getAllRoleList()
}
// 打开用户列表
function showUserList(){
  $('#roleListModal').fadeOut(100)
  $('.user_list').fadeIn(100)
  showFlag = 0
  $('#searchName').val('')
  userQueryInfo.username = ''
  getUserList()
}

// 关闭模态框触发的事件
$('#updateUser').on('hidden.bs.modal',function(){
  $('[type=checkbox]').each(function(i,item){
    $(item).prop('checked',false)
  })
  $("#updateUserForm").data("bootstrapValidator").resetForm();
})

$("#updateRole").on('hidden.bs.modal',function(){
  $('[type=checkbox]').each(function(i,item){
    $(item).prop('checked',false)
  })
  $("#updateRoleForm").data("bootstrapValidator").resetForm();
})

$("#addUser").on('hidden.bs.modal',function(){
  $('[type=checkbox]').each(function(i,item){
    $(item).prop('checked',false)
  })
  $("#addUserForm").data("bootstrapValidator").resetForm();
  $('#addPassword').val('')
  $('#addUserName').val('')
  $('#confirmPassword').val('')
})

$("#addRole").on('hidden.bs.modal',function(){
  $('[type=checkbox]').each(function(i,item){
    $(item).prop('checked',false)
  })
  $("#addRoleForm").data("bootstrapValidator").resetForm();
  $('#addRoleName').val('')
  $('#addRemark').val('')
  $('.addRoleChecked input').each(function(index,item){
    $(item).prop('checked',false)
  })
})

$("#changePassword").on('hidden.bs.modal',function(){
  $('#changePasswordForm').data("bootstrapValidator").resetForm()
  $('#oldPassword').val('')
  $(('#newPassword')).val('')
})

// 多选框的全选和全不选
// 编辑角色模态框
$('.updateRoles .checkedAll').on('click',function(){
  var flag = $(this).prop('checked')
  $('.updateRoleChecked input').each(function(index,item){
    $(item).prop('checked',flag)
  })
  if($('.updateRoleChecked input:checked').length !== 0){
    $('.updateRoleInfo').fadeOut(100)
    $("#updateRoleForm").data("bootstrapValidator").resetForm();
  }
})
$('.updateRoleChecked input').on('click',function(){
  if($('.updateRoleChecked input').length == $('.updateRoleChecked input:checked').length){
    $('.updateRoles .checkedAll').prop('checked',true)
  }else{
    $('.updateRoles .checkedAll').prop('checked',false)
  }
  if($('.updateRoleChecked input:checked').length !== 0){
    $('.updateRoleInfo').fadeOut(100)
    $("#updateRoleForm").data("bootstrapValidator").resetForm();
  }
})

// 新增角色模态框
$('.addRoles .checkedAll').on('click',function(){
  var flag = $(this).prop('checked')
  $('.addRoleChecked input').each(function(index,item){
    $(item).prop('checked',flag)
  })
  if($('.addRoleChecked input:checked').length !== 0){
    $('.addRoleInfo').fadeOut(100)
    $("#addRoleForm").data("bootstrapValidator").resetForm();
  } 
})
$('.addRoleChecked input').on('click',function(){
  if($('.addRoleChecked input').length == $('.addRoleChecked input:checked').length){
    $('.addRoles .checkedAll').prop('checked',true)
  }else{
    $('.addRoles .checkedAll').prop('checked',false)
  }
  if($('.addRoleChecked input:checked').length !== 0){
    $('.addRoleInfo').fadeOut(100)
    $("#addRoleForm").data("bootstrapValidator").resetForm();
  }
})

// 编辑用户模态框
$('.updateGroupsList>input').on('click',function(){
  var flag = $(this).prop('checked')
  $('.updateGroupsList ul input').each(function(index,item){
    $(item).prop('checked',flag)
  })
  if($('.updateGroupsList ul input:checked').length !== 0){
    $('.updateUserInfo').fadeOut(100)
    $("#updateUserForm").data("bootstrapValidator").resetForm();
  }
})
$('.updateGroupsList ul').on('click','input',function(){
  if($('.updateGroupsList ul input').length == $('.updateGroupsList ul input:checked').length){
    $('.updateGroupsList>input').prop('checked',true)
  }else{
    $('.updateGroupsList>input').prop('checked',false)
  }
  if($('.updateGroupsList ul input:checked').length !== 0){
    $('.updateUserInfo').fadeOut(100)
    $("#updateUserForm").data("bootstrapValidator").resetForm();
  }
})

// 新增用户模态框
$('.addGroupsList>input').on('click',function(){
  var flag = $(this).prop('checked')
  $('.addGroupsList ul input').each(function(index,item){
    $(item).prop('checked',flag)
  })

  if($('.addGroupsList ul input:checked').length !== 0) {
    $('.addUserInfo').fadeOut(100)
    $("#addUserForm").data("bootstrapValidator").resetForm();
  }
})
$('.addGroupsList ul').on('click','input',function(){
  if($('.addGroupsList ul input').length == $('.addGroupsList ul input:checked').length){
    $('.addGroupsList>input').prop('checked',true)
  }else{
    $('.addGroupsList>input').prop('checked',false)
  }
  if($('.addGroupsList ul input:checked').length !== 0){
    $('.addUserInfo').fadeOut(100)
    $("#addUserForm").data("bootstrapValidator").resetForm();
  }
})
