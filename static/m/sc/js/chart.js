function loadClass(){
	loadDate({    //加载大的类别
	    data:"",
	    method:"get",
	    url:"/sc/module/getmodule",
	    async:true,
	    callback:function(d){
	        var classification = document.querySelector("#classification")
	        for(var i = 0;i < d.module.length;i++){
	            if(d.module[i][0] == 2){
	                classification.innerHTML +=  "<option classId='"+d.module[i][0]+"' classMemo='"+d.module[i][2]+"' classFlag='"+d.module[i][3]+"'>"+d.module[i][1]+"</option>"
	            }
	        }
	    }
	})
}
loadClass()

alldept = JSON.parse(localStorage.getItem("alldept"))
var idept =document.querySelector("#cqdept")
for(var i =0;i<alldept.length;i++){
    var option=document.createElement("option")
    option.value=alldept[i].id
    option.innerHTML=alldept[i].name
    idept.appendChild(option)
}

function loadChart(){
	var data = {}   //进来默认为栏目一
	data.id = 2
	var idept1 =document.querySelector("#cqdept")
	data.cdept = Number(idept1.value)
	loadDate({     //返回所有商品种类，并把它列在第一列
	    data:data,
	    method:"POST",
	    url:"/sc/module/getmoduleitem",
	    async:true,
	    callback:function(d){
					console.log(d)
					if(d.item.length == 4){
						var objectList = new Array()
						for(var i = 0;i < d.item.length;i++){  //按照seq的顺序排列
								objectList.push(d.item[i])
						}
						objectList.sort(function(a,b){ return a[2]-b[2] });   //按流水号从小到大排序
						buttonInfo(objectList)
					}
	    }
	})
}
loadChart()

function change_show_imageType(e){       //改变大类触发事件，改变大类了里面的值
    var i
    var data = {}
    var idept1 =document.querySelector("#cqdept")
    data.cdept = Number(idept1.value)
    var classification = document.querySelector("#classification")
    for(i = 0;i < classification.children.length;i++){
        if(classification.children[i].innerHTML == classification.value){
            data.id = Number(classification.children[i].getAttribute("classid"))     //返回大类的所有商品
            loadDate({     //返回所有商品种类，并把它列在第一列
                data:data,
                method:"POST",
                url:"/sc/module/getmoduleitem",
                async:true,
                callback:function(d){
                    console.log(d)
										if(d.item.length == 4){
											var objectList = new Array()
											for(var i = 0;i < d.item.length;i++){  //按照seq的顺序排列
													objectList.push(d.item[i])
											}
											objectList.sort(function(a,b){ return a[2]-b[2] });   //按流水号从小到大排序
											buttonInfo(objectList)
										}
                }
            })
            break
        }
    }
}

function change_show_imageDept(e){       //改变部门触发事件，改变部门了里面的值
    var i
    var data = {}
    var idept1 =document.querySelector("#cqdept")
    data.cdept = Number(idept1.value)
    var classification = document.querySelector("#classification")
    for(i = 0;i < classification.children.length;i++){
        if(classification.children[i].innerHTML == classification.value){
            data.id = Number(classification.children[i].getAttribute("classid"))     //返回大类的所有商品
            loadDate({     //返回所有商品种类，并把它列在第一列
                data:data,
                method:"POST",
                url:"/sc/module/getmoduleitem",
                async:true,
                callback:function(d){
                    // console.log(d)
										if(d.item.length == 4){
											var objectList = new Array()
											for(var i = 0;i < d.item.length;i++){  //按照seq的顺序排列
													objectList.push(d.item[i])
											}
											objectList.sort(function(a,b){ return a[2]-b[2] });   //按流水号从小到大排序
											buttonInfo(objectList)
										}
                }
            })
            break
        }
    }
}

function buttonInfo(list){         //为每个按钮插入相应的信息
    if (list.length == 0) {
      return
    }
    var loadImg = document.querySelector(".typeList")
		var selectUrl =document.querySelectorAll(".selectUrl")
		var startItem,endItem,oldSelectUrlHtml
    loadImg.innerHTML = ""
    for(var i = 0;i < list.length;i++){
				startItem = list[i][3].indexOf("?")
				endItem = list[i][3].indexOf("=")
        var div = document.createElement("div")
        div.innerHTML = '<ul class="flex"><p style="background-color: '+list[i][4]+';"><i class="icon iconfont icon-'+list[i][1]+'"></i></p><li class="flex-1"><h1>'+list[i][5]+'</h1><h2>'+list[i][6]+'</h2></li></ul>' +
            ' 图标选择：<input class="chartName" value="'+list[i][1]+'" type="text" onBlur="chartName(this)"/>' +
            ' 类名颜色：<input class="chartColor" value="'+list[i][4]+'" type="color" onBlur="chartName(this)"/>'+
						' <select class="selectUrl" onchange="chanageUrl(this)"><option urlname="'+list[i][3].substring(startItem+1,endItem)+'" urlid="'+list[i][3].substring(endItem+1,list[0][3].length)+'"></option></select><br/>' +
            ' 种类名字：<input class="comName" value="'+list[i][5]+'" type="text" onBlur="chartName(this)"/>' +
            ' 种类说明：<input class="comMemo" value="'+list[i][6]+'" type="text" onBlur="chartName(this)"/>' +
            ' <input type="button" value="链接" onclick="chanageUrl(this)"/>：<input class="chartUrl" value="'+list[i][3]+'" type="text"/> ' +
            ' <input type="button" class="submit" seq='+list[i][2]+' muId="'+list[i][0]+'" onclick="submit(this)" value="确定"/>'
        loadImg.appendChild(div)
    }
		allURl()
}

function submit(e){    //改变左边图标的内容
    var eParent = e.parentNode
    var idept1 =document.querySelector("#cqdept")
    if(e.parentNode.querySelector(".chartUrl").value == ""){
        _e["msgBox"]({
            msg: "请填写跳转页面的链接!",
            timeout:3000
        })
        return
    }
    var fd = new FormData(),xml = new XMLHttpRequest()
    fd.append("cdept",Number(idept1.value))
    var classification = document.querySelector("#classification")
    for(var i = 0;i < classification.children.length;i++){
        if(classification.value == classification.children[i].innerHTML){
            fd.append("module",Number(classification.children[i].getAttribute("classId")))
            break
        }
    }
    fd.append("seq",Number(e.getAttribute("seq")))
    fd.append("id",Number(e.getAttribute("muId")))
    var image1 = e.parentNode.querySelector(".flex").querySelector("i").getAttribute("class")
    fd.append("image",image1.substring(image1.indexOf("-")+1,image1.length))
    var color1 = e.parentNode.querySelector(".flex").querySelector("p").getAttribute("style")
    console.log(color1.substring(color1.indexOf(":")+2,color1.length))
    fd.append("color",color1.substring(color1.indexOf(":")+2,color1.length))
    fd.append("name",e.parentNode.querySelector(".flex").querySelector("h1").innerHTML)
    fd.append("intro",e.parentNode.querySelector(".flex").querySelector("h2").innerHTML)
    fd.append("url",e.parentNode.querySelector(".chartUrl").value)
    xml.open("POST", "/sc/module/insert",true)
    xml.onreadystatechange=function() {
        if (xml.readyState==4 && xml.status==200) {
            var d=eval('('+xml.responseText+');')
            _e["msgBox"]({
                msg: d.msg,
                className: d.res==-1 ? "error":"success",
                timeout:3000
            })
        }
    }
    xml.send(fd)
}

function chartName(e){            //离开把相应的值写在相应的地方
    var eParent = e.parentNode
    if(e.value == ""){
        _e["msgBox"]({
            msg: "填写不能为空!",
            timeout:3000
        })
        return
    }
    if(e.getAttribute("class") == "chartName"){
        eParent.querySelector("i").setAttribute("class","icon iconfont icon-"+e.value) //改变图标
    }
    if(e.getAttribute("class") == "chartColor"){
        eParent.querySelector("p").setAttribute("style","background-color: "+e.value)  //改变背景色
    }
    if(e.getAttribute("class") == "comName"){
        eParent.querySelector("h1").innerHTML = e.value //改变名字
    }
    if(e.getAttribute("class") == "comMemo"){
        eParent.querySelector("h2").innerHTML = e.value //改变说明
    }
}

function allURl(){
	var urlNameAll = document.querySelectorAll(".selectUrl")
	for(var i = 0;i < urlNameAll.length;i++){
		classUrl(urlNameAll[i])
	}
}
allURl()

function classUrl(e){
	var urlNameAll = e
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

function  chanageUrl(e){
	var eInput = e.parentNode.querySelector(".chartUrl")
	for(var i = 0;i < e.children.length;i++){
		if(e.value == e.children[i].innerHTML){
			eInput.value = 'goods.html?'+e.children[i].getAttribute("urlName")+'='+e.children[i].getAttribute("urlId")
		}
	}
}
