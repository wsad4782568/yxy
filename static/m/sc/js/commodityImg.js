loadDate({    //加载大的类别
    data:"",
    method:"get",
    url:"/sc/module/getmodule",
    async:true,
    callback:function(d){
        var classification = document.querySelector("#classification")
        for(var i = 0;i < d.module.length;i++){
            if(d.module[i][0] == 1){
                classification.innerHTML +=  "<option classId='"+d.module[i][0]+"' classMemo='"+d.module[i][2]+"' classFlag='"+d.module[i][3]+"'>"+d.module[i][1]+"</option>"
            }
        }
        for(var i = 0;i < d.module.length;i++){
            if(d.module[i][0] == 3){
                classification.innerHTML +=  "<option classId='"+d.module[i][0]+"' classMemo='"+d.module[i][2]+"' classFlag='"+d.module[i][3]+"'>"+d.module[i][1]+"</option>"
            }
        }
        for(var i = 0;i < d.module.length;i++){
            if(d.module[i][0] == 4){
                classification.innerHTML +=  "<option classId='"+d.module[i][0]+"' classMemo='"+d.module[i][2]+"' classFlag='"+d.module[i][3]+"'>"+d.module[i][1]+"</option>"
            }
        }
    }
})

function unique(arr){    //数组去重复
    var tmp = new Array();
    for(var m in arr){
        tmp[arr[m]]=1;
    }//再把键和值的位置再次调换
    var tmparr = new Array();
    for(var n in tmp){
        tmparr.push(n);
    }
    return tmparr;
}

(function(){
    alldept = JSON.parse(localStorage.getItem("alldept"))
    var idept =document.querySelector("#cqdept")
    for(var i =0;i<alldept.length;i++){
        var option=document.createElement("option")
        option.value=alldept[i].id
        option.innerHTML=alldept[i].name
        idept.appendChild(option)
    }
    var data1 = {}   //进来默认为广告类
    data1.id = 1
    data1.cdept = Number(idept.value)
    loadDate({     //返回所有商品种类，并把它列在第一列
        data:data1,
        method:"POST",
        url:"/sc/module/getmoduleitem",
        async:true,
        callback:function(d){
            // console.log(d)
            var objectList = new Array()
            for(var i = 0;i < d.item.length;i++){  //按照seq的顺序排列
                objectList.push(d.item[i])
            }
            objectList.sort(function(a,b){ return a[2]-b[2] });   //按流水号从小到大排序
            buttonInfo(objectList)
        }
    })
})()

function loadDate2(){
  var data2 = {}
  var idept2 = document.querySelector("#cqdept")
  data2.cdept = Number(idept2.value)
  loadDate({    //加载大的类别
      data:data2,
      method:"POST",
      url:"/sc/module/showmoduleitem",
      async:true,
      callback:function(d){
          console.log(d)
          var picturesAll = document.querySelector("#picturesAll")
          picturesAll.innerHTML = ""
          var i
          var uniqueArr = []
          for(i = 0;i < d.item.length;i++){
              uniqueArr.push(d.item[i][1])
          }
          uniqueArr = unique(uniqueArr)
          for(i = 0;i < uniqueArr.length;i++){
              picturesAll.innerHTML +=  "<a href='#' class='deleteImg' ondblclick='imgReplace(this)'><img src=' http://mrten-0.mrten.cn/"+uniqueArr[i]+"?imageMogr2/thumbnail/180x150'  img='"+d.item[i][1]+"' imgId='"+d.item[i][0]+"'/></a>"
          }
      }
  })
}
loadDate2()


function change_show_imageType(e){       //改变大类触发事件，改变大类了里面的值
    var i
    var idept =document.querySelector("#cqdept")
    var loadImg = document.querySelectorAll(".loadImg")
    document.querySelector("#img").children[0].setAttribute("src","")
    document.querySelector("#url").querySelector("input").value = ""
    var imgClear = document.querySelector("#imgClear")
    var comDetail = document.querySelector("#comDetail")
    for(i = 0;i < loadImg.length;i++){
        loadImg[i].setAttribute("class","loadImg")
        loadImg[i].setAttribute("urlName"," ")
        loadImg[i].setAttribute("imgName"," ")
    }
    var data = {}
    data.cdept = Number(idept.value)
    var classification = document.querySelector("#classification")
    for(i = 0;i < classification.children.length;i++){
        if(classification.children[i].innerHTML == classification.value){
            data.id = Number(classification.children[i].getAttribute("classid"))     //返回大类的所有商品
            // console.log(data)
            var imgNum = document.querySelector("#imgNum").querySelector("div")
            if(data.id == 1){
                imgClear.style.visibility = "visible"
                comDetail.style.visibility = "hidden"
                imgNum.innerHTML = '<input type="button" value="1" seq="1" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="2" seq="2" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="3" seq="3" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="4" seq="4" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="5" seq="5" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="6" seq="6" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="7" seq="7" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="8" seq="8" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="9" seq="9" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="10" seq="10" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/>'
            }
            if(data.id == 3){
                imgClear.style.visibility = "visible"
                comDetail.style.visibility = "hidden"
                imgNum.innerHTML = '<input type="button" value="1" seq="1" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="2" seq="2" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="3" seq="3" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="4" seq="4" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="5" seq="5" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="6" seq="6" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="7" seq="7" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="8" seq="8" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="9" seq="9" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="10" seq="10" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/>'
            }
            if(data.id == 4){
                document.querySelector("#comName").value = ""
                document.querySelector("#comColor").value = ""
                document.querySelector("#comMemo").value = ""
                imgClear.style.visibility = "visible"
                comDetail.style.visibility = "visible"
                imgNum.innerHTML = '<input type="button" value="1" seq="1" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="2" seq="2" imgName="" urlName=""  comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="3" seq="3" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="4" seq="4" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> '  +
                    '<input type="button" value="5" seq="5" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> ' +
                    '<input type="button" value="6" seq="6" imgName="" urlName="" comColor="" comName="" comMemo="" class="loadImg" onclick="loadImg(this)"/> '
            }
            loadDate({     //返回所有商品种类，并把它列在第一列
                data:data,
                method:"POST",
                url:"/sc/module/getmoduleitem",
                async:true,
                callback:function(d){
                    console.log(d)
                    loadDate2()
                    var objectList = new Array()
                    for(var i = 0;i < d.item.length;i++){  //按照seq的顺序排列
                        objectList.push(d.item[i])
                    }
                    objectList.sort(function(a,b){ return a[2]-b[2] });   //按流水号从小到大排序
                    buttonInfo(objectList)
                }
            })
            break
        }
    }
}

function buttonInfo(list){         //为每个按钮插入相应的信息
    var loadImg = document.querySelectorAll(".loadImg")
    var comDetail = document.querySelector("#comDetail")
    if(comDetail.style.visibility == "visible"){
        for(var i = 0;i < list.length;i++){
            loadImg[list[i][2]-1].setAttribute("imgId",list[i][0])
            loadImg[list[i][2]-1].setAttribute("imgName",list[i][1])
            loadImg[list[i][2]-1].setAttribute("urlName",list[i][3])
            loadImg[list[i][2]-1].setAttribute("comColor",list[i][4])
            loadImg[list[i][2]-1].setAttribute("comName",list[i][5])
            loadImg[list[i][2]-1].setAttribute("comMemo",list[i][6])
        }
        return
    }
    for(var j = 0;j < list.length;j++){
        loadImg[list[j][2]-1].setAttribute("imgId",list[j][0])
        loadImg[list[j][2]-1].setAttribute("imgName",list[j][1])
        loadImg[list[j][2]-1].setAttribute("urlName",list[j][3])
    }
}

function loadImg(e){      //点击按钮加载图片以及url
    var eParent = e.parentNode.children
    var img = document.querySelector("#img").children[0]
    var url = document.querySelector("#url").querySelector("input")
    var comColor = document.querySelector("#comColor")
    var comName = document.querySelector("#comName")
    var comMemo= document.querySelector("#comMemo")
    var i
    for(i = 0;i < eParent.length;i++){
        eParent[i].setAttribute("class","loadImg")
    }
    e.setAttribute("class","loadImg loadImg1")
    if(e.getAttribute("imgName").length == 0){
      img.setAttribute("src"," http://mrten-0.mrten.cn/500888.gif?imageMogr2/thumbnail/300x200")
    }else{
        img.setAttribute("src"," http://mrten-0.mrten.cn/"+e.getAttribute("imgName")+"?imageMogr2/thumbnail/300x200")
    }

    url.value = e.getAttribute("urlName")
    var comDetail = document.querySelector("#comDetail")
    if(comDetail.style.visibility == "visible"){
        comColor.value = e.getAttribute("comColor")
        comName.value = e.getAttribute("comName")
        comMemo.value = e.getAttribute("comMemo")
    }
}

function imgReplace(e){            //双击右边的图片，加载整个大的图片
    var i,loadImg1 = 0
    var loadImg = document.querySelectorAll(".loadImg")
    for(i = 0;i < loadImg.length;i++){
        if(loadImg[i].getAttribute("class") == "loadImg loadImg1"){
            var imgRp = e.children[0].getAttribute("src")        //获取右边点击图片
            var img = document.querySelector("#img").children[0]    //获取完整图片
            img.setAttribute("src",imgRp.substring(0,imgRp.indexOf("?"))+"?imageMogr2/thumbnail/300x200")    //把图片放大
            loadImg[i].setAttribute("src",img.getAttribute("src").substring(img.getAttribute("src").indexOf('com/')+4,img.getAttribute("src").indexOf("?")))
            loadImg1 = 1
            break
        }
    }
    if(loadImg1 == 0){
    	_e["msgBox"]({
            msg: "请选择顺序!",
            timeout:3000
       })
    }
}

_e.bind("#imgUpOK","click",function(){     //上传图片
    var files= document.querySelector("#imgUp").files
    if(files.length == 0){
    	_e["msgBox"]({
            msg: "上传图片为空",
            timeout:3000
       })
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
        xmlhttp.open("POST", "/qn/upload/modulePic",true)
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                var data=eval('('+xmlhttp.responseText+');')
                console.log(data)
                var keys=data["Keys"]
                for(var i=0;i<files.length;i++){
                    var xp = new XMLHttpRequest(), fd = new FormData
                    xp.open("POST", "http://up.qiniu.com",true)
                    fd.append("file",files[i])
                    fd.append("token",data["Token"])
                    fd.append("key",data["Keys"][i])
                    xp.onreadystatechange=function(){
                        if (xp.readyState==4 && xp.status==200){
                            var d=eval('('+xp.responseText+');')
                            // console.log(d)
                        }
                    }
                    xp.send(fd)
                }
                args[0]=keys
                upcb(args)
            }
        }
        xmlhttp.send(addFd)
    }
})

function upcb(){
    var data = {}
    var args=arguments[0]
    var idept =document.querySelector("#cqdept")
    data.cdept = Number(idept.value)
    data.image = args[0][0]
    loadDate({    //加载大的类别
        data:data,
        method:"get",
        url:"/sc/module/insert",
        async:true,
        callback:function(d){
        	_e["msgBox"]({
                msg: d.msg,
                className: d.res==-1 ? "error":"success",
                timeout:3000
            })
            var picturesAll = document.querySelector("#picturesAll")
            picturesAll.innerHTML += "<a href='#' class='delectImg' ondblclick='imgReplace(this)'><img src=' http://mrten-0.mrten.cn/"+args[0][0]+"?imageMogr2/thumbnail/180x150' img='"+args[0][0]+"' imgId='"+d.module+"'/></a>"
        }
    })
}

_e.bind("#imgClear","click",function(){    //清除seq,可以删除前面的seq
    var i,loadImg1 = 0
    var data = {}
    var loadImg = document.querySelectorAll(".loadImg")
    var idept =document.querySelector("#cqdept")
    data.cdept = Number(idept.value)
    for(i = 0;i < loadImg.length;i++){
        if(loadImg[i].getAttribute("class") == "loadImg loadImg1" && loadImg[i].getAttribute("imgId")){
            data.id = Number(loadImg[i].getAttribute("imgId"))
            loadImg1 = 1
            break
        }
    }
    if(loadImg1 == 0){
    	_e["msgBox"]({
            msg: "清除错误!",
            timeout:3000
        })
        return
    }
    loadDate({    //加载大的类别
        data:data,
        method:"POST",
        url:"/sc/module/delete",
        async:true,
        callback:function(d){
        	_e["msgBox"]({
                msg: d.msg,
                className: d.res==-1 ? "error":"success",
                timeout:3000
           })
        }
    })
})

_e.bind("#imgOK","click",function(){     //把图片插入到数据库
    var fd = new FormData(),xhr = new XMLHttpRequest()
    var idept =document.querySelector("#cqdept")
    fd.append("cdept",Number(idept.value))
    var url = document.querySelector("#url").querySelector("input").value
    var img = document.querySelector("#img").children[0].getAttribute("src")
    if(img == " http://mrten-0.mrten.cn/500888.gif?imageMogr2/thumbnail/300x200"){
    	_e["msgBox"]({
            msg: "请添加图片!",
            timeout:3000
        })
        return
    }
    var classification = document.querySelector("#classification")
    for(var i = 0;i < classification.children.length;i++){
        if(classification.children[i].innerHTML == classification.value){
            fd.append("module",Number(classification.children[i].getAttribute("classid")))
            break
        }
    }
    var comColor = document.querySelector("#comColor")
    var comName = document.querySelector("#comName")
    var comMemo= document.querySelector("#comMemo")
    var comDetail = document.querySelector("#comDetail")
    if(comDetail.style.visibility == "visible"){
        fd.append("name",comName.value)
        fd.append("intro",comMemo.value)
        fd.append("color",comColor.value)
    }else{
        fd.append("name","")
        fd.append("intro","")
        fd.append("color","")
    }
    fd.append("url",url)
    fd.append("image",img.substring(img.indexOf('cn/')+3,img.indexOf("?")))
    var loadImg = document.querySelectorAll(".loadImg")
    for(i = 0;i < loadImg.length;i++){
        if(loadImg[i].getAttribute("class") == "loadImg loadImg1"){
            fd.append("seq",Number(loadImg[i].getAttribute("seq")))
            fd.append("id",Number(loadImg[i].getAttribute("imgId")))
            loadImg[i].setAttribute("urlName",url)
            loadImg[i].setAttribute("imgname",img.substring(img.indexOf('com/')+4,img.indexOf("?")))
            // console.log(loadImg[i])
            break
        }
    }
    xhr.open("POST","/sc/module/insert",true)
    xhr.send(fd)
    xhr.onreadystatechange = function(){
        if (xhr.readyState==4 && xhr.status==200){
            var d = eval('('+xhr.responseText+');')
            console.log(d)
            _e["msgBox"]({
                msg: d.msg,
                className: d.res==-1 ? "error":"success",
                timeout:3000
            })
            for(i = 0;i < loadImg.length;i++){
                if(loadImg[i].getAttribute("class") == "loadImg loadImg1"){
                    console.log(loadImg[i])
                    loadImg[i].setAttribute("imgid",d.module)
                }
            }
        }
    }
})

function batch(e){    //标识批量
    var deleteImg = document.querySelectorAll(".deleteImg")
    var i
    var batchDelete = document.querySelector("#batchDelete")
    if(e.getAttribute("batchBlock") == "block"){
        for(i = 0;i < deleteImg.length;i++){
            var input1 = document.createElement("input")
            input1.setAttribute("type","checkbox")
            input1.style.height = "70px"
            input1.style.width = "70px"
            deleteImg[i].appendChild(input1)
        }
        e.setAttribute("batchBlock","none")
        batchDelete.style.visibility = "visible"
    }else{
        for(i = 0;i < deleteImg.length;i++){
            deleteImg[i].removeChild(deleteImg[i].querySelector("input"))
        }
        e.setAttribute("batchBlock","block")
        batchDelete.style.visibility = "hidden"
    }
}

_e.bind("#batchDelete","click",function(){   //批量删除图片
    var deleteImg = document.querySelectorAll(".deleteImg")
    for(var i = 0;i < deleteImg.length;i++){
        if(deleteImg[i].children[1].checked){
            deleteImgFunc(deleteImg[i].children[0].getAttribute("imgid"),deleteImg[i])
        }
    }
    _e["msgBox"]({
        msg: "删除成功!",
        timeout:3000
    })
})

function deleteImgFunc(imgid,dom){    //删除图片的函数
    var deleteImg = document.querySelectorAll(".deleteImg")
    var batchDelete = document.querySelector("#batchDelete")
    var e = document.querySelector("#batchAll")
    var fd = new FormData(),xml = new XMLHttpRequest()
    var idept =document.querySelector("#cqdept")
    fd.append("cdept",Number(idept.value))
    fd.append("id",Number(imgid))
    xml.open("POST","/sc/module/delete",true)
    xml.send(fd)
    xml.onreadystatechange = function(){
        if (xml.readyState==4 && xml.status==200){
            var d = eval('('+xml.responseText+');')
            for(var i = 0;i < deleteImg.length;i++){
                deleteImg[i].removeChild(deleteImg[i].querySelector("input"))
            }
            dom.parentNode.removeChild(dom)
            e.setAttribute("batchBlock","block")
            batchDelete.style.visibility = "hidden"
        }
    }
}


//url的选择
function loadtreeName(){
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
	        var trtime = document.querySelector("#trtime")
			trtime.parentNode.removeChild(trtime)
			var btnExtRow = document.querySelector("#btnExtRow")
			btnExtRow.style.display = "none"
	    }
	})
}
loadtreeName()

function loadtree(treedata){
    var trs=new _e["tree"]()
    var event=[{e:"click",func:function () { //需要绑定的函数，绑定tbl
        t.funcs.loadData.call(t,{    //在table.js中的204行显示
            qseq:17, //数组中下标
            qverb:'k',// like '% %' 条件
            qpt:this.getAttribute("data-code") //值
        })
    }, is_leaf:1}]
    trs.init("#trees",treedata,1,"TR",event)    //创建树
}

function loadtbl(others){
    coldefs = [{
        seq: 23, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "流水号", // 列标题
        visible: true, //是否可见
        // checkall: false, // 是否可全选
        // isID: 1,
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
        seq: 15, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "规格", // 列标题
        visible: true, //是否可见
        name: "specification", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 14, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>"+item+"</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "单位", // 列标题
        visible: true, //是否可见
        name: "unit", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 17,
        render: function(item) {
            return "<b>"+item+"</b>"
        },
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "种类", // 列标题
        visible: true, //是否可见
    }]

    t = new _e["table"]()
    row_actions =[
        {cls:"doerow",func:function(tbl,rows){
          var loadImg = document.querySelectorAll(".loadImg")
          var flag = 0,i
          for(i = 0;i < loadImg.length;i++){
              if(loadImg[i].getAttribute("class") == "loadImg loadImg1"){
                  flag = 1
              }
          }
          if(flag == 0){
            _e["msgBox"]({
                msg: "请选择顺序!",
                timeout:3000
            })
            return
          }
        	document.querySelector("#url").querySelector("input").value = "goodsdetail.html?comid="+tbl.data[rows][16]+"&commoditytype="+tbl.data[rows][24]
        },title:"添加"}
    ]

    rows_actions = []

    ext_row = function(rows,i){
        return "this is " + i
    }

    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/stocktransfers/getallStock"+_e.jurisdiction())
}

function loadCommodityClass(){
	var urlNameAll = document.querySelector("#urlNameAll")
	var xml = new XMLHttpRequest()
	xml.open("POST","/sc/statistics/getClass",true)
    xml.send()
    xml.onreadystatechange = function(){
        if(xml.readyState==4 && xml.status==200){
        	var d = eval('(' +xml.responseText+ ');')
        	console.log(d)
        	for(var i = 0;i < d.class.length;i++){
        		var option = document.createElement("option")
        		if(d.class[i][4] == 0){
        			option.setAttribute("urlName","classid")
        			option.setAttribute("urlId",d.class[i][0])
        			option.innerHTML = d.class[i][2]
        			urlNameAll.appendChild(option)
        		}
        		if(d.class[i][4] == 1){
        			option.setAttribute("urlName","code")
        			option.setAttribute("urlId",d.class[i][0])
        			option.innerHTML = d.class[i][2]
        			urlNameAll.appendChild(option)
        		}
        	}
        	for(var j = 0;j < d.module.length;j++){
        		var option1 = document.createElement("option")
        		option1.setAttribute("urlName","moduleid")
        		option1.setAttribute("urlId",d.module[j][0])
        		option1.innerHTML = d.module[j][2]
        		urlNameAll.appendChild(option1)
        	}
        }
	}
}
loadCommodityClass()

document.querySelector("#urlAdd").addEventListener("click",function(){   //提交select中选择的类别
  var loadImg = document.querySelectorAll(".loadImg")
  var flag = 0,i
  for(i = 0;i < loadImg.length;i++){
      if(loadImg[i].getAttribute("class") == "loadImg loadImg1"){
          flag = 1
      }
  }
  if(flag == 0){
    _e["msgBox"]({
        msg: "请选择顺序!",
        timeout:3000
    })
    return
  }
	var urlNameAll = document.querySelector("#urlNameAll")
	for(i = 0;i < urlNameAll.children.length;i++){
		if(urlNameAll.value == urlNameAll.children[i].innerHTML){
			document.querySelector("#url").querySelector("input").value = "goods.html?"+urlNameAll.children[i].getAttribute("urlName")+"="+urlNameAll.children[i].getAttribute("urlId")
		}
	}
})
