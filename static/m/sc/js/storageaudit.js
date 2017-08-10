function loadtbl(){
    coldefs = [{
        seq: 0, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "调入库订单id", // 列标题
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
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "调入库状态", // 列标题
        visible: true, //是否可见
        name: "status", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 2, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "调入库原因", // 列标题
        visible: true, //是否可见
        name: "reason", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 3, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "调入库人员", // 列标题
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

    t = new _e["table"]()
    row_actions =[{cls:"doerow",func:function(tbl,rows){
        var stockId = tbl.data[rows][0]
        var fData = new FormData(),xml = new XMLHttpRequest()
        fData.append("id",Number(stockId))
        xml.open("POST","/sc/expressstock/get",true)
        xml.send(fData)
        xml.onreadystatechange=function()  {
            if (xml.readyState==4 && xml.status==200){
                var d = eval('('+xml.responseText+');')
                var tableDlg = "<table id='stockCom' style='width:450px;margin:20px 20px;' border='1'><thead><tr><th>库存id</th><th>商品id</th><th>商品名</th><th>调入数量</th></thead><tbody>"
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
            if(tbl.data[rows][2] == "2"){
                alert("该商品已审核")
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
            if(tbl.data[rows][2] == "1"){
                alert("该商品未审核")
                return
            }
            if(tbl.data[rows][2] == "3"){
                alert("该商品已入库成功")
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
        },title:"入库通过"}]

    rows_actions = []
    ext_row = function(rows,i){
        return "this is row "+i
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/expressstock/getin")
}
loadtbl()
t.funcs.loadData.call(t)