
$('.username').html(window.localStorage.getItem('username'))
$(".header_left ul").html(
  template("menuList", {
    list: JSON.parse(window.localStorage.getItem("menuList"))
  })
);

$('iframe').attr('src',window.localStorage.getItem('currentUrl'))
$('.header_left a').each(function(i,item){
  if($(item).attr('href') == window.localStorage.getItem('currentUrl')){
    $(item).parent().addClass('active')
    $('title').html($(item).html())
  }
})

$(".header_left ul").on('click','a',function(e){
  if($(this).attr('href') == './workDesk.html'){
    window.location.href = $(this).attr('href')
    return
  }
  e.preventDefault()
  $('.header_left li').each(function(i,item){
    $(item).removeClass('active')
  })
  $(this).parent().addClass('active')
  $('title').html($(this).html())

  var mySrc = $(this).attr('href')
  $('iframe').attr('src',mySrc)

  window.localStorage.setItem('currentUrl',$(this).attr('href'))
})