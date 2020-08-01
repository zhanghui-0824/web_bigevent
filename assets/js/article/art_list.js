$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义一个时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());


        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + '\n' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零的整数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义查询的参数对象
    var q = {
        pagenum: 1,//页码值
        pagesize: 2,//每页显示的数据，默认是2条
        cate_id: '', //文章分类的 Id
        state: '' //文章的发布状态
    };

    initTable();
    initCate();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染页面的方法
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败');
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //重新渲染表单区域的UI结构
                form.render();
            }
        })
    }

    // 为筛选按钮绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',//分页容器的id
            count: total,//总数据条
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调函数
            jump: function (obj, first) {
                // 把最新的页码值赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                //   把最新的条目值赋值到 q 这个查询参数对象的pagesize中
                q.pagesize = obj.limit
                //   根据最新的 q 获取对应的数据列表,并渲染表格
                //   initTable();//直接调用会进入死循环
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function(){
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'get',
                url:'/my/article/delete/' + id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    if(len === 1){
                        // 页码值最小为1
                        q.pagenum = q.pagenum === 1? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            
            layer.close(index);
          });
    })
})