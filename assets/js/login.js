$(function(){
    //点击去注册账号的链接
    $('#link_reg').on('click',function(){
        $('.login-box').hide();
        $('.reg-box').show();
    })
    //点击去登录的链接
    $('#link_login').on('click',function(){
        $('.login-box').show();
        $('.reg-box').hide();
    })
    //从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    //通过layui.form()函数自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        //校验两次密码是否一致的规则
        repwd:function(value){
         var pwd =  $('.reg-box [name=password]').val();
         if(pwd !== value){
             return '两次密码不一致'
         }
        }
    })
    //监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        e.preventDefault();
        // 发起post请求
        var data = {
            username:$('#form_reg [name=username]').val(),
            password:$('#form_reg [name=password]').val(),
        }

       
        $.post('/api/reguser',data,function(res){
            if(res.status !== 0){
              return layer.msg(res.message)
            }
            layer.msg('注册成功,请登录！');
            //模拟人的点击行为
            $('#link_login').click();
        
        })
    })
     //监听登录表单的提交事件
     $('#form_login').on('submit',function(e){
         e.preventDefault();
         $.ajax({
             url:'/api/login',
             method:'post',
             data:$(this).serialize(),
             success:function(res){
                 if(res.status !== 0){
                     return layer.msg('登录失败！')
                 }
                 layer.msg('登录成功！');
                 //将登录成功得到的token字符串保存到localStore中
                 localStorage.setItem('token',res.token);
                 //跳转到后台主页index.html页面
                 console.log(location);
                 location.href = '/index.html';
             }
         })
     })
})