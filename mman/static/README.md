 Wiki


##目录概览


```
├── examples #测试目录,上线时移除
│   ├── manage 
│   └── sales
├── include #js,css,images库
│   ├── assets #自己的js,css
│   └── dist #第三方框架
├── manage #管理平台
│   ├── crm #客户关系管理
│   ├── oms #订单管理
│   ├── open #开放平台
│   ├── scm #供应链管理
│   └── sas #数据统计分析
└── sales       #销售页面
    ├── account #客户账户
    ├── area #区域
    ├── deliver_address #配送地址
    ├── goods  #商品主页
    ├── img    #测试图片,上线时移除
    ├── orders #订单
    └── wxpay #微信支付目录
```

文件与目录结构方式按照功能与页面划分,客户页面与管理页面自己开发的所有css与js全部解耦.只公用第三方库,目前同时使用的图片在上线时需要部署到qiniu公共空间,并且压缩。


##Mui Q&A

**1. 在移动手机上面不能滑动的情况.**

解决方案:
```javascript
<div class="mui-scroll-wrapper">
    <div class="mui-scroll">
    <!--这里放置真实显示的DOM内容-->
    </div>
</div>
mui('.mui-scroll-wrapper').scroll({});//滑动初始化模块必须等内容加载完成之后才能调用
```
参考:[侧滑菜单导致列表页无法滑动](http://ask.dcloud.net.cn/question/14884)

**2.侧滑菜单在手机上的超链接被阻止问题,主要是滑动事件阻止了默认行为**

解决方案:给菜单增加tap事件，使用mui.openWindow()跳转页面
```javascript
mui(".e-sidemenu").on("tap","li",function(e){
    var openUrl=this.getAttribute("data-url");
    if(openUrl!=null){
        mui.openWindow({
            url: openUrl
        })
    }
});
```
参考:[MUI Web APP侧滑菜单在手机上被阻止](http://ask.dcloud.net.cn/question/15128)

**3.处理遮罩比内容先出的用户体验问题**

解决方案:对遮罩的显示设置一个setTimeOut
```javascript
if(menuWrapperClassList.contains('mui-active')) {
            document.body.classList.remove('menu-open');
            menuWrapper.className = 'menu-wrapper fadeOutDown animated';
            menu.className = 'menu bounceOutDown animated';
            setTimeout(function() {
                backdrop.style.opacity = 0;
                menuWrapper.classList.add('hidden');
            }, 500);
        } else {
            document.body.classList.add('menu-open');
            menuWrapper.className = 'menu-wrapper fadeInUp animated mui-active';
            menu.className = 'menu bounceInUp animated';
            setTimeout(function() {
                backdrop.style.opacity = 1;
            }, 300);

        }
```
参考:[MUI Web APP侧滑菜单在手机上被阻止](http://ask.dcloud.net.cn/question/15128)