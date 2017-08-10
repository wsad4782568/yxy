/**
 * Created by Administrator on 2016/6/3.
 */
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
            title:"标题", // 列标题
            visible:true, //是否可见
            name:"title",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:2,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"用户姓名", // 列标题
            visible:true, //是否可见
            name:"user",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:3,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"房间号", // 列标题
            visible:true, //是否可见
            name:"room",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:4,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"电话", // 列标题
            visible:true, //是否可见
            name:"phone",//和后端对应，FormData里面的key，后端解析时要一致
            type:3,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:5,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){
                if (item==1) return "<b>是</b>"
                return "<b>否</b>"
            },
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"主地址", // 列标题
            visible:true, //是否可见
            name:"flag",//和后端对应，FormData里面的key，后端解析时要一致
            type:3,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[[1,"是"],[2,"否"]]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:6,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"送货地址", // 列标题
            visible:true, //是否可见
            name:"subdistrict_id",//和后端对应，FormData里面的key，后端解析时要一致
            type:3,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        }
    ]

    t = new _e["table"]()
    row_actions =[]
    rows_actions = []
    ext_row = function(rows,i){
        return "this is row "+i
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/basis/address/get"+_e["jurisdiction"]())
    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
    tbl_head.querySelector("#trunit").parentNode.removeChild( tbl_head.querySelector("#trunit"))
}