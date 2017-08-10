/**
 * Created by Administrator on 2016/6/25.
 */
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://211.69.228.169:8081/sc/stocking/getextend", true);
xhr.send();
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        stockingextend = eval('(' + xhr.responseText + ');')
        if (stockingextend.res != 0) {
            _e["msgBox"]({
                msg: "发生了未知的错误"
            })
        } else {
            dept = []
            for (var i = 0; i < stockingextend.dept.length; i++) {
                dept.push([stockingextend.dept[i][0], stockingextend.dept[i][1], 0, 1])
            }
            var status = [
                [1, "编辑中", 0, 1],
                [2, "待审中", 0, 1],
                [3, "审核通过", 0, 1],
                [4, "进货入库完成", 0, 1]
            ]
            loadtree(status)
            loadtbl()
            t.funcs.loadData.call(t)
        }
    }
}

function loadtree(treedata) {
    var trs = new _e["tree"]()
    var event = [{
        e: "click",
        func: function() { //需要绑定的函数，绑定tbl
            t.funcs.loadData.call(t, {
                qseq: 1, //数组中下标
                qverb: 'e', // = 条件
                qpt: this.getAttribute("data-id") //值
            })
        },
        is_leaf: 1
    }]
    trs.init("#trees", treedata, 1, "TR", event) //创建树
}

function loadtbl() {
    coldefs = [{
        seq: 0, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return item
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: false, // 可检索 function
        title: "id", // 列标题
        visible: true, //是否可见
        checkall: false, // 是否可全选
        isID: 1,
        name: "id", //和后端对应，FormData里面的key，后端解析时要一致
        type: -1, //-1:不可见 0:input 1:select 2:不可修改input 3:不可修改select（需要跨表转换时）
        data: [] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列

    }, {
        seq: 1, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i][0] == item) return "<b>" + this.data[i][1] + "</b>"
            }
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: false, // 可检索 function
        title: "状态", // 列标题
        visible: true, //是否可见
        name: "status", //和后端对应，FormData里面的key，后端解析时要一致
        type: 1,
        data: [
            [1, "编辑中", 0, 1],
            [2, "待审核", 0, 1],
            [3, "审核通过", 0, 1],
            [4, "进货入库完成", 0, 1]
        ] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    }, {
        seq: 2, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: false, // 可检索 function
        title: "说明", // 列标题
        visible: true, //是否可见
        name: "memoofapply", //和后端对应，FormData里面的key，后端解析时要一致
        type: 0,
        data: [] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    }, {
        seq: 3, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: false, // 可检索 function
        title: "进货单号码", // 列标题
        visible: true, //是否可见
        name: "ticketcode", //和后端对应，FormData里面的key，后端解析时要一致
        type: 0,
        data: [] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    }, {
        seq: 4, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: false, // 可检索 function
        title: "创建时间", // 列标题
        visible: true, //是否可见
        name: "created", //和后端对应，FormData里面的key，后端解析时要一致
        type: -1,
        data: [] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    }, {
        seq: 5, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: false, // 可检索 function
        title: "修改时间", // 列标题
        visible: true, //是否可见
        name: "updated", //和后端对应，FormData里面的key，后端解析时要一致
        type: -1,
        data: [] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    }, {
        seq: 6, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: false, // 可检索 function
        title: "部门", // 列标题
        visible: true, //是否可见
        name: "dept", //和后端对应，FormData里面的key，后端解析时要一致
        type: 1,
        data: dept //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    }, {
        seq: 7, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            for (var i = 0; i < stockingextend.staff.length; i++) {
                if (stockingextend.staff[i][0] == item) return "<b>" + stockingextend.staff[i][1] + "</b>"
                if (i == stockingextend.staff.length - 1) return "<b>暂无</b>"
            }
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "申请人", // 列标题
        visible: true, //是否可见
        name: "applicant", //和后端对应，FormData里面的key，后端解析时要一致
        type: 3,
        data: stockingextend.staff //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    }, {
        seq: 8, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            for (var i = 0; i < stockingextend.staff.length; i++) {
                if (stockingextend.staff[i][0] == item) return "<b>" + stockingextend.staff[i][1] + "</b>"
                if (i == stockingextend.staff.length - 1) return "<b> </b>"
            }
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "入库人员", // 列标题
        visible: true, //是否可见
        name: "checkedby", //和后端对应，FormData里面的key，后端解析时要一致
        type: 1,
        data: stockingextend.staff //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    }, {
        seq: 9, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            for (var i = 0; i < stockingextend.staff.length; i++) {
                if (stockingextend.staff[i][0] == item) return "<b>" + stockingextend.staff[i][1] + "</b>"
                if (i == stockingextend.staff.length - 1) return "<b> </b>"
            }
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "采购员", // 列标题
        visible: true, //是否可见
        name: "buyer", //和后端对应，FormData里面的key，后端解析时要一致
        type: 1,
        data: stockingextend.staff //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    }, {
        seq: 10, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            if (item == 1) return "<b>是</b>"
            return "<b>否</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: false, // 可排序 function
        retrievable: false, // 可检索 function
        title: "是否特权入库", // 列标题
        visible: true, //是否可见
        name: "onlinesale", //和后端对应，FormData里面的key，后端解析时要一致
        type: 1, //-1:不可见 0:input 1:select 2:不可修改input 3:不可修改select（需要跨表转换时）
        data: [
            [1, "是"],
            [2, "否"]
        ] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
    }]
    t = new _e["table"]()
    row_actions = [{
        cls: "doerow",
        func: function(tbl, rows) {
            if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
            var xhre = new XMLHttpRequest()
            var url = "http://211.69.228.169:8081/sc/stocking/getitem?id=" + tbl["data"][rows][0]
            xhre.open("POST", url, true)
            xhre.send()
            xhre.onreadystatechange = function() {
                if (xhre.readyState == 4 && xhr.status == 200) {
                    var e = eval('(' + xhre.responseText + ');')
                    console.log(e)
                    if (e.res == -1) {
                        _e["msgBox"]({
                            msg: e.msg
                        })
                    } else {
                        var dlg = _e.dialog({
                            id: "dlgData",
                            width: "750px",
                            title: "详细信息",
                            mainBody: "<table style='width: 600px;margin-left: 50px;margin-top:10px;'>" +
                            "<thead><tr><th>编号</th><th>生产日期</th><th>保质期</th><th>申请数量</th><th>商品名</th><th>采购价格</th><th>说明</th><th>接受数量</th><th>过期预警</th><th>商品单位</th></tr></thead>" +
                            "</table><br/>",
                            actions: [{
                                id: "btn",
                                title: "关闭",
                                func: function() {
                                    dlg.parentNode.removeChild(dlg)
                                }
                            }]
                        })
                        dlg.show()
                        var selectTbody = document.createElement("tbody")
                        selectTbody.setAttribute("id", "selectTbody")
                        dlg.querySelector("table").appendChild(selectTbody)
                        for (var i = 0; i < e.stockingitem.length; i++) {
                            var tr = document.createElement("tr")
                            tr.innerHTML = '<td>  ' + e.stockingitem[i][0] + ' </td>' +
                                '<td>' + e.stockingitem[i][1] + '</td>' +
                                '<td>  ' + e.stockingitem[i][2] + ' </td>' +
                                '<td>  ' + e.stockingitem[i][3] + ' </td>' +
                                '<td>  ' + e.stockingitem[i][4] + ' </td>' +
                                '<td>  ' + e.stockingitem[i][5] + ' </td>' +
                                '<td>  ' + e.stockingitem[i][6] + ' </td>' +
                                '<td>  ' + e.stockingitem[i][7] + ' </td>'
                            if(e.stockingitem[i][8]==2) {
                                tr.innerHTML +='<td>关闭</td>'
                            } else {
                                tr.innerHTML +='<td>打开</td>'
                            }
                            tr.innerHTML += '<td>  ' + e.stockingitem[i][9] + ' </td>'
                            selectTbody.appendChild(tr)
                        }
                    }
                }
            }
        },
        title: "查看详细"
    }]
    rows_actions = []

    ext_row = function(rows, i) {
        return "this is row " + i
    }
    t.funcs.init.call(t, "tbl",
        coldefs, row_actions, rows_actions, "table", "__THE__TABLE__", ext_row, "http://211.69.228.169:8081/sc/stocking/get")
}