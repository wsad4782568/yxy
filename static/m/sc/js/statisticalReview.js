/**
 * Created by Administrator on 2016/6/25.
 */
function becomeTbl(e){
    t.funcs.loadData.call(t,{    //在table.js中的204行显示
        qseq:4, //数组中下标
        qverb:'e',//  等于 条件
        qpt:Number(e.getAttribute("value")) //值
    })
}



function loadtbl(){
    coldefs = [{
        seq: 0, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "统计id", // 列标题
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
        title: "创建时间", // 列标题
        visible: true, //是否可见
        name: "created", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 2, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "更新时间", // 列标题
        visible: true, //是否可见
        name: "updatetime", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 3, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
            retrievable: true, // 可检索 function
            title: "计划备忘录", // 列标题
            visible: true, //是否可见
            name: "memoofapply", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 4, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            if(item == 1){
                return "<b>有效订单</b>"
            }
            if(item == 5){
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
    row_actions =[{cls:"doerow",func:function(tbl,rows){    //这里改了
        var stockId = tbl.data[rows][0]
        loadDate({
            data:{id:Number(stockId)},
            method:"post",
            url:"/sc/checkstocking/gettrueplanitem",
            callback:function(d){
                console.log(d)
                var tableDlg = "<div>统计计划id：<span id='dispatchId'>"+tbl.data[rows][0]+"</span></div>" +
                    "<div>统计备忘录：<span id='dispatchMemo'>"+tbl.data[rows][3]+"</span></div>" +
                    "<table id='stockCom' style='width:450px;margin-top:20px;' border='1'><thead><tr>" +
                    "<th>编号</th><th>商品名</th><th>规格</th><th>单位</th><th>数量</th><th>备注</th></thead><tbody>"
                for(var i = 0;i < d.stockinfo.length;i++){
                    tableDlg += "<tr><td>"+d.stockinfo[i][0]+"</td><td>"+d.stockinfo[i][1]+"</td>" +
                        "<td>"+d.stockinfo[i][2]+"</td><td>"+d.stockinfo[i][3]+"</td>" +
                        "<td>"+d.stockinfo[i][4]+"</td><td>"+d.stockinfo[i][5]+"</td></tr>"
                }
                tableDlg += "</tbody></table>"

                var titleName = "编辑"
                if (tbl.data[rows][4] == "5") {
                    titleName = "关闭"
                }

                if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                var dlg = _e.dialog({id:"dlgData",width:"500px",
                    title:"统计计划情况",
                    mainBody:tableDlg,
                    actions:[{id:"btn",title:titleName,func:function(){
                        if(Number(tbl.data[rows][4]) == 1){
                          var tbodyCom = dlg.querySelector("tbody").children
                          var ComTr = new Object()
                          ComTr.stockId = Number(dlg.querySelector("#dispatchId").innerHTML)
                          ComTr.stockMemo = dlg.querySelector("#dispatchMemo").innerHTML
                          var stockCom = new Array()
                          for(var i = 0;i < tbodyCom.length;i++){
                              var comList = new Array()
                              comList[0] = tbodyCom[i].children[0].innerHTML
                              comList[1] = tbodyCom[i].children[1].innerHTML
                              comList[2] = tbodyCom[i].children[2].innerHTML
                              comList[3] = tbodyCom[i].children[4].innerHTML
                              comList[4] = tbodyCom[i].children[5].innerHTML
                              stockCom.push(comList)
                          }
                          ComTr.stockCom = stockCom
                          console.log(ComTr)
                          var frm = window.parent.document.querySelector("#frm")  //找到父页面的frame节点
                          frm.setAttribute("src","statistics.html")       //在子页面更改当前子页面
                          frm.setAttribute("editStatistics","editStatisticsAble")
                          localStorage.setItem("editStatistics",JSON.stringify(ComTr))
                        }
                      }},{id:"btn1",title:"导出",func:function(){
                          var data = []
                          var dataAllTbody = dlg.querySelector("tbody")
                          var dataAllThead = dlg.querySelector("thead").querySelector("tr")
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
                          dlg.parentNode.removeChild(dlg)
                          }}]})
                  dlg.show()
                  if (tbl.data[rows][4] == "5") {
                      document.querySelector("#btn1").style.display = "none"
                  }
            }
        })
    }, title:"查看详情"}]

    rows_actions = []

    ext_row = function(rows,i){
        return "this is row "+i
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/checkstocking/gettrueplan")

    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trunit").parentNode.removeChild(tbl_head.querySelector("#trunit")) //删除单位
    tbl_head.querySelector("#trdept").parentNode.removeChild(tbl_head.querySelector("#trdept"))  //删除部门

    var trtime = tbl_head.querySelector("#trtime")
    var trSearch = document.createElement("tr") //添加快捷键
    trSearch.innerHTML = '<td colspan="6"><input type="button" value="今天" onclick="dateSearch(1)"/>'+
      '<input type="button" value="近三天" onclick="dateSearch(3)"/>'+
      '<input type="button" value="近一周" onclick="dateSearch(7)"/>'+
      '<input type="button" value="近一个月" onclick="dateSearch(30)"/></td>'
    trtime.parentNode.insertBefore(trSearch,trtime)
}
loadtbl()
t.funcs.loadData.call(t,{    //在table.js中的204行显示
    qseq: -1, //更新时间
    qverb: 'g',// >
    qpt: -1,  //-1
    oseq: 2, //顺序的下标
    odir:"d" //降序降序
})

function dateSearch(e){   //时间快捷键
    var tody=_e["CurentTime"]()
    tody=_e["addDate"](tody,1)
    var times=document.querySelector("#tbl").querySelectorAll(".cqtime")
    times[0].value=_e["addDate"](tody,0-e)
    times[1].value=tody
    t.funcs.reloadOption.call(t)
    t.funcs.loadData.call(t, {
       qseq: 0, //id
       qverb: 'g',// >
       qpt: -1,  //-1
       oseq: 2, //顺序的下标
       odir:"d" //升序降序
    })
}
