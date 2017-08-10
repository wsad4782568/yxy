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

function WarehousingTbl() {
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
            if (item == 2) {
                return "<b>待入库</b>"
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
            if (item == 11) {
                return "<b>调转单</b>"
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
        func: function(tbl, rows) { //把入库商品添加到入库列表中
            var stockId = tbl.data[rows][0]
            loadDate({
                data: {
                    id: Number(stockId)
                },
                method: "post",
                url: "/sc/stockingplan/getstockingplaninfo" + _e.jurisdiction(),
                callback: function(d) {
                    console.log(d)
                    var tableDlg = "<table id='stockCom' style='width:450px;margin-top:20px' border='1'><thead><tr><th>商品名</th><th>规格</th><th>单位</th><th>数量</th><th>售价</th><th>进价</th><th>商品备忘录</th></thead><tbody>"
                    for (var i = 0; i < d.stockinfo.length; i++) {
                        tableDlg += "<tr><td comNum='" + d.stockinfo[i][7] + "' comId='" + d.stockinfo[i][5] + "'>" + d.stockinfo[i][1] + "</td>" +
                            "<td>" + d.stockinfo[i][8] + "</td>" +
                            "<td comStock='" + d.stockinfo[i][11] + "'>" + d.stockinfo[i][6] + "</td>" +
                            "<td>" + d.stockinfo[i][2] + "</td>" +
                            "<td>" + (d.stockinfo[i][9] / 100).toFixed(2) + "</td>" +
                            "<td>" + (d.stockinfo[i][10] / 100).toFixed(2) + "</td>" +
                            "<td>" + d.stockinfo[i][4] + "</td>" +
                            "</tr>"
                    }
                    tableDlg += "</tbody></table><div style='margin-left:20px;' id='memorandum'>计划id：<span id='planId'>" + stockId +
                        "</span><br/>计划备忘录：<input type='text' value='" + d.stockinfo[0][3] + "' id='planMemo'/></div>"

                    var titleName = "入库编辑"
                    if (tbl.data[rows][1] == "5" || tbl.data[rows][1] == "1" || tbl.data[rows][1] == "3" || tbl.data[rows][1] == "4" || tbl.data[rows][1] == "11") {
                        titleName = "关闭"
                    }
                    var titleName1 = "转换调度单"

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
                                if (tbl.data[rows][1] == "1") {
                                    dlg.parentNode.removeChild(dlg)
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
                                if (tbl.data[rows][1] == "11") {
                                    dlg.parentNode.removeChild(dlg)
                                    return
                                }
                                if (tbl.data[rows][1] == "2") {
                                    var tbodyCom = dlg.querySelector("tbody").children
                                    var comDetailTbody = document.querySelector("#comDetailTbody")
                                    var planId = document.querySelector("#planId").innerHTML
                                    var planMemo = document.querySelector("#planMemo").value
                                    for (var i = 0; i < tbodyCom.length; i++) {
                                        comDetailTbody.innerHTML += '<td comId="' + tbodyCom[i].children[0].getAttribute("comId") + '" comNum="' + tbodyCom[i].children[0].getAttribute("comNum") + '">' + tbodyCom[i].children[0].innerHTML + '</td>' +
                                            '<td>' + tbodyCom[i].children[1].innerHTML + '</td>' +
                                            '<td comStock="' + tbodyCom[i].children[2].getAttribute("comStock") + '">' + tbodyCom[i].children[2].innerHTML + '</td>' +
                                            '<td>' + tbodyCom[i].children[3].innerHTML + '</td>' +
                                            '<td>' + tbodyCom[i].children[4].innerHTML + '</td>' +
                                            '<td>' + tbodyCom[i].children[5].innerHTML + '</td>' +
                                            '<td>' + tbodyCom[i].children[6].innerHTML + '</td>' +
                                            '<td><a href="#" style="color: #0a0a0a"><i class="icon iconfont icon-addshoppingcart" onclick="addComList(this)"></i></a></td></tr>'
                                    }
                                    document.querySelector("#orderId").innerHTML = planId
                                    document.querySelector("#orderMemo").innerHTML = planMemo
                                    document.querySelector("#storagePlan").style.display = "none"
                                    document.querySelector("#storageCom").style.display = "block"
                                    dlg.parentNode.removeChild(dlg)
                                }
                            }
                        },{
                            id: "btn1",
                            title: titleName1,
                            func: function() {
                                var btn1 = document.querySelector("#btn1")
                                if (tbl.data[rows][1] == "1") {
                                    dlg.parentNode.removeChild(dlg)
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
                                if (tbl.data[rows][1] == "11") {
                                    dlg.parentNode.removeChild(dlg)
                                    return
                                }
                                if (tbl.data[rows][1] == "2") {
                                    var memorandum = dlg.querySelector("#memorandum")
                                    var cqdept = document.querySelector("#cqdept")
                                    if(btn1.innerHTML == "转换调度单"){
                                      btn1.innerHTML = "调度申请"
                                      memorandum.innerHTML = '<span>申请调出部门:</span><select id="deptAll">'+cqdept.innerHTML+'</select><br/>'+
                                              '<span>调度备注:</span><input typt="text" id="dMemo"/>'
                                      return
                                    }
                                    if(btn1.innerHTML == "调度申请"){
                                      var fd = new FormData(),xml = new XMLHttpRequest()
                                      var tbodyTr = dlg.querySelector("tbody").children
                                      var deptAll = document.querySelector("#deptAll")   //出库部门
                                      var dMemo = document.querySelector("#dMemo")   //出库备注
                                      fd.append("id",Number(tbl.data[rows][0]))
                                      console.log(Number(tbl.data[rows][0]))
                                      fd.append("deptout",Number(deptAll.value))
                                      fd.append("deptin",Number(cqdept.value))
                                      if(dMemo.value.length == 0){
                                        fd.append("outmemo","无")
                                      }else{
                                        fd.append("outmemo",dMemo.value)
                                      }
                                      for(var i = 0;i < tbodyTr.length;i++){
                                        fd.append("commodity",Number(tbodyTr[i].children[0].getAttribute("comid")))
                                        fd.append("amount",Number(tbodyTr[i].children[3].innerHTML))
                                      }
                                      xml.open("POST","/sc/stockingplanfer/purchasetotransfer",true)
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

                                    }
                                }
                            }
                        }]
                    })
                    dlg.show()
                    if(tbl.data[rows][1] == "5" || tbl.data[rows][1] == "1" || tbl.data[rows][1] == "3" || tbl.data[rows][1] == "4" ||  tbl.data[rows][1] == "11"){
                        document.querySelector("#btn1").parentNode.removeChild(document.querySelector("#btn1"))
                    }
                }
            })
        },
        title: "入库编辑"
    },{
        cls: "doerow",
        func: function(tbl, rows) { //把入库商品添加到入库列表中
            if (tbl.data[rows][1] == "1") {
                _e["msgBox"]({
                    msg: "该计划未审核",
                    timeout: 3000
                })
                return
            }
            if (tbl.data[rows][1] == "3") {
                _e["msgBox"]({
                    msg: "该计划已入库",
                    timeout: 3000
                })
                return
            }
            if (tbl.data[rows][1] == "4") {
                _e["msgBox"]({
                    msg: "该计划是审核不通过",
                    timeout: 3000
                })
                return
            }
            if (tbl.data[rows][1] == "5") {
                _e["msgBox"]({
                    msg: "该计划是无效单",
                    timeout: 3000
                })
                return
            }
            if (tbl.data[rows][1] == "11") {
                _e["msgBox"]({
                    msg: "该计划是调转单",
                    timeout: 3000
                })
                return
            }
            if (tbl.data[rows][1] == "2") {
                if (document.querySelector("#dlgCom")) document.querySelector("#dlgCom").parentNode.removeChild(document.querySelector("#dlgCom"));
                var dlg = _e.deleteBox({
                    id: "dlgCom",
                    title: '是否废单',
                    mainBody: "",
                    actions: [{
                        id: "btnDe1",
                        title: "确定",
                        func: function() {
                            var fd = new FormData(),
                                xml = new XMLHttpRequest()
                            fd.append("id", Number(tbl.data[rows][0]))
                            xml.open("POST", "/sc/stockingplan/wasteplan")
                            xml.send(fd)
                            xml.onreadystatechange = function() {
                                if (xml.readyState == 4 && xml.status == 200) {
                                    var d = eval('(' + xml.responseText + ');')
                                    _e["msgBox"]({
                                        msg: d.msg,
                                        className: d.res == -1 ? "error" : "success",
                                        timeout: 3000
                                    })
                                }
                            }
                            dlg.parentNode.removeChild(dlg)
                            setTimeout(function(){
                                self.location.reload()
                            },3000)
                        }
                    }, {
                        id: "btnDe2",
                        title: "取消",
                        func: function() {
                            dlg.parentNode.removeChild(dlg)
                            return
                        }
                    }]
                })
                dlg.show()
            }

        },
        title: "废单"
    }]

    rows_actions = []

    ext_row = function(rows, i) {
        return "this is row " + i
    }
    after_Load = function(tbl, tblDom) {}
    t.funcs.init.call(t, "tbl",
        coldefs, row_actions, rows_actions, "table", "__THE__TABLE__", ext_row, "/sc/checkstockingplan/getpass", after_Load)

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
WarehousingTbl()
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

function addComList(e) { //通过计划的id取得其它采购的id
    var addCom = e.parentNode.parentNode.parentNode
    var commodityRow = document.querySelectorAll(".commodityRow")
    // for (var i = 0; i < commodityRow.length; i++) { //判断同种商品是否添加在入库列表
    //     if (Number(addCom.children[0].getAttribute("comNum")) == Number(commodityRow[i].getAttribute("comNum"))) {
    //         _e["msgBox"]({
    //             msg: "该商品已添加",
    //             timeout: 3000
    //         })
    //         return
    //     }
    // }
    var orderTbody = document.querySelector("#orderTbody")
    var tr = document.createElement("tr")
    tr.setAttribute("class", "trCom")
    tr.innerHTML = '<td class="commodityRow" comNum="' + addCom.children[0].getAttribute("comNum") + '" comId="' + addCom.children[0].getAttribute("comId") + '" style="width: 80px;">' + addCom.children[0].innerHTML + '</td>' +
        '<td style="width: 70px;">' + addCom.children[1].innerHTML + '</td>' +
        '<td style="width: 60px;"><input type="number" class="condition price" value="' + addCom.children[5].innerHTML + '" style="width: 60px;"/></td>' +
        '<td style="width: 85px;"><input type="Number" class="comNum" value="' + addCom.children[3].innerHTML + '" stockId="' + addCom.children[2].getAttribute("comstock") + '" style="width: 60px;"/><span>' + addCom.children[2].innerHTML + '</span></td>' +
        '<td style="width: 80px;"><input type="text" class="comMemo" value="' + addCom.children[6].innerHTML + '" style="width:80px;"/></td>' +
        '<td style="width: 100px;"><input style="width: 100px;" class="supplier" supplierId="" onkeyup="supplier(this)"/><ul style="width:140px;background-color: #ffffff;margin: 0;padding: 0;overflow-y: auto;"></ul></td>' +
        '<td style="width: 50px;"><a href="#" style="color: #0a0a0a;text-decoration:none;"><i class="icon iconfont icon-delete"  onclick="deleteCom(this)"></i></a></td>'
    orderTbody.appendChild(tr)

}

_e.bind("#addComListAll", "click", function() { //将计划中的商品全部添加
    var comDetailTbody = document.querySelector("#comDetailTbody")
    for (var i = 0; i < comDetailTbody.children.length; i++) {
        var comDetailTbodyClick = comDetailTbody.children[i].children[7].children[0].children[0]
        addComList(comDetailTbodyClick)
    }
})


function deleteCom(e) { //删除入库单的一列
    e.parentNode.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode.parentNode)
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
                tblAddCom(tbl.data[rows])
            },
            title: "新增"
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

function tblAddCom(purchseinfo) { //补添商品的选择
    var orderTbody = document.querySelector("#orderTbody")
    var commodityRow = document.querySelectorAll(".commodityRow")
    for (var i = 0; i < commodityRow.length; i++) { //判断同种商品是否添加在入库列表
        if (Number(purchseinfo[23]) == Number(commodityRow[i].getAttribute("comNum"))) {
            _e["msgBox"]({
                msg: "该商品已添加",
                timeout: 3000
            })
            return
        }
    }
    var tr = document.createElement("tr")
    tr.setAttribute("class", "trCom")
    tr.innerHTML = '<td class="commodityRow" comNum="' + purchseinfo[23] + '" comId="' + purchseinfo[16] + '" style="width: 80px;">' + purchseinfo[1] + '</td>' +
        '<td style="width: 70px;">' + purchseinfo[15] + '</td>' +
        '<td style="width: 60px;"><input type="number" class="condition price" style="width: 60px;"/></td>' +
        '<td style="width: 85px;"><input type="Number" class="comNum" value="" stockId="' + purchseinfo[0] + '" style="width: 60px;"/><span>' + purchseinfo[14] + '</span></td>' +
        '<td style="width: 80px;"><input type="text" class="comMemo" value="" style="width:80px;"/></td>' +
        '<td style="width: 100px;"><input style="width: 100px;" class="supplier" supplierId="" onkeyup="supplier(this)"/><ul style="width:140px;background-color: #ffffff;margin: 0;padding: 0;overflow-y: auto;"></ul></td>' +
        '<td style="width: 50px;"><a href="#" style="color: #0a0a0a;text-decoration:none;"><i class="icon iconfont icon-delete"  onclick="deleteCom(this)"></i></a></td>'
    orderTbody.appendChild(tr)
}


document.querySelector("#planCommodity").addEventListener("click", function() { //入库提交
    var j = 0
    if (document.querySelector("#orderTbody").children.length == 0) {
        _e["msgBox"]({
            msg: "没有入库的商品!",
            timeout: 3000
        })
        return
    }
    for (j = 0; j < document.querySelectorAll(".condition").length; j++) {
        if (Number(document.querySelectorAll(".condition")[j].value) <= 0) {
            _e["msgBox"]({
                msg: "请输入正确的采购价格!",
                timeout: 3000
            })
            return
        }
    }
    for (j = 0; j < document.querySelectorAll(".comNum").length; j++) {
        if (Number(document.querySelectorAll(".comNum")[j].value) <= 0) {
            _e["msgBox"]({
                msg: "请输入正确的数量!",
                timeout: 3000
            })
            return
        }
    }
    for (j = 0; j < document.querySelectorAll(".supplier").length; j++) {
        if (Number(document.querySelectorAll(".supplier")[j].getAttribute("supplierid")) <= 0) {
            _e["msgBox"]({
                msg: "请输入供应商!",
                timeout: 3000
            })
            return
        }
    }

    var orderCom = document.querySelector("#orderTbody").children
    var fd = new FormData(),
        xml = new XMLHttpRequest()
    fd.append("stockingid", Number(document.querySelector("#orderId").innerHTML))
    for (var i = 0; i < orderCom.length; i++) {
        var resonInput = orderCom[i].querySelector(".comMemo").value
        fd.append("commodityid", Number(orderCom[i].querySelector(".commodityRow").getAttribute("comId")))
        fd.append("stockid", Number(orderCom[i].querySelector(".comNum").getAttribute("stockId")))
        fd.append("amountreceive", Number(orderCom[i].querySelector(".comNum").value))
        fd.append("stockingprice",parseInt(Number(orderCom[i].querySelector(".price").value) * 100) )
        fd.append("reason", (resonInput == '') ? "无" : resonInput)
        if (orderCom[i].querySelector(".supplier").value.length > 0 && Number(orderCom[i].querySelector(".supplier").getAttribute("supplierid")) != 0) {
            fd.append("supplier", Number(orderCom[i].querySelector(".supplier").getAttribute("supplierid")))
        } else {
            fd.append("supplier", -1)
        }
    }
    xml.open("POST", "/sc/stockingplan/putinstorage", true)
    xml.send(fd)
    xml.onreadystatechange = function() {
        if (xml.readyState == 4 && xml.status == 200) {
            var d = eval('(' + xml.responseText + ');')
            _e["msgBox"]({
                msg: d.msg,
                className: d.res == -1 ? "error" : "success",
                timeout: 3000
            })
            setTimeout(function(){
                self.location.reload()
            },3000)
        }
    }
}, true)

function supplier(e) { //供应商的选择
    var eSelect = e.parentNode.querySelector("ul")
    if (e.value.length == 0) {
        eSelect.style.height = "0px"
        e.setAttribute("supplierClass", "")
        e.setAttribute("supplierId", "")
        return
    }
    eSelect.innerHTML = ""
    var fd = new FormData(),
        xml = new XMLHttpRequest()
    fd.append("name", e.value)
    xml.open("POST", "/sc/stockingplan/searchsupplier", true)
    xml.send(fd)
    xml.onreadystatechange = function() {
        if (xml.readyState == 4 && xml.status == 200) {
            var d = eval('(' + xml.responseText + ');')
            if (d.stockinfo.length > 0) {
                for (var i = 0; i < d.stockinfo.length; i++) {
                    eSelect.style.height = "150px"
                    var option = document.createElement("li")
                    option.setAttribute("onmouseover", "mOver(this)")
                    option.setAttribute("onmouseout", "mOut(this)")
                    option.setAttribute("onclick", "liSupplier(this)")
                    option.style.listStyle = "none"
                    option.style.cursor = "hand"
                    option.setAttribute("supplierId", d.stockinfo[i][0])
                    option.innerHTML = d.stockinfo[i][1]
                    option.setAttribute("supplierClass", d.stockinfo[i][2])
                    eSelect.appendChild(option)
                }
                eSelect.style.display = "block"
            }
        }
    }
}

function liSupplier(e) { //选择供应商
    var eUl = e.parentNode
    var eInput = eUl.parentNode.querySelector("input")
    eInput.value = e.innerHTML
    eInput.setAttribute("supplierClass", e.getAttribute("supplierClass"))
    eInput.setAttribute("supplierId", e.getAttribute("supplierId"))
    eUl.innerHTML = ""
    eUl.style.height = "0px"
}

function mOver(e) {
    e.style.backgroundColor = "#EEEEEE"
}

function mOut(e) {
    e.style.backgroundColor = "#FFFFFF"
}

var drafts = _e["getQueryString"]("drafts")
if (drafts) {
    _e["gethtml"](document.querySelector('#orderTbody'), 'enterstocking', ['price', 'comNum', 'comMemo', 'supplier'])
    _e["gethtml"](document.querySelector('#comDetailTbody'), 'enterstocking1', [''])
    document.querySelector("#storagePlan").style.display = "none"
    document.querySelector("#storageCom").style.display = "block"
} else {
    var t2 = window.setInterval("_e.sethtml(document.querySelector('#orderTbody'),'enterstocking',['price','comNum','comMemo','supplier'])", 10000);
    var t2 = window.setInterval("_e.sethtml(document.querySelector('#comDetailTbody'),'enterstocking1',[''])", 10000);
}

function deleteCom(e) { //删除单项入库商品
    e.parentNode.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode.parentNode)
}


function printAll(){
  var data = []
  var dataAllTbody = document.querySelector("#orderTbody")
  var dataAllThead = document.querySelector("#orderTable").querySelector("thead").querySelector("tr")
  var fd = new FormData(),xml = new XMLHttpRequest()
  for(var k = 0;k < dataAllThead.children.length-1;k++){
      data.push(dataAllThead.children[k].innerHTML)
      fd.append("data",dataAllThead.children[k].innerHTML)
  }
  for(var i = 0;i < dataAllTbody.children.length;i++){
      var dataAllTbody1 = dataAllTbody.children[i]
      fd.append("data",dataAllTbody1.children[0].innerHTML)
      fd.append("data",dataAllTbody1.children[1].innerHTML)
      fd.append("data",dataAllTbody1.children[2].children[0].value)
      fd.append("data",dataAllTbody1.children[3].children[0].value+dataAllTbody1.children[3].children[1].innerHTML)
      fd.append("data",dataAllTbody1.children[4].children[0].value)
      fd.append("data",dataAllTbody1.children[5].children[0].value)
      data.push(dataAllTbody1.children[0].innerHTML)
      data.push(dataAllTbody1.children[1].innerHTML)
      data.push(dataAllTbody1.children[2].children[0].value)
      data.push(dataAllTbody1.children[3].children[0].value+dataAllTbody1.children[3].children[1].innerHTML)
      data.push(dataAllTbody1.children[4].children[0].value)
      data.push(dataAllTbody1.children[5].children[0].value)
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
}

_e.bind("#purchaseAllPrice","click",function(){
  var orderTbody = document.querySelector("#orderTbody")
  var price,comNum,comNumAll = 0
  for(var i = 0;i < orderTbody.children.length;i++){
    price = orderTbody.children[i].querySelector(".price")
    comNum = orderTbody.children[i].querySelector(".comNum")
    comNumAll += Number(price.value)*Number(comNum.value)
  }
  var purchasePrice = document.querySelector("#purchasePrice")
  purchasePrice.innerHTML = comNumAll.toFixed(2) + "元"
})
