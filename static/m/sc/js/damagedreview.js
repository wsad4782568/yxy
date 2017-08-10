function becomeTbl(e) {
    t.funcs.loadData.call(t, { //在table.js中的204行显示
        qseq: 2, //数组中下标
        qverb: 'e', //  等于 条件
        qpt: Number(e.getAttribute("value")) //值
    })
}


loadDate({
    data: {},
    method: "post",
    url: "/sc/stockingplanfer/getallstaff",
    callback: function(da) {
        loadDate({
            data: {},
            method: "post",
            url: "/basis/department/getdept",
            callback: function(d) {
                loadtbl(d.dept,da.purchseinfo)
                t.funcs.loadData.call(t, { //在table.js中的204行显示
                    qseq: -1, //更新时间
                    qverb: 'g', // >
                    qpt: -1, //-1
                    oseq: 5, //顺序的下标
                    odir: "d" //降序降序
                })
            }
        })
    }
})

function loadtbl(dept,staff) {
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
        seq: 5, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "创建时间", // 列标题
        visible: true, //是否可见
        name: "create", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 6, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "更新时间", // 列标题
        visible: true, //是否可见
        name: "update", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 7, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            for (var i = 0; i < dept.length; i++) {
                if (Number(item) == Number(dept[i][0])) {
                    return "<b>" + dept[i][1] + "</b>"
                }
            }
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "报损部门", // 列标题
        visible: true, //是否可见
        name: "deptout", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 10, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            for (var i = 0; i < staff.length; i++) {
                if (Number(item) == Number(staff[i][0])) {
                    return "<b>" + staff[i][1] + "</b>"
                }
            }
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "审核人", // 列标题
        visible: true, //是否可见
        name: "checkby", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 3, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "备注", // 列标题
        visible: true, //是否可见
        name: "outmemo", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 2, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            if (item == '1') {
                return "<b>审核中</b>"
            }
            if (item == '2') {
                return "<b>审核通过</b>"
            }
            if (item == '4') {
                return "<b>审核不通过</b>"
            }
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "审核状态", // 列标题
        visible: true, //是否可见
        name: "status", //和后端对应，FormData里面的key，后端解析时要一致
    }]

    t = new _e["table"]()
    row_actions = [{
        cls: "doerow",
        func: function(tbl, rows) {
            loadDate({
                data: {
                    id: Number(tbl.data[rows][0])
                },
                method: "post",
                url: "/sc/stockloss/getlossinfo",
                callback: function(d) {
                    console.log(d)
                    comList(d.stockinfo, Number(tbl.data[rows][0]), Number(tbl.data[rows][2]), tbl.data[rows][3])
                }
            })
        },
        title: "审核"
    }]

    rows_actions = []
    ext_row = function(rows, i) {
        return "this is row " + i
    }
    t.funcs.init.call(t, "tbl",
        coldefs, row_actions, rows_actions, "table", "__THE__TABLE__", ext_row, "/sc/stockloss/get")
    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trunit").parentNode.removeChild(tbl_head.querySelector("#trunit"))

    var trtime = tbl_head.querySelector("#trtime")
    var trSearch = document.createElement("tr") //添加快捷键
    trSearch.innerHTML = '<td colspan="6"><input type="button" value="今天" onclick="dateSearch(1)"/>' +
        '<input type="button" value="近三天" onclick="dateSearch(3)"/>' +
        '<input type="button" value="近一周" onclick="dateSearch(7)"/>' +
        '<input type="button" value="近一个月" onclick="dateSearch(30)"/></td>'
    trtime.parentNode.insertBefore(trSearch, trtime)
}

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
        oseq: 6, //顺序的下标
        odir: "d" //升序降序
    })
}

function comList(comAll, idName, status, memoAll) { //根据报损计划id去寻找报损商品
    console.log(comAll)
    var tableDlg = "<div>报损计划id：<span id='dispatchId'>" + idName + "</span></div>" +
        "<div>调度备忘录：<span id='dispatchMemo'>" + memoAll + "</span></div>" +
        "<table id='stockCom' style='width:450px;margin-top:20px;' border='1'><thead><tr>" +
        "<th>商品名</th><th>报损数量</th><th>补进数量</th><th>规格</th></thead><tbody>"

    for (var i = 0; i < comAll.length; i++) {
      if(comAll[i][13]){
        tableDlg += "<tr><td comNum='" + comAll[i][7] + "' comId='" + comAll[i][1] + "'>" + comAll[i][2] + "</td>" +
            "<td class='damaged'><span>" + comAll[i][3] + "</span><span stockId='" + comAll[i][0] + "'>" + comAll[i][6] + "</span></td>" +
            "<td class='upinto'><span>" + comAll[i][13] + "</span><span  stockId='" + comAll[i][9] + "'>" + comAll[i][15] + "</span></td>" +
            "<td>" + comAll[i][8] + "</td></tr>"
      }else{
        tableDlg += "<tr><td comNum='" + comAll[i][7] + "' comId='" + comAll[i][1] + "'>" + comAll[i][2] + "</td>" +
            "<td class='damaged'><span>" + comAll[i][3] + "</span><span stockId='" + comAll[i][0] + "'>" + comAll[i][6] + "</span></td>" +
            "<td class='upinto'><span></span><span  stockId=''></span></td>" +
            "<td>" + comAll[i][8] + "</td></tr>"
      }
    }

    var titleName = "审核通过"
    var titleName1 = "审核不通过"
    if (status == "2") {
        titleName = "导出"
    }
    if(status == "5"){
      titleName = "关闭"
    }
    if(status == "4"){
      titleName1 = "关闭"
    }

    tableDlg += "</tbody></table>"
    if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
    var dlg = _e.dialog({
        id: "dlgData",
        width: "500px",
        title: "报损情况",
        mainBody: tableDlg,
        actions: [{
            id: "btn",
            title: titleName,
            func: function() {
                if (status == "2") {
                  var data = []
                  var dataAllTbody = document.querySelector("#stockCom").querySelector("tbody")
                  var dataAllThead = document.querySelector("#stockCom").querySelector("thead").querySelector("tr")
                  var fd = new FormData(),xml = new XMLHttpRequest()
                  for(var k = 0;k < dataAllThead.children.length;k++){
                      data.push(dataAllThead.children[k].innerHTML)
                      fd.append("data",dataAllThead.children[k].innerHTML)
                  }
                  for(var i = 0;i < dataAllTbody.children.length;i++){
                      fd.append("data",dataAllTbody.children[i].children[0].innerHTML)
                      fd.append("data",dataAllTbody.children[i].children[1].children[0].innerHTML+dataAllTbody.children[i].children[1].children[1].innerHTML)
                      fd.append("data",dataAllTbody.children[i].children[2].children[0].innerHTML+dataAllTbody.children[i].children[2].children[1].innerHTML)
                      fd.append("data",dataAllTbody.children[i].children[3].innerHTML)
                      data.push(dataAllTbody.children[i].children[0].innerHTML)
                      data.push(dataAllTbody.children[i].children[1].children[0].innerHTML+dataAllTbody.children[i].children[1].children[1].innerHTML)
                      data.push(dataAllTbody.children[i].children[2].children[0].innerHTML+dataAllTbody.children[i].children[2].children[1].innerHTML)
                      data.push(dataAllTbody.children[i].children[3].innerHTML)
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
                if (status == "4") {
                    dlg.parentNode.removeChild(dlg)
                    return
                }
                if (status == "5") {
                    dlg.parentNode.removeChild(dlg)
                    return
                }
                if(status == "1"){
                  var data = {};
                  data.stocktransferid = Number(dlg.querySelector("#dispatchId").innerHTML)
                  data.outmemo = dlg.querySelector("#dispatchMemo").innerHTML
                  data.stockidreduce = [];
                  data.amountreduce = [];
                  data.stockidadd = [];
                  data.amountadd = [];
                  for (var j = 0; j < dlg.querySelector("tbody").children.length; j++) {
                      var tbodyChild = dlg.querySelector("tbody").children[j]
                      data.stockidreduce.push(Number(tbodyChild.children[1].children[1].getAttribute("stockId")));
                      data.amountreduce.push(Number(tbodyChild.children[1].children[0].innerHTML));

                      if(Number(tbodyChild.children[2].children[1].getAttribute("stockId")) > 0){
                        data.stockidadd.push(Number(tbodyChild.children[2].children[1].getAttribute("stockId")));
                        data.amountadd.push(Number(tbodyChild.children[2].children[0].innerHTML));
                      }

                  }
                  loadDate({
                      data: data,
                      method: "post",
                      url: "/sc/stockloss/checklosspass"+_e.jurisdiction(),
                      callback: function(d) {
                          _e["msgBox"]({
                              msg: d.msg,
                              className: d.res == -1 ? "error" : "success",
                              timeout: 3000
                          })
                          dlg.parentNode.removeChild(dlg)
                          setTimeout(function(){
                              self.location.reload()
                          },3000)
                      }
                  })
                }
            }
        },{id: "btn2",
          title: titleName1,
          func: function() {
              if (status == "2") {
                  dlg.parentNode.removeChild(dlg)
                  return
              }
              if (status == "4") {
                  dlg.parentNode.removeChild(dlg)
                  return
              }
              if (status == "5") {
                  dlg.parentNode.removeChild(dlg)
                  return
              }
              if(status == "1"){
                var data = {};
                data.id = Number(idName)
                loadDate({
                    data: data,
                    method: "post",
                    url: "/sc/stocktransfer/transfernotpass",
                    callback: function(d) {
                      console.log(d)
                        _e["msgBox"]({
                            msg: d.msg,
                            className: d.res == -1 ? "error" : "success",
                            timeout: 3000
                        })
                        dlg.parentNode.removeChild(dlg)
                        setTimeout(function(){
                            self.location.reload()
                        },3000)
                    }
                })
              }
            }
        },{
            id: "btn1",
            title: "编辑",
            func: function() {
                if (status == "1") {
                    dlg.parentNode.removeChild(dlg)
                    return
                }
                if (status == "2") {
                    dlg.parentNode.removeChild(dlg)
                    return
                }
                if (status == "5") {
                    dlg.parentNode.removeChild(dlg)
                    return
                }
               if(status == "4"){
                 var ComTr = new Object()
                 ComTr.stockId = dlg.querySelector("#dispatchId").innerHTML
                 ComTr.Memo = dlg.querySelector("#dispatchMemo").innerHTML
                 var stockCom = new Array()
                 var stockComTbody = dlg.querySelector("tbody")
                 for (var i = 0; i < stockComTbody.children.length; i++) {
                     var comList = {}
                     comList.comId = stockComTbody.children[i].children[0].getAttribute("comId") //商品id
                     comList.comNum = stockComTbody.children[i].children[0].getAttribute("comNum") //商品id
                     comList.comName = stockComTbody.children[i].children[0].innerHTML //商品名
                     comList.comSe = stockComTbody.children[i].children[3].innerHTML //规格

                     comList.comDamagedUnit = stockComTbody.children[i].children[1].children[1].innerHTML
                     comList.comDamagedStockId = stockComTbody.children[i].children[1].children[1].getAttribute("stockId")
                     comList.comDamagedAmount = stockComTbody.children[i].children[1].children[0].innerHTML

                     comList.comUpintoUnit = stockComTbody.children[i].children[2].children[1].innerHTML
                     comList.comUpintoStockId = stockComTbody.children[i].children[2].children[1].getAttribute("stockId")
                     comList.comUpintoAmount = stockComTbody.children[i].children[2].children[0].innerHTML
                     stockCom.push(comList)
                 }
                 ComTr.stockCom = stockCom
                 var frm = window.parent.document.querySelector("#frm") //找到父页面的frame节点
                 frm.setAttribute("src", "damaged.html") //在子页面更改当前子页面
                 frm.setAttribute("damagedEdit", "editDamagedAble")
                 localStorage.setItem("editDamaged", JSON.stringify(ComTr))
               }
            }
        }]
    })
    dlg.show()
    if (status == "2" || status == "5") {
        document.querySelector("#btn1").style.display = "none"
        document.querySelector("#btn2").style.display = "none"
    }
    if (status == "4") {
        document.querySelector("#btn").style.display = "none"
        document.querySelector("#btn2").style.display = "none"
    }
    if (status == "1") {
        document.querySelector("#btn1").style.display = "none"
    }
}
