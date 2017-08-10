function deptAll(){
    var data = {}
    data.flag = 1
    var curDate = new Date()
    data.starttime = Number(_e.dateToInt(curDate.toLocaleDateString()))
    loadDate({
        data:data,
        method:"post",
        url:"/sc/checkstocking/statisticsplanbydept",
        callback:function(d){
            if(d.res == -1){
                _e["msgBox"]({
	                msg: d.msg,
	                timeout:3000
	            })
                return
            }
            var objectList = new Array()
            for(var i = 0;i < d.stockinfo.length;i++){  //把
                objectList.push(d.stockinfo[i])
            }
            objectList.sort(function(a,b){ return a[4]-b[4] });   //按流水号从小到大排序
            var commodityTbody = document.querySelector(".commodityTbody")
            commodityTbody.innerHTML = ''
            for(i = 0;i < objectList.length;i++){
                var tr = document.createElement("tr")
                tr.innerHTML = "<td>"+objectList[i][0]+"</td>"+
                    "<td>"+objectList[i][2]+"</td>"+
                    "<td>"+objectList[i][4]+"</td>"+
                    "<td>"+objectList[i][5]+"</td>"+
                    "<td>"+objectList[i][3]+"</td>"+
                    "<td>"+objectList[i][1]+"</td>"+
                    "<td><input type='button' value='添加' onclick='addCom(this)'/></td>"
                commodityTbody.appendChild(tr)
            }
        }
    })
}
deptAll()

function departmentAll(){   //函数一开始就加载部门信息
    var allDept = JSON.parse(localStorage.getItem("alldept"))
    var deptName = document.querySelector("#deptName")
    for(var i = 0;i < allDept.length;i++){
        deptName.innerHTML += "<input type='radio' name='dept' deptId='"+allDept[i].id+"' onclick='blockStaff(this)'>"+allDept[i].name+"<br/>"
    }
}
departmentAll()

function blockStaff(e){     //加载当前点击部门的人员
    var data = {}
    data.cdept = Number(e.getAttribute("deptId"))
    console.log(data)
    loadDate({
        data:data,
        method:"post",
        url:"/sc/stockingplan/statisticsasstaff",
        callback:function(d){
            console.log(d)
            if(d.res == -1){
                _e["msgBox"]({
               		msg: d.msg,
	                timeout:3000
	            })
                return
            }
            var staffId = document.querySelector("#staffId")
            staffId.innerHTML = ""
            for(var i = 0;i < d.stockinfo.length;i++){
                staffId.innerHTML += "<input type='radio' name='staff' dept='"+data.cdept+"' staffId='"+d.stockinfo[i][0]+"' onclick='staffCom(this)'/>"+d.stockinfo[i][1]+"<br/>"
            }
        }
    })

    if(Number(e.getAttribute("deptid")) == 0){
    	deptAll()
    }else{
    	var data1 = {}
	    data1.cdept = Number(e.getAttribute("deptid"))
	    data1.flag = 3
	    var curDate = new Date()
	    data1.starttime = Number(_e.dateToInt(curDate.toLocaleDateString()))
	    loadDate({
	        data:data1,
	        method:"post",
	        url:"/sc/checkstocking/statisticsplanbydept",
	        callback:function(d){
	            if(d.res == -1){
	                _e["msgBox"]({
		                msg: d.msg,
		                timeout:3000
		            })
	                return
	            }
	            var objectList = new Array()
	            for(var i = 0;i < d.stockinfo.length;i++){  //把
	                objectList.push(d.stockinfo[i])
	            }
	            objectList.sort(function(a,b){ return a[4]-b[4] });   //按流水号从小到大排序
	            var commodityTbody = document.querySelector(".commodityTbody")
	            commodityTbody.innerHTML = ''
	            for(i = 0;i < objectList.length;i++){
	                var tr = document.createElement("tr")
	                tr.innerHTML = "<td>"+objectList[i][0]+"</td>"+
	                    "<td>"+objectList[i][2]+"</td>"+
	                    "<td>"+objectList[i][4]+"</td>"+
	                    "<td>"+objectList[i][5]+"</td>"+
	                    "<td>"+objectList[i][3]+"</td>"+
	                    "<td>"+objectList[i][1]+"</td>"+
	                    "<td><input type='button' value='添加' onclick='addCom(this)'/></td>"
	                commodityTbody.appendChild(tr)
	            }
	        }
	    })
    }
}

function staffCom(e){         //加载几天该人下的订单
	var data = {}
	data.cdept = Number(e.getAttribute("dept"))
  data.staff = Number(e.getAttribute("staffid"))
  data.flag = 2
	var curDate = new Date()
	data.starttime = Number(_e.dateToInt(curDate.toLocaleDateString()))
	loadDate({
	    data:data,
	    method:"post",
	    url:"/sc/checkstocking/statisticsplanbydept",
	    callback:function(d){
	        if(d.res == -1){
	            _e["msgBox"]({
		            msg: d.msg,
		            timeout:3000
		        })
	            return
	        }
	        var objectList = new Array()
	        for(var i = 0;i < d.stockinfo.length;i++){  //把
	            objectList.push(d.stockinfo[i])
	        }
	        objectList.sort(function(a,b){ return a[4]-b[4] });   //按流水号从小到大排序
	        var commodityTbody = document.querySelector(".commodityTbody")
	        commodityTbody.innerHTML = ''
	        for(i = 0;i < objectList.length;i++){
	            var tr = document.createElement("tr")
	            tr.innerHTML = "<td>"+objectList[i][0]+"</td>"+
	                "<td>"+objectList[i][2]+"</td>"+
	                "<td>"+objectList[i][4]+"</td>"+
	                "<td>"+objectList[i][5]+"</td>"+
	                "<td>"+objectList[i][3]+"</td>"+
	                "<td>"+objectList[i][1]+"</td>"+
	                "<td><input type='button' value='添加' onclick='addCom(this)'/></td>"
	            commodityTbody.appendChild(tr)
	        }
	    }
	})
}

function toDay(e){   //快捷加载信息
  var tody=_e["CurentTime"]()
  todyAddOne=_e["addDate"](tody,1)
  var operatingDateStart = document.querySelector("#timeStart")
  operatingDateStart.value = _e["addDate"](tody,1-Number(e.getAttribute("dataValue")))
  var operatingDateEnd = document.querySelector("#timeEnd")
  operatingDateEnd.value = todyAddOne
  timeTwo()
}

function timeTwo(){    //加载数据
  var timeStart = document.querySelector("#timeStart")
  var timeEnd = document.querySelector("#timeEnd")
  var data = {}
  var staffId = document.querySelector("#staffId")
  var deptName = document.querySelector("#deptName")
  for(var i = 0;i < deptName.children.length;i++){
      if(deptName.children[i].checked == true){
          if(Number(deptName.children[i].getAttribute("deptid")) == 0){
              data.flag = 1
              break
          }
          var staffFlag = 0
          for(var j = 0;j < staffId.children.length;j++){
              if(staffId.children[j].checked == true){
                  data.cdept = Number(staffId.children[j].getAttribute("dept"))
                  data.staff = Number(staffId.children[j].getAttribute("staffid"))
                  data.flag = 2
                  staffFlag = 1
                  break
              }
          }
          if(staffFlag == 1){
              break
          }else{
              data.cdept = Number(deptName.children[i].getAttribute("deptid"))
              data.flag = 3
              break
          }
      }
  }
  if(timeStart.value == ""){
      data.starttime = Number(_e.dateToInt("2016-01-01"))
  }else{
    console.log(timeStart.value)
    data.starttime = Number(_e.dateToInt(timeStart.value))
  }

  if(timeEnd.value == ""){
      data.timeEnd = Number(_e.dateToInt("2016-01-01"))
  }else{
      console.log(timeEnd.value)
      data.endtime = Number(_e.dateToInt(timeEnd.value))
  }

  console.log(data)
  loadDate({
      data:data,
      method:"post",
      url:"/sc/stockingplan/statisticsplan",
      callback:function(d){
          console.log(d)
          if(d.res == -1){
              _e["msgBox"]({
                msg: d.msg,
                timeout:3000
            })
              return
          }
          var objectList = new Array()
          for(i = 0;i < d.stockinfo.length;i++){  //把
              objectList.push(d.stockinfo[i])
          }
          objectList.sort(function(a,b){ return a[4]-b[4] });   //按流水号从小到大排序
          var commodityTbody = document.querySelector(".commodityTbody")
          commodityTbody.innerHTML = ''
          for(i = 0;i < objectList.length;i++){
              var tr = document.createElement("tr")
              tr.innerHTML = "<td>"+objectList[i][0]+"</td>"+
                  "<td>"+objectList[i][2]+"</td>"+
                  "<td >"+objectList[i][4]+"</td>"+
                  "<td>"+objectList[i][5]+"</td>"+
                  "<td>"+objectList[i][3]+"</td>"+
                  "<td>"+objectList[i][1]+"</td>"+
                  "<td><input type='button' value='添加' onclick='addCom(this)'/></td>"
              commodityTbody.appendChild(tr)
          }
      }
  })
}
// document.querySelector("#timeTwo").addEventListener("click",function(){
//
// },true)

function addCom(e){        //把当前点击的一行添加到右边
    var eTdAll = e.parentNode.parentNode.children   //得到当前点击的一行
    var mainRightTbody = document.querySelector(".mainRight").querySelector("tbody")    //得到右边要添加的节点
    for(var i = 0;i < mainRightTbody.children.length;i++){
        if(eTdAll[2].innerHTML == mainRightTbody.children[i].children[1].innerHTML){
            _e["msgBox"]({
                msg: "该商品已添加",
                timeout: 3000
            })
            return
        }
    }
    var tr = document.createElement("tr")
    tr.innerHTML = "<td class='comName'>"+eTdAll[1].innerHTML+"</td>"+
            "<td class='comNum'>"+eTdAll[2].innerHTML+"</td>"+
            "<td class='comSp'>"+eTdAll[3].innerHTML+"</td>"+
            "<td style='width: 120px;'><input type='number' class='comAount' style='width: 80px;'/>件</td>"+
            "<td style='width:100px;'><input  class='comMemo' type='text' style='width:100px;'/></td>"+
            "<td><input type='button' value='删除' onclick='deleteCom(this)'/></td>"
    mainRightTbody.appendChild(tr)
}

_e.bind("#addComListAll","click",function(){
  var comDetailTbody = document.querySelector(".commodityTbody")
  for (var i = 0; i < comDetailTbody.children.length; i++) {
      var comDetailTbodyClick = comDetailTbody.children[i].children[6].children[0]
      addCom(comDetailTbodyClick)
  }
})

function deleteCom(q){   //删除当前的一行
    var q = q.parentNode.parentNode
    q.parentNode.removeChild(q)
}

_e.bind("#carryOut","click",function(){
    var fd = new FormData(),xml = new XMLHttpRequest()
    var bigMemo = document.querySelector(".bigMemo")
    fd.append("bigmemo",bigMemo.value)
    if(Number(bigMemo.getAttribute("bigMemoId")) > 0){
        fd.append("stockId",Number(bigMemo.getAttribute("bigMemoId")))
    }
    var mainRightTbody = document.querySelector(".mainRight").querySelector("tbody")
    for(var i = 0;i < mainRightTbody.children.length;i++){
        fd.append("commodityserial",Number(mainRightTbody.children[i].querySelector(".comNum").innerHTML))
        fd.append("commodityname",mainRightTbody.children[i].querySelector(".comName").innerHTML)
        fd.append("unit","件")
        fd.append("amountitem",Number(mainRightTbody.children[i].querySelector(".comAount").value))
        fd.append("specification",mainRightTbody.children[i].querySelector(".comSp").innerHTML)
        if(mainRightTbody.children[i].querySelector(".comMemo").value == ""){
            fd.append("memo","无")
        }else{
            fd.append("memo",mainRightTbody.children[i].querySelector(".comMemo").value)
        }
    }
    fd.append("status",1)
    xml.open("POST","/sc/checkstocking/trueplan",true)
    xml.send(fd)
    xml.onreadystatechange = function(){
        if (xml.readyState==4 && xml.status==200){
            var d = eval('('+xml.responseText+');')
            _e["msgBox"]({
                msg: d.msg,
                className: d.res==-1 ? "error":"success",
                timeout:3000
            })
            setTimeout(function(){
                self.location.reload()
            },3000)
        }
    }
})

var drafts=_e["getQueryString"]("drafts")
if(drafts){
    _e["gethtml"](document.querySelector('#commodityList'),'statistics',['comAount','comMemo'])
}else{
    var t2 = window.setInterval("_e.sethtml(document.querySelector('#commodityList'),'statistics',['comAount','comMemo'])",10000);
}

_e.bind("#addCom", "click", function() { //点击补进商品弹出所有商品的dlg
    if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
    var dlg = _e.dialog({
        id: "dlgData",
        width: "600px",
        title: "补进商品列表",
        mainBody: '<div id="table" style="margin-top: 10px;"></div>',
        actions: [{
            id: "btn",
            title: "关闭",
            func: function() {
                dlg.parentNode.removeChild(dlg)
            }
        }]
    })
    dlg.show()

    function loadtbl() {
        coldefs1 = [{
            seq: 16, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function(item) {
                return "<b>" + item + "</b>"
            }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable: true, // 可排序 function
            retrievable: true, // 可检索 function
            title: "流水号", // 列标题
            visible: true, //是否可见
            checkall: false, // 是否可全选
            isID: 1,
            name: "commodity", //和后端对应，FormData里面的key，后端解析时要一致
        }, {
            seq: 1, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function(item) {
                return "<b>" + item + "</b>"
            }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable: true, // 可排序 function
            retrievable: true, // 可检索 function
            title: "商品名", // 列标题
            visible: true, //是否可见
            name: "name", //和后端对应，FormData里面的key，后端解析时要一致
        }, {
            seq: 15, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function(item) {
                return "<b>" + item + "</b>"
            }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable: true, // 可排序 function
            retrievable: true, // 可检索 function
            title: "规格", // 列标题
            visible: true, //是否可见
            name: "specification", //和后端对应，FormData里面的key，后端解析时要一致
        }, {
            seq: 14, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function(item) {
                return "<b>" + item + "</b>"
            }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable: true, // 可排序 function
            retrievable: true, // 可检索 function
            title: "单位", // 列标题
            visible: true, //是否可见
            name: "unit", //和后端对应，FormData里面的key，后端解析时要一致
        }]

        t1 = new _e["table"]()
        row_actions1 = [{
            cls: "doerow",
            func: function(tbl, rows) {
                var mainRightTbody = document.querySelector("#commodityList")    //得到右边要添加的节点
                for(var i = 0;i < mainRightTbody.children.length;i++){
                    if(tbl.data[rows][23] == mainRightTbody.children[i].children[1].innerHTML){
                        _e["msgBox"]({
                            msg: "该商品已添加",
                            timeout: 3000
                        })
                        return
                    }
                }
                var tr = document.createElement("tr")
                tr.innerHTML = "<td class='comName'>"+tbl.data[rows][1]+"</td>"+
                        "<td class='comNum'>"+tbl.data[rows][23]+"</td>"+
                        "<td class='comSp'>"+tbl.data[rows][15]+"</td>"+
                        "<td style='width: 120px;'><input type='number' class='comAount' style='width: 80px;'/>件</td>"+
                        "<td style='width:100px;'><input  class='comMemo' type='text' style='width:100px;'/></td>"+
                        "<td><input type='button' value='删除' onclick='deleteCom(this)'/></td>"
                mainRightTbody.appendChild(tr)
            },title: "新增"
        }]

        rows_actions1 = []

        ext_row1 = function(rows, i) {
            return "this is " + i
        }

        t1.funcs.init.call(t1, "table",
            coldefs1, row_actions1, rows_actions1, "table", "__THE__TABLE__1", ext_row1, "/sc/stock/get" + _e.jurisdiction())
        var tbl_head = document.querySelector("#table").querySelector("thead")
        tbl_head.querySelector("#trtime").parentNode.removeChild(tbl_head.querySelector("#trtime"))
    }
    loadtbl()
    t1.funcs.loadData.call(t1)
})

var frm = window.parent.document.querySelector("#frm")        //把原有的copy一份放回这里
if(frm.getAttribute("editStatistics") == "editStatisticsAble"){
    var ComTr = JSON.parse(localStorage.getItem("editStatistics"))
    var bigMemo = document.querySelector(".bigMemo")
    bigMemo.setAttribute("bigMemoId",ComTr.stockId)
    bigMemo.value = ComTr.stockMemo
    for(var i = 0;i < ComTr.stockCom.length;i++){    //把stockCom中的每一行copy并且列在id=commodityList的下面
        restoreCom(ComTr.stockCom[i])
    }
    frm.setAttribute("editStatistics","editStatisticsUnAble")
}

function restoreCom(restoreCom){
    var commodityList = document.querySelector("#commodityList")
    var tr = document.createElement("tr")
    tr.innerHTML = "<td class='comName'>"+ComTr.stockCom[i][1]+"</td>"+
            "<td class='comNum'>"+ComTr.stockCom[i][0]+"</td>"+
            "<td class='comSp'>"+ComTr.stockCom[i][2]+"</td>"+
            "<td style='width: 120px;'><input type='number' class='comAount' value='"+ComTr.stockCom[i][3]+"' style='width: 80px;'/>件</td>"+
            "<td style='width:100px;'><input type='text' class='comMemo' value='"+ComTr.stockCom[i][4]+"' style='width:100px;'/></td>"+
            "<td><input type='button' value='删除' onclick='deleteCom(this)'/></td>"
    commodityList.appendChild(tr)
}
