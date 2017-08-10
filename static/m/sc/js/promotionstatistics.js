/**
 * Created by bobodaren007 on 2016/8/9 0009.
 */
/**
 * Created by bobodaren007 on 2016/7/18 0018.
 */

getPromotion()
t.funcs.loadData.call(t)
function getPromotion(){
    coldefs = [
        { seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(v){
                return "<span class='goodsid'>"+v+"</span>"
            },// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"id", // 列标题
            visible:true, //是否可见
            checkall:false,// 是否可全选
            //isID:1,
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
            retrievable: true,
            title:"范围",
            visible:true,
            name:"validflag",
            type:0,
            data:[]
        },
        { seq:7,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"方式",
            visible:true,
            name:"promotionflag",
            type:0,
            data:[]
        },
        { seq:8,
            render:function(item){
              return "<b>"+item+"</b>"
            },
            sortable:true,
            retrievable: true,
            title:"详情",
            visible:true,
            name:"detil",
            type:0,
            data:[]
        },
        { seq:9,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"次数",
            visible:true,
            name:"repeattimes",
            type:0,
            data:[]
        },{ seq:10,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"开始时间",
            visible:true,
            name:"starttime",
            type:0,
            data:[]
        },{ seq:11,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"结束时间",
            visible:true,
            name:"endtime",
            type:0,
            data:[]
        },{ seq:12,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"可购买数量",
            visible:true,
            name:"repeatpurchasetimes",
            type:0,
            data:[]
        }
    ]

    t = new _e["table"]()
    row_actions =[

    ]

    rows_actions = [

    ]

    ext_row = function(rows,i){
        return "this is row "+i
    }
    t.funcs.init.call(t,"tblleft",
        coldefs,row_actions,rows_actions,"table pure-table pure-table-bordered","__THE__TABLE__",ext_row, "/sc/promotion/getpromotioncoms")
    var tbl_head = document.querySelector("#tblleft").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
}
