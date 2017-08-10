function loadtbl(){
    coldefs = [{
        seq: 0, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "调出库订单id", // 列标题
        visible: true, //是否可见
        checkall: false, // 是否可全选
        isID: 1,
        name: "id", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 1, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            if(item == '1'){
                return "<b>审核中</b>"
            }
            if(item == '2'){
                return "<b>审核完成</b>"
            }
            if(item == '3'){
                return "<b>出库完成</b>"
            }
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "调出库状态", // 列标题
        visible: true, //是否可见
        name: "status", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 2, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "调出库原因", // 列标题
        visible: true, //是否可见
        name: "reason", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 3, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "调出库人员", // 列标题
        visible: true, //是否可见
        name: "deptout", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 5, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>"+item+"</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "审批人员", // 列标题
        visible: true, //是否可见
        name: "checkedby", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 4, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>"+item+"</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "创建时间", // 列标题
        visible: true, //是否可见
        name: "created", //和后端对应，FormData里面的key，后端解析时要一致
    }]

    t = new _e["table"]();
    row_actions =[{cls:"doerow",func:function(tbl,rows){
        var stockId = tbl.data[rows][0]
        var fData = new FormData(),xml = new XMLHttpRequest()
        fData.append("id",Number(stockId))
        xml.open("POST","/sc/expressstock/get",true)
        xml.send(fData);
        xml.onreadystatechange=function()  {
            if (xml.readyState==4 && xml.status==200){
                var d = eval('('+xml.responseText+');')
                var tableDlg = "<table id='stockCom' style='width:450px;margin-top: 20px;' border='1'><thead><tr><th>库存id</th>" +
                    "<th>商品id</th><th>商品名</th><th>出库数量</th></thead><tbody>"
                for(var i = 0;i < d.stockinfo.length;i++){
                    tableDlg += "<tr><td>"+d.stockinfo[i][0]+"</td>" +
                        "<td>"+d.stockinfo[i][1]+"</td>" +
                        "<td>"+d.stockinfo[i][2]+"</td>" +
                        "<td>"+d.stockinfo[i][3]+"</td>" +
                        "</tr>"
                }

                if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                var dlg = _e.dialog({id:"dlgData",width:"500px",
                    title:"查看入库订单",
                    mainBody:tableDlg})
                dlg.show()
            }
        }
    },title:"查看出库"},
        {cls:"doerow",func:function(tbl,rows){
            if(tbl.data[rows][1] == "2"){
                alert("该商品已审核")
                return
            }
            if(tbl.data[rows][1] == "3"){
                alert("该商品已出库完成")
                return
            }
            var stockId = tbl.data[rows][0]
            var fData = new FormData(),xml = new XMLHttpRequest()
            fData.append("id",Number(stockId))
            xml.open("POST","/sc/expressstockpass/pass",true)
            xml.send(fData)
            xml.onreadystatechange=function()  {
                if (xml.readyState==4 && xml.status==200){
                    var d = eval('('+xml.responseText+');')
                    self.location.reload()
                    _e["msgBox"]({
                        msg: d.msg,
                        className: d.res==-1 ? "error":"success",
                        timeout:3000
                    })
                }
            }
        },title:"审核"},
        {cls:"doerow",func:function(tbl,rows){
            if(tbl.data[rows][1] == "1"){
                alert("该商品未审核")
                return
            }
            if(tbl.data[rows][1] == "3"){
                alert("该商品已出库成功")
                return
            }
            var stockId = tbl.data[rows][0]
            var fData = new FormData(),xml = new XMLHttpRequest()
            fData.append("id",Number(stockId))
            xml.open("POST","/sc/expressstock/get",true)
            xml.send(fData)
            xml.onreadystatechange=function()  {
                if (xml.readyState==4 && xml.status==200){
                    var d = eval('('+xml.responseText+');')
                    var tableDlg = "<table id='stockCom' style='width:450px;margin-top: 20px;' border='1'><thead><tr><th>库存id</th>" +
                        "<th>商品id</th><th>商品名</th><th>出库数量</th></thead><tbody>"
                    for(var i = 0;i < d.stockinfo.length;i++){
                        tableDlg += "<tr><td>"+d.stockinfo[i][0]+"</td>" +
                            "<td>"+d.stockinfo[i][1]+"</td>" +
                            "<td>"+d.stockinfo[i][2]+"</td>" +
                            "<td>"+d.stockinfo[i][3]+"</td>" +
                            "</tr>"
                    }
                    if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                    var dlg = _e.dialog({id:"dlgData",width:"500px",
                        title:"查看入库订单",
                        mainBody:tableDlg,
                        actions:[{id:"btn",title:"入库通过",func:function(){
                            var fd = new FormData(),xhr = new XMLHttpRequest()
                            fd.append("id",Number(tbl.data[rows][0]))
                            fd.append("inorout",1)
                            fd.append("checkedby",Number(tbl.data[rows][5]))
                            fd.append("reason",tbl.data[rows][2])
                            var stockTr = dlg.querySelector("tbody").children
                            for(var j = 0;j < stockTr.length;j++){
                                fd.append("stockid",Number(stockTr[j].children[0].innerHTML))
                                fd.append("amount",Number(stockTr[j].children[3].innerHTML))
                            }

                            xhr.open("POST","/sc/expressstockpass/inoroutexpressstock",true)
                            xhr.send(fd)
                            xhr.onreadystatechange=function()  {
                                if (xhr.readyState==4 && xhr.status==200){
                                    var d = eval('('+xhr.responseText+');')
                                    self.location.reload()
                                    _e["msgBox"]({
                                        msg: d.msg,
                                        className: d.res==-1 ? "error":"success",
                                        timeout:3000
                                    })
                                }
                            }
                        }}]})
                    dlg.show()
                }
            }
        },title:"出库通过"}]

    rows_actions = [];
    ext_row = function(rows,i){
        return "this is row "+i
    };
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/expressstock/getout")
}
loadtbl();
t.funcs.loadData.call(t);


function  loadDate(options){
    var options_ = options?options:new Error("option is error"), 
        fData = new FormData(),
        xml = new XMLHttpRequest()
    fData.append(options["data"])
    xml.open(options["method"],option)
    
    var fData = new FormData(),xml = new XMLHttpRequest();
    
}