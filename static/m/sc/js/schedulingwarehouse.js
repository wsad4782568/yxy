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
    url: "/basis/staff/getstaffinfo" + _e.jurisdiction(),
    callback: function(d) {
        document.querySelector("#features").setAttribute("departmentType", d.stockinfo[0][1])
    }
})

loadDate({
    data: {},
    method: "post",
    url: "/basis/staff/getstaffinfo" + _e.jurisdiction(),
    callback: function(d) {
        loadDate({
            data: {},
            method: "post",
            url: "/basis/department/getdept",
            callback: function(d) {
                warehousingTbl(d.dept)
                t.funcs.loadData.call(t, { //在table.js中的204行显示
                    qseq: -1, //更新时间
                    qverb: 'g', // >
                    qpt: -1, //-1
                    oseq: 6, //顺序的下标
                    odir: "d" //降序降序
                })
            }
        })
    }
})

function warehousingTbl(dept) {
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
        name: "created", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 6, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "更新时间", // 列标题
        visible: true, //是否可见
        name: "updatatime", //和后端对应，FormData里面的key，后端解析时要一致
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
        title: "调出库部门", // 列标题
        visible: true, //是否可见
        name: "deptout", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 8, //在数据[[],[]]中的位置rows[i][seq] 返回值
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
        title: "入库部门", // 列标题
        visible: true, //是否可见
        name: "deptin", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 3, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "调度备忘", // 列标题
        visible: true, //是否可见
        name: "inmemo", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 2, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            if (item == '1') {
                return "<b>审核中</b>"
            }
            if (item == '2') {
                return "<b>待入库</b>"
            }
            if (item == '3') {
                return "<b>入库成功</b>"
            }
            if (item == '4'){
              return "<b>审核不通过</b>"
            }
            if (item == '5') {
                return "<b>无效单</b>"
            }
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "调度状态", // 列标题
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
                    id: Number(stockId),
                    cdept: Number(tbl.data[rows][7])
                },
                method: "post",
                url: "/sc/stocktransfer/getstocktransferinfo",
                callback: function(d) {
                    console.log(d)
                    if(d.stockinfo.length > 0){
                      var tableDlg = "<div>调度id：<span id='dispatchId'>" + tbl.data[rows][0] + "</span></div>" +
                          "<div>调度备忘录：<span id='dispatchMemo'>" + tbl.data[rows][3] + "</span></div><table id='stockCom' style='width:450px;margin-top:20px;' border='1'><thead><tr><th>商品名</th><th>规格</th><th>单位</th><th>调入数量</th></thead><tbody>"
                      for (var i = 0; i < d.stockinfo.length; i++) {
                          tableDlg += '<tr><td comNo="' + d.stockinfo[i][8] + '" stockId="' + d.stockinfo[i][0] + '" comId="' + d.stockinfo[i][1] + '">' + d.stockinfo[i][2] + '</td>' +
                              '<td>' + d.stockinfo[i][7] + '</td>' +
                              '<td>' + d.stockinfo[i][6] + '</td>' +
                              '<td>' + d.stockinfo[i][3] + '</td>' +
                              '</tr>'
                      }

                      var titleName = "入库"
                      if (tbl.data[rows][2] == "5" || tbl.data[rows][2] == "1" || tbl.data[rows][2] == "3") {
                          titleName = "关闭"
                      }
                      if (Number(tbl.data[rows][2]) == 4){
                          // titleName = "编辑"
                          titleName = "关闭"
                      }

                      if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                      var dlg = _e.dialog({
                          id: "dlgData",
                          width: "500px",
                          title: "查看调度",
                          mainBody: tableDlg,
                          actions: [{
                              id: "btn",
                              title: titleName,
                              func: function() {
                                  if (Number(tbl.data[rows][2]) == 1) {
                                      dlg.parentNode.removeChild(dlg)
                                      return
                                  }
                                  if (Number(tbl.data[rows][2]) == 3) {
                                      dlg.parentNode.removeChild(dlg)
                                      return
                                  }
                                  if (Number(tbl.data[rows][2]) == 4){
                                      dlg.parentNode.removeChild(dlg)
                                      return
                                  }
                                  if (Number(tbl.data[rows][2]) == 5) {
                                      dlg.parentNode.removeChild(dlg)
                                      return
                                  }
                                  if (Number(tbl.data[rows][2] == 2)) {
                                      var comTr = dlg.querySelector("tbody")
                                      var data = {}
                                      data.stocktransferid = Number(dlg.querySelector("#dispatchId").innerHTML)
                                      data.inmemo = (dlg.querySelector("#dispatchMemo").innerHTML == '') ? "无" : dlg.querySelector("#dispatchMemo").innerHTML
                                      data.stockid = [];
                                      data.commodity = [];
                                      data.amount = [];
                                      for (var i = 0; i < comTr.children.length; i++) {
                                          data.stockid.push(Number(comTr.children[i].children[0].getAttribute("stockid")));
                                          data.commodity.push(Number(comTr.children[i].children[0].getAttribute("comId")))
                                          data.amount.push(Number(comTr.children[i].children[3].innerHTML));
                                      }
                                      loadDate({
                                          data: data,
                                          method: "post",
                                          url: "/sc/stocktransfer/dispatchstock",
                                          callback: function(d) {
                                              _e["msgBox"]({
                                                  msg: d.msg,
                                                  className: d.res == -1 ? "error" : "success",
                                                  timeout: 3000
                                              })
                                              setTimeout(function(){
                                                  self.location.reload()
                                              },3000)
                                          }
                                      })
                                  }
                              }
                          }]
                      })
                      dlg.show()
                  }else{
                    _e["msgBox"]({
                        msg: "系统加载过慢，请刷新",
                        timeout: 3000
                    })
                  }
                }
            })
        },
        title: "商品详情"
    },{cls: "doerow",func: function(tbl, rows) {
            if (tbl.data[rows][2] == "1") {
                _e["msgBox"]({
                    msg: "此单不能废除",
                    timeout: 3000
                })
                return
            }
            if (tbl.data[rows][2] == "3") {
                _e["msgBox"]({
                    msg: "此单不能废除",
                    timeout: 3000
                })
                return
            }
            if (tbl.data[rows][2] == "4") {
                _e["msgBox"]({
                    msg: "此单不能废除",
                    timeout: 3000
                })
                return
            }
            if (tbl.data[rows][2] == "5") {
                _e["msgBox"]({
                    msg: "此单已废除废除",
                    timeout: 3000
                })
                return
            }
            if (tbl.data[rows][2] == "2") {
                if (document.querySelector("#dlgCom")) document.querySelector("#dlgCom").parentNode.removeChild(document.querySelector("#dlgCom"));
                var dlg = _e.deleteBox({
                    id: "dlgCom",
                    title: '是否废单',
                    mainBody: "",
                    actions: [{
                        id: "btnDe1",
                        title: "确定",
                        func: function() {
                            loadDate({
                                data: {
                                    id: Number(tbl.data[rows][0])
                                },
                                method: "post",
                                url: "/sc/stockingplanfer/delete" + _e.jurisdiction(),
                                callback: function(d) {
                                    _e["msgBox"]({
                                        msg: d.msg,
                                        className: d.res == -1 ? "error" : "success",
                                        timeout: 3000
                                    })
                                    setTimeout(function(){
                                        self.location.reload()
                                    },3000)
                                }
                            })
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
    t.funcs.init.call(t, "tbl",
        coldefs, row_actions, rows_actions, "table", "__THE__TABLE__", ext_row, "/sc/stocktransfer/getin")

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

function printAll(){
  var data = []
  var dataAllTbody = document.querySelector("#orderTbody")
  var dataAllThead = document.querySelector(".orderTable").querySelector("thead").querySelector("tr")
  var fd = new FormData(),xml = new XMLHttpRequest()
  for(var k = 0;k < dataAllThead.children.length-1;k++){
      data.push(dataAllThead.children[k].innerHTML)
      fd.append("data",dataAllThead.children[k].innerHTML)
  }
  for(var i = 0;i < dataAllTbody.children.length;i++){
      var dataAllTbody1 = dataAllTbody.children[i]
      fd.append("data",dataAllTbody1.children[0].innerHTML)
      fd.append("data",dataAllTbody1.children[1].innerHTML)
      fd.append("data",dataAllTbody1.children[2].children[0].value+dataAllTbody1.children[2].children[1].innerHTML)
      data.push(dataAllTbody1.children[0].innerHTML)
      data.push(dataAllTbody1.children[1].innerHTML)
      data.push(dataAllTbody1.children[2].children[0].value+dataAllTbody1.children[2].children[1].innerHTML)
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
