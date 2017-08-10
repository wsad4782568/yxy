/**
 * Created by eachma on 16-7-14.
 */
loadtbl()
t.funcs.loadData.call(t, {
    qseq: 0, //id
    qverb: 'g',// >
    qpt: -1,  //-1
    oseq: 1, //顺序的下标
    odir:"a" //升序降序
})
function loadtbl(){
    coldefs = [{ seq:1,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){ return v},// 这里render是function，它可以组合或变换当前数据行，然后进行显示

        title:"id", // 列标题
        visible:true, //是否可见
        name:"id",//和后端对应，FormData里面的key，后端解析时要一致
        type:-1,//-1:不可见 0:input 1:select 2:不可修改input 3:不可修改select（需要跨表转换时）
        data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列

    },
        { seq:2,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"省份", // 列标题
            visible:true, //是否可见
            name:"province",//和后端对应，FormData里面的key，后端解析时要一致
            type:-1,
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:3,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"城市", // 列标题
            visible:true, //是否可见
            name:"city",//和后端对应，FormData里面的key，后端解析时要一致
            type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:4,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"区域", // 列标题
            visible:true, //是否可见
            name:"district",//和后端对应，FormData里面的key，后端解析时要一致
            type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:5,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"小区名称", // 列标题
            visible:true, //是否可见
            name:"name",//和后端对应，FormData里面的key，后端解析时要一致
            type:0,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
            data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },
        { seq:6,//在数据[[],[]]中的位置rows[i][seq] 返回值
            render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable:true, // 可排序 function
            retrievable: true, // 可检索 function
            title:"小区说明", // 列标题
            visible:true, //是否可见
            name:"memo",//和后端对应，FormData里面的key，后端解析时要一致
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
            actions:[{id:"btn",class:"bottom",title:"修改",func:function(){
                var data=dlg.querySelectorAll(".form-data")
                var fd = new FormData(), xhr = new XMLHttpRequest()
                fd.append("id",data[0].value)
                fd.append("name",data[4].value)
                fd.append("memo",data[5].value)
                xhr.open("POST" ,"/basis/subdistrict/update"+_e["jurisdiction"]() , true)
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
            }},
            {id:"btn",class:"bottom",title:"取消",func:function(){
                dlg.parentNode.removeChild(dlg)
            }}]})
        dlg.show()
        var forms = dlg.querySelector(".main").children[0]
        var form_data = forms.querySelectorAll(".form-data")
        for(var i=0;i<form_data.length;i++){//将原来的数据添加进来，方便对比修改
            form_data[i].value=tbl["data"][rows][i+1] //将tbl里面的值填入input
        }
    },title:"基本信息"},
    {cls:"doerow",func:function(tbl,rows){
        if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
        var dlg = _e.dialog({id:"dlgData",width:"500px",
            title:"删除小区信息",
            mainBody:"<h2>是否删除小区 ： " + tbl.data[rows][5]+"</h2>"+
            "<h1>请确认已经清除了 小区-门店 的关系</h1>",
            actions:[{id:"btn",title:"移除",func:function(){
                var data=dlg.querySelectorAll(".form-data")
                var fd = new FormData(), xhr = new XMLHttpRequest()
                fd.append("id",tbl.data[rows][1])
                xhr.open("POST" ,"/basis/subdistrict/delete"+_e["jurisdiction"]() , true)
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
    },title:"删除小区"}
    ]
    rows_actions = [{
        func:function(tbl,rows){
            if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
            var dlg = _e.dialog({id:"dlgData",width:"500px",
                title:"添加社区",
                mainBody:"按区域名查询<input id='input-name' value=''>"+"<button type='button' id='btnSearch' style='margin-top: 16px'>查询</button>"+
                "<table style='width:300px'><thead><tr><th>id</th><th>省</th><th>市</th><th>区域</th></tr></thead></table>"+
                _e["genForm"](coldefs),
                actions:[{id:"btn",title:"确定",func:function(){
                    var data=dlg.querySelectorAll(".form-data")
                    var fd = new FormData(), xhr = new XMLHttpRequest()
                    if(data[4].value.length < 1){
                        _e["msgBox"]({msg: "请填写完整的信息",})
                        return
                    }
                    fd.append("name",data[4].value)
                    fd.append("memo",data[5].value)
                    console.log(data[4].value)
                    console.log(data[5].value)
                    var checkIpt = dlg.querySelectorAll(".checkIpt")
                    var checkeds=[]
                    for(var s1=0;s1<checkIpt.length;s1++){
                        if(checkIpt[s1].checked) checkeds.push(checkIpt[s1])
                    }
                    if(checkeds.length>1){
                        _e["msgBox"]({msg: "只能设置一个区域",})
                        return
                    }
                    else if (checkeds.length<1){
                        _e["msgBox"]({msg: "必须选择一个区域",})
                        return
                    }
                    else {
                        fd.append("district",checkeds[0].parentNode.children[1].innerText)
                        console.log(checkeds[0].parentNode.children[1].innerText)
                    }
                    xhr.open("POST" ,"/basis/subdistrict/insert" +_e["jurisdiction"](), true)
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
            _e.bind("#btnSearch","click",comModify)
            _e.bind("#input-name","change",comModify)
            function comModify(){
                if(document.querySelector("#selectTbody")){
                    document.querySelector("#selectTbody").parentNode.removeChild(document.querySelector("#selectTbody"))
                }
                var fd = new FormData();
                fd.append("district",dlg.querySelector("#input-name").value)
                var xhr = new XMLHttpRequest()
                xhr.open("POST","/basis/district/getbydis",true)
                xhr.send(fd)
                xhr.onreadystatechange = function(){
                    if(xhr.readyState == 4 && xhr.status == 200){
                        var dat = eval('('+xhr.responseText+');')
                        if(dat.district.length < 1 ){
                            _e["msgBox"]({msg: "没有这个区域!"})
                        }
                        var selectTbody = document.createElement("tbody")
                        selectTbody.setAttribute("id","selectTbody")
                        dlg.querySelector("table").appendChild(selectTbody)
                        var selectTxt = document.querySelector("#selectTbody")
                        if(dlg.querySelector("#input-name").value == ""){
                            selectTxt.style.background = "transparent"
                            _e["msgBox"]({msg: "输入不能为空!"})
                        }else{
                            for(var i=0; i<dat.district.length; i++){
                                var tr = document.createElement("tr")
                                tr.innerHTML = '<td>'+'<input type="checkbox" class="checkIpt">'+'<span>'+dat.district[i][0]+'</span>'+'</td>'+
                                    '<td>'+dat.district[i][1]+'</td>'+
                                    '<td>'+dat.district[i][2]+'</td>'+
                                    '<td>'+dat.district[i][3]+'</td>'
                                selectTbody.appendChild(tr)
                            }
                        }
                    }
                }
            }
        },title:"添加社区"}]

    ext_row = function(rows,i){
        return "this is row "+i
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/basis/subdistrict/get"+_e["jurisdiction"]())
    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
    tbl_head.querySelector("#trunit").parentNode.removeChild( tbl_head.querySelector("#trunit"))
    tbl_head.querySelector("#trdept").parentNode.removeChild( tbl_head.querySelector("#trdept"))
}
