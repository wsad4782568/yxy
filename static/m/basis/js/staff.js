/**
 * Created by Administrator on 2016/6/3.
 */

loadtbl()
function loadtbl(){
    var a= [[1,"是"],[2,"否"]]
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
            title:"姓名", // 列标题
            visible:true, //是否可见
            name:"username",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:2,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"职称", // 列标题
            visible:true, //是否可见
            name:"title",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:3,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"密码", // 列标题
            visible:true, //是否可见
            name:"pwd",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:4,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"用户电话", // 列标题
            visible:true, //是否可见
            name:"phone",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:5,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){
                if(item==1) return "<b>是</b>"
                return "<b>否</b>"
            },
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"合作方员工", // 列标题
            visible:true,
            name:"corp",
            type:1,
            data:[[1,"是"],[2,"否"]]
        },
        { seq:6,
            render:function(item){
                for(var i=0;i<this.data.length;i++){
                  if (item == this.data[i][0]) return this.data[i][1]
                }
                return "无"
            },
            sortable:true,
            retrievable: true,
            title:"权限",
            visible:true,
            name:"role",
            type:1,
            data:[[1,"超级管理员"],[2,"管理员"],[3,"店长"],[4,"副店长"],[5,"仓管"],[6,"副仓管"],
            [7,"普通员工"],[8,"超级数据查询员"],[9,"数据查询员"],[10,"采购总监"],[11,"市场经理"]]
        }
    ]

    t = new _e["table"]()
    row_actions =[{cls:"doerow",func:function(tbl,rows){
        if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
        var dlg = _e.dialog({id:"dlgData",width:"500px",
            title:"基本信息修改",
            mainBody:_e["genForm"](coldefs),
            actions:[{id:"btn",title:"确定",func:function(){
                var data=dlg.querySelectorAll(".form-data")
                var fd = new FormData(), xhr = new XMLHttpRequest()
                for(var i=0;i<data.length;i++){
                    fd.append(data[i].name,data[i].value)
                }
                xhr.open("POST" ,"/basis/staff/update"+_e["jurisdiction"]() , true)
                xhr.send(fd)
                xhr.onreadystatechange=function(){
                    if (xhr.readyState==4 && xhr.status==200){
                        var d = eval('('+xhr.responseText+');')
                        if (d.res==-1){
                            _e["msgBox"]({msg:d.msg})
                        }
                        else {
                            _e["msgBox"]({
                                msg:d.msg,
                                className:"success"
                            })
                            if(d.res==0){
                                dlg.parentNode.removeChild(dlg)
                                t.funcs.loadData.call(t)
                            }
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
        var dlg = _e.dialog({id:"dlgData",width:"500px",
            title:"更改部门",
            mainBody:"<h2>将 ： " + tbl.data[rows][1]+" 调动至</h2></br>"+
            "<div id='changedept'><h3>部门</h3></div>",
            actions:[{id:"btn",title:"调动",func:function(){
                var data=dlg.querySelectorAll(".form-data")
                var fd = new FormData(), xhr = new XMLHttpRequest()
                fd.append("staffid",tbl.data[rows][0])
                fd.append("department",dlg.querySelector("#department").value)
                xhr.open("POST" ,"/basis/staff/changedept"+_e["jurisdiction"]() , true)
                xhr.send(fd)
                xhr.onreadystatechange=function(){
                    if (xhr.readyState==4 && xhr.status==200){
                        var d = eval('('+xhr.responseText+');')
                        if (d.res==-1){
                            _e["msgBox"]({msg:d.msg})
                        }
                        else {
                            _e["msgBox"]({
                                msg:d.msg,
                                className:"success"
                            })
                            if(d.res==0){
                                dlg.parentNode.removeChild(dlg)
                                t.funcs.loadData.call(t)
                            }
                        }
                    }
                }
            }},{id:"btndelete",title:"取消",func:function(){
              dlg.parentNode.removeChild(dlg)
            }}]})
            var nowdept=document.querySelector("#cqdept")
            var select= document.createElement("select")
            select.id="department"
            select.innerHTML = nowdept.innerHTML
            dlg.querySelector("#changedept").appendChild(select)
        dlg.show()

    },title:"更改部门"},
    {cls:"doerow",func:function(tbl,rows){
        if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
        var dlg = _e.dialog({id:"dlgData",width:"500px",
            title:"删除",
            mainBody:"<h2>是否删除员工 ： " + tbl.data[rows][1]+"</h2>",
            actions:[{id:"btn",title:"删除",func:function(){
                var data=dlg.querySelectorAll(".form-data")
                var fd = new FormData(), xhr = new XMLHttpRequest()
                fd.append("id",tbl.data[rows][0])
                xhr.open("POST" ,"/basis/staff/delete"+_e["jurisdiction"]() , true)
                xhr.send(fd)
                xhr.onreadystatechange=function(){
                    if (xhr.readyState==4 && xhr.status==200){
                        var d = eval('('+xhr.responseText+');')
                        if (d.res==-1){
                            _e["msgBox"]({msg:d.msg})
                        }
                        else {
                            _e["msgBox"]({
                                msg:d.msg,
                                className:"success"
                            })
                            if(d.res==0){
                                dlg.parentNode.removeChild(dlg)
                                t.funcs.loadData.call(t)
                            }
                        }
                    }
                }
            }},{id:"btndelete",title:"取消",func:function(){
              dlg.parentNode.removeChild(dlg)
            }}]})
        dlg.show()
    },title:"删除员工"}
    ]
    rows_actions = [{
        func:function(tbl,rows){
            if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
            var nowdept=document.querySelector("#cqdept")
            var dlg = _e.dialog({id:"dlgData",width:"500px",
                title:"在"+nowdept.children[nowdept.selectedIndex].innerHTML+"下添加员工",
                mainBody:_e["genForm"](coldefs),
                actions:[{id:"btn",title:"确定",func:function(){
                    var data=dlg.querySelectorAll(".form-data")
                    var fd = new FormData(), xhr = new XMLHttpRequest()
                    for(var i=0;i<data.length;i++){
                        fd.append(data[i].name,data[i].value)
                    }
                    xhr.open("POST" ,"/basis/staff/insert"+_e["jurisdiction"]() , true)
                    xhr.send(fd)
                    xhr.onreadystatechange=function(){
                        if (xhr.readyState==4 && xhr.status==200){
                            var d = eval('('+xhr.responseText+');')
                            if (d.res==-1){
                                _e["msgBox"]({msg:d.msg})
                            }
                            else {
                                _e["msgBox"]({
                                    msg:d.msg,
                                    className:"success"
                                })
                                dlg.parentNode.removeChild(dlg)
                                t.funcs.loadData.call(t)
                            }
                        }
                    }
                }}]})
            dlg.show()
        },title:"添加员工"}]

    ext_row = function(rows,i){
        return "this is row "+i
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/basis/staff/get")
    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
    tbl_head.querySelector("#trunit").parentNode.removeChild( tbl_head.querySelector("#trunit"))
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/basis/staff/getControllersDept",true)
    xhr.onreadystatechange = function(){
        if (xhr.readyState==4 && xhr.status==200){
            var da = eval('(' +xhr.responseText+ ');')
            if (!da.deptall){
              _e.msgBox({msg:"部门信息失败"})
            }
            var cdeptSelect=tbl_head.querySelector("#cqdept")
            for (var i = 0; i < da.deptall.length; i++) {
              var option=document.createElement("option")
              option.value=da.deptall[i][0]
              option.innerHTML=da.deptall[i][1]
              cdeptSelect.appendChild(option)
            }
            t.funcs.reloadOption.call(t)
            t.funcs.loadData.call(t)
            localStorage.setItem("show_dept",tbl_head.querySelector("#cqdept").value)
        }
    }
    xhr.send()
    tbl_head.querySelector("#cqdept").innerHTML=""

}
