/**
 * Created by bobodaren007 on 2016/7/20 0020.
 * 新增买送基本信息
 * 两张表：tbl1显示要赠送的商品信息
 * f
 *         tbl2显示添加买送基本信息成功之后的信息
 */
function loadtbl(){
    coldefs1 = [{ seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){
            return "<span>"+v+"</span>"
        },// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable:true, // 可排序 function
        retrievable: false, // 可检索 function
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
            retrievable: true,
            title:"规格",
            visible:true,
            name:"specification",
            type:0,
            data:[]
        },{ seq:3,
            render:function(item){return "<b>"+(item/100).toFixed(2)+"</b>"},
            sortable:true,
            retrievable: true,
            title:"价格",
            visible:true,
            name:"price",
            type:0,
            data:[]
        }
    ]

    t1 = new _e["table"]()
    row_actions =[
    ]

    rows_actions = [
    ]

    var ext_row = function(rows,i){
        return "this is row "+i
    }
    var afterLoad = function(tbl,tblDom){
        _e.bindAll(".check","click",function(e){
            // 获得当前的行的id
           // alert(this.getAttribute("data-val"))
            document.querySelector(".goodsidname").innerHTML+='<input class="checknode" ' +
                'data-id="'+this.parentNode.childNodes[1].innerText+'" data-name="'
                +this.parentNode.parentNode.childNodes[1].innerText+'" style="margin: 10px;" type="checkbox"' +
                ' name="gooodsNode">'+this.parentNode.childNodes[1].innerText+
                '-'+this.parentNode.parentNode.childNodes[1].innerText
        },tblDom)

    }

    t1.funcs.init.call(t1,"tbl",
        coldefs1,row_actions,rows_actions,"table","1__THE__TABLE__",ext_row,
        "/sc/promotion/getcoms",
        afterLoad
    )
}

loadtbl()
t1.funcs.loadData.call(t1)

loadtblchioce()
function loadtblchioce(){
    coldefs = [{ seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){
            return "<span>"+v+"</span>"
        },// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable:true, // 可排序 function
        retrievable: false, // 可检索 function
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
            retrievable: true,
            title:"介绍",
            visible:true,
            name:"intro",
            type:0,
            data:[]
        },
        { seq:3,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"买",
            visible:true,
            name:"buys",
            type:0,
            data:[]
        },
        { seq:4,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"送",
            visible:true,
            name:"gifts",
            type:0,
            data:[]
        }
    ]

    t = new _e["table"]()
    row_actions =[

        //添加tbl的删除操作，并获得当前行的所有的数据
     /*   {cls:"does",func:function(tbl,rows){
            console.log(tbl.data[rows])
        },title:"编辑"}*/
    ]
    rows_actions = []
    ext_row = function(rows,i){
        return "this is row "+i
    }
    t.funcs.init.call(t,"tbl2",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,
        "/sc/promotion/getallgiftpackge")
}


_e.bind(".submitgoods","click",submitgoods)
function submitgoods() {
    var j = 0
    var idStr = []
    for (var i = 0; i < document.querySelectorAll(".checknode").length; i++) {
        if (document.querySelectorAll(".checknode")[i].checked == true) {
            idStr[j] = document.querySelectorAll(".checknode")[i].getAttribute("data-id")
            j++
        }
    }
    var fd = new FormData(), xhr = new XMLHttpRequest()
    if (document.querySelector(".giftname").value == " " || document.querySelector(".giftinfo").value == " " || document.querySelector(".giftbuy").value == ""|| document.querySelector(".giftsale").value == "") {
        _e.msgBox({
            msg: "请填写规范！",
            timeout: 2000,
            className: "error"
        })
        return
    } else {
        fd.append("name", document.querySelector(".giftname").value)
        fd.append("intro", document.querySelector(".giftinfo").value)
        fd.append("buys", document.querySelector(".giftbuy").value)
        fd.append("gifts", document.querySelector(".giftsale").value)
        console.log(fd.get('buys'))
        for (var k = 0; k < idStr.length; k++) {
            fd.append("com", idStr[k])
        }
    }
    xhr.open("POST", "/sc/promotion/makegiftpackage"+_e["jurisdiction"](), true)
    xhr.send(fd)
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            aa = eval('(' + xhr.responseText + ');')
            if (aa.res == 1) {
                _e.msgBox({
                    msg: "添加成功！",
                    timeout: 2000,
                    className: "success"
                })
                document.querySelector(".giftname").value = ""
                document.querySelector(".giftinfo").value = ""
                document.querySelector(".giftbuy").value = ""
                document.querySelector(".giftsale").value = ""
                setTimeout("window.location.reload()",2000)
            }
            else {
                _e.msgBox({
                    msg: "操作无效！",
                    timeout: 2000,
                    className: "error"
                })
            }
        }
    }
}
