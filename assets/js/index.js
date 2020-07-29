$(function(){
    getUserInfo();

    var layer = layui.layer;
    //弹出退出框
    $('#btnLogout').on('click',function(){
        layer.confirm('确定退出登录', {icon: 3, title:'提示'}, function(index){
            //do something
            // 清空本地存储中的token
            localStorage.removeItem('token');
            // 重新跳转到登录页面
            location.href = '/login.html';
            layer.close(index);
          });
    })
})
//获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method:'get',
        url:'/my/userinfo',
        //请求头：封装到baseAPI js文件中
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败！');
            }
            // 调用renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        },
       
    })
}

//渲染用户头像
function renderAvatar(user){
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp' + name);
    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide();
    }else{
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}