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
        retrievable: false, // 可检索 function
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
        seq: 7, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "规格", // 列标题
        visible: true, //是否可见
        name: "specification", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 11, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>"+item+"</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "单位", // 列标题
        visible: true, //是否可见
        name: "unit", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 12,
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
            var comChild = document.querySelector("#commodityList").children
            for(var i = 0;i< comChild.length;i++){
                if(tbl.data[rows][0] == comChild[i].querySelector("td").getAttribute("comid")){
                    _e["msgBox"]({
					    msg: "该商品已添加!",
					    timeout:3000
					})
                    return
                }
            }
            var tr = document.createElement("tr")
            tr.innerHTML = '<tr><td comNum="'+tbl.data[rows][21]+'" comId="'+tbl.data[rows][0]+'">'+ tbl.data[rows][1] +'</td>' +
                '<td style="width: 130px;"><input type="number"  class="numb" style="width: 65px;"/><span>'+tbl.data[rows][11]+'</span></td>' +
                '<td style="width: 130px;"><input type="text"  class="memo" value="" style="width: 130px;"/></td>' +
                '<td><a href="#" style="color: #0a0a0a;text-decoration:none;"><i class="icon iconfont icon-delete"  onclick="deleteCom(this)"></i></a></td></tr>'
            document.querySelector("#commodityList").appendChild(tr)
        },title:"添加"}
    ]

    rows_actions = []

    ext_row = function(rows,i){
        return "this is " + i
    }

    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/commodity/getcommoditys")
    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild(tbl_head.querySelector("#trtime"))
}

function deleteCom(e){
	if (document.querySelector("#dlgCom")) document.querySelector("#dlgCom").parentNode.removeChild(document.querySelector("#dlgCom"));
	var dlg = _e.deleteBox({id:"dlgCom",
        title:'"'+e.parentNode.parentNode.parentNode.children[0].innerHTML+'"商品',
        mainBody:"",
        actions:[{id:"btnDe1",title:"确定",func:function(){
	            e.parentNode.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode.parentNode)
	        	dlg.parentNode.removeChild(dlg)
        	}},{id:"btnDe2",title:"取消",func:function(){
        		dlg.parentNode.removeChild(dlg)
	            return
	        }}
        ]})
    dlg.show()
}


document.querySelector("#planCommodity").addEventListener("click",function(){   //提交计划
    var commodityList = document.querySelector("#commodityList")
    if(commodityList.children.length == 0){
        _e["msgBox"]({
			msg: "计划不能为空!",
			timeout:3000
		})
        return
    }
    var numb = document.querySelectorAll(".numb")
    for(var j = 0;j < numb.length;j++){
        if(Number(numb[j].value) <= 0){
        	_e["msgBox"]({
				msg: "请填写正确的采购数量!",
				timeout:3000
			})
            return
        }
    }
    var tableDlg = "<table border='1' style='width: 350px;margin:20px auto;'><thead><tr>" +
        "<th>商品名</th>" +
        "<th>数量</th>" +
        "<th>备注</th></tr></thead><tbody>"
    for(j = 0;j < commodityList.children.length;j++){
        var comTr = commodityList.children[j]
        tableDlg += "<tr><td comId='"+comTr.children[0].getAttribute('comid')+"'>"+comTr.children[0].innerHTML+"</td>"+
                "<td><span class='comNum'>"+comTr.children[1].querySelector("input").value+"</span><span>"+comTr.children[1].querySelector("span").innerHTML+"</span></td>"+
                "<td>"+comTr.children[2].querySelector("input").value+"</td></tr>"
    }
    tableDlg += "</tbody></table>"
    if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
    var dlg = _e.dialog({id:"dlgData",width:"500px",
        title:"查看当前采购表单",
        mainBody:tableDlg,
        actions:[{id:"btn",title:"确定",func:function(){
            var fd = new FormData(),xml = new XMLHttpRequest()
            var stockId = document.querySelector("#stockId")
            if(Number(stockId.getAttribute("status")) == 2 || Number(stockId.getAttribute("status")) == 5){
                fd.append("id",Number(stockId.innerHTML))
                fd.append("status",Number(stockId.getAttribute("status")))
            }
            fd.append("memoofapply",document.querySelector("#InputMemo").value)
            var tbodyChild = dlg.querySelector("tbody").children
            for(var i = 0;i < tbodyChild.length;i++){
                fd.append("commodityid",Number(tbodyChild[i].children[0].getAttribute("comid")))
                fd.append("stockamount",Number(tbodyChild[i].children[1].children[0].innerHTML))
                if(tbodyChild[i].children[2].innerHTML == ""){
                    fd.append("stockmemo","空")
                }else{
                    fd.append("stockmemo",tbodyChild[i].children[2].innerHTML)
                }
            }
            xml.open("POST","/sc/stockingplan/insert"+_e.jurisdiction(),true)
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
if(frm.getAttribute("editPurchase") == "editPurchaseAble"){
    var ComTr = JSON.parse(localStorage.getItem("editCom"))
    console.log(ComTr)
    var stockId = document.querySelector("#stockId")
    stockId.innerHTML = ComTr.stockId
    stockId.setAttribute("status",ComTr.stute)
    for(var i = 0;i < ComTr.stockCom.length;i++){    //把stockCom中的每一行copy并且列在id=commodityList的下面
        restoreCom(ComTr.stockCom[i])
    }
    frm.setAttribute("editPurchase","editPurchaseUnAble")
}

function restoreCom(restoreCom){
    var commodityList = document.querySelector("#commodityList")
    var tr = document.createElement("tr")
    tr.innerHTML = '<tr><td comNum="'+restoreCom.comNum+'" comId="'+restoreCom.comId+'">'+ restoreCom.comName +'</td>' +
        '<td style="width: 130px;"><input type="number" value="'+restoreCom.comAmount+'" class="numb" style="width: 65px;"/><span>'+restoreCom.comUnit+'</span></td>' +
        '<td style="width: 130px;"><input type="text"  class="memo" value="'+restoreCom.comMemo+'" style="width: 130px;"/></td>' +
        '<td><a href="#" style="color: #0a0a0a;text-decoration:none;"><i class="icon iconfont icon-delete"  onclick="deleteCom(this)"></i></a></td></tr>'
    commodityList.appendChild(tr)
}


var drafts=_e["getQueryString"]("drafts")
if(drafts){
    _e["gethtml"](document.querySelector('#commodityList'),'stocktingplan',['numb','memo'])
}else{
    var t2 = window.setInterval("_e.sethtml(document.querySelector('#commodityList'),'stocktingplan',['numb','memo'])",10000);
}
