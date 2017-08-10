/**
 * Created by Administrator on 2016/6/3.
 */

loadtbl()
t.funcs.loadData.call(t)
function loadtbl(){
    var dataDepttype=[[1,"售卖实体店"],[2,"配送点"],[3,"分仓或者配送点"],[4,"合作店"],[5,"运营部门"],[6,"行政管理部门"],[7,"虚仓数据部门"],[20,"其他"]]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    var dataStatus=[[1,"正常"],[2,"关店"],[3,"停止线上"],[4,"停止线下"]]
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
            title:"省份", // 列标题
            visible:true, //是否可见
            name:"province",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:2,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"城市", // 列标题
            visible:true, //是否可见
            name:"city",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:3,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"区域", // 列标题
            visible:true, //是否可见
            name:"district",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:4,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"邮编", // 列标题
            visible:true, //是否可见
            name:"zip",//和后端对应，FormData里面的key，后端解析时要一致
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
                xhr.open("POST" ,"/basis/district/update" +_e["jurisdiction"](), true)
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
    },title:"基本信息"}
    ]
    rows_actions = [{
        func:function(tbl,rows){
            if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
            var dlg = _e.dialog({id:"dlgData",width:"500px",
                title:"添加社区",
                mainBody:_e["genForm"](coldefs),
                actions:[{id:"btn",title:"确定",func:function(){
                    var data=dlg.querySelectorAll(".form-data")
                    var fd = new FormData(), xhr = new XMLHttpRequest()
                    for(var i=0;i<data.length;i++){
                        if(data[i].value.length<1 && i>0){
                            _e["msgBox"]({msg:"请填写完整的信息"})
                            return
                        }
                        fd.append(data[i].name,data[i].value)
                    }
                    xhr.open("POST" ,"/basis/district/insert" +_e["jurisdiction"](), true)
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
        },title:"添加社区"}]

    ext_row = function(rows,i){
        return "this is row "+i
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/basis/district/get"+_e["jurisdiction"]())
    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
    tbl_head.querySelector("#trunit").parentNode.removeChild( tbl_head.querySelector("#trunit"))
    tbl_head.querySelector("#trdept").parentNode.removeChild( tbl_head.querySelector("#trdept"))
}
