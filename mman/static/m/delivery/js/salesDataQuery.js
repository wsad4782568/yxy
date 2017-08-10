function loadGoods(){            //选择分类
    var xml = new XMLHttpRequest()
    xml.open("POST","/sc/module/getclass",true)
    xml.send()
    xml.onreadystatechange = function(){
        if (xml.readyState==4 && xml.status==200){
            var d = eval('('+xml.responseText+');')
            var idept = document.querySelector("#classSelect")
            for(var i = 0;i < d.class.length;i++){
                var option=document.createElement("option")
                option.value = d.class[i][0]
                option.innerHTML = d.class[i][2]
                idept.appendChild(option)
            }
        }
    }
}
loadGoods()

function loadalldept(){    //选择部门
    var alldept = JSON.parse(localStorage.getItem("alldept"))
    var idept = document.querySelector("#operatingSelect")
    for(var i =0;i < alldept.length;i++){
        var option=document.createElement("option")
        option.value = alldept[i].id
        option.innerHTML=alldept[i].name
        idept.appendChild(option)
    }
}
loadalldept()

function operatingDateSubmit(){     //改变时间改变内容，改变部门，类别如果没有时间默认全部
  var operatingDateStart = document.querySelector("#operatingDateStart")
  var operatingDateEnd = document.querySelector("#operatingDateEnd")
  var i,k
  var fd = new FormData(),xml = new XMLHttpRequest()
  if(operatingDateStart.value == ""){   //判断时间
      fd.append("starttime",Number(_e.dateToInt("2016-01-01")))
  }else{
      fd.append("starttime",Number(_e.dateToInt(operatingDateStart.value)))
  }
  if(operatingDateStart.value == "" || operatingDateEnd.value == ""){   //判断时间
      fd.append("endtime",Number(_e.dateToInt("2026-01-01")))
  }else{
      fd.append("endtime",Number(_e.dateToInt(operatingDateEnd.value)))
  }
  if(Number(_e.dateToInt(operatingDateStart.value)) > Number(_e.dateToInt(operatingDateEnd.value))){
      _e["msgBox"]({
          msg: "结束时间不能小于开始时间!",
          timeout:3000
      })
      return
  }
  var classSelect = document.querySelector("#classSelect")
  var operatingDept = document.querySelector("#operatingSelect")
  var lineSelect = document.querySelector("#lineSelect")
  var CommunitySelect = document.querySelector("#CommunitySelect")
  if(classSelect.value == "--请选择分类--" && operatingDept.value == "--请选择部门--"  && lineSelect.value != "--请选择类型--"){  //只选类别，其他全选
     fd.append("is_online",Number(lineSelect.value))
  }
  if(classSelect.value == "--请选择分类--" && operatingDept.value != "--请选择部门--"  && lineSelect.value == "--请选择类型--"){ //只选部门，其他全选
      fd.append("cdept",Number(operatingDept.value))
  }
  if(classSelect.value != "--请选择分类--" && operatingDept.value == "--请选择部门--" && lineSelect.value == "--请选择类型--"){  //只选分类，其他全选
    fd.append("class",Number(classSelect.value))
  }
  if(classSelect.value != "--请选择分类--" && operatingDept.value == "--请选择部门--"  && lineSelect.value != "--请选择类型--"){ //部门全选，其他选一个
    fd.append("class",Number(classSelect.value))
    fd.append("is_online",Number(lineSelect.value))
  }
  if(classSelect.value == "--请选择分类--" && operatingDept.value != "--请选择部门--"  && lineSelect.value != "--请选择类型--"){ //类别全选，其他选一个
    fd.append("cdept",Number(operatingDept.value))
    fd.append("is_online",Number(lineSelect.value))
  }
  if(classSelect.value != "--请选择分类--" && operatingDept.value != "--请选择部门--"  && lineSelect.value == "--请选择类型--"){  //线上全选，其他选一个
    fd.append("class",Number(classSelect.value))
    fd.append("cdept",Number(operatingDept.value))
  }
  if(classSelect.value != "--请选择分类--" && operatingDept.value != "--请选择部门--"  && lineSelect.value != "--请选择类型--"){ //全选
    fd.append("class",Number(classSelect.value))
    fd.append("cdept",Number(operatingDept.value))
    fd.append("is_online",Number(lineSelect.value))
  }
  if(CommunitySelect.value != "--请选择小区--"){
    fd.append("subdistrict",Number(CommunitySelect.value))
  }
  var commodityNo = document.querySelector("#commodityNo").getAttribute("commodityNo")
  // console.log(commodityNo)
  if(Number(commodityNo) > 0){
    fd.append("commodityno",Number(commodityNo))
  }
  xml.open("POST","/sc/statistics/statisticsorder",true)
  xml.send(fd)
  xml.onreadystatechange = function(){
      if (xml.readyState==4 && xml.status==200){
          var d = eval('('+xml.responseText+');')
            console.log(d)
          var i
          var objectList = new Array()
          for(i = 0;i < d.stockinfo.length;i++){
              objectList.push(d.stockinfo[i]) //按品类的编号从小到大排序
              objectList.sort(function(a,b){ return a[2]-b[2] })
          }
          comList(objectList)
      }
  }
}

function dateSearch(e){   //改变时间
  var tody=_e["CurentTime"]()
  todyAddOne=_e["addDate"](tody,1)
  var operatingDateStart = document.querySelector("#operatingDateStart")
  operatingDateStart.value = _e["addDate"](tody,1-Number(e))
  var operatingDateEnd = document.querySelector("#operatingDateEnd")
  operatingDateEnd.value = todyAddOne
  operatingDateSubmit()
}

function comList(stockinfo){     //排序后显示
    var mmm = 0
    var dataAllTbody = document.querySelector("#dataAllTbody")
    dataAllTbody.innerHTML = ""
    for(var i = 0;i < stockinfo.length;i++){
      mmm = mmm + stockinfo[i][8]
        if(i == 0){
            var tr = document.createElement("tr")
            tr.setAttribute("class","com"+stockinfo[i][2])
            if((stockinfo[i][9]/100).toFixed(2) == 0){
              tr.innerHTML = '<td>'+classType(stockinfo[i][0])+'</td> ' +
                  '<td>'+stockinfo[i][1]+'</td>' +
                  '<td>'+stockinfo[i][2]+'</td>' +
                  '<td>'+stockinfo[i][3]+'</td>' +
                  '<td>'+stockinfo[i][4]+'</td>' +
                  '<td>'+stockinfo[i][5]+'</td>' +
                  '<td>'+stockinfo[i][6]+'</td>' +
                  '<td>'+stockinfo[i][7]+'</td>' +
                  '<td>'+(stockinfo[i][9]/100).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][9]/100*stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+((stockinfo[i][8]/100)/stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][8]/100).toFixed(2)+'</td> '+
                  '<td>'+((stockinfo[i][8] - stockinfo[i][9]*stockinfo[i][7])/100).toFixed(2)+'</td>' +
                  '<td>100%</td>'
              dataAllTbody.appendChild(tr)
            }else if((stockinfo[i][8]/100).toFixed(2) == 0){
              tr.innerHTML = '<td>'+classType(stockinfo[i][0])+'</td> ' +
                  '<td>'+stockinfo[i][1]+'</td>' +
                  '<td>'+stockinfo[i][2]+'</td>' +
                  '<td>'+stockinfo[i][3]+'</td>' +
                  '<td>'+stockinfo[i][4]+'</td>' +
                  '<td>'+stockinfo[i][5]+'</td>' +
                  '<td>'+stockinfo[i][6]+'</td>' +
                  '<td>'+stockinfo[i][7]+'</td>' +
                  '<td>'+(stockinfo[i][9]/100).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][9]/100*stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+((stockinfo[i][8]/100)/stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][8]/100).toFixed(2)+'</td> '+
                  '<td>'+((stockinfo[i][8] - stockinfo[i][9]*stockinfo[i][7])/100).toFixed(2)+'</td>' +
                  '<td>-100%</td>'
              dataAllTbody.appendChild(tr)
            }else{
              tr.innerHTML = '<td>'+classType(stockinfo[i][0])+'</td> ' +
                  '<td>'+stockinfo[i][1]+'</td>' +
                  '<td>'+stockinfo[i][2]+'</td>' +
                  '<td>'+stockinfo[i][3]+'</td>' +
                  '<td>'+stockinfo[i][4]+'</td>' +
                  '<td>'+stockinfo[i][5]+'</td>' +
                  '<td>'+stockinfo[i][6]+'</td>' +
                  '<td>'+stockinfo[i][7]+'</td>' +
                  '<td>'+(stockinfo[i][9]/100).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][9]/100*stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+((stockinfo[i][8]/100)/stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][8]/100).toFixed(2)+'</td> '+
                  '<td>'+((stockinfo[i][8] - stockinfo[i][9]*stockinfo[i][7])/100).toFixed(2)+'</td>' +
                  '<td>'+((stockinfo[i][8] - stockinfo[i][9]*stockinfo[i][7])/stockinfo[i][8]).toFixed(2)+'%'+'</td>'
              dataAllTbody.appendChild(tr)
            }
            continue
        }

        if(Number(dataAllTbody.children[dataAllTbody.children.length-1].children[2].innerHTML) != Number(stockinfo[i][2])){
            var tr1 = document.createElement("tr")
            if((stockinfo[i][9]/100).toFixed(2) == 0){
              tr1.setAttribute("class","com"+stockinfo[i][2])
              tr1.innerHTML = '<td>'+classType(stockinfo[i][0])+'</td> ' +
                  '<td>'+stockinfo[i][1]+'</td>' +
                  '<td>'+stockinfo[i][2]+'</td>' +
                  '<td>'+stockinfo[i][3]+'</td>' +
                  '<td>'+stockinfo[i][4]+'</td>' +
                  '<td>'+stockinfo[i][5]+'</td>' +
                  '<td>'+stockinfo[i][6]+'</td>' +
                  '<td>'+stockinfo[i][7]+'</td>' +
                  '<td>'+(stockinfo[i][9]/100).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][9]/100*stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+((stockinfo[i][8]/100)/stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][8]/100).toFixed(2)+'</td> '+
                  '<td>'+((stockinfo[i][8] - stockinfo[i][9]*stockinfo[i][7])/100).toFixed(2)+'</td>' +
                  '<td>100%</td>'
              dataAllTbody.appendChild(tr1)
            }else if((stockinfo[i][8]/100).toFixed(2) == 0){
              tr1.setAttribute("class","com"+stockinfo[i][2])
              tr1.innerHTML = '<td>'+classType(stockinfo[i][0])+'</td> ' +
                  '<td>'+stockinfo[i][1]+'</td>' +
                  '<td>'+stockinfo[i][2]+'</td>' +
                  '<td>'+stockinfo[i][3]+'</td>' +
                  '<td>'+stockinfo[i][4]+'</td>' +
                  '<td>'+stockinfo[i][5]+'</td>' +
                  '<td>'+stockinfo[i][6]+'</td>' +
                  '<td>'+stockinfo[i][7]+'</td>' +
                  '<td>'+(stockinfo[i][9]/100).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][9]/100*stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+((stockinfo[i][8]/100)/stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][8]/100).toFixed(2)+'</td> '+
                  '<td>'+((stockinfo[i][8] - stockinfo[i][9]*stockinfo[i][7])/100).toFixed(2)+'</td>' +
                  '<td>-100%</td>'
              dataAllTbody.appendChild(tr1)
            }else{
              tr1.setAttribute("class","com"+stockinfo[i][2])
              tr1.innerHTML = '<td>'+classType(stockinfo[i][0])+'</td> ' +
                  '<td>'+stockinfo[i][1]+'</td>' +
                  '<td>'+stockinfo[i][2]+'</td>' +
                  '<td>'+stockinfo[i][3]+'</td>' +
                  '<td>'+stockinfo[i][4]+'</td>' +
                  '<td>'+stockinfo[i][5]+'</td>' +
                  '<td>'+stockinfo[i][6]+'</td>' +
                  '<td>'+stockinfo[i][7]+'</td>' +
                  '<td>'+(stockinfo[i][9]/100).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][9]/100*stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+((stockinfo[i][8]/100)/stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][8]/100).toFixed(2)+'</td> '+
                  '<td>'+((stockinfo[i][8] - stockinfo[i][9]*stockinfo[i][7])/100).toFixed(2)+'</td>' +
                  '<td>'+((stockinfo[i][8] - stockinfo[i][9]*stockinfo[i][7])/stockinfo[i][8]).toFixed(2)+'%'+'</td>'
              dataAllTbody.appendChild(tr1)
            }
        }
        else{
            var tr2 = document.createElement("tr")
            if((stockinfo[i][9]/100).toFixed(2) == 0){
              tr2.setAttribute("class","com"+stockinfo[i][2])
              tr2.innerHTML = '<td style="visibility: hidden;">'+classType(stockinfo[i][0])+'</td> ' +
                  '<td style="visibility: hidden;">'+stockinfo[i][1]+'</td>' +
                  '<td style="visibility: hidden;">'+stockinfo[i][2]+'</td>' +
                  '<td>'+stockinfo[i][3]+'</td>' +
                  '<td>'+stockinfo[i][4]+'</td>' +
                  '<td>'+stockinfo[i][5]+'</td>' +
                  '<td>'+stockinfo[i][6]+'</td>' +
                  '<td>'+stockinfo[i][7]+'</td>' +
                  '<td>'+(stockinfo[i][9]/100).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][9]/100*stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+((stockinfo[i][8]/100)/stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][8]/100).toFixed(2)+'</td> '+
                  '<td>'+((stockinfo[i][8] - stockinfo[i][9]*stockinfo[i][7])/100).toFixed(2)+'</td>' +
                  '<td>100%</td>'
              dataAllTbody.appendChild(tr2)
            }else if((stockinfo[i][8]/100).toFixed(2) == 0){
              tr2.setAttribute("class","com"+stockinfo[i][2])
              tr2.innerHTML = '<td style="visibility: hidden;">'+classType(stockinfo[i][0])+'</td> ' +
                  '<td style="visibility: hidden;">'+stockinfo[i][1]+'</td>' +
                  '<td style="visibility: hidden;">'+stockinfo[i][2]+'</td>' +
                  '<td>'+stockinfo[i][3]+'</td>' +
                  '<td>'+stockinfo[i][4]+'</td>' +
                  '<td>'+stockinfo[i][5]+'</td>' +
                  '<td>'+stockinfo[i][6]+'</td>' +
                  '<td>'+stockinfo[i][7]+'</td>' +
                  '<td>'+(stockinfo[i][9]/100).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][9]/100*stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+((stockinfo[i][8]/100)/stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][8]/100).toFixed(2)+'</td> '+
                  '<td>'+((stockinfo[i][8] - stockinfo[i][9]*stockinfo[i][7])/100).toFixed(2)+'</td>' +
                  '<td>-100%</td>'
              dataAllTbody.appendChild(tr2)
            }else{
              tr2.setAttribute("class","com"+stockinfo[i][2])
              tr2.innerHTML = '<td style="visibility: hidden;">'+classType(stockinfo[i][0])+'</td> ' +
                  '<td style="visibility: hidden;">'+stockinfo[i][1]+'</td>' +
                  '<td style="visibility: hidden;">'+stockinfo[i][2]+'</td>' +
                  '<td>'+stockinfo[i][3]+'</td>' +
                  '<td>'+stockinfo[i][4]+'</td>' +
                  '<td>'+stockinfo[i][5]+'</td>' +
                  '<td>'+stockinfo[i][6]+'</td>' +
                  '<td>'+stockinfo[i][7]+'</td>' +
                  '<td>'+(stockinfo[i][9]/100).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][9]/100*stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+((stockinfo[i][8]/100)/stockinfo[i][7]).toFixed(2)+'</td>' +
                  '<td>'+(stockinfo[i][8]/100).toFixed(2)+'</td> '+
                  '<td>'+((stockinfo[i][8] - stockinfo[i][9]*stockinfo[i][7])/100).toFixed(2)+'</td>' +
                  '<td>'+((stockinfo[i][8] - stockinfo[i][9]*stockinfo[i][7])/stockinfo[i][8]).toFixed(2)+'%'+'</td>'
              dataAllTbody.appendChild(tr2)
            }
        }
    }
              console.log(mmm)

    var numAll = 0,spreadAll = 0,purchaseAll = 0,retailAll = 0,j
    for(j = 0;j < dataAllTbody.children.length;j++){
        numAll += Number(dataAllTbody.children[j].children[11].innerHTML)   //总价
        // spreadAll += Number(dataAllTbody.children[j].children[12].innerHTML)*Number(dataAllTbody.children[j].children[7].innerHTML)   //总差价
        retailAll += Number(dataAllTbody.children[j].children[11].innerHTML)   //总零售价
        purchaseAll += Number(dataAllTbody.children[j].children[9].innerHTML)  //总进价
    }
    spreadAll = retailAll - purchaseAll
    var tr3 = document.createElement("tr")
    tr3.innerHTML = '<td style="visibility: hidden;"></td> ' +
        '<td style="visibility: hidden;"></td>' +
        '<td style="visibility: hidden;"></td>' +
        '<td style="visibility: hidden;"></td>' +
        '<td style="visibility: hidden;"></td>' +
        '<td style="visibility: hidden;"></td>' +
        '<td style="color:red;">总进价</td>' +
        '<td style="color:red;">'+purchaseAll.toFixed(2)+'</td>' +
        '<td style="color:red;">总差价</td>' +
        '<td style="color:red;">'+spreadAll.toFixed(2)+'</td>' +
        '<td style="color:red;">总毛利率</td>' +
        '<td style="color:red;">'+(spreadAll/retailAll*100).toFixed(2)+'%</td>' +
        '<td style="color:red;">总计</td>' +
        '<td style="color:red;">'+numAll.toFixed(2)+'</td>'
    dataAllTbody.appendChild(tr3)

    var className = "className",classAllNum = -1,classMemo= []
    for(j = 0;j < dataAllTbody.children.length;j++){
      if(dataAllTbody.children[j].className == className){
        continue
      }else{
        className = dataAllTbody.children[j].className
        classMemo.push(className)
        classAllNum = classAllNum + 1
      }
    }

    var classNum,classNum1,classNum2,i = 0
    for(j = 0;j < classAllNum;j++){
     classNum = 0
     classNum1 = 0
     classNum2 = 0
     for(var k = 0;k < dataAllTbody.children.length;k++){
        if(dataAllTbody.children[k].className == classMemo[j]){
          classNum = classNum + Number(dataAllTbody.children[k].children[9].innerHTML)     //总进价
          classNum1 = classNum1 + Number(dataAllTbody.children[k].children[11].innerHTML)  //总售价
          i++
        }
      }
      classNum2 = classNum1 - classNum   //总差价
      var tr4 = document.createElement("tr")
      if(classNum1 == 0){
        tr4.innerHTML = '<td style="visibility: hidden;"></td> ' +
            '<td style="visibility: hidden;"></td>' +
            '<td style="visibility: hidden;"></td>' +
            '<td style="visibility: hidden;"></td>' +
            '<td style="visibility: hidden;"></td>' +
            '<td style="visibility: hidden;"></td>' +
            '<td style="visibility: hidden;"></td>' +
            '<td style="visibility: hidden;"></td>' +
            '<td style="color:red;">小计</td>' +
            '<td style="color:red;">'+classNum.toFixed(2)+'</td>'+
            '<td style="visibility: hidden;"></td>' +
            '<td style="color:red;">'+classNum1.toFixed(2)+'</td>'+
            '<td style="color:red;">'+classNum2.toFixed(2)+'</td>'+
            '<td style="color:red;">-100%</td>'
       dataAllTbody.insertBefore(tr4,dataAllTbody.children[i])
       i = i + 1
     }else{
       tr4.innerHTML = '<td style="visibility: hidden;"></td> ' +
           '<td style="visibility: hidden;"></td>' +
           '<td style="visibility: hidden;"></td>' +
           '<td style="visibility: hidden;"></td>' +
           '<td style="visibility: hidden;"></td>' +
           '<td style="visibility: hidden;"></td>' +
           '<td style="visibility: hidden;"></td>' +
           '<td style="visibility: hidden;"></td>' +
           '<td style="color:red;">小计</td>' +
           '<td style="color:red;">'+classNum.toFixed(2)+'</td>'+
           '<td style="visibility: hidden;"></td>' +
           '<td style="color:red;">'+classNum1.toFixed(2)+'</td>'+
           '<td style="color:red;">'+classNum2.toFixed(2)+'</td>'+
           '<td style="color:red;">'+(classNum2/classNum1*100).toFixed(2)+'%</td>'
      dataAllTbody.insertBefore(tr4,dataAllTbody.children[i])
      i = i + 1
     }
  }
}

function classType(d){   //选择大类
    var classSelect = document.querySelector("#classSelect")
    for(var i = 0;i < classSelect.children.length;i++){
        if(Number(classSelect.children[i].getAttribute("value")) == d){
            return classSelect.children[i].innerHTML
        }
    }
}

function chageDept(e){  //根据部门改变小区
	var operatingCommunity = document.querySelector("#operatingCommunity")
	if(e.value == "--请选择部门--"){
		operatingCommunity.style.display = "none"
		return
	}
	var CommunitySelect = document.querySelector("#CommunitySelect")
	operatingCommunity.style.display = "block"
	var fd = new FormData(),xml = new XMLHttpRequest()
	fd.append("dept",Number(e.value))
	xml.open("POST","/sc/statistics/getSubdistrictById",true)
    xml.send(fd)
    xml.onreadystatechange = function(){
        if (xml.readyState==4 && xml.status==200){
            var d = eval('('+xml.responseText+');')
      			CommunitySelect.innerHTML = '<option value="--请选择小区--">--请选择小区--</option>'
      			for(var i = 0;i < d.subdistrict.length;i++){
      				var option = document.createElement("option")
      				option.value = d.subdistrict[i][0]
      				option.innerHTML = d.subdistrict[i][1]
      				option.setAttribute("memo",d.subdistrict[i][2])
      				CommunitySelect.appendChild(option)
      			}
        }
    }
}


function commodityAll(e){   //供应商的选择
    var eSelect = e.parentNode.querySelector("ul")
    if(e.value.length == 0){
        eSelect.style.height = "0px"
        // e.setAttribute("commodityClass","")
        e.setAttribute("commodityNo","")
        return
    }
	  eSelect.innerHTML = ""
    var fd = new FormData(),xml = new XMLHttpRequest()
    fd.append("name",e.value)
    xml.open("POST","/sc/statistics/searchcommodity",true)
    xml.send(fd)
    xml.onreadystatechange = function(){
        if(xml.readyState == 4 && xml.status == 200){
            var d = eval('('+xml.responseText+');')
            if(d.commodityinfo.length > 0){
                for(var i = 0;i < d.commodityinfo.length;i++){
					          eSelect.style.height = "150px"
                    var option = document.createElement("li")
          					option.setAttribute("onmouseover","mOver(this)")
          					option.setAttribute("onmouseout","mOut(this)")
          					option.setAttribute("onclick","commodityOne(this)")
                    option.style.listStyle = "none"
					          option.style.cursor = "hand"
                    option.setAttribute("commodityNo",d.commodityinfo[i][4])
                    option.innerHTML = d.commodityinfo[i][1] + " " + d.commodityinfo[i][2] + " " + d.commodityinfo[i][3] + " "
                    eSelect.appendChild(option)
                }
                eSelect.style.display = "block"
            }
        }
    }
}

function commodityOne(e){   //选择商品
  	var eUl = e.parentNode
  	var eInput = eUl.parentNode.querySelector("input")
  	eInput.value = e.innerHTML
  	// eInput.setAttribute("commodityClass",e.getAttribute("commodityClass"))
  	eInput.setAttribute("commodityNo",e.getAttribute("commodityNo"))
  	eUl.innerHTML = ""
  	eUl.style.height = "0px"
    operatingDateSubmit()
}

function mOver(e){
	e.style.backgroundColor = "#FFFFFF"
}

function mOut(e){
	e.style.backgroundColor = "#EEEEEE"
}

function printAll(){
  var data = []
  var dataAllTbody = document.querySelector("#dataAllTbody")
  var dataAllThead = document.querySelector("thead").querySelector("tr")
  var fd = new FormData(),xml = new XMLHttpRequest()
  for(var k = 0;k < dataAllThead.children.length;k++){
      data.push(dataAllThead.children[k].innerHTML)
      fd.append("data",dataAllThead.children[k].innerHTML)
  }
  for(var i = 0;i < dataAllTbody.children.length;i++){
      for(var j = 0;j < dataAllTbody.children[i].children.length;j++){
          if(dataAllTbody.children[i].children[j].innerHTML == ""){
            data.push(" ")
            fd.append("data","  ")
          }else{
            if(dataAllTbody.children[i].children[j].style.visibility == "hidden"){
              data.push("")
              fd.append("data","  ")
            }else{
              data.push(dataAllTbody.children[i].children[j].innerHTML)
              fd.append("data",dataAllTbody.children[i].children[j].innerHTML)
            }
          }
      }
  }
  console.log(data.length)
  xml.open("POST","/sc/aboutcsv/purchase",true)
  xml.send(fd)
  xml.onreadystatechange = function(){
      if (xml.readyState==4 && xml.status==200){
          var d = eval('('+xml.responseText+');')
          console.log(d)
      }
  }
}
