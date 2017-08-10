/**
 * Created by bobodaren007 on 2016/7/20 0020.
 * 创建优惠券的基础信息
 * 一张表显示添加成功之后信息
 */
couponStyle()
function couponStyle(){
    coldefs = [{ seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){
            return "<span class='chioce'>"+v+"</span>"
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
            title:"面额",
            visible:true,
            name:"pv",
            type:0,
            data:[]
        },
        { seq:2,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"生效时间",
            visible:true,
            name:"valid",
            type:0,
            data:[]
        },
        { seq:3,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"有效期",
            visible:true,
            name:"expired",
            type:0,
            data:[]
        },
        { seq:4,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"部门",
            visible:true,
            name:"dept",
            type:0,
            data:[]
        }
    ]

    t = new _e["table"]()
    row_actions =[
       /* {cls:"does",func:function(){
            console.log(this)
        },title:"编辑"}*/
    ]

    rows_actions = [

    ]

    ext_row = function(rows,i){
        return "this is row "+i
    }
    t.funcs.init.call(t,"tbl4",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row, "/sc/promotion/getcoupon")
}

_e.bind(".submitcoupon","click",submitcoupon)
function submitcoupon() {
    var coupon = new FormData(),xhr = new XMLHttpRequest()
    if(document.querySelector(".cash").value==" "||document.querySelector(".valid").value==""||document.querySelector(".expired").value==""){
        _e.msgBox({
            msg:"请填写规范！",
            timeout:2000,
            className:"error"
        })
        return
    }else{
        coupon.append("pv",document.querySelector(".cash").value)
        coupon.append("valid",document.querySelector(".valid").value)
        coupon.append("expired",document.querySelector(".expired").value)
    }

    xhr.open("POST","/sc/promotion/makecoupon"+_e["jurisdiction"](),true)
    xhr.send(coupon)
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
