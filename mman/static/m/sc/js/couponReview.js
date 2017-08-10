function loadtbl() {
    coldefs = [{
        seq: 0, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "id", // 列标题
        visible: true, //是否可见
        // checkall: false, // 是否可全选
        // isID: 1,
        name: "id", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 9, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "名字", // 列标题
        visible: true, //是否可见
        name: "name", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 3, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "说明", // 列标题
        visible: true, //是否可见
        name: "intro", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 1, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "发行量", // 列标题
        visible: true, //是否可见
        name: "amount", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 4, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "余量", // 列标题
        visible: true, //是否可见
        name: "leaving", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 5, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + (item / 100).toFixed(2) + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "面值", // 列标题
        visible: true, //是否可见
        name: "pv", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 7, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + (item / 100).toFixed(2) + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "满额", // 列标题
        visible: true, //是否可见
        name: "conditionmoney", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 6, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "生产时间", // 列标题
        visible: true, //是否可见
        name: "valid", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 2, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "过期时间", // 列标题
        visible: true, //是否可见
        name: "expired", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 8, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            if (item == 1) {
                return "<b>不发行</b>"
            }
            if (item == 2) {
                return "<b>发行</b>"
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
        func: function(tbl, rows) {
            var stockId = tbl.data[rows][0]
            loadDate({
                data: {
                    id: Number(stockId)
                },
                method: "post",
                url: "/sc/coupon/getinfo",
                callback: function(d) {
                  console.log(d)
                    tableDlg = "<div>商品优惠卷id：<span id='dispatchId'>" + tbl.data[rows][0] + "</span></div>" +
                        "<div>调度备忘录：<span id='dispatchMemo'>" + tbl.data[rows][3] + "</span></div>" +
                        "<table id='stockCom' style='width:450px;margin-top:20px;' border='1'><thead><tr>" +
                        "<th>商品名/种类名</th><th>规格</th><th>单位</th><th>部门</th><th>面值</th><th>余量</th></thead><tbody>"

                    for (var i = 0; i < d.coupon.length; i++) {
                      if(d.coupon[i][0] == 0 && d.coupon[i][7] > 0){
                        tableDlg += "<tr><td classid='"+d.coupon[i][7]+"' comId=''>" + d.coupon[i][8] + "</td>" +
                            "<td>——</td>" +
                            "<td>——</td>" +
                            "<td dept='" + d.coupon[i][2] + "'>" + d.coupon[i][3] + "</td>" +
                            "<td>" + (tbl.data[rows][5] / 100).toFixed(2) + "</td>" +
                            "<td>" + tbl.data[rows][4] + "</td>" +
                            "</tr>"
                      }else if (d.coupon[i][0] == 0 && d.coupon[i][7] == 0) {
                        tableDlg += "<tr><td classid='0' comId='0'>通用优惠券</td>" +
                            "<td>——</td>" +
                            "<td>——</td>" +
                            "<td dept='" + d.coupon[i][2] + "'>" + d.coupon[i][3] + "</td>" +
                            "<td>" + (tbl.data[rows][5] / 100).toFixed(2) + "</td>" +
                            "<td>" + tbl.data[rows][4] + "</td>" +
                            "</tr>"
                      }else{
                        tableDlg += "<tr><td classid='' comId='"+d.coupon[i][0]+"'>" + d.coupon[i][1] + "</td>" +
                            "<td>" + d.coupon[i][5] + "</td>" +
                            "<td>" + d.coupon[i][4] + "</td>" +
                            "<td dept='" + d.coupon[i][2] + "'>" + d.coupon[i][3] + "</td>" +
                            "<td>" + (tbl.data[rows][5] / 100).toFixed(2) + "</td>" +
                            "<td>" + tbl.data[rows][4] + "</td>" +
                            "</tr>"
                      }
                    }

                    var titleName = "发行"
                    if(tbl.data[rows][8] == 2){
                      titleName = "关闭"
                    }

                    if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                    var dlg = _e.dialog({
                        id: "dlgData",
                        width: "500px",
                        title: "优惠卷详情",
                        mainBody: tableDlg,
                        actions: [{
                            id: "btn",
                            title: titleName,
                            func: function() {
                                if (tbl.data[rows][8] == 1) {
                                  var fd = new FormData(),
                                      xml = new XMLHttpRequest()
                                  fd.append("id", tbl.data[rows][0])
                                  xml.open("POST", "/sc/coupon/alterstatus", true)
                                  xml.send(fd)
                                  xml.onreadystatechange = function() {
                                      if (xml.readyState == 4 && xml.status == 200) {
                                          var d = eval('(' + xml.responseText + ');')
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
                                }

                                if (tbl.data[rows][8] == 2) {
                                    dlg.parentNode.removeChild(dlg)
                                    return
                                }
                            }
                        }, {
                            id: "btn1",
                            title: "编辑",
                            func: function() {
                                if (tbl.data[rows][8] == 1) {
                                    var ComTr = new Object()
                                    ComTr.id = tbl.data[rows][0]
                                    ComTr.endTime = (tbl.data[rows][2]).substr(0, 10)
                                    ComTr.InputMemo = tbl.data[rows][3]
                                    ComTr.margin = tbl.data[rows][4]
                                    ComTr.faceValue = tbl.data[rows][5] / 100
                                    ComTr.startTime = (tbl.data[rows][6]).substr(0, 10)
                                    ComTr.fullValue = tbl.data[rows][7] / 100
                                    ComTr.name = tbl.data[rows][9]
                                    var stockComTbody = dlg.querySelector("tbody")
                                    var stockDept = new Array()
                                    for (var i = 0; i < stockComTbody.children.length; i++) {
                                        if (stockDept.length == 0) {
                                            stockDept.push(stockComTbody.children[i].children[3].getAttribute("dept"))
                                        } else {
                                            for (var j = 0; j < stockDept.length; j++) {
                                                if (stockDept[j] != stockComTbody.children[i].children[3].getAttribute("dept")) {
                                                    stockDept.push(stockComTbody.children[i].children[3].getAttribute("dept"))
                                                }
                                            }
                                        }
                                    }
                                    ComTr.stockDept = stockDept

                                    var stockCom = new Array()
                                    var deptFlag
                                    for (i = 0; i < stockComTbody.children.length; i++) {
                                        var comList = {}
                                        if (i == 0) {
                                            comList.comId = stockComTbody.children[i].children[0].getAttribute("comId")
                                            comList.class = stockComTbody.children[i].children[0].getAttribute("classid")
                                            comList.comName = stockComTbody.children[i].children[0].innerHTML
                                            comList.comSe = stockComTbody.children[i].children[1].innerHTML
                                            comList.comUnit = stockComTbody.children[i].children[2].innerHTML
                                            deptFlag = stockComTbody.children[i].children[1].getAttribute("dept")
                                            stockCom.push(comList)
                                        }
                                        if (i != 0 && deptFlag == stockComTbody.children[i].children[1].getAttribute("dept")) {
                                            comList.comId = stockComTbody.children[i].children[0].getAttribute("comId")
                                            comList.class = stockComTbody.children[i].children[0].getAttribute("classid")
                                            comList.comName = stockComTbody.children[i].children[0].innerHTML
                                            comList.comSe = stockComTbody.children[i].children[1].innerHTML
                                            comList.comUnit = stockComTbody.children[i].children[2].innerHTML
                                            stockCom.push(comList)
                                        }
                                    }
                                    ComTr.stockCom = stockCom
                                    console.log(ComTr)
                                    var frm = window.parent.document.querySelector("#frm") //找到父页面的frame节点
                                    frm.setAttribute("src", "ComCoupon.html") //在子页面更改当前子页面
                                    frm.setAttribute("couponEdit", "editCouponAble")
                                    localStorage.setItem("editCoupon", JSON.stringify(ComTr))
                                    return
                                }
                            }
                        }]
                    })
                    dlg.show()
                    if(tbl.data[rows][8] == 2){
                        document.querySelector("#btn1").parentNode.removeChild(document.querySelector("#btn1"))
                    }
                }
            })
        },
        title: "查看详情"
    }]

    rows_actions = []
    ext_row = function(rows, i) {
        return "this is row " + i
    }
    t.funcs.init.call(t, "tbl",
        coldefs, row_actions, rows_actions, "table", "__THE__TABLE__", ext_row, "/sc/coupon/get")

    var trunit = document.querySelector("#trunit")
    trunit.parentNode.removeChild(trunit)
}
loadtbl()
t.funcs.loadData.call(t)
