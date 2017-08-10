/**
 * Created by Administrator on 2016/6/25.
 */
function becomeTbl(e) {
    t.funcs.loadData.call(t, { //在table.js中的204行显示
        qseq: 1, //数组中下标
        qverb: 'e', //  等于 条件
        qpt: Number(e.getAttribute("value")) //值
    })
}


function loadtbl() {
    coldefs = [{
        seq: 0, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "计划id", // 列标题
        visible: true, //是否可见
        // checkall: false, // 是否可全选
        // isID: 1,
        name: "id", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 4, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "创建时间", // 列标题
        visible: true, //是否可见
        name: "created", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 5, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "更新时间", // 列标题
        visible: true, //是否可见
        name: "updatetime", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 2, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "计划备忘录", // 列标题
        visible: true, //是否可见
        name: "memoofapply", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 1, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            if (item == 1) {
                return "<b>审核中</b>"
            }
            if (item == 2) {
                return "<b>审核通过</b>"
            }
            if (item == 3) {
                return "<b>入库成功</b>"
            }
            if (item == 4) {
                return "<b>审核不通过</b>"
            }
            if (item == 5) {
                return "<b>无效单</b>"
            }
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "状态", // 列标题
        visible: true, //是否可见
        name: "status", //和后端对应，FormData里面的key，后端解析时要一致
    }]

    t = new _e["table"]()
    row_actions = [{
        cls: "doerow",
        func: function(tbl, rows) { //这里改了
            console.log(tbl.data[rows][0])
            var stockId = tbl.data[rows][0]
            loadDate({
                data: {
                    id: Number(stockId)
                },
                method: "post",
                url: "/sc/stockingplan/getstockingplaninfo" + _e.jurisdiction(),
                callback: function(d) {
                    console.log(d)
                    var tableDlg = "<table id='stockCom' style='width:450px;margin-top:20px' border='1'><thead><tr><th>商品id</th><th>商品名</th>" +
                        "<th>采购单位</th><th>采购数量</th><th>商品备忘录</th></thead><tbody>"
                    for (var i = 0; i < d.stockinfo.length; i++) {
                        tableDlg += "<tr><td>" + d.stockinfo[i][5] + "</td>" +
                            "<td>" + d.stockinfo[i][1] + "</td>" +
                            "<td>" + d.stockinfo[i][6] + "</td>" +
                            "<td>" + d.stockinfo[i][2] + "</td>" +
                            "<td>" + d.stockinfo[i][4] + "</td>" +
                            "</tr>"
                    }
                    tableDlg += "</tbody></table><div style='margin-left:20px;' id='memorandum'>计划id：<span>" + stockId +
                        "</span><br/>计划备忘录：<input type='text' value='" + d.stockinfo[0][3] + "'/></div>"

                    var titleName = "审核通过"
                    if (tbl.data[rows][1] == "5" || tbl.data[rows][1] == "3" || tbl.data[rows][1] == "4") {
                        titleName = "关闭"
                    }
                    if(tbl.data[rows][1] == "2"){
                        titleName = "导出"
                    }

                    if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                    var dlg = _e.dialog({
                        id: "dlgData",
                        width: "500px",
                        title: "查看采购计划",
                        mainBody: tableDlg,
                        actions: [{
                            id: "btn",
                            title: titleName,
                            func: function() {
                                if (tbl.data[rows][1] == "2") {
                                    var data = []
                                    var dataAllTbody = document.querySelector("#stockCom").querySelector("tbody")
                                    var dataAllThead = document.querySelector("#stockCom").querySelector("thead").querySelector("tr")
                                    var fd = new FormData(),xml = new XMLHttpRequest()
                                    for(var k = 0;k < dataAllThead.children.length;k++){
                                        data.push(dataAllThead.children[k].innerHTML)
                                        fd.append("data",dataAllThead.children[k].innerHTML)
                                    }
                                    for(var i = 0;i < dataAllTbody.children.length;i++){
                                        for(var j = 0;j < dataAllTbody.children[i].children.length;j++){
                                          fd.append("data",dataAllTbody.children[i].children[j].innerHTML)
                                          data.push(dataAllTbody.children[i].children[j].innerHTML)
                                        }
                                    }
                                    console.log(data)
                                    // xml.open("POST"," ",true)
                                    // xml.send(fd)
                                    // xml.onreadystatechange = function(){
                                    //     if (xml.readyState==4 && xml.status==200){
                                    //         var d = eval('('+xml.responseText+');')
                                    //         console.log(d)
                                    //     }
                                    // }
                                    return
                                }
                                if (tbl.data[rows][1] == "3") {
                                    dlg.parentNode.removeChild(dlg)
                                    return
                                }
                                if (tbl.data[rows][1] == "4") {
                                    dlg.parentNode.removeChild(dlg)
                                    return
                                }
                                if (tbl.data[rows][1] == "5") {
                                    dlg.parentNode.removeChild(dlg)
                                    return
                                }
                                if (tbl.data[rows][1] == "1") {
                                    var thisTr = dlg.querySelector("tbody").querySelectorAll("tr")
                                    loadDate({
                                        data: {
                                            id: Number(document.querySelector("#memorandum").querySelector("span").innerHTML)
                                        },
                                        method: "post",
                                        url: "/sc/checkstocking/checkpass" + _e.jurisdiction(),
                                        callback: function(d) {
                                            _e["msgBox"]({
                                                msg: d.msg,
                                                className: d.res == -1 ? "error" : "success",
                                                timeout: 3000
                                            })
                                            setTimeout(function(){
                                                self.location.reload()
                                            },3000)
                                            dlg.parentNode.removeChild(dlg)
                                        }
                                    })
                                }
                            }
                        },{
                            id: "btn1",
                            title: "审核不通过",
                            func: function() {
                                if (tbl.data[rows][1] == "2") {
                                    _e["msgBox"]({
                                        msg: "该计划已通过!",
                                        timeout: 3000
                                    })
                                    return
                                }
                                if (tbl.data[rows][1] == "3") {
                                    _e["msgBox"]({
                                        msg: "该单已入库成功!",
                                        timeout: 3000
                                    })
                                    return
                                }
                                if (tbl.data[rows][1] == "4") {
                                    _e["msgBox"]({
                                        msg: "该单已审核不通过!",
                                        timeout: 3000
                                    })
                                    return
                                }
                                if (tbl.data[rows][1] == "5") {
                                    dlg.parentNode.removeChild(dlg)
                                    return
                                }
                                if (tbl.data[rows][1] == "1") {
                                    loadDate({
                                        data: {
                                            id: Number(tbl.data[rows][0])
                                        },
                                        method: "post",
                                        url: "/sc/checkstocking/refuse" + _e.jurisdiction(),
                                        callback: function(d) {
                                            _e["msgBox"]({
                                                msg: d.msg,
                                                className: d.res == -1 ? "error" : "success",
                                                timeout: 3000
                                            })
                                            setTimeout(function(){
                                                self.location.reload()
                                            },3000)
                                            dlg.parentNode.removeChild(dlg)
                                        }
                                    })
                                }
                            }
                        }]
                    })
                    dlg.show()
                    if (tbl.data[rows][1] == "5" || tbl.data[rows][1] == "2" || tbl.data[rows][1] == "3" || tbl.data[rows][1] == "4") {
                        document.querySelector("#btn1").style.display = "none"
                    }
                }
            })
        },
        title: "查看计划"
    }]

    rows_actions = []

    ext_row = function(rows, i) {
        return "商品1: <span class='comA'></span>  -- 商品2: <span class='comB'></span>"
    }
    after_Load = function(tbl, tblDom) {
        for (var i = 0; i < tbl.data.length; i++) {
            tblName(tbl.data[i], i, tblDom)
        }
    }
    t.funcs.init.call(t, "tbl",
        coldefs, row_actions, rows_actions, "table", "__THE__TABLE__", ext_row, "/sc/checkstockingplan/get", after_Load)

    var tbl_head = document.querySelector("#tbl").querySelector("thead") //删除单位
    tbl_head.querySelector("#trunit").parentNode.removeChild(tbl_head.querySelector("#trunit"))

    var trtime = tbl_head.querySelector("#trtime")
    var trSearch = document.createElement("tr") //添加快捷键
    trSearch.innerHTML = '<td colspan="6"><input type="button" value="今天" onclick="dateSearch(1)"/>' +
        '<input type="button" value="近三天" onclick="dateSearch(3)"/>' +
        '<input type="button" value="近一周" onclick="dateSearch(7)"/>' +
        '<input type="button" value="近一个月" onclick="dateSearch(30)"/></td>'
    trtime.parentNode.insertBefore(trSearch, trtime)
}
loadtbl()
t.funcs.loadData.call(t, { //在table.js中的204行显示
    qseq: -1, //更新时间
    qverb: 'g', // >
    qpt: -1, //-1
    oseq: 5, //顺序的下标
    odir: "d" //降序降序
})

function dateSearch(e) { //时间快捷键
    var tody = _e["CurentTime"]()
    tody = _e["addDate"](tody, 1)
    var times = document.querySelector("#tbl").querySelectorAll(".cqtime")
    times[0].value = _e["addDate"](tody, 0 - e)
    times[1].value = tody
    t.funcs.reloadOption.call(t)
    t.funcs.loadData.call(t, {
        qseq: 0, //id
        qverb: 'g', // >
        qpt: -1, //-1
        oseq: 5, //顺序的下标
        odir: "d" //升序降序
    })
}

function tblName(data, seq, tblDom) { //在扩展栏下面显示一到两个商品
    var comA = tblDom.querySelectorAll(".comA")[seq]
    var comB = tblDom.querySelectorAll(".comB")[seq]
    loadDate({
        data: {
            id: Number(data[0])
        },
        method: "post",
        url: "/sc/stockingplan/getstockingplaninfo" + _e.jurisdiction(),
        callback: function(d) {
            for (var i = 0; i < d.stockinfo.length; i++) {
                if (i == 0) {
                    comA.innerHTML = d.stockinfo[i][1]
                }
                if (i == 1) {
                    comB.innerHTML = d.stockinfo[i][1]
                    break
                }
            }
        }
    })
}
