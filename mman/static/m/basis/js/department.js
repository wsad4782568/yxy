/**
 * Created by Administrator on 2016/6/3.
 */
var xhr = new XMLHttpRequest();
xhr.open("POST", "/basis/department/getext", true);
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        deptextend = eval('('+xhr.responseText+');')
        deptextend.dept.push([-1,"无上级部门"])
        loadtbl()
        t.funcs.loadData.call(t)
    }
}
function loadtbl(){
  //var dataDepttype=[[1,"实体店"],[2,"配送点"],[3,"分仓或者配送点"],[4,"合作店"],[5,"运营部门"],[6,"行政管理部门"],[7,"总店"],[8,"地推"],[20,"其他"]]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    var dataDepttype=[[1,"实体店"],[3,"分仓或者配送点"],[6,"行政管理部门"],[7,"总店"],[8,"地推"],[20,"其他"]]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    var dataStatus=[[1,"正常"],[2,"关店"]]
    //[[1,"正常"],[2,"关店"],[3,"停止线上"],[4,"停止线下"]]
    coldefs = [{ seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){ return v},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable:true, // 可排序 function
        retrievable: false, // 可检索 function
        title:"id", // 列标题
        visible:true, //是否可见
        checkall:false,// 是否可全选
        isID:1,
        name:"id",//和后端对应，FormData里面的key，后端解析时要一致
        type:-1,//-1:不可见 0:input 1:select 2:不可修改input 3:不可修改select（需要跨表转换时）
        data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列

    },
        { seq:1,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"店名", // 列标题
            visible:true, //是否可见
            name:"name",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:2,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){
                if(item==1) return "<b>是</b>"
                return "<b>否</b>"
            },// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"是否合作店", // 列标题
            visible:true, //是否可见
            name:"isallied",//和后端对应，FormData里面的key，后端解析时要一致
            type:1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[[1,"是"],[2,"否"]]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:3,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<div style='width: 237px;overflow-y: scroll;height: 39px;border: 1px solid #c0c0c0;'><b>"+item+"</b></div>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"简介", // 列标题
            visible:true, //是否可见
            name:"intro",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:4,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){
                if(item==1) return "<b>营业中</b>"
                return "<b>暂停营业</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"营业情况", // 列标题
            visible:true, //是否可见
            name:"active",//和后端对应，FormData里面的key，后端解析时要一致
            type:1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[[1,"营业中"],[2,"暂停营业"]]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:5,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true, // 可排序 function
            retrievable: false, // 可检索 function
            title:"创建时间", // 列标题
            visible:false, //是否可见
            name:"created",//和后端对应，FormData里面的key，后端解析时要一致
            type:2,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:6,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){
                for(var i=0;i<dataDepttype.length;i++){
                    if(dataDepttype[i][0]==item) return "<b>"+dataDepttype[i][1]+"</b>"
                }
            },
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"部门类型", // 列标题
            visible:true, //是否可见
            name:"depttype",//和后端对应，FormData里面的key，后端解析时要一致
            type:1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:dataDepttype//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:7,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){
                for(var i=0;i<dataStatus.length;i++){
                    if(dataStatus[i][0]==item) return "<b>"+dataStatus[i][1]+"</b>"
                }
            },
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"店铺状态", // 列标题
            visible:true, //是否可见
            name:"status",//和后端对应，FormData里面的key，后端解析时要一致
            type:1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:dataStatus//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:8,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){
                for(var i=0;i<this.data.length;i++){
                    if(this.data[i][0]==item) return "<b>"+this.data[i][1]+"</b>"
                }
            },
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"上级部门", // 列标题
            visible:true, //是否可见
            name:"supervisor",//和后端对应，FormData里面的key，后端解析时要一致
            type:1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:deptextend.dept//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:9,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"关店时间", // 列标题
            visible:false, //是否可见
            name:"openend",//和后端对应，FormData里面的key，后端解析时要一致
            type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:10,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},
            sortable:false, // 可排序 function
            retrievable: false, // 可检索 function
            title:"开店时间", // 列标题
            visible:false, //是否可见
            name:"openstart",//和后端对应，FormData里面的key，后端解析时要一致
            type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },{ seq:11,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){
                for(var i=0;i<this.data.length;i++){
                    if(this.data[i][0]==item) return "<b>"+this.data[i][1]+"</b>"
                }
            },
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"负责人", // 列标题
            visible:true, //是否可见
            name:"deptadmin",//和后端对应，FormData里面的key，后端解析时要一致
            type:1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:deptextend.staff//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },  { seq:12,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"联系电话", // 列标题
            visible:true, //是否可见
            name:"phone",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        }, { seq:13,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"地址", // 列标题
            visible:true, //是否可见
            name:"address",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        }
    ]

    t = new _e["table"]()
    row_actions =[{cls:"doerow",func:function(tbl,rows){
        if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
        var dlg = _e.dialog({id:"dlgData",class:"dlgData",width:"500px",
            title:"基本信息修改",
            mainBody:_e["genForm"](coldefs),
            actions:[{id:"btn",class:"bottom",title:"确定",func:function(){
                var data=dlg.querySelectorAll(".form-data")
                var fd = new FormData(), xhr = new XMLHttpRequest()
                for(var i=0;i<data.length;i++){
                    fd.append(data[i].name,data[i].value)
                }
                xhr.open("POST" ,"/basis/department/update" +_e["jurisdiction"](), true)
                xhr.send(fd)
                xhr.onreadystatechange=function(){
                    if (xhr.readyState==4 && xhr.status==200){
                        var d = eval('('+xhr.responseText+');')
                        _e["msgBox"]({
                            msg: d.msg,
                            className: d.res==-1 ? "error":"success",
                            timeout:3000})
                        if(d.res==0){
                            dlg.parentNode.removeChild(dlg)
                            t.funcs.loadData.call(t)
                        }
                    }
                }
            }}]})
        dlg.show()
        var forms = dlg.querySelector(".main").children[0]
        var form_data = forms.querySelectorAll(".form-data")//获取每个input或者select的DOM对象
        for(var i=0;i<form_data.length;i++){//将原来的数据添加进来，方便对比修改
            form_data[i].value=tbl["data"][rows][i] //将tbl里面的值填入input
        }
    },title:"基本信息"},
        {cls:"doerow",func:function(tbl,rows){
            if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
            var dlg = _e.dialog({id:"dlgData",width:"800px",
                title:"基本信息修改",
                mainBody:"创建时间：<i>"+tbl.data[rows][5]+"</i><br>"+
                "关店时间：<i>"+tbl.data[rows][9]+"</i><br>"+
                "开店时间：<i>"+tbl.data[rows][10]+"</i><br>"  ,
                actions:[{id:"btn",title:"关闭",func:function(){
                    dlg.parentNode.removeChild(dlg)
                }}]})
            dlg.show()

        },title:"其他信息"}
    ]
    rows_actions = [{
        func:function(tbl,rows){
            if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
            var dlg = _e.dialog({id:"dlgData",width:"500px",
                title:"添加门店",
                mainBody:_e["genForm"](coldefs),
                actions:[{id:"btn",title:"确定",func:function(){
                    var data=dlg.querySelectorAll(".form-data")
                    var fd = new FormData(), xhr = new XMLHttpRequest()
                    for(var i=0;i<data.length;i++){
                        fd.append(data[i].name,data[i].value)
                    }
                    xhr.open("POST" ,"/basis/department/insert"+_e["jurisdiction"]() , true)
                    xhr.send(fd)
                    xhr.onreadystatechange=function(){
                        if (xhr.readyState==4 && xhr.status==200){
                            var d = eval('('+xhr.responseText+');')
                            _e["msgBox"]({
                                msg: d.msg,
                                className: d.res==-1 ? "error":"success",
                                timeout:3000})
                            if(d.res==0){
                                dlg.parentNode.removeChild(dlg)
                                t.funcs.loadData.call(t)
                            }
                        }
                    }
                }}]})
            dlg.show()
        },title:"添加门店"}]

    ext_row = function(rows,i){
        return "this is row "+i
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/basis/department/get"+_e["jurisdiction"]())
    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
    tbl_head.querySelector("#trunit").parentNode.removeChild( tbl_head.querySelector("#trunit"))
    tbl_head.querySelector("#trdept").parentNode.removeChild( tbl_head.querySelector("#trdept"))
}
