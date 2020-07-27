//在ajaxPrefilter中统一拼接请求的根路径
$.ajaxPrefilter(function(options){
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})