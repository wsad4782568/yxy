function commodityType(){     //商品类别的区分，因为数据库没有这个东西，所以在前段定死了
    var commodityType = [
        [1,"通用"],
        [2,"团购"],
        [3,"单品团购"],
        [4,"单品团购和普通购买"],
        [5,"组合商品团购"],
        [6,"组合商品团购和普通购买"],
        [7,"预购"],
        [8,"代购"]
    ]
    var commodityTypeAll = ''
    for(var j = 0;j < commodityType.length;j++){
        commodityTypeAll += "<option typeId='"+commodityType[j][0]+"'>"+commodityType[j][1]+"</option>"
    }
    return commodityTypeAll
}

loadDate({
    data:"",
    method:"get",
    url:"/sc/module/getmodule",
    async:true,
    callback:function(d){
        var classification = document.querySelector("#classification")
        for(var i = 0;i < d.module.length;i++){
            classification.innerHTML +=  "<option classId='"+d.module[i][0]+"' classMemo='"+d.module[i][2]+"' classFlag='"+d.module[i][3]+"'>"+d.module[i][1]+"</option>"
        }
    }
})

loadDate({
    data:"",
    method:"get",
    url:"/sc/commodity/getext"+_e.jurisdiction(),
    async:true,
    callback:function(others){
        trs=[]
        trs.push([0,"父节点"])
        for(var i in others.tree) {
            trs.push([others.tree[i][0],others.tree[i][2],others.tree[i][7],others.tree[i][8],["data-code",others.tree[i][1]]]);
        }
        loadtree(trs)
        loadtbl(others)
        t.funcs.loadData.call(t)
    }
})
function loadtree(treedata){
    var trs=new _e["tree"]()
    var event=[{e:"click",func:function () { //需要绑定的函数，绑定tbl
        t.funcs.loadData.call(t,{    //在table.js中的204行显示
            qseq:12, //数组中下标
            qverb:'k',// like '% %' 条件
            qpt:this.getAttribute("data-code") //值
        })
    }, is_leaf:1}]
    trs.init("#trees",treedata,1,"TR",event)    //创建树
}

function loadtbl(others){
    coldefs = [{
        seq: 0, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "商品id", // 列标题
        visible: true, //是否可见
        checkall: false, // 是否可全选
        isID: 1,
        name: "id", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 1, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "商品名", // 列标题
        visible: true, //是否可见
        name: "name", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 4, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item/100 + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "单价", // 列标题
        visible: true, //是否可见
        name: "price", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 7, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>"+item+"</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "规格", // 列标题
        visible: true, //是否可见
        name: "specifation", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 12,
        render: function(item) {
            for(var i =0;i<others.tree.length;i++){
                if(others.tree[i][1]==item){
                    return "<b>" + others.tree[i][2] + "</b>"
                }
            }
            return "<b>"+item+"</b>"
        },
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "商品种类", // 列标题
        visible: true, //是否可见
    }]

    t = new _e["table"]()
    row_actions =[
        {cls:"doerow",func:function(tbl,rows){
            var comName = document.querySelector(".comName")
            comName.setAttribute("comid",tbl.data[rows][0])
            comName.innerHTML = tbl.data[rows][1]
            comName.setAttribute("class","commodityName")
        },title:"添加"}
    ]

    rows_actions = []

    ext_row = function(rows,i){
        return "this is " + i
    }

    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/module/getcommodity"+_e.jurisdiction())
}

function flagType(e){     //flag多一
    var eParent = e.parentNode.parentNode
    if(e.value == "单品"){
        eParent.children[0].children[0].style.display = "none"
        eParent.children[5].children[0].style.display = "block"
    }
    if(e.value == "种类"){
        eParent.children[5].children[0].style.display = "none"
        eParent.children[0].children[0].style.display = "block"
    }
}

function comType(e){    //找到商品类别
    var commodityType = [
        [1,"通用"],
        [2,"团购"],
        [3,"单品团购"],
        [4,"单品团购和普通购买"],
        [5,"组合商品团购"],
        [6,"组合商品团购和普通购买"],
        [7,"预购"],
        [8,"代购"]
    ]
    for(var i = 0;i < commodityType.length;i++){
        if(e == commodityType[i][0]){
            return commodityType[i][1]
        }
    }
}

function comFlag(e){    //找到商品类别
    var comFlag = [
        [1,"单品"],
        [2,"种类"],
    ]
    for(var i = 0;i < comFlag.length;i++){
        if(e == comFlag[i][0]){
            return comFlag[i][1]
        }
    }
    return
}

var data1 = {}   //进来默认为广告类
data1.id = 1
loadDate({     //返回所有商品种类，并把它列在第一列
    data:data1,
    method:"POST",
    url:"/sc/module/getmoduleitem",
    async:true,
    callback:function(d){
        // console.log(d)
        var commodityTbody = document.querySelector("#commodityTbody")
        commodityTbody.innerHTML = ""
        for(var j = 0;j < d.moduleclass.length;j++){
            var comTr = document.createElement("tr")
            comTr.innerHTML += "<td style='width: 120px;' ificationid='"+d.moduleclass[j][8]+"'>"+d.moduleclass[j][7]+"</td>"+
                "<td style='width: 60px;'>"+comType(d.moduleclass[j][2])+"</td>"+
                "<td style='width: 60px;'><input type='number' class='seq' markId='"+d.moduleclass[j][6]+"' style='width: 60px;' value='"+d.moduleclass[j][0]+"'/></td>"+
                "<td style='width: 60px;'>"+comFlag(d.moduleclass[j][4])+"</td>"+
                "<td style='width: 60px;'><input input type='text' class='commodityMemo' width='100px;' value='"+d.moduleclass[j][1]+"'/></td>"+
                "<td style='width: 120px;' comid='"+d.moduleclass[j][9]+"'>"+d.moduleclass[j][3]+"</td>"+
                "<td><input class='commodityImg' type='button' value='图片' srcImg='"+d.moduleclass[j][5]+"' style='width:60px' onclick='srcImg(this)'/></td>"+
                '<td style="width:60px"><a href="#" style="color: #0a0a0a;text-decoration:none;"><i class="icon iconfont icon-circle"  onclick="deleteImg(this)"></i></a></td></tr>'
            commodityTbody.appendChild(comTr)
        }
    }
})

function change_show_imageType(e){       //改变大类触发事件，改变大类了里面的值
    var classification = document.querySelector("#classification")
    var commodityTbody = document.querySelector("#commodityTbody")
    for(var i = 0;i < classification.children.length;i++){
        if(classification.value == classification.children[i].innerHTML){  //获得大类值
            var classid = classification.children[i].getAttribute("classid")
            if(Number(classid) == 1 || Number(classid) == 4 || Number(classid) == 5){  //广告，代购，预购
                var data = {}
                data.id = Number(classid)
                loadDate({     //返回所有商品种类，并把它列在第一列
                    data:data,
                    method:"POST",
                    url:"/sc/module/getmoduleitem",
                    async:true,
                    callback:function(d){
                        console.log(d)
                        commodityTbody.innerHTML = ""
                        for(var j = 0;j < d.moduleclass.length;j++){
                            var comTr = document.createElement("tr")
                            comTr.innerHTML += "<td style='width: 120px;' ificationid='"+d.moduleclass[j][8]+"'>"+d.moduleclass[j][7]+"</td>"+
                                "<td style='width: 60px;'>"+comType(d.moduleclass[j][2])+"</td>"+
                                "<td style='width: 60px;'><input type='number' class='seq' markId='"+d.moduleclass[j][6]+"' style='width: 60px;' value='"+d.moduleclass[j][0]+"'/></td>"+
                                "<td style='width: 60px;'>"+comFlag(d.moduleclass[j][4])+"</td>"+
                                "<td style='width: 60px;'><input input type='text' class='commodityMemo' width='100px;' value='"+d.moduleclass[j][1]+"'/></td>"+
                                "<td style='width: 120px;' comid='"+d.moduleclass[j][9]+"'>"+d.moduleclass[j][3]+"</td>"+
                                "<td><input class='commodityImg' type='button' value='图片' srcImg='"+d.moduleclass[j][5]+"' style='width:60px' onclick='srcImg(this)'/></td>"+
                                '<td style="width:60px"><a href="#" style="color: #0a0a0a;text-decoration:none;"><i class="icon iconfont icon-circle"  onclick="deleteImg(this)"></i></a></td></tr>'
                            commodityTbody.appendChild(comTr)
                        }
                    }
                })
            }

            if(Number(classid) == 2){  //品类推荐
                var data1 = {}
                data1.id = Number(classid)
                loadDate({     //返回所有商品种类，并把它列在第一列
                    data:data1,
                    method:"POST",
                    url:"/sc/module/getmoduleitem",
                    async:true,
                    callback:function(d){
                        // console.log(d)
                        commodityTbody.innerHTML = ""
                        for(var j = 0;j < d.moduleclass.length;j++){
                            var comTr = document.createElement("tr")
                            comTr.innerHTML += "<td style='width: 120px;' ificationid='"+d.moduleclass[j][8]+"'>"+d.moduleclass[j][7]+"</td>"+
                                "<td style='width: 60px;'>"+comType(d.moduleclass[j][2])+"</td>"+
                                "<td style='width: 60px;'><input type='number' class='seq' markId='"+d.moduleclass[j][6]+"' style='width: 60px;' value='"+d.moduleclass[j][0]+"'/></td>"+
                                "<td style='width: 60px;'>"+comFlag(d.moduleclass[j][4])+"</td>"+
                                "<td style='width: 60px;'><input input type='text' class='commodityMemo' width='100px;' value='"+d.moduleclass[j][1]+"'/></td>"+
                                "<td style='width: 120px;' comid='"+d.moduleclass[j][9]+"'>"+d.moduleclass[j][3]+"</td>"+
                                "<td><input class='commodityImg' type='button' value='图片' srcImg='"+d.moduleclass[j][5]+"' style='width:60px' onclick='srcImg(this)'/></td>"+
                                '<td style="width:60px"><a href="#" style="color: #0a0a0a;text-decoration:none;"><i class="icon iconfont icon-circle"  onclick="deleteImg(this)"></i></a></td></tr>'
                            commodityTbody.appendChild(comTr)
                        }
                    }
                })
            }

            if(Number(classid) == 3){  //单品推荐
                var data2 = {}
                data2.id = Number(classid)
                loadDate({     //返回所有商品种类，并把它列在第一列
                    data:data2,
                    method:"POST",
                    url:"/sc/module/getmoduleitem",
                    async:true,
                    callback:function(d){
                        // console.log(d)
                        commodityTbody.innerHTML = ""
                        for(var j = 0;j < d.moduleclass.length;j++){
                            var comTr = document.createElement("tr")
                            comTr.innerHTML += "<td style='width: 120px;' ificationid='"+d.moduleclass[j][8]+"'>"+d.moduleclass[j][7]+"</td>"+
                                "<td style='width: 60px;'>"+comType(d.moduleclass[j][2])+"</td>"+
                                "<td style='width: 60px;'><input type='number' class='seq' markId='"+d.moduleclass[j][6]+"' style='width: 60px;' value='"+d.moduleclass[j][0]+"'/></td>"+
                                "<td style='width: 60px;'>"+comFlag(d.moduleclass[j][4])+"</td>"+
                                "<td style='width: 60px;'><input input type='text' class='commodityMemo' width='100px;' value='"+d.moduleclass[j][1]+"'/></td>"+
                                "<td style='width: 120px;' comid='"+d.moduleclass[j][9]+"'>"+d.moduleclass[j][3]+"</td>"+
                                "<td><input class='commodityImg' type='button' value='图片' srcImg='"+d.moduleclass[j][5]+"' style='width:60px' onclick='srcImg(this)'/></td>"+
                                '<td style="width:60px"><a href="#" style="color: #0a0a0a;text-decoration:none;"><i class="icon iconfont icon-circle"  onclick="deleteImg(this)"></i></a></td></tr>'
                            commodityTbody.appendChild(comTr)
                        }
                    }
                })
            }
        }
    }
}

function upImg(){
    var files= document.querySelector("#imgUp").files
    if(files.length == 0){
        alert("上传图片为空!")
    }else{
        // _e.upload(files,upcb)
        var args=arguments
        var xmlhttp = new XMLHttpRequest()
        var addFd = new FormData()
        for(var i=0;i<files.length;i++){
            var suffix= files[i].name.substring(files[i].name.lastIndexOf('.'))
            addFd.append("name",files[i].name)
            addFd.append("suffix",suffix)
        }
        xmlhttp.open("POST", "/qn/upload",true)
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                var data=eval('('+xmlhttp.responseText+');')
                var keys=data["Keys"]
                for(var i=0;i<files.length;i++){
                    var xp = new XMLHttpRequest(), fd = new FormData
                    xp.open("POST", "http://up.qiniu.com",true)
                    fd.append("file",files[i])
                    fd.append("token",data["Token"])
                    fd.append("key",data["Keys"][i])
                    xp.send(fd)
                    xp.onreadystatechange=function(){
                        if (xp.readyState==4 && xp.status==200){
                        }
                    }
                }
                args[0]=keys
                upcb(args)
            }
        }
        xmlhttp.send(addFd)
    }
}

function upcb(){
    var args=arguments[0]
    var myDate = new Date()//随机数 用来更新七牛的缓存
    var imgMassage = document.querySelector("#imgMassage")
    imgMassage.setAttribute("src"," http://od35wia0b.bkt.clouddn.com/"+args[0][0]+"?imageMogr2/thumbnail/160x120!&v="+myDate.getMilliseconds())
    alert("成功")
}

function srcImg(e){    //点击图片，触发函数
    var myDate = new Date()//随机数 用来更新七牛的缓存
    var divImg = document.querySelector(".mainRight")
    if(e.getAttribute("srcImg")){
        divImg.innerHTML = '<img id="imgMassage" src=" http://od35wia0b.bkt.clouddn.com/'+e.getAttribute("srcImg")+'?imageMogr2/thumbnail/160x120!&v='+myDate.getMilliseconds()+'"/>' +
            '<input type="file" id="imgUp"/><input type="button" onclick="upImg()" value="添加"/>' +
            '<div style="text-align: center;"><button class="addImg">确定</button></div>'
    }else{
        divImg.innerHTML = '<img id="imgMassage" src="" />' +
            '<input type="file" id="imgUp"/><input type="button" onclick="upImg()" value="添加"/>' +
            '<div style="text-align: center;"><button class="addImg">确定</button></div>'
    }

    // console.log(e.parentNode.parentNode)
    var eTr = e.parentNode.parentNode
    document.querySelector(".addImg").addEventListener("click",function(){    //提交商品或种类图片
        var classification = document.querySelector("#classification")
        var url
        var data = {}
        if(Number(eTr.querySelector(".seq").getAttribute("markId")) == 0){
            url = "/sc/module/insertone"
            for(var i = 0;i < classification.children.length;i++){
                if(classification.value == classification.children[i].innerHTML){   //判断大类选择的是哪个大类
                    data.type = Number(classification.children[i].getAttribute("classid"))
                    break
                }
            }
            var imgMassageSrc = document.querySelector("#imgMassage").getAttribute("src")
            var img = imgMassageSrc.substring(imgMassageSrc.indexOf('com/')+4,imgMassageSrc.indexOf("?"))
            data.filekey = img    //filekey图片
            var commodityClass = eTr.querySelector(".commodityClass")
            if(commodityClass.style.display == "block"){    //commodityclass商品种类
                for(i = 0;i < commodityClass.children.length;i++){
                    if(commodityClass.value == commodityClass.children[i].innerHTML){
                        data.commodityclass = Number(commodityClass.children[i].getAttribute("ificationid"))
                        break
                    }
                }
            }else{
                data.commodityclass = 0
            }

            var flagType = eTr.querySelector(".flagType")
            if(flagType.style.display == "block"){    //flag商品或种类
                for(i = 0;i < flagType.children.length;i++){
                    if(flagType.value == flagType.children[i].innerHTML){
                        data.flag = Number(flagType.children[i].getAttribute("flagtype"))
                        break
                    }
                }
            }else{
                data.flag = 0
            }

            var commodityName = eTr.querySelector(".commodityName")
            if(commodityName.style.display == "block"){    //flag商品或种类
                data.commodity = Number(commodityName.getAttribute("comid"))
                if(Number(commodityName.getAttribute("comid")) == 0){
                    alert("请选择商品!")
                    return
                }
            }else{
                data.commodity = 0
            }

            var commodityType = eTr.querySelector(".commodityType")
            for(i = 0;i < commodityType.children.length;i++){
                if(commodityType.value == commodityType.children[i].innerHTML){
                    data.commoditytype = Number(commodityType.children[i].getAttribute("typeid"))
                    break
                }
            }

            data.text = eTr.querySelector(".commodityMemo").value
            data.seq = Number(eTr.querySelector(".seq").value)
        }else{
            url = "/sc/module/updateone"
            imgMassageSrc = document.querySelector("#imgMassage").getAttribute("src")
            img = imgMassageSrc.substring(imgMassageSrc.indexOf('com/')+4,imgMassageSrc.indexOf("?"))
            data.filekey = img    //filekey图片
            data.type = Number(eTr.querySelector(".seq").getAttribute("markId"))
            data.text = eTr.querySelector(".commodityMemo").value
            data.seq = Number(eTr.querySelector(".seq").value)
        }
        console.log(data)
        loadDate({     //返回所有商品种类，并把它列在第一列
            data:data,
            method:"POST",
            url:url,
            async:true,
            callback:function(d){
                alert(d.msg)

            }
        })
    },true)
}

function addCom(){   //添加父节点，即是先添加图片选择信息
    var commodityTbody = document.querySelector("#commodityTbody")
    loadDate({     //返回所有商品种类，并把它列在第一列
        data:"",
        method:"get",
        url:"/sc/module/getclass",
        async:true,
        callback:function(d){
            // console.log(d)
            var classification1 = ''
            for(var j = 0;j < d.class.length;j++){
                classification1 += "<option ificationId='"+d.class[j][0]+"' ificationMemo='"+d.class[j][1]+"'>"+d.class[j][2]+"</option>"
            }
            var classification = document.querySelector("#classification")
            var flagType,commodityName,commodityClass
            for(var i = 0;i < classification.children.length;i++){
                if(classification.value == classification.children[i].innerHTML){  //获得大类值
                    var classid = classification.children[i].getAttribute("classid")
                    if(Number(classid) == 1 || Number(classid) == 4 || Number(classid) == 5){  //广告，代购，预购
                        flagType = "display:block"
                        commodityName = "display:none"
                        commodityClass = "display:block"
                        break
                    }

                    if(Number(classid) == 2){
                        flagType = "display:none"
                        commodityName = "display:block"
                        commodityClass = "display:none"
                        break
                    }

                    if(Number(classid) == 3){
                        flagType = "display:none"
                        commodityName = "display:none"
                        commodityClass = "display:block"
                        break
                    }
                }
            }
            var commodityTr = document.createElement("tr")
            commodityTr.innerHTML = '<td style="width: 120px;"><select class="commodityClass" style="'+commodityName+'">'+classification1+'</select></td>' +
                '<td><select class="commodityType">'+commodityType()+'</select></td>'+
                '<td style="width:60px"><input class="seq" markId="0" type="number" style="width:60px;"/></td>' +
                '<td style="width:60px"><select class="flagType" style="width:60px;'+flagType+'" onchange="flagType(this)"><option flagType="1">单品</option><option flagType="2">种类</option></select></td>' +
                '<td><input type="text" class="commodityMemo" width="100px;"/></td>' +
                '<td style="width: 120px;"><span class="commodityName" comId="" style="'+commodityClass+'" onclick="commodityName(this)">添加</span></td>' +
                '<td style="width:60px"><input class="commodityImg" type="button" srcImg="" value="图片" style="width:60px" onclick="srcImg(this)"/></td>'+
                '<td style="width:60px"><a href="#" style="color: #0a0a0a;text-decoration:none;"><i class="icon iconfont icon-delete"  onclick="deleteCom(this)"></i></a></td></tr>'
            commodityTbody.appendChild(commodityTr)
        }
    })
}

function deleteCom(e){   //删除当前的一行
    e.parentNode.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode.parentNode)
}

function deleteImg(e){
    var data = {}
    data.id = Number(e.parentNode.parentNode.parentNode.querySelector(".seq").getAttribute("markid"))
    loadDate({     //返回所有商品种类，并把它列在第一列
        data:data,
        method:"POST",
        url:"/sc/module/delete",
        async:true,
        callback:function(d){
            alert(d.msg)
        }
    })
}

function commodityName(e){
    var commodityName = document.querySelectorAll(".commodityName")
    for(var i = 0;i < commodityName.length;i++){
        commodityName[i].setAttribute("class","commodityName")
    }
    e.setAttribute("class","commodityName comName")
}
