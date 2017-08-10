
loadtbl()
t.funcs.loadData.call(t)
function loadtbl(){
    coldefs = [{ seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){ return v},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
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
        { seq:1,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"姓名", // 列标题
            visible:true, //是否可见
            name:"name",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:2,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<img src=' http://od35wia0b.bkt.clouddn.com/"+item+"?imageMogr2/thumbnail/20x20!' />"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            title:"用户头像", // 列标题
            visible:false, //是否可见
            name:"avatar",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:3,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){
                if(item==1) return "<b>男</b>"
                return "<b>女</b>"
            },// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"性别", // 列标题
            visible:true, //是否可见
            name:"gender",//和后端对应，FormData里面的key，后端解析时要一致
            type:1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[[1,"男"],[2,"女"]]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:4,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: false, // 可检索 function
            title:"创建时间", // 列标题
            visible:false, //是否可见
            name:"created",//和后端对应，FormData里面的key，后端解析时要一致
            type:2,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:5,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"邮箱", // 列标题
            visible:true, //是否可见
            name:"email",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:6,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"联系方式", // 列标题
            visible:true, //是否可见
            name:"phone",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:7,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"密码", // 列标题
            visible:false, //是否可见
            name:"pwd",//和后端对应，FormData里面的key，后端解析时要一致
            type:2,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:8,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"街道", // 列标题
            visible:true, //是否可见
            name:"subdistrict",//和后端对应，FormData里面的key，后端解析时要一致
            type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:9,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"账户余额", // 列标题
            visible:false, //是否可见
            name:"balance",//和后端对应，FormData里面的key，后端解析时要一致
            type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:10,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"账户积分", // 列标题
            visible:true, //是否可见
            name:"scores",//和后端对应，FormData里面的key，后端解析时要一致
            type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:11,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"微信openid", // 列标题
            visible:false, //是否可见
            name:"openid",//和后端对应，FormData里面的key，后端解析时要一致
            type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:12,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"来源", // 列标题
            visible:true, //是否可见
            name:"source",//和后端对应，FormData里面的key，后端解析时要一致
            type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        }

    ]

    t = new _e["table"]()
    row_actions =[{cls:"doerow",func:function(tbl,rows){
        if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
        var dlg = _e.dialog({id:"dlgData",width:"500px",
            title:"其他信息",
            mainBody:"创建时间：<i>"+tbl.data[rows][4]+"</i><br>"+
            "密码：<i>"+tbl.data[rows][7]+"</i><br>"+
            "账户余额：<i>"+tbl.data[rows][9]+"</i><br>"+
            "<img src=' http://od35wia0b.bkt.clouddn.com/"+tbl.data[rows][2]+"' />"    ,
            actions:[{id:"btn",title:"确定",func:function(){
                dlg.parentNode.removeChild(dlg)
            }}]})
        dlg.show()

    },title:"其他信息"}
     ]
    rows_actions = []

    ext_row = function(rows,i){
        return "this is row "+i
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/basis/userinfo/get"+_e["jurisdiction"]())
    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
    tbl_head.querySelector("#trunit").parentNode.removeChild( tbl_head.querySelector("#trunit"))
    tbl_head.querySelector("#trdept").parentNode.removeChild( tbl_head.querySelector("#trdept"))
}
