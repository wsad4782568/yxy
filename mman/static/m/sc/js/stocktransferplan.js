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
        _e.bind("#cqdept","change",function(){
            document.querySelector("#commodityList").innerHTML = ""
        })
        loadDate({
            data:{},
            method:"post",
            url:"/basis/department/getdept",
            callback:function(d){
                var selectDepartIn =  document.querySelector("#recallLibrary")
                var alldept = JSON.parse(localStorage.getItem("alldept"))
                for(var i = 0;i < alldept.length;i++){
                  selectDepartIn.innerHTML += "<option value='"+alldept[i].id+"'>"+alldept[i].name+"</option>"
                }

                var selectDepartCqdept =  document.querySelector("#cqdept")
                selectDepartCqdept.parentNode.children[0].innerHTML = "申请调出库部门"
                selectDepartCqdept.innerHTML = ""
                for(var i = 0;i < d.dept.length;i++){
                    selectDepartCqdept.innerHTML += "<option value='"+d.dept[i][0]+"'>"+d.dept[i][1]+"</option>"
                }
            }
        })
    }
})

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
    row_actions =[{cls:"doerow",func:function(tbl,rows){
        var commodityList = document.querySelector("#commodityList")
        for(var i = 0;i < commodityList.children.length;i++){
            if(tbl.data[rows][0] == commodityList.children[i].children[0].getAttribute("stockId")){
                _e["msgBox"]({
        					msg: "该商品已添加!",
        					timeout:3000
        				})
                return
            }
        }
        var tr = document.createElement("tr")
        tr.innerHTML = "<td class='comName' comId='"+tbl.data[rows][16]+"' stockId='"+tbl.data[rows][0]+"'>"+tbl.data[rows][1]+"</td>"+
            "<td>"+tbl.data[rows][15]+"</td>"+
            "<td>"+tbl.data[rows][14]+"</td>"+
            "<td style='width: 80px'><input type='number' class='comAmount' comNum='"+tbl.data[rows][2]+"' style='width: 80px'/></td>"+
            "<td><input type='button' onclick='deleteCom(this)' value='删除'/></td>"
        commodityList.appendChild(tr)
    },title:"添加"}]

    rows_actions = []

    ext_row = function(rows,i){
        return "this is " + i
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/stocktransfers/getallStock"+_e.jurisdiction())
	  var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild(tbl_head.querySelector("#trtime"))

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

document.querySelector("#planCommodity").addEventListener("click",function(){
    var commodityList = document.querySelector("#commodityList").children
    var inDepartment = document.querySelector("#recallLibrary")
    if(commodityList.length == 0){
        _e["msgBox"]({
            msg: "订单不能为空！",
            timeout:3000
        })
        return
    }
    var comAmount = document.querySelectorAll(".comAmount")
    for(var j = 0;j < comAmount.length;j++){
        if(Number(comAmount[j].value) < 0){
            _e["msgBox"]({
				msg: "请输入正确的数量!",
				timeout:3000
			})
            return
        }
        if(Number(comAmount[j].value) > Number(comAmount[j].getAttribute("comNum"))){
            _e["msgBox"]({
				msg: comAmount[j].parentNode.parentNode.children[0].innerHTML+"的数量大于库存数量!",
				timeout:3000
			})
            return
        }
    }
    var description = document.querySelector("#description")
    var fd = new FormData(),xhr = new XMLHttpRequest()
    if(description.value == ''){
        fd.append("outmemo","无")
    }else{
        fd.append("outmemo",document.querySelector("#description").value)
    }
    var outDepartment = document.querySelector("#cqdept")
    if(Number(inDepartment.value) == Number(outDepartment.value)){
        _e["msgBox"]({
          msg: "同种部门不能调库!",
          timeout:3000
        })
        return
    }
    fd.append("deptin",Number(inDepartment.value))   //调出库部门id
    fd.append("deptout",Number(outDepartment.value))
    for(var i = 0;i < commodityList.length;i++){
        fd.append("stockid",Number(commodityList[i].children[0].getAttribute("stockId")))
        fd.append("amount",Number(commodityList[i].querySelector(".comAmount").value))
    }
    // var url = "/sc/stocktransfer/insert"
    // if(Number(document.querySelector("#playId").innerHTML) > 0){
        // url = "/sc/stockingplanfer/update"
    //     fd.append("stocktransferid",Number(document.querySelector("#playId").innerHTML))
    // }
    xhr.open("POST","/sc/stocktransfer/insert"+_e.jurisdiction(),true)
    xhr.send(fd)
    xhr.onreadystatechange = function(){
        if (xhr.readyState==4 && xhr.status==200){
            var d = eval('('+xhr.responseText+');')
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
},true)

var frm = window.parent.document.querySelector("#frm")        //把原有的copy一份放回这里
if(frm.getAttribute("schedulingEdit") == "editSchedulingAble"){
    _e["msgBox"]({
      msg: "请重新选择调出库部门和调入库部门!",
      timeout:3000
    })
    var ComTr = JSON.parse(localStorage.getItem("editScheduling"))
    var stockId = document.querySelector("#playId")
    stockId.innerHTML = ComTr.stockId
    var description = document.querySelector("#description")
    description.value = ComTr.Memo
    for(var i = 0;i < ComTr.stockCom.length;i++){    //把stockCom中的每一行copy并且列在id=commodityList的下面
        restoreCom(ComTr.stockCom[i])
    }
    frm.setAttribute("schedulingEdit","editSchedulingUnAble")
}

function restoreCom(restoreCom){
    var commodityList = document.querySelector("#commodityList")
    var tr = document.createElement("tr")
    tr.innerHTML = "<td class='comName' comId='"+restoreCom.comId+"' stockId='"+restoreCom.stockId+"'>"+restoreCom.comName+"</td>"+
        "<td>"+restoreCom.comSpe+"</td>"+
        "<td>"+restoreCom.comUnit+"</td>"+
        "<td style='width: 80px'><input type='number' class='comAmount' comNum='10000000' value='"+restoreCom.comAmount+"' style='width: 80px'/></td>"+
        "<td><input type='button' onclick='deleteCom(this)' value='删除'/></td>"
    commodityList.appendChild(tr)
}

var drafts=_e["getQueryString"]("drafts")
if(drafts){
    _e["gethtml"](document.querySelector('#commodityList'),'stocktransferplan',['comAmount'])
}else{
    var t2 = window.setInterval("_e.sethtml(document.querySelector('#commodityList'),'stocktransferplan',['comAmount'])",10000);
}
