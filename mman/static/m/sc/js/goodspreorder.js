/**
 * Created by bobdoaren007 on 2016/7/21 0021.
 */
/**
 * Created by bobodaren007 on 2016/7/19 0019.
 * 促销方式和商品绑定
 * 分为 tree(商品菜单)、tbl1(商品信息)、tbl2(促销方式信息)
 */
var promotionId=0
var goodsId=[]
var xhr = new XMLHttpRequest();
xhr.open("GET", "/sc/commodity/getext", true);
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        others = eval('('+xhr.responseText+');')
        others.comclass = []// id 和 姓名  对比  商品tbl里面对应的
        for(var i in others.tree) {
            if (others.tree[i][8]==1){//只需要叶子节点的,商品只在这个种类下面
                others.comclass.push([others.tree[i][1],others.tree[i][2]]);
            }
        }
        trs=[]
        trs.push([0,"父节点"])
        for(var i in others.tree) {
            trs.push([others.tree[i][0],others.tree[i][2],others.tree[i][7],others.tree[i][8],["data-code",others.tree[i][1]]]);
        }
        loadtree(trs)
        loadtbl()
        t.funcs.loadData.call(t)
    }
}

function loadtree(treedata){
    var trs=new _e["tree"]()
    var event=[{e:"click",func:function () { //需要绑定的函数，绑定tbl
        t.funcs.loadData.call(t,{    //在table.js中的204行显示
            qseq:12, //数组中下标
            qverb:'e',// = 条件
            qpt:this.getAttribute("data-code") //值
        })
    }, is_leaf:1}]
    trs.init("#trees",treedata,1,"TR",event)    //创建树
}

function loadtbl(){
    coldefs = [{ seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){
            return "<span class='goodsid'>"+v+"</span>"
        },// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable:true, // 可排序 function
        retrievable: true, // 可检索 function
        title:"id", // 列标题
        visible:true, //是否可见
        checkall:false,// 是否可全选
        isID:1,
        name:"id",//和后端对应，FormData里面的key，后端解析时要一致
        type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
        data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列

    },
        { seq:1,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"商品名",
            visible:true,
            name:"name",
            type:0,
            data:[]
        },

        { seq:2,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"规格",
            visible:true,
            name:"specification",
            type:0,
            data:[]
        },{ seq:3,
            render:function(item){return "<b>"+(item/100).toFixed(2)+"</b>"},
            sortable:true,
            retrievable: false,
            title:"价格",
            visible:true,
            name:"price",
            type:0,
            data:[]
        },{ seq:4,
            render:function(item){
                    if (item==-1||item==0) {
                        return "<b>0 否</b>"
                    }else{
                        return "<b>"+item+"</b>"
                    }
            },
            sortable:true,
            retrievable: false,
            title:"预购",
            visible:true,
            name:"preorder",
            type:0,
            data:[]
        }
    ]

    t = new _e["table"]()
    row_actions =[
        {cls:"does",func:function(tbl,rows){
            console.log(tbl.data[rows][0])
            var fd=new FormData(), xhr=new XMLHttpRequest()
            fd.append("commodity",tbl.data[rows][0])
            fd.append("preorder",-1)
            xhr.open("POST","/sc/preorder/bindpreorder"+_e["jurisdiction"](),true)
            xhr.send(fd)
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    goodsPromotionRes = eval('(' + xhr.responseText + ');')
                    console.log(goodsPromotionRes)
                    if(goodsPromotionRes.res==1){
                        _e.msgBox({
                            msg:"添加成功！",
                            timeout:2000,
                            className:"success"
                        })
                    }
                }
            }
        },title:"一键还原"}
    ]

    rows_actions = [
    ]

    var ext_row = function(rows,i){
        return "this is row "+i
    }
    var afterLoad = function(tbl,tblDom){
        /*  _e.bindAll(".check","click",function(e){//绑定checkbox
         console.log(this.parentNode.childNodes[1].innerText)
         },tblDom)*/
    }

    t.funcs.init.call(t,"tbl1",
        coldefs,row_actions,rows_actions,"table","1__THE__TABLE__",ext_row,
        "/sc/preorder/getprecoms",
        afterLoad
    )
}


getPromotion()
function getPromotion(){
    coldefs2 = [{ seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){
            return "<span class='check'>"+v+"</span>"
        },// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable:true, // 可排序 function
        retrievable: true, // 可检索 function
        title:"id", // 列标题
        visible:true, //是否可见
        checkall:false,// 是否可全选
        isID:1,
        name:"id",//和后端对应，FormData里面的key，后端解析时要一致
        type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
        data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列

    },
        { seq:1,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"名称",
            visible:true,
            name:"name",
            type:0,
            data:[]
        },
        { seq:2,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"部门",
            visible:true,
            name:"dept",
            type:0,
            data:[]
        },
        { seq:3,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"预定日期",
            visible:true,
            name:"startorder",
            type:0,
            data:[]
        },
        { seq:4,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"配送出单时间",
            visible:true,
            name:"finishorder",
            type:0,
            data:[]
        },
        { seq:5,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"下单后配送间隔",
            visible:true,
            name:"deliveryinterval",
            type:0,
            data:[]
        },
        { seq:6,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"配送说明",
            visible:true,
            name:"deliveryhint",
            type:0,
            data:[]
        }
    ]


    var t2 = new _e["table"]()
    var row_actions =[
    ]

    var rows_actions = [
    ]

    var ext_row = function(rows,i){
        return "this is row "+i
    }
    var afterLoad2 = function(tbl,tblDom){//单绑tbl的checkbox
        _e.bindAll(".check","click",function(e){
            for(var i=0;i<tblDom.querySelectorAll(".check").length;i++){
                tblDom.querySelectorAll(".check")[i].checked=false
                this.checked =true
            }
            promotionId=this.parentNode.childNodes[1].innerText
        },tblDom)}
    t2.funcs.init.call(t2,"tbl2",
        coldefs2,row_actions,rows_actions,"table","2__THE__TABLE__",ext_row, "/sc/preorder/getpreorder",
        afterLoad2)
}

_e.bind(".goodspromotionId","click",submitId)
function submitId() {
    console.log(promotionId)
    if(promotionId==0||document.querySelectorAll(".goodsid").length==0){
        _e.msgBox({
            msg:"操作失败！",
            timeout:2000,
            className:"error"
        })
        return
    }
    var fd=new FormData(), xhr=new XMLHttpRequest()
    var goodsIdArr=document.querySelectorAll(".goodsid")
    for(var i=0;i<goodsIdArr.length;i++){
        var goodsIdArrCheck=goodsIdArr[i].parentNode.firstChild
        if(goodsIdArrCheck.checked==true) {
            console.log(goodsIdArr[i].innerText)
            fd.append("commodity", goodsIdArr[i].innerText)
        }
    }
    fd.append("preorder",promotionId)
    xhr.open("POST","/sc/preorder/bindpreorder"+_e["jurisdiction"](),true)
    xhr.send(fd)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            goodsPromotionRes = eval('(' + xhr.responseText + ');')
            console.log(goodsPromotionRes)
            if(goodsPromotionRes.res==1){
                _e.msgBox({
                    msg:"添加成功！",
                    timeout:2000,
                    className:"success"
                })
            }
        }
    }
}