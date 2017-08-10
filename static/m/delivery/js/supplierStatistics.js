function loadClass(){         //获取所有大类
    var xml = new XMLHttpRequest()
    xml.open("POST","/sc/module/getclass",true)
    xml.send()
    xml.onreadystatechange = function(){
        if (xml.readyState==4 && xml.status==200){
            var d = eval('('+xml.responseText+');')
            // console.log(d)
            var idept = document.querySelector("#dataAllClass")
            for(var i = 0;i < d.class.length;i++){
                var option=document.createElement("option")
                option.value = d.class[i][0]
                option.innerHTML = d.class[i][2]
                idept.appendChild(option)
            }
        }
    }
}
loadClass()

function loadalldept(){   //获取部门
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

function supplier(e){   //供应商的选择
    var eSelect = e.parentNode.querySelector("ul")
    eSelect.innerHTML = ""
    // console.log(eSelect)
    var fd = new FormData(),xml = new XMLHttpRequest()


    fd.append("name",e.value)
    xml.open("POST","/sc/stockingplan/searchsupplier",true)
    xml.send(fd)
    xml.onreadystatechange = function(){
        if(xml.readyState == 4 && xml.status == 200){
            var d = eval('('+xml.responseText+');')
            // console.log(d)
            if(d.stockinfo.length > 0){
                for(var i = 0;i < d.stockinfo.length;i++){
                    eSelect.style.height = "150px"
                    var option = document.createElement("li")
                    option.setAttribute("onmouseover","mOver(this)")
                    option.setAttribute("onmouseout","mOut(this)")
                    option.setAttribute("onclick","liSupplier(this)")
                    option.style.listStyle = "none"
                    option.style.cursor = "hand"
                    option.setAttribute("supplierId",d.stockinfo[i][0])
                    option.innerHTML = d.stockinfo[i][1]
                    option.setAttribute("supplierClass",d.stockinfo[i][2])
                    eSelect.appendChild(option)
                }
                eSelect.style.display = "block"
            }
        }
    }
}

function liSupplier(e){   //选择供应商
    var eUl = e.parentNode
    var eInput = eUl.parentNode.querySelector("input")
    eInput.value = e.innerHTML
    eInput.setAttribute("supplierClass",e.getAttribute("supplierClass"))
    eInput.setAttribute("supplierId",e.getAttribute("supplierId"))
    eUl.innerHTML = ""
    eUl.style.height = "0px"
}

function mOver(e){
    e.style.backgroundColor = "#FFFFFF"
}

function mOut(e){
    e.style.backgroundColor = "rgb(122, 146, 156)"
}

function operatingDateSubmit(){
  var operatingDateStart = document.querySelector("#operatingDateStart")
  var operatingDateEnd = document.querySelector("#operatingDateEnd")
  var operatingSelect = document.querySelector("#operatingSelect")
  var dataAllClass =document.querySelector("#dataAllClass")
  var supplierName = document.querySelector("#supplierName")
  var fd = new FormData(),xml = new XMLHttpRequest()
  if(operatingDateStart.value == ""){   //判断开始时间
      fd.append("starttime",Number(_e.dateToInt("2016-01-01")))
  }else{
      fd.append("starttime",Number(_e.dateToInt(operatingDateStart.value)))
  }

  if(operatingDateStart.value == "" || operatingDateEnd.value == ""){   //判断结束时间
      fd.append("endtime",Number(_e.dateToInt("2026-01-01")))
  }else{
      fd.append("endtime",Number(_e.dateToInt(operatingDateEnd.value)))
  }
  // if(supplierName.value == ""){
  //     _e["msgBox"]({
  //         msg: "请填写供应商！",
  //         timeout:3000
  //     })
  //     return
  // }
  if(operatingSelect.value == "--请选择部门--"){
      fd.append("flag",2)
      // console.log(operatingSelect.value)
  }else{
      fd.append("flag",1)
      fd.append("cdept",Number(operatingSelect.value))
      // console.log(Number(operatingSelect.value))
  }
  fd.append("supplier",Number(supplierName.getAttribute("supplierid")))
  fd.append("classid",Number(dataAllClass.value))
  xml.open("POST","/sc/statistics/statisticssupplier",true)
  xml.send(fd)
  xml.onreadystatechange = function(){
      if (xml.readyState==4 && xml.status==200){
          var d = eval('('+xml.responseText+');')
          // console.log(d)
          dateAdd(d.stockinfo)
          // var dataAllTbody = document.querySelector("#dataAllTbody")
          // dataAllTbody.innerHTML = ""
          // for(var i = 0;i < d.stockinfo.length;i++){
          //     var tr = document.createElement("tr")
          //     tr.innerHTML = "<td>"+d.stockinfo[i][2]+"</td>"+
          //         "<td>"+d.stockinfo[i][5]+"</td>"+
          //         "<td>"+d.stockinfo[i][6]+"</td>"+
          //         "<td>"+d.stockinfo[i][1]+"</td>"+
          //         "<td>"+(d.stockinfo[i][4]/100).toFixed(2)+"</td>"+
          //         "<td>"+((d.stockinfo[i][4]/100)*d.stockinfo[i][1]).toFixed(2)+"</td>"
          //     dataAllTbody.appendChild(tr)
          // }
      }
  }
}

function dateAdd(stockinfo){
  var dataAllTbody = document.querySelector("#dataAllTbody")
  dataAllTbody.innerHTML = ""
  var All = 0
  for(var i = 0;i < stockinfo.length;i++){
      var tr = document.createElement("tr")
      tr.innerHTML = "<td>"+stockinfo[i][2]+"</td>"+
          "<td>"+stockinfo[i][5]+"</td>"+
          "<td>"+stockinfo[i][6]+"</td>"+
          "<td>"+stockinfo[i][1]+"</td>"+
          "<td>"+(stockinfo[i][4]/100).toFixed(2)+"</td>"+
          "<td>"+((stockinfo[i][4]/100)*stockinfo[i][1]).toFixed(2)+"</td>"
      dataAllTbody.appendChild(tr)
      All = All + (stockinfo[i][4]/100)*stockinfo[i][1]
  }
  var tr3 = document.createElement("tr")
  tr3.innerHTML = '<td style="visibility: hidden;"></td> ' +
      '<td style="visibility: hidden;"></td>' +
      '<td style="visibility: hidden;"></td>' +
      '<td style="visibility: hidden;"></td>' +
      '<td>总计</td>' +
      '<td>'+All.toFixed(2)+'</td>'
  dataAllTbody.appendChild(tr3)
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

function printAll(){
  var data = []
  var dataAllTbody = document.querySelector("#dataAllTbody")
  var dataAllThead = document.querySelector("#dataAllThead").querySelector("tr")
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
  // console.log(data.length)
  xml.open("POST","/sc/aboutcsv/supplier",true)
  xml.send(fd)
  xml.onreadystatechange = function(){
      if (xml.readyState==4 && xml.status==200){
          var d = eval('('+xml.responseText+');')
          console.log(d)
          location.href = d.url
          _e["msgBox"]({
              msg: "该表单已导出",
              timeout:3000
          })
      }
  }
}
