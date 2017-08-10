var xhr = new XMLHttpRequest();
xhr.open("GET", "/sc/commodity/getext"+_e.jurisdiction(), true);
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        others = eval('('+xhr.responseText+');')
        trs=[]
        trs.push([0,"父节点"])
        for(var i in others.tree) {
            trs.push([others.tree[i][0],others.tree[i][2],others.tree[i][7],others.tree[i][8],["data-code",others.tree[i][1]]]);
        }
        loadtree(trs)
        loadtbl()
        t.funcs.loadData.call(t)
        _e.bind("#cqdept","change",function(){
            document.querySelector("#commodityList").innerHTML = ""
        })
    }
}
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

function loadtbl(){
    coldefs = [{
        seq: 16, //在数据[[],[]]中的位置rows[i][seq] 返回值
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
        seq: 2, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>"+item+"</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "库存数量", // 列标题
        visible: true, //是否可见
        name: "amount", //和后端对应，FormData里面的key，后端解析时要一致
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
			       var commodityList = document.querySelector("#commodityList")
             for(i = 0;i < commodityList.children.length;i++){
                if(tbl.data[rows][23] == Number(commodityList.children[i].children[0].getAttribute("comNum"))){
					             _e["msgBox"]({
          			            msg: "该商品已添加",
          			            timeout:3000
          			        })
                        return
                }
            }

            var xml = new XMLHttpRequest()
            xml.open("POST","/sc/stockingplanfer/getallunit?id="+tbl.data[rows][16]+_e.jurisdiction(1),true)
            xml.send()
            xml.onreadystatechange = function(){
                if (xml.readyState==4 && xml.status==200){
                    var d = eval('(' +xml.responseText+ ');')
                    // console.log(d)
                    var select = "<select>"
                    for(var i = 0;i < d.commodityunit.length;i++){
            						if(Number(d.commodityunit[i][4]) != tbl.data[rows][0]){
            							 select += "<option value='"+d.commodityunit[i][4]+"'>"+d.commodityunit[i][3]+"</option>"
            						}
                    }
                    select += "</select>"

                    var tr = document.createElement("tr")
                    tr.innerHTML = "<td class='comName' comNum='"+tbl.data[rows][23]+"' comId='"+tbl.data[rows][16]+"'>"+tbl.data[rows][1]+"</td>"+
                        "<td>"+tbl.data[rows][15]+"</td>"+
                        "<td><input type='number' class='damagedUnit' style='width: 80px;' amount='"+tbl.data[rows][2]+"' stockId='"+tbl.data[rows][0]+"'/><span>"+tbl.data[rows][14]+"</span></td>"+
                        "<td><input type='number' class='upintoUnit' style='width: 80px;'/>"+select+"</td>"+
                        "<td><input type='button' value='删除' onclick='deleteCom(this)'/></td>"
                    commodityList.appendChild(tr)
                }
            }

        },title:"添加"}
    ]

    rows_actions = []

    ext_row = function(rows,i){
        return "this is " + i
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/stocktransfers/getallStock"+_e.jurisdiction())
	  var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild(tbl_head.querySelector("#trtime"))
}


function deleteCom(e){
	if (document.querySelector("#dlgCom")) document.querySelector("#dlgCom").parentNode.removeChild(document.querySelector("#dlgCom"));
	var dlg = _e.deleteBox({id:"dlgCom",
        title:'"'+e.parentNode.parentNode.children[0].innerHTML+'"商品',
        mainBody:"",
        actions:[{id:"btnDe1",title:"确定",func:function(){
	            e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode)
	        	dlg.parentNode.removeChild(dlg)
        	}},{id:"btnDe2",title:"取消",func:function(){
        		dlg.parentNode.removeChild(dlg)
	            return
	        }}
        ]})
    dlg.show()
}

document.querySelector("#planCommodity").addEventListener("click",function(){    //提交报损信息
    var commodityList = document.querySelector("#commodityList")
    if(commodityList.children.length == 0){
        _e["msgBox"]({
            msg: "计划不能为空！",
            timeout:3000
        })
        return
    }
    var damagedUnit = document.querySelectorAll(".damagedUnit")
    for(var j = 0;j < damagedUnit.length;j++){
        if(Number(damagedUnit[j].value) <= 0){
            _e["msgBox"]({
                msg: "请填写正确的数量！",
                timeout:3000
            })
            return
        }
        // if(Number(damagedUnit[j].value) > Number(damagedUnit[j].getAttribute("amount"))){
        //     _e["msgBox"]({
        //         msg: "报损数量不能大于库存数量！",
        //         timeout:3000
        //     })
        //     return
        // }
    }
    var tableDlg = "<table border='1' style='width: 350px;margin:20px auto;'><thead><tr>" +
        "<th>商品名</th>" +
        "<th>规格</th>"+
        "<th>报损数量</th>"+
        "<th>补进数量</th></tr></thead><tbody>"
    for(j = 0;j < commodityList.children.length;j++){
        var comTr = commodityList.children[j]
        var unitName = ""
        for(var k = 0;k < comTr.children[3].querySelector("select").children.length;k++){
            if(comTr.children[3].querySelector("select").children[k].value == comTr.children[3].querySelector("select").value){
                unitName = comTr.children[3].querySelector("select").children[k].innerHTML
            }
        }
        tableDlg += "<tr><td comId='"+comTr.children[0].getAttribute('comid')+"'>"+comTr.children[0].innerHTML+"</td>"+
            "<td>"+comTr.children[1].innerHTML+"</td>"+
            "<td><span stockId='"+comTr.children[2].querySelector("input").getAttribute("stockId")+"'>"+comTr.children[2].querySelector("input").value +"</span>"+ comTr.children[2].querySelector("span").innerHTML+"</td>" +
            "<td><span stockId='"+comTr.children[3].querySelector("select").value+"'>"+comTr.children[3].querySelector("input").value + "</span>" + unitName+"</td></tr>"
    }
    tableDlg += "</tbody></table>"
    if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
    var dlg = _e.dialog({id:"dlgData",width:"500px",
        title:"查看当前采购表单",
        mainBody:tableDlg,
        actions:[{id:"btn",title:"确定",func:function(){
            var fd = new FormData(),xml = new XMLHttpRequest();
            var orderMemo = document.querySelector("#orderMemo").value
            if(orderMemo == ''){
                fd.append("outmemo","无")
            }else{
                fd.append("outmemo",orderMemo)
            }

            // var planCom = document.querySelector("#commodityList").children
            // for(var i = 0;i < planCom.length;i++){
            //   console.log(planCom[i])
            //   fd.append("amountreduce",Number(planCom[i].querySelector(".damagedUnit").value))
            //   fd.append("stockidreduce",Number(planCom[i].querySelector(".damagedUnit").getAttribute("stockid")))
            //   if(planCom[i].querySelector("select").length == 0){
            //     // console.log(Number(planCom[i].querySelector(".damagedUnit").getAttribute("stockid")))
            //     fd.append("amountadd",0)
            //     fd.append("stockidadd",Number(planCom[i].querySelector(".damagedUnit").getAttribute("stockid")))
            //   }else{
            //     fd.append("amountadd",Number(planCom[i].querySelector(".upintoUnit").value))
            //     fd.append("stockidadd",Number(planCom[i].querySelector("select").value))
            //   }
            // }
            var dlgTbody = dlg.querySelector("tbody")
            for(var i = 0;i < dlgTbody.children.length;i++){
              fd.append("amountreduce",Number(dlgTbody.children[i].children[2].children[0].innerHTML))
              fd.append("stockidreduce",Number(dlgTbody.children[i].children[2].children[0].getAttribute("stockid")))
              fd.append("amountadd",Number(dlgTbody.children[i].children[3].children[0].innerHTML))
              if(Number(dlgTbody.children[i].children[3].children[0].getAttribute("stockid")) > 0){
                fd.append("stockidadd",Number(dlgTbody.children[i].children[3].children[0].getAttribute("stockid")))
              }else{
                fd.append("stockidadd",Number(dlgTbody.children[i].children[2].children[0].getAttribute("stockid")))
              }

            }

            if(Number(document.querySelector("#orderForm").innerHTML) > 0 ){
                fd.append("stocktransferid",Number(document.querySelector("#orderForm").innerHTML))
            }
            xml.open("POST","/sc/stockloss/insert"+_e.jurisdiction(),true)
            xml.send(fd)
            xml.onreadystatechange = function(){
                if (xml.readyState==4 && xml.status==200){
                    var d = eval('(' +xml.responseText+ ');')
                    _e["msgBox"]({
      		                msg: d.msg,
      		                className: d.res==-1 ? "error":"success",
      		                timeout:3000
      		          })
                    setTimeout(function(){
                        self.location.reload()
                    },3000)
                    dlg.parentNode.removeChild(dlg)
                }
            }
        }}]})
    dlg.show()
},true)



var frm = window.parent.document.querySelector("#frm")        //把原有的copy一份放回这里
if(frm.getAttribute("damagedEdit") == "editDamagedAble"){
    var ComTr = JSON.parse(localStorage.getItem("editDamaged"))
    var stockId = document.querySelector("#orderForm")
    stockId.innerHTML = ComTr.stockId
    var description = document.querySelector("#orderMemo")
    description.value = ComTr.Memo
    for(var i = 0;i < ComTr.stockCom.length;i++){    //把stockCom中的每一行copy并且列在id=commodityList的下面
        restoreCom(ComTr.stockCom[i])
    }
    frm.setAttribute("damagedEdit","editDamagedUnAble")
}

function restoreCom(restoreCom){
	  var xml = new XMLHttpRequest()
    xml.open("POST","/sc/stockingplanfer/getallunit?id="+Number(restoreCom.comId)+_e.jurisdiction(1),true)
    xml.send()
    xml.onreadystatechange = function(){
    if (xml.readyState==4 && xml.status==200){
			var d = eval('(' +xml.responseText+ ');')
			console.log(d)

      var select
      if(d.res == -1){
        select = "<select></select>"
      }else{
        select = "<select><option value='"+restoreCom.comUpintoStockId+"'>"+restoreCom.comUpintoUnit+"</option>"
        for(var i = 0;i < d.commodityunit.length;i++){
    				if(Number(restoreCom.comUpintoStockId) != d.commodityunit[i][4] && restoreCom.comDamagedStockId != d.commodityunit[i][4]){
    					select += "<option value='"+d.commodityunit[i][4]+"'>"+d.commodityunit[i][3]+"</option>"
    				}
        }
        select += "</select>"
      }

			var commodityList = document.querySelector("#commodityList")
   		 	var tr = document.createElement("tr")
    		tr.innerHTML = "<td class='comName' comId='"+restoreCom.comId+"' comNum='"+restoreCom.comNum+"'>"+restoreCom.comName+"</td>"+
            	"<td>"+restoreCom.comSe+"</td>"+
           	 	"<td><input type='number' class='damagedUnit' style='width: 80px;' value='"+restoreCom.comDamagedAmount+"' stockId='"+restoreCom.comDamagedStockId+"'/><span>"+restoreCom.comDamagedUnit+"</span></td>"+
           	 	"<td><input type='number' class='upintoUnit' style='width: 80px;' value='"+restoreCom.comUpintoAmount+"'/>"+select+"</td>"+
            	"<td><input type='button' value='删除' onclick='deleteCom(this)'/></td>"
    		commodityList.appendChild(tr)
		}
	}
}
