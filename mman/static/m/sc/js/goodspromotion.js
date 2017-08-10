/**
 * Created by bobodaren007 on 2016/7/19 0019.
 * 促销方式和商品绑定
 * 分为 tree(商品菜单)、tbl1(商品信息)、tbl2(促销方式信息)
 */

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
            qseq:7, //数组中下标
            qverb:'e',// = 条件
            qpt:this.getAttribute("data-code") //值
            //qpt:7791 //值
        })
    }, is_leaf:1}]
    trs.init("#trees",treedata,1,"TR",event)    //创建树
}

function loadtbl(){
    coldefs = [ { seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){
            return "<span>"+v+"</span>"
        },// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable:true, // 可排序 function
        retrievable: false, // 可检索 function
        title:"id", // 列标题
        visible:true, //是否可见
        checkall:false,// 是否可全选
        // isID:1,
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
            retrievable: true,
            title:"单位",
            visible:true,
            name:"unit",
            type:0,
            data:[]
        },
        { seq:3,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"规格",
            visible:true,
            name:"specification",
            type:0,
            data:[]
        },
        { seq:4,
            render:function(item){return "<b>"+parseInt(item)+"</b>"},
            sortable:true,
            retrievable: true,
            title:"数量",
            visible:true,
            name:"amount",
            type:0,
            data:[]
        },{ seq:5,
            render:function(item){return "<b>"+(item/100).toFixed(2)+"</b>"},
            sortable:true,
            retrievable: true,
            title:"价格",
            visible:true,
            name:"price_onsale",
            type:0,
            data:[]
        },
        { seq:6,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"方式",
            visible:true,
            name:"promotion",
            type:0,
            data:[]
        }
        ]

    t = new _e["table"]()
    row_actions =[{cls:"does",func:function(tbl,rows){
        if(document.querySelector(".data-goods-tbody").children.length!=0){
            for(var i=0;i<document.querySelectorAll(".get_goodsId").length;i++){
                if(document.querySelectorAll(".get_goodsId")[i].innerHTML==tbl.data[rows][0]){
                    _e.msgBox({
                        msg:"已选定！",
                        timeout:2000,
                        className:"warning"
                    })
                    return
                }
            }
        }
        var data_tbody='<tr><td class="get_goodsId">'+tbl.data[rows][0]+'</td> <td>'+tbl.data[rows][1]+'</td> <td>'+tbl.data[rows][2]+'</td> <td>'+tbl.data[rows][3]+'</td><td>'+parseInt(tbl.data[rows][4])+'</td><td>'+(tbl.data[rows][5]/100).toFixed(2)+'</td><td><input type="button" class="remove_goods" value="删除"></td></tr>'
        document.querySelector(".data-goods-tbody").innerHTML+=data_tbody
        document.querySelector(".pure-table-horizontal").style.display="block"
        _e.bindAll(".remove_goods","click",removeGoods)

    },title:"选中"},
        {cls:"does",func:function(tbl,rows){
            console.log(tbl.data[rows][0])
            var fd=new FormData(), xhr=new XMLHttpRequest()
            fd.append("comid", tbl.data[rows][0])
            fd.append("promotion",0)
            xhr.open("POST","/sc/promption/bindpromotion",true)
            xhr.send(fd)
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    goodsPromotionRes = eval('(' + xhr.responseText + ');')
                    console.log(goodsPromotionRes)
                    if(goodsPromotionRes.res==0){
                        _e.msgBox({
                            msg:"修改成功！",
                            timeout:2000,
                            className:"success"
                        })

                        document.querySelector("#property_row_"+rows).children[6].innerHTML="<b>0</b>"
                    }
                }
            }
        },title:"不指定"}
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
        coldefs,row_actions,rows_actions,"table pure-table pure-table-bordered","1__THE__TABLE__",ext_row,
        "/sc/promotion/getcoms",
        afterLoad
    )
    var tbl_head = document.querySelector("#tbl1").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
}


getPromotion()
t2.funcs.loadData.call(t2)
function getPromotion(){
    coldefs2 = [{ seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){
            return "<span>"+v+"</span>"
        },// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable:true, // 可排序 function
        retrievable: true, // 可检索 function
        title:"id", // 列标题
        visible:true, //是否可见
        checkall:false,// 是否可全选
        // isID:1,
        name:"id",//和后端对应，FormData里面的key，后端解析时要一致
        type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
        data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    },
        { seq:1,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"部门",
            visible:false,
            name:"dept",
            type:0,
            data:[]
        },
        { seq:2,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"范围",
            visible:true,
            name:"validflag",
            type:0,
            data:[]
        },
        { seq:3,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"方式",
            visible:true,
            name:"promotionflag",
            type:0,
            data:[]
        },
        { seq:4,
            render:function(item){
                return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"详情",
            visible:true,
            name:"detil",
            type:0,
            data:[]
        },
        { seq:5,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"次数",
            visible:true,
            name:"repeattimes",
            type:0,
            data:[]
        },{ seq:6,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"开始时间",
            visible:true,
            name:"starttime",
            type:0,
            data:[]
        },{ seq:7,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"结束时间",
            visible:true,
            name:"endtime",
            type:0,
            data:[]
        },{ seq:8,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"数量",
            visible:true,
            name:"repeatpurchasetimes",
            type:0,
            data:[]
        }
    ]

    t2 = new _e["table"]()
   var row_actions =[
       {cls:"does",func:function(tbl,rows){
           var data_tbl='<div>id：<span class="data_tbl_id">'+tbl["data"][rows][0]+'</span> / <span>范围：'+
           tbl["data"][rows][2]+'</span> / <span>方式：'+tbl["data"][rows][3]+
           '</span> / <span>详情：'+tbl["data"][rows][4]+'</span> / <span>客户享用次数：'+tbl["data"][rows][5]+'</span> / <span>开始时间：'+tbl["data"][rows][6]+'</span> / <span>结束时间：'+tbl["data"][rows][7]+'</span>'+
           '</div>'
        document.querySelector(".data-tbl").innerHTML=data_tbl
        document.querySelector("#tbl2").style.display="none"
        document.querySelector("#btn_restart").style.display="block"
       },title:"选中"}
    ]

   var rows_actions = [
    ]

    var ext_row = function(rows,i){
        return "this is row "+i
    }
  /*  var afterLoad2 = function(tbl,tblDom){//单绑tbl的checkbox
        _e.bindAll(".check","click",function(e){
              for(var i=0;i<tblDom.querySelectorAll(".check").length;i++){
                  tblDom.querySelectorAll(".check")[i].checked=false
                  this.checked =true
              }
            promotionId=this.parentNode.childNodes[1].innerText
        },tblDom)}*/
    t2.funcs.init.call(t2,"tbl2",
        coldefs2,row_actions,rows_actions,"table pure-table pure-table-bordered","2__THE__TABLE__",ext_row, "/sc/promotion/getpromotion")
    var tbl_head = document.querySelector("#tbl2").querySelector("thead")
    tbl_head.querySelector("#trdept").parentNode.removeChild( tbl_head.querySelector("#trdept"))
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
    tbl_head.querySelector("#trunit").parentNode.removeChild( tbl_head.querySelector("#trunit"))

}

_e.bind(".goodspromotionId","click",submitId)
function submitId() {
    if(document.querySelectorAll(".get_goodsId").length==0||document.querySelector(".data_tbl_id")==null){
        _e.msgBox({
            msg:"请操作规范！",
            timeout:2000,
            className:"warning"
        })
        return
    }
    var fdd=new FormData(), xhr=new XMLHttpRequest()
    var goodsIdArr=document.querySelectorAll(".get_goodsId")
    for(var i=0;i<goodsIdArr.length;i++){
        console.log(goodsIdArr[i].innerText)
        fdd.append("comid", Number(goodsIdArr[i].innerText))
    }
    fdd.append("promotion",Number(document.querySelector(".data_tbl_id").innerHTML))
    xhr.open("POST","/sc/promption/bindpromotion"+_e["jurisdiction"](),true)
    xhr.send(fdd)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            goodsPromotionRes = eval('(' + xhr.responseText + ');')
            console.log(goodsPromotionRes)
            _e["msgBox"]({
                msg: goodsPromotionRes.msg,
                className: goodsPromotionRes.res==-1 ? "error":"success",
                timeout:3000
            })
            if(goodsPromotionRes.res==0){
                t.funcs.loadData.call(t)
                document.querySelector("#tbl2").style.display="block"
                document.querySelector("#btn_restart").style.display="none"
                document.querySelector(".data-tbl").innerHTML=''
                document.querySelector(".data-goods").innerHTML=""
            }
        }
    }
}
_e.bind("#btn_restart","click",function () {
    document.querySelector("#tbl2").style.display="block"
    document.querySelector("#btn_restart").style.display="none"
    document.querySelector(".data-tbl").innerHTML=''
})


function removeGoods() {

    this.parentNode.parentNode.remove(this.parentNode.parentNode)
    console.log(document.querySelector(".data-goods-tbody").children.length)
    if(document.querySelector(".data-goods-tbody").children.length==0){
        document.querySelector(".pure-table-horizontal").style.display="none"
    }
}
