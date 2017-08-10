var xhr = new XMLHttpRequest();
xhr.open("GET", "/sc/commodity/getext", true);
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        others = eval('('+xhr.responseText+');')
        others.comclass = []// id 和 姓名  对比  商品tbl里面对应的
        for(var i in others.tree) {
            if (others.tree[i][8]==1){//只需要叶子节点的,商品只在这个种类下面
                others.comclass.push([others.tree[i][1],others.tree[i][2]]);
            }
        }
        others.trname = []// id 和 姓名  对比
        others.trname.push([0,"父节点"])
        for(var i in others.tree) {
            if (others.tree[i][8]==0){//只需要大类,叶子节点不能作为大类
                others.trname.push([others.tree[i][0],others.tree[i][2]]);
            }
        }
        trs=[]
        trs.push([0,"父节点"])
        for(var i in others.tree) {
            trs.push([others.tree[i][0],others.tree[i][2],others.tree[i][7],others.tree[i][8],["data-code",others.tree[i][1]]]);
        }
        loadtree(trs)
        loadtbl()
        t.funcs.loadData.call(t, {
            qseq: 0, //id
            qverb: 'g',// >
            qpt: -1,  //-1
            oseq: 20, //顺序的下标
            odir:"a" //升序降序
        })

        addBarcodeSelect()
        addOtherTree ()
    }
}
function loadtree(treedata){
    var trs=new _e["tree"]()
    var event=[{e:"click",func:function () { //需要绑定的函数，绑定tbl
        t.funcs.loadData.call(t,{    //在table.js中的204行显示
            qseq:12, //数组中下标
            qverb:'e',// = 条件
            qpt:this.getAttribute("data-code"), //值
            oseq: 0, //顺序的下标
            odir:"a" //升序降序
        })
    }, is_leaf:1}]
    trs.init("#trees",treedata,1,"TR",event)    //创建树
}

function loadtbl(){
    coldefs = [{ seq:1,
        render:function(item){return "<b>"+item+"</b>"},
        sortable:true,
        retrievable: true,
        title:"商品名",
        visible:true,
        name:"name",
        type:0,
        data:[]
    },{ seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){ return v},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        visible:true,
        sortable:true,
        retrievable: true,
        title:"流水号",
        name:"id",//和后端对应，FormData里面的key，后端解析时要一致
        type:-1,
        data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列

    }, { seq:23,
        render:function(item){
            if(item.length>3) return "<img src=' http://od35wia0b.bkt.clouddn.com/"+item+"?imageMogr2/thumbnail/80x80!' />"
            return "<b>"+item+"</b>"
        },// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        title:"图片",
        sortable:true,
        retrievable: true,
        visible:true,
        // http://od35wia0b.bkt.clouddn.com/153.jpg?imageMogr2/thumbnail/20x20!
    }, { seq:20,
        title:"编号",
        render:function(item){return "<b>"+item+"</b>"},
        sortable:true,
        retrievable: true,
        visible:true,
    }, { seq:12,
        render:function(item){
            for(var i = 0;i<window["others"].comclass.length;i++){
                if (others.comclass[i][0]==item) return "<b>"+others.comclass[i][1]+item+"</b>"
            }
        },
        title:"商品种类",
        visible:true,
        sortable:true,
        retrievable: true,
        name:"classid",
        type:1,
        data:others.comclass
    }, { seq:22,
        title:"条形码",
        render:function(item){
            var codes=item.split(",")
            var barcode = ''
            for(var i = 0 ;i < codes.length-1;i++){
                barcode+='<i>'+codes[i]+'</i><br>'
            }
            return "<b>"+barcode+"</b>"
        },
        visible:true,
    }, { seq:7,
        render:function(item){return "<b>"+item+"</b>"},
        sortable:true,
        retrievable: true,
        title:"规格",
        visible:true,
        name:"specification",
        type:0,
        data:[]
    }, { seq:11,
        render:function(item){return "<b>"+item+"</b>"
            //return "<input onclick='LoadUnits(this)' type='button' value='"+item+"'>"
        },
        title:"单位",
        visible:true,
    },{ seq:4,
            render:function(item){return "<b>"+(item/100).toFixed(2)+"</b>"},
            sortable:true,
            title:"零售价",
            visible:true,
            name:"price",
            type:0,
            data:[]
        }

    ]

    t = new _e["table"]()
    row_actions =[{cls:"doerow",func:function(tbl,rows){
        if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
        var dlg = _e.dialog({id:"dlgData",width:"800px",
            title:tbl.data[rows][0]+" "+tbl.data[rows][1]+" "+ " 的基本信息修改",
            mainBody:_e["genForm"](coldefs)+'<div style="padding-top: 130px"><div class="form-name">单位</div><input class="form-data" name="unit" type="text"></div><br>'+
            '<p>商品描述：</p><input type="text" name="intro" class=" form-data" placeholder="商品详细描述" style="height: 60px;width: 300px"><br>',
            actions:[{id:"btn",title:"确定",func:function(){
                var data=dlg.querySelectorAll(".form-data")
                var fd = new FormData(), xhr = new XMLHttpRequest()
                for(var i=0;i<data.length;i++){
                    if(i==4){
                        var prices=Number(data[i].value)*100
                        if(isNaN(prices) || prices<0){
                            _e.msgBox({msg:"输入价格必须大于0"})
                            return
                        }
                        fd.append(data[i].name,parseInt(Number(data[i].value)*100))

                    }else{
                        fd.append(data[i].name,_e["stripscript"](data[i].value))
                    }
                }
                xhr.open("POST" ,"/sc/commodity/updatecommodity"+_e["jurisdiction"]() , true)
                xhr.send(fd)
                xhr.onreadystatechange=function()  {
                    if (xhr.readyState==4 && xhr.status==200){
                        var d = eval('('+xhr.responseText+');')
                        _e["msgBox"]({
                            msg: d.msg,
                            className: d.res==-1 ? "error":"success",
                            timeout:3000
                        })
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
        form_data[0].value=tbl["data"][rows][1]
        form_data[1].value=tbl["data"][rows][0]
        form_data[2].value=tbl["data"][rows][12]
        form_data[3].value=tbl["data"][rows][7]
        form_data[4].value=(tbl["data"][rows][4]/100).toFixed(2)
        form_data[5].value=tbl["data"][rows][11]
        form_data[6].value=tbl["data"][rows][3]

    },title:"基本信息"},
        {cls:"doerow",func:function(tbl,rows){
            if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
            var dlg = _e.dialog({id:"dlgData",width:"500px",
                title:tbl.data[rows][0]+" "+tbl.data[rows][1]+" "+"条形码信息修改",
                mainBody:"<table style='width:300px'><thead><tr><th>id</th><th>条形码</th><th>操作</th></thead><tbody id='selectTbody'></tbody></table>"+
                "<button type='button' id='btnNewBarcode' style='margin-top: 16px'>新增</button>",
                actions:[{id:"btn",title:"提交更改",func:function(){
                    //var selectTbody = document.querySelector("#selectTbody")
                    var trs=document.querySelector("#selectTbody").querySelectorAll("tr")
                    var df = new FormData(), xhr1 = new XMLHttpRequest()
                    var checked_tr = []
                    df.append("commodity",tbl["data"][rows][0])
                    for (var i=0;i<trs.length;i++){
                        if(trs[i].children[0].children[0].checked) {
                            if(trs[i].children[1].children[0].value.length == 0){
                                _e["msgBox"]({msg: "长度不能为空!"})
                                return
                            }
                            checked_tr.push(trs[i])
                        }
                    }
                    if(checked_tr.length<1) {
                        _e["msgBox"]({msg: "请选择商品!"})
                        return
                    }
                    for(var i=0; i<checked_tr.length; i++){
                        var tds=checked_tr[i].querySelectorAll("td")
                        df.append("id",_e["stripscript"](tds[0].children[1].getAttribute("data-id")))
                        df.append("code",_e["stripscript"](tds[1].children[0].value))
                    }
                    xhr.open("POST" ,"/sc/commodity/updatebarcode"+_e["jurisdiction"]() , true)
                    xhr.send(df)
                    xhr.onreadystatechange=function()  {
                        if (xhr.readyState==4 && xhr.status==200){
                            var dat = eval('(' +xhr.responseText+ ');')
                            _e["msgBox"]({
                                msg: dat.msg,
                                className: dat.res==-1 ? "error":"success",
                                timeout:3000
                            })
                            if(dat.res==0){
                                dlg.parentNode.removeChild(dlg)
                                t.funcs.loadData.call(t)
                            }
                        }
                    }
                }}]})
            dlg.show()
            _e.bind("#btnNewBarcode","click",newbarcode)
            var selectTbody = document.querySelector("#selectTbody")
            var fd = new FormData(), xhr = new XMLHttpRequest()
            fd.append("commodity",tbl.data[rows][0])
            xhr.open("POST" ,"/sc/commodity/getbarcode" , true)
            xhr.send(fd)
            xhr.onreadystatechange=function()  {
                if (xhr.readyState==4 && xhr.status==200){
                    var barcodes = eval('('+xhr.responseText+');')
                    for (var i =0;i< barcodes.barcode.length;i++){
                        var tr = document.createElement("tr")
                        tr.innerHTML = '<td>'+'<input type="checkbox" class="checkIpt">'+'<span data-id="'+barcodes.barcode[i][0]+'">'+barcodes.barcode[i][0]+'</span>'+'</td>'+
                            '<td><input type="text" value="'+barcodes.barcode[i][1]+'"></td>'+
                            '<td><a href="#" style="color: #0a0a0a"><i class="icon iconfont icon-delete" onclick="deleteBarcode(this)"></i></a></td>'
                        selectTbody.appendChild(tr)
                    }
                }
            }
            function newbarcode(){
                var tr = document.createElement("tr")
                tr.innerHTML = '<td>'+'<input type="checkbox" class="checkIpt">'+'<span data-id="-88">新</span>'+'</td>'+
                    '<td><input type="text" value=""></td>'+
                    '<td><a href="#" style="color: #0a0a0a"><i class="icon iconfont icon-delete" onclick="deleteBarcode(this)"></i></a></td>'
                selectTbody.appendChild(tr)
            }
        },title:"条形码"},
        {cls:"doerow",func:function(tbl,rows){
            if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
            var dlg = _e.dialog({id:"dlgData",width:"500px",
                title:tbl.data[rows][1]+"的图片信息",
                mainBody:'<div id="imgBody" style="padding-bottom: 5px;overflow: hidden;"></div>',
                actions:[{id:"btn",title:"确定",func:function(){
                    dlg.parentNode.removeChild(dlg)
                }},
                    {id:"btn",title:"修改顺序",func:function(){
                        var fd22 = new FormData(),xhr22 = new XMLHttpRequest()
                        var spanImgList = dlg.querySelectorAll(".imgDiv")

                        var has_main_img = 0
                        for (var j=0;j<spanImgList.length;j++){
                            var file_seq=Number(spanImgList[j].children[1].value)
                            if(file_seq==0) has_main_img++
                            if(isNaN(file_seq) || file_seq<0 ){
                                _e.msgBox({msg:"请输入正确的数字"})
                                return
                            }
                        }
                        if(has_main_img==0){
                            _e.msgBox({msg:"有且只能有一张顺序为0的商品主图片"})
                            return
                        }
                        for (var i=0;i<spanImgList.length;i++){
                            fd22.append("filekey",spanImgList[i].getAttribute("data-key"))
                            fd22.append("seq",spanImgList[i].children[1].value)
                        }
                        xhr22.open("POST","/qn/commodityfile/update",true)
                        xhr22.send(fd22)
                        xhr22.onreadystatechange = function(){
                            if(xhr22.readyState == 4 && xhr22.status == 200){
                                var dat = eval('(' +xhr22.responseText+ ');')
                                _e["msgBox"]({
                                    msg: dat.msg,
                                    className: dat.res==-1 ? "error":"success",
                                    timeout:3000
                                })
                                if(dat.res==0){
                                    dlg.parentNode.removeChild(dlg)
                                }
                            }
                        }
                    }}]})
            dlg.show()
            var myDate = new Date()//用作随机数刷新七牛缓存
            var fd = new FormData(),xhr = new XMLHttpRequest()
            fd.append("commodityid",tbl.data[rows][0])
            xhr.open("POST","/qn/showimage",true)
            xhr.send(fd)
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4 && xhr.status == 200){
                    var dateIm = eval('('+xhr.responseText+');')
                    var dateImg = dateIm.keys

                    dlg.querySelector(".main").style.paddingLeft = "27%"
                    dlg.querySelector(".main").style.paddingTop = "20px"

                    var imgBody = document.querySelector("#imgBody")
                    var batchM = document.createElement("button")     //创建批量删除
                    batchM.setAttribute("id","batchMange")
                    batchM.innerHTML = "批量删除"
                    batchM.onclick = batch   //为批量删除绑定事件
                    imgBody.parentElement.insertBefore(batchM,imgBody)

                    var batchT = document.createElement("button")
                    batchT.setAttribute("id","batch")
                    batchT.innerHTML = "确定"
                    batchT.onclick = deleteImg
                    batchT.style.display = "none"
                    imgBody.parentElement.appendChild(batchT)

                    var addInput = document.createElement("input")     //创建上传图片的input
                    addInput.setAttribute("type","file")
                    addInput.setAttribute("id","file")
                    addInput.setAttribute("multiple","multiple")
                    imgBody.parentElement.appendChild(addInput)
                    var addButton = document.createElement("button")    //创建上传图片的确定键
                    addButton.setAttribute("id","upload")
                    addButton.innerHTML = "上传"
                    imgBody.parentElement.appendChild(addButton)

                    for(var i=0; i<dateImg.length; i++){
                        var spanImg = document.createElement("li")
                        spanImg.setAttribute("class","imgDiv")
                        spanImg.setAttribute("data-key",dateImg[i][0])
                        spanImg.setAttribute("style","float:left;list-style-type:none;padding-top:10px;padding-bottom:5px;width:100px;")
                        spanImg.style.paddingLeft = "10px"
                        var Img = document.createElement("img")
                    //    Img.setAttribute("src"," http://od35wia0b.bkt.clouddn.com/"+dateImg[i]+"?imageMogr2/thumbnail/120x80!&v="+myDate.getMilliseconds())

                        Img.setAttribute("src"," http://od35wia0b.bkt.clouddn.com/"+dateImg[i][0]+"?imageMogr2/thumbnail/120x80!")
                        spanImg.appendChild(Img)
                        spanImg.innerHTML+='<input type="text" class="seqInput" value="'+dateImg[i][1]+'" style="width: 20px;margin-left:40px"/>'
                        imgBody.appendChild(spanImg)
                    }
                    if(document.querySelector("#imgBody").childNodes.length > 4){
                        dlg.querySelector(".main").style.overflow = "auto"
                        dlg.querySelector(".main").style.height = "300px"
                    }

                    function batch(){
                        imgBatch(imgBody.querySelectorAll("img"),imgBody.querySelector(".imgDiv").childNodes.length,document.querySelector("#batch"),imgBody.querySelectorAll(".imgDiv"))
                    }
                    function deleteImg(){
                        imgDelete(imgBody.querySelectorAll(".imgDiv"),document.getElementsByName("check"),dateImg,tbl.data[rows][0])
                    }
                    document.querySelector("#upload").onclick = function(){
                        var domimg=document.querySelector("#imgBody")
                        var files= document.querySelector("#file").files
                        if(files.length == 0){
                            alert("上传图片为空!")
                        }else{
                            _e.upload(files,upcb,domimg,tbl.data[rows][0])
                        }
                    }
                }
            }
        },title:"图片管理"},
        {cls:"doerow",func:function(tbl,rows){
            window.location.href = "/m/sc/editor/index.html?commodity_id=" + tbl["data"][rows][0]
        },title:"商品详情"},
        /*{cls:"doerow",func:function(tbl,rows){
            if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
            var dlg = _e.dialog({id:"dlgData",width:"500px",
                title:tbl.data[rows][0]+" "+tbl.data[rows][1]+" "+"有关商品",
                mainBody: '<table class="pure-table pure-table-bordered"> ' +
                '<thead> <tr> ' +
                '<th>流水号</th> ' +
                '<th>品名</th> ' +
                '<th>规格</th> ' +
                '<th>单位</th> ' +
                '<th>种类</th> ' +
                '<th>价格</th> ' +
                '<th>流水号</th> ' +
                '<th>关系</th> ' +
                '</tr> </thead> <tbody id="allComsList"></tbody></table>',
                actions:[{id:"btn",title:"删除",func:function(){
                    var df = new FormData(), xhr1 = new XMLHttpRequest()
                    df.append("id",tbl["data"][rows][0])
                    xhr.open("POST" ,"/sc/commodity/deleteAllCmbyCom"+_e["jurisdiction"]() , true)
                    xhr.send(df)
                    xhr.onreadystatechange=function()  {
                        if (xhr.readyState==4 && xhr.status==200){
                            var dat = eval('(' +xhr.responseText+ ');')
                            _e["msgBox"]({
                                msg: dat.msg,
                                className: dat.res==-1 ? "error":"success",
                                timeout:3000
                            })
                            if(dat.res==0){
                                dlg.parentNode.removeChild(dlg)
                                t.funcs.loadData.call(t)
                            }
                        }
                    }
                }}]})
            var fd = new FormData(), xhr = new XMLHttpRequest()
            fd.append("id",tbl.data[rows][0])
            xhr.open("POST" ,"/sc/commodity/getAllCmbyCom",true)
            xhr.send(fd)
            xhr.onreadystatechange=function(){
                if (xhr.readyState==4 && xhr.status==200){
                    var dat = eval('(' +xhr.responseText+ ');')
                    if(dat.res==-1){
                        _e["msgBox"]({msg: dat.msg})
                        return
                    }
                    var allComsList=dlg.querySelector("#allComsList")
                    for ( var i=0;i<dat.commodityUnits.length;i++){
                        var tr =document.createElement("tr")
                        tr.innerHTML='<td>'+dat.commodityUnits[i][0]+'</td>' +
                            '<td>'+dat.commodityUnits[i][1]+'</td>' +
                            '<td>'+dat.commodityUnits[i][2]+'</td>' +
                            '<td>'+dat.commodityUnits[i][3]+'</td>' +
                            '<td>'+dat.commodityUnits[i][4]+'</td>' +
                            '<td>'+(dat.commodityUnits[i][5]/100).toFixed(2)+'</td>' +
                            '<td>'+dat.commodityUnits[i][6]+'</td>' +
                            '<td>'+_e.unit[dat.commodityUnits[i][7]]+'</td>'
                        allComsList.appendChild(tr)
                    }

                    for ( var i=0;i<dat.otherrelcm.length;i++){
                        var tr =document.createElement("tr")
                        tr.innerHTML='<td>'+dat.otherrelcm[i][0]+'</td>' +
                            '<td>'+dat.otherrelcm[i][1]+'</td>' +
                            '<td>'+dat.otherrelcm[i][2]+'</td>' +
                            '<td>'+dat.otherrelcm[i][3]+'</td>' +
                            '<td>'+dat.otherrelcm[i][4]+'</td>' +
                            '<td>'+(dat.otherrelcm[i][5]/100).toFixed(2)+'</td>' +
                            '<td>'+dat.otherrelcm[i][6]+'</td>'
                        if(dat.otherrelcm[i][7]==4){
                            tr.innerHTML+='<td>赠品</td>'
                        }else  if(dat.otherrelcm[i][7]==5){
                            tr.innerHTML+='<td>组合商品</td>'
                        }else  if(dat.otherrelcm[i][7]==6){
                            tr.innerHTML+='<td>特价</td>'
                        }else  if(dat.otherrelcm[i][7]==7){
                            tr.innerHTML+='<td>另一种规格</td>'
                        }
                        allComsList.appendChild(tr)
                    }

                    dlg.show()
                }
            }
        },title:"删除商品"},*/
        {cls:"doerow",func:function(tbl,rows){
            if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
            var dlg = _e.dialog({id:"dlgData",width:"800px",
                title:tbl.data[rows][0]+" "+tbl.data[rows][1]+" "+"有关商品",
                mainBody: '<table class="pure-table pure-table-bordered"> ' +
                '<thead> <tr> ' +
                '<th>流水号</th> ' +
                '<th>品名</th> ' +
                '<th>规格</th> ' +
                '<th>单位</th> ' +
                '<th>种类</th> ' +
                '<th>价格</th> ' +
                '<th>流水号</th> ' +
                '<th>关系</th> ' +
                '<th>操作</th> ' +
                '</tr> </thead> <tbody id="allComsList"></tbody></table>'+
                '<br><select id="unitSelect"><option value="1">'+_e["unit"][1]+'：</option><option value="2">'+_e["unit"][2]+'：</option><option value="3">'+_e["unit"][3]+'：</option><option value="4">'+_e["unit"][4]+'：</option></select><p><input id="addOtherUnit" type="button" value="添加其他单位"/></p><div id="units">' + '</div>'+
                '<button class="pure-button pure-button-primary" id="subNewUnit">新增单位</button>',
                actions:[{id:"btn",title:"关闭",func:function(){
                    dlg.parentNode.removeChild(dlg)
                }}]})
            var fd = new FormData(), xhr = new XMLHttpRequest()
            fd.append("id",tbl.data[rows][0])
            xhr.open("POST" ,"/sc/commodity/getAllCmbyCom",true)
            xhr.send(fd)
            xhr.onreadystatechange=function(){
                if (xhr.readyState==4 && xhr.status==200){
                    var dat = eval('(' +xhr.responseText+ ');')
                    if(dat.res==-1){
                        _e["msgBox"]({msg: dat.msg})
                        return
                    }
                    var allComsList=dlg.querySelector("#allComsList")
                    for ( var i=0;i<dat.commodityUnits.length;i++){
                        var tr =document.createElement("tr")
                        tr.innerHTML='<td>'+dat.commodityUnits[i][0]+'</td>' +
                            '<td>'+dat.commodityUnits[i][1]+'</td>' +
                            '<td>'+dat.commodityUnits[i][2]+'</td>' +
                            '<td>'+dat.commodityUnits[i][3]+'</td>' +
                            '<td>'+dat.commodityUnits[i][4]+'</td>' +
                            '<td>'+(dat.commodityUnits[i][5]/100).toFixed(2)+'</td>' +
                            '<td>'+dat.commodityUnits[i][6]+'</td>' +
                            '<td>'+_e.unit[dat.commodityUnits[i][7]]+'</td>'+
                            '<td><i class="icon iconfont delete deleteunit">&#xe617;</i></td>'
                        allComsList.appendChild(tr)
                    }
                    _e.bindAll(".deleteunit","click",deleteUnit,dlg)
                    function deleteUnit(){
                        var dlttr=this.parentNode.parentNode
                        if (confirm("确定要删除吗？")) {
                            var df2 = new FormData,xhr2 = new XMLHttpRequest()
                            df2.append("id",dlttr.children[0].innerHTML)
                            xhr2.open("POST","/sc/commodity/deletebyComId"+_e["jurisdiction"](),true)
                            xhr2.send(df2)
                            xhr2.onreadystatechange = function(){
                                if(xhr2.readyState == 4 && xhr2.status == 200){
                                    var dat = eval('(' +xhr2.responseText+ ');')
                                    _e["msgBox"]({
                                        msg: dat.msg,
                                        className: dat.res==-1 ? "error":"success",
                                        timeout:3000
                                    })
                                    if(dat.res==0){
                                        dlttr.parentNode.removeChild(dlttr)
                                    }
                                }
                            }
                        }
                    }
                    dlg.show()
                }
            }
            _e.bind("#addOtherUnit","click",addOtherUnit,dlg)
            _e.bind("#subNewUnit","click",subNewUnit,dlg)
            function subNewUnit(){
                var fd = new FormData(), xhr1 = new XMLHttpRequest()
                fd.append("id",tbl["data"][rows][0])
                var units =  dlg.querySelectorAll(".cls_unit")
                if(units.length<1){
                    _e.msgBox({msg:"请添加单位后再提交"})
                    return
                }
                var specifications =  dlg.querySelectorAll(".cls_specification")
                var prices =  dlg.querySelectorAll(".cls_price")
                var barcodes =  dlg.querySelectorAll(".cls_barcode")
                for (var s1=0;s1<units.length;s1++){
                    if(units[s1].value.length<1 || units[s1].value.length>4) {
                        _e.msgBox({msg:"单位不能过短或过长"})
                        return
                    }
                    if(specifications[s1].value.length<1) {
                        _e.msgBox({msg:"请填写规格"})
                        return
                    }
                    var  input_price = Number(prices[s1].value)*100
                    if ( input_price<=0 || isNaN(input_price)){
                        _e.msgBox({msg:"价格必须大于0"})
                        return
                    }
                    fd.append("extunit",_e["stripscript"](units[s1].value))
                    fd.append("extunitismainunit",_e["stripscript"](units[s1].getAttribute("data-id")))
                    fd.append("extprice",input_price)
                    fd.append("extspecification",_e["stripscript"](specifications[s1].value))
                    if(barcodes[s1].value.length<1) fd.append("extbarcode","-1")
                    else fd.append("extbarcode",_e["stripscript"](barcodes[s1].value))
                }
                 xhr.open("POST" ,"/sc/commodity/addCommodityUnit"+_e["jurisdiction"]() , true)
                 xhr.send(fd)
                 xhr.onreadystatechange=function()  {
                     if (xhr.readyState==4 && xhr.status==200){
                         var dat = eval('(' +xhr.responseText+ ');')
                         _e["msgBox"]({
                             msg: dat.msg,
                             className: dat.res==-1 ? "error":"success",
                             timeout:3000
                         })
                         if(dat.res==0){
                             dlg.parentNode.removeChild(dlg)
                             t.funcs.loadData.call(t)
                         }
                     }
                 }
            }
            function addOtherUnit(){
                var unitDiv = dlg.querySelector("#units")
                var unitSelect = dlg.querySelector("#unitSelect")
                var unit_index=Number(unitSelect.value)
                var unit_span=document.createElement("span")
                var delet_i=document.createElement("i")
                unit_span.innerHTML='<br><i>'+_e["unit"][unit_index]+'：</i><input type="text" value="" class="cls_unit" placeholder="" data-id="'+unit_index+'" style="width: 50px;">'+
                    '<i>规格：</i><input type="text" value="" class="cls_specification" placeholder="" style="width: 50px;">' +
                    '<i>零售价：</i><input type="text" value="" class="cls_price" placeholder="" style="width: 50px;">' +
                    '<i>条形码：</i><input type="text" value="" class="cls_barcode" placeholder="" >'
                delet_i.setAttribute("class","icon iconfont delete deleterel")
                delet_i.innerHTML='&#xe617;'
                delet_i.onclick=function(){
                    var delete_tr=this.parentNode
                    delete_tr.parentNode.removeChild(delete_tr)
                }
                unit_span.appendChild(delet_i)
                unitDiv.appendChild(unit_span)

                unitSelect.selectedIndex=(unit_index++)%4
            }
        },title:"单位管理"}
    ]
    function imgBatch(e1,e2,e3,e4) {
        if(e2 == 1){
            e3.style.display = "block"
            for (var i = 0; i < e1.length; i++) {
                if (e1[i].parentNode.children.length < 2) {
                    var imgInput = document.createElement("input")
                    imgInput.setAttribute("type", "checkbox")
                    imgInput.setAttribute("name","check")
                    imgInput.setAttribute("value",i)
                    e4[i].appendChild(imgInput)
                }
            }
        }else{
            e3.style.display = "none"
            for (var j = 0; j < e1.length; j++) {
                if(e4[j].childNodes[1]){
                    e4[j].removeChild(e4[j].childNodes[1])
                }
            }
        }
    }

    function imgDelete(e1,e2,e3,e4){
        var arrImg = new Array()
        for(var i=0; i<e2.length; i++){
            if(e2[i].checked){
                arrImg.push(e3[i][0])
                e1[i].style.display = "none"
            }
        }
        var formD = new FormData(),xhR = new XMLHttpRequest()
        formD.append("commodityid",e4)
        for(var j=0; j<arrImg.length; j++){
            formD.append("filekey",arrImg[j])
        }
        xhR.open("POST","/qn/deletemany",true)
        xhR.send(formD)
        xhR.onreadystatechange = function(){
            if(xhR.readyState == 4 && xhR.status == 200){
                var dat = eval('(' +xhR.responseText+ ');')
                _e["msgBox"]({
                    msg: dat.msg,
                    className: dat.res==-1 ? "error":"success",
                    timeout:3000
                })
                if(dat.res!=-1){
                    t.funcs.loadData.call(t)
                }
            }
        }
    }

    function upcb(){
        var args=arguments[0]
        console.log(args)
        var myDate = new Date()//随机数 用来更新七牛的缓存
        var xml =new XMLHttpRequest(),fd = new FormData
        for(var j=0;j<args[0].length;j++){
            fd.append("filekey",args[0][j])
        }
        fd.append("commodityid",args[3])
        xml.open("POST","/qn/insertmanyfile",true)
        xml.send(fd)
        xml.onreadystatechange=function(){
            if(xml.readyState == 4 && xml.status == 200){
                var dat = eval('(' +xml.responseText+ ');')
                _e["msgBox"]({
                    msg: dat.msg,
                    className: dat.res==-1 ? "error":"success",
                    timeout:3000
                })
                if(dat.res!=-1){
                    t.funcs.loadData.call(t)
                }
            }
        }
        for(var i=0;i<args[0].length;i++){
            var spanImg = document.createElement("li")
            spanImg.setAttribute("class","imgDiv")
            spanImg.setAttribute("style","float:left;list-style-type:none;padding-top:10px;padding-bottom:5px;")
            var Img = document.createElement("img")
            spanImg.style.paddingLeft = "10px"
          //  Img.setAttribute("src"," http://od35wia0b.bkt.clouddn.com/"+args[0][i]+"?imageMogr2/thumbnail/120x80!&v="+myDate.getMilliseconds())
            Img.setAttribute("src"," http://od35wia0b.bkt.clouddn.com/"+args[0][i]+"?imageMogr2/thumbnail/120x80!")
            spanImg.appendChild(Img)
            args[2].appendChild(spanImg)
        }
    }
    rows_actions = [{
        func:function(tbl,rows){
          var addcoles = [{
              title:"商品名",
              name:"name",
              type:0,
              data:[]
          },{
              title:"商品种类",
              name:"classid",
              type:1,
              data:others.comclass
          }]
            if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
            var dlg = _e.dialog({id:"dlgData",width:"800px",
                title:"添加商品",
                mainBody:_e["genForm"](addcoles)+
                '<div id="units" style="padding-top: 50px" ">' + '</div>'+
                '<br><select id="unitSelect"><option value="1">'+_e["unit"][1]+'：</option><option value="2">'+_e["unit"][2]+'：</option><option value="3">'+_e["unit"][3]+'：</option><option value="4">'+_e["unit"][4]+'：</option></select><p><input id="addOtherUnit" type="button" value="添加其他单位"/></p>'+
                '<p>商品描述:</p><input type="text" value="" id="input_intro" name="intro" placeholder="商品描述" style="height: 60px;width: 300px"><br>',
                actions:[{id:"btn",title:"确定",func:function(){
                    var data=dlg.querySelectorAll(".form-data")
                    var fd = new FormData(), xhr = new XMLHttpRequest()

                        var value=_e["stripscript"](data[0].value)
                        if (value.length<1){
                            _e.msgBox({msg:"请填写完整的信息"})
                            return
                        }
                    fd.append(data[0].name,value)
                    fd.append(data[1].name,data[1].value)

                    var units =  dlg.querySelectorAll(".cls_unit")
                    var specifications =  dlg.querySelectorAll(".cls_specification")
                    var prices =  dlg.querySelectorAll(".cls_price")
                    var barcodes =  dlg.querySelectorAll(".cls_barcode")
                    for (var s1=0;s1<units.length;s1++){
                        if(units[s1].value.length<1 || units[s1].value.length>4) {
                            _e.msgBox({msg:"单位不能过短或过长"})
                            return
                        }
                        if(specifications[s1].value.length<1) {
                            _e.msgBox({msg:"请填写规格"})
                            return
                        }
                        var  input_price = Number(prices[s1].value)*100
                        if ( input_price<=0 || isNaN(input_price)){
                            _e.msgBox({msg:"价格必须大于0"})
                            return
                        }
                        fd.append("extunit",_e["stripscript"](units[s1].value))
                        fd.append("extunitismainunit",_e["stripscript"](units[s1].getAttribute("data-id")))
                        fd.append("extprice",input_price)
                        fd.append("extspecification",_e["stripscript"](specifications[s1].value))
                        if(barcodes[s1].value.length<1) fd.append("extbarcode","-1")
                        else fd.append("extbarcode",_e["stripscript"](barcodes[s1].value))
                    }
                    fd.append("intro",_e["stripscript"](dlg.querySelector("#input_intro").value))
                    xhr.open("POST" ,"/sc/commodity/insert"+_e["jurisdiction"](),true)
                    xhr.send(fd)
                    xhr.onreadystatechange=function(){
                        if (xhr.readyState==4 && xhr.status==200){
                            var dat = eval('(' +xhr.responseText+ ');')
                            _e["msgBox"]({
                                msg: dat.msg,
                                className: dat.res==-1 ? "error":"success",
                                timeout:3000
                            })
                            if(dat.res==0){
                                dlg.parentNode.removeChild(dlg)
                                t.funcs.loadData.call(t)
                            }
                        }
                    }
                }}]})
            dlg.show()
            _e.bind("#addOtherUnit","click",addOtherUnit,dlg)
            function addOtherUnit(){
                var unitDiv = dlg.querySelector("#units")
                var unitSelect = dlg.querySelector("#unitSelect")
                var unit_index=Number(unitSelect.value)
                var unit_span=document.createElement("span")
                var delet_i=document.createElement("i")
                unit_span.innerHTML='<br><i>'+_e["unit"][unit_index]+'：</i><input type="text" value="" class="cls_unit" placeholder="" data-id="'+unit_index+'" style="width: 50px;">'+
                    '<i>规格：</i><input type="text" value="" class="cls_specification" placeholder="" style="width: 50px;">' +
                    '<i>零售价：</i><input type="text" value="" class="cls_price" placeholder="" style="width: 50px;">' +
                    '<i>条形码：</i><input type="text" value="" class="cls_barcode" placeholder="" >'
                delet_i.setAttribute("class","icon iconfont delete deleterel")
                delet_i.innerHTML='&#xe617;'
               delet_i.onclick=function(){
                   var delete_tr=this.parentNode
                   delete_tr.parentNode.removeChild(delete_tr)
               }
                unit_span.appendChild(delet_i)
                unitDiv.appendChild(unit_span)

                unitSelect.selectedIndex=(unit_index++)%4
            }
        },title:"添加商品"}]
    ext_row = function(rows,i){
        return "this is row "+i
    }
    after_Load = function(tbl,tblDom){
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/commodity/getcommoditys",after_Load)
    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
    tbl_head.querySelector("#trdept").parentNode.removeChild( tbl_head.querySelector("#trdept"))
}


function deleteBarcode(btn){
    var tr= btn.parentNode.parentNode.parentNode
    var id=Number(tr.children[0].children[1].getAttribute("data-id"))
    if( id == -88){
        tr.parentNode.removeChild(tr)
    }else{
        var fd = new FormData(), xhr = new XMLHttpRequest()
        fd.append("id",id)
        xhr.open("POST" ,"/sc/commodity/deletebarcode"+_e["jurisdiction"](),true)
        xhr.send(fd)
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4 && xhr.status==200){
                var dat = eval('(' +xhr.responseText+ ');')
                _e["msgBox"]({
                    msg: dat.msg,
                    className: dat.res==-1 ? "error":"success",
                    timeout:3000
                })
                if(dat.res==0){
                    tr.parentNode.removeChild(tr)
                }
            }
        }
    }
}


function addBarcodeSelect(){
  var thead_td=document.querySelector("#tbl").querySelector("#btnResetQc").parentNode
  var inputs = document.createElement("input")
  var buttons = document.createElement("button")
  inputs.setAttribute("type","text")
  inputs.setAttribute("id","SltBarcode")
  inputs.setAttribute("placeholder","条形码")
  buttons.innerHTML="查询"
  buttons.id="btnBarcode"
  thead_td.appendChild(inputs)
  thead_td.appendChild(buttons)
  _e.bind("#btnBarcode","click",loadBarcode,thead_td)
  _e.bind("#SltBarcode","change",loadBarcode,thead_td)
  function loadBarcode(){
    var code = document.querySelector("#tbl").querySelector("#SltBarcode").value
    var  xhr = new XMLHttpRequest()
    var url = "/sc/stock/getStockIdByCode?code="+code
    xhr.open("POST" , url, true)
    xhr.send()
    xhr.onreadystatechange=function()  {
        if (xhr.readyState==4 && xhr.status==200){
            var dat = eval('(' +xhr.responseText+ ');')
            if(dat.res==-1){
              _e["msgBox"]({msg: dat.msg})
              return
            }
            t.funcs.loadData.call(t, {
                qseq: 0, //id
                qverb: 'e',// =
                qpt: dat.commodity,  //-1
                oseq: 20, //顺序的下标
                odir:"a" //升序降序
            })

        }
    }

  }
}


function addOtherTree (){
  var tree=document.querySelector("#trees")
  var ul = document.createElement("ul")
  ul.setAttribute("id","other_tree")
  ul.innerHTML=
  '<li data-id="9" class="other task" onclick="taskAll(this)">特价</li>'+
  '<li data-id="4" class="other task" onclick="taskAll(this)">组合套餐</li>'
  //tree.parentNode.insertBefore(div,tree)
  tree.insertBefore(ul,tree.children[0])
  _e.bindAll(".other","click",loadOther,tree.parentNode)
  function loadOther(){
        t.funcs.loadData.call(t, {
            qseq: 9, //id
            qverb: 'e',// =
            qpt: this.getAttribute("data-id"),  //-1
            oseq: 16, //顺序的下标
            odir:"a" //升序降序
        })
    }
}
