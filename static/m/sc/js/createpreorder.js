/**
 * Created by bobdoaren007 on 2016/7/21 0021.
 */
loadtbl()
function loadtbl(){
    coldefs = [{ seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){
            return "<span class='check'>"+v+"</span>"
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

    t = new _e["table"]()
    row_actions =[
        //添加tbl的删除操作，并获得当前行的所有的数据
        /*{cls:"does",func:function(tbl,rows){
         console.log(tbl.data[rows])
         },title:"删除"}*/
    ]
    rows_actions = []
    ext_row = function(rows,i){
        return "this is row "+i
    }


    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,
        "/sc/preorder/getpreorder")
}
_e.bind(".submitpreorder","click",submitPreorderInfo)
function submitPreorderInfo() {
    var fdPreOrder = new FormData(),xhr = new XMLHttpRequest()
    if(document.querySelector(".deliveryinterval").value==""||document.querySelector(".finishorder").value==""||document.querySelector(".name").value==""||document.querySelector(".startorder").value==""||document.querySelector(".deliveryhint").value==""){
        _e.msgBox({
            msg:"请填写规范！",
            timeout:2000,
            className:"warning"
        })
        return
    }
    fdPreOrder.append("name",document.querySelector(".name").value)
    fdPreOrder.append("start_order",document.querySelector(".startorder").value)
    fdPreOrder.append("finish_order",document.querySelector(".finishorder").value)
    fdPreOrder.append("delivery_interval",document.querySelector(".deliveryinterval").value)
    fdPreOrder.append("delivery_hint",document.querySelector(".deliveryhint").value)
    xhr.open("POST","/sc/preorder/setpreorder"+_e["jurisdiction"](),true)
    xhr.send(fdPreOrder)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            resCoupon = eval('(' + xhr.responseText + ');')
            if(resCoupon.res==1){
                _e.msgBox({
                    msg:"添加成功！",
                    timeout:2000,
                    className:"success"
                })
            }else{
                _e.msgBox({
                    msg: "操作无效！",
                    timeout: 2000,
                    className: "error"
                })
                return
            }
        }
    }
}