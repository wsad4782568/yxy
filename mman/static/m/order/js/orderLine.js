/**
 * Created by Administrator on 2016/6/25.
 */
function becomeTbl(e){
    t.funcs.loadData.call(t,{    //在table.js中的204行显示
        qseq:7, //数组中下标
        qverb:'e',//  等于 条件
        qpt:Number(e.getAttribute("value")) //值
    })
}

function upOrDown(e){
    t.funcs.loadData.call(t,{    //在table.js中的204行显示
        qseq:10, //数组中下标
        qverb:'e',//  等于 条件
        qpt:Number(e.value) //值
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
        title: "订单id", // 列标题
        visible: true, //是否可见
        name: "id", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 1, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "用户名", // 列标题
        visible: true, //是否可见
        name: "name", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 2, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "电话", // 列标题
        visible: true, //是否可见
        name: "phone", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 3, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "地址", // 列标题
        visible: true, //是否可见
        name: "addres", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 4, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "创建时间", // 列标题
        visible: true, //是否可见
        name: "created", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 6, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "优惠价格", // 列标题
        visible: true, //是否可见
        name: "outofpocket", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 7, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            if(item == 1){
                return "<b>未付款</b>"
            }
            if(item == 2){
                return "<b>已付款</b>"
            }
            if(item == 3){
                return "<b>配送中</b>"
            }
            if(item == 4){
                return "<b>完成</b>"
            }
            if(item == 5){
                return "<b>取消</b>"
            }
            if(item == 11){
                return "<b>废单</b>"
            }
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "状态", // 列标题
        visible: true, //是否可见
        name: "status", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 8, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item/100 + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "总价", // 列标题
        visible: true, //是否可见
        name: "totalprice", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 9, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            if(item == 1){
              return "<b>现金</b>"
            }
            if(item == 2){
              return "<b>商城</b>"
            }
            if(item == 3){
              return "<b>代购</b>"
            }
            if(item == 4){
              return "<b>地推</b>"
            }
            if(item == 5){
              return "<b>门店退货</b>"
            }
            if(item == 6){
              return "<b>微信门店</b>"
            }
            if(item == 7){
              return "<b>银行卡门店</b>"
            }
            if(item == 8){
              return "<b>线上团购</b>"
            }
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "上下线", // 列标题
        visible: true, //是否可见
        name: "orders_type", //和后端对应，FormData里面的key，后端解析时要一致
    }]

    t = new _e["table"]()
    row_actions =[{cls:"doerow",func:function(tbl,rows){    //这里改了
        var stockId = tbl.data[rows][0]
        loadDate({
            data:{id:Number(stockId)},
            method:"post",
            url:"/sc/statistics/getorderinfo",
            callback:function(d){
                console.log(d)
                var tableDlg = "<div style='margin-left:20px;margin-top:15px;' id='memorandum'>订单id：<span>"+stockId +
                    "</span></div><table id='stockCom' style='width:450px;' border='1'><thead><tr><th>商品名</th><th>单位</th>" +
                    "<th>规格</th><th>数量</th><th>单价</th><th>总金额</th><th>备注</th></thead><tbody>"
                var allPrice = 0
                for(var i = 0;i < d.stockinfo.length;i++){
                    tableDlg += "<tr><td>"+d.stockinfo[i][0]+"</td>" +
                        "<td>"+d.stockinfo[i][1]+"</td>" +
                        "<td>"+d.stockinfo[i][2]+"</td>" +
                        "<td>"+d.stockinfo[i][6]+"</td>" +
                        "<td>"+((d.stockinfo[i][4]/100)/d.stockinfo[i][6]).toFixed(2)+"</td>" +
                        "<td>"+(d.stockinfo[i][4]/100).toFixed(2)+"元</td>"+
                        "<td>"+d.stockinfo[i][3]+"</td>" +
                        "</tr>"
                    allPrice = allPrice + (d.stockinfo[i][4]/100)
                }
                tableDlg += "</tbody></table><div style='margin-left:20px;margin-top:5px' id='memorandum'>总计：<span>"+allPrice.toFixed(2) +
                    "元</span></div>"

                var titleName = "关闭"
                var rootuser  = localStorage.getItem("rootuser")
                if(rootuser == "超级用户"){
                  titleName = "废单"
                }
                // if(Number(tbl.data[rows][7]) == 11){
                //   titleName = "关闭"
                // }
                if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                var dlg = _e.dialog({id:"dlgData",width:"500px",
                    title:"查看当前订单",
                    mainBody:tableDlg,
                    actions:[{id:"btn",title:titleName,func:function(){
                      if(titleName ==  "关闭" || Number(tbl.data[rows][7]) == 11){
                        dlg.parentNode.removeChild(dlg)
                        return
                      }
                       if(rootuser == "超级用户" && Number(tbl.data[rows][7]) != 11){
                         loadDate({
                             data:{id:Number(tbl.data[rows][0])},
                             method:"post",
                             url:"/sc/statistics/wastesingle",
                             callback:function(d){
                                 _e["msgBox"]({
                                     msg: d.msg,
                                     className: d.res==-1 ? "error":"success",
                                     timeout:3000
                                 })
                                 dlg.parentNode.removeChild(dlg)
                                 setTimeout(function(){
                                     self.location.reload()
                                 },3000)
                             }
                         })
                       }
                    }},{id:"btn1",title:"导出",func:function(){
                      alert("导出接口测试")
                      // var data = []
                      // var dataAllTbody = dlg.querySelector("tbody")
                      // var dataAllThead = dlg.querySelector("thead").querySelector("tr")
                      // var fd = new FormData(),xml = new XMLHttpRequest()
                      // for(var k = 0;k < dataAllThead.children.length;k++){
                      //     data.push(dataAllThead.children[k].innerHTML)
                      //     fd.append("data",dataAllThead.children[k].innerHTML)
                      // }
                      // for(var i = 0;i < dataAllTbody.children.length;i++){
                      //     for(var j = 0;j < dataAllTbody.children[i].children.length;j++){
                      //         if(dataAllTbody.children[i].children[j].innerHTML == ""){
                      //           data.push(" ")
                      //           fd.append("data","  ")
                      //         }else{
                      //           if(dataAllTbody.children[i].children[j].style.visibility == "hidden"){
                      //             data.push("")
                      //             fd.append("data","  ")
                      //           }else{
                      //             data.push(dataAllTbody.children[i].children[j].innerHTML)
                      //             fd.append("data",dataAllTbody.children[i].children[j].innerHTML)
                      //           }
                      //         }
                      //     }
                      // }
                      // console.log(data)
                      // var memorandum = document.querySelector("#memorandum").querySelector("span")
                      // xml.open("POST"," ",true)
                      // xml.send(fd)
                      // xml.onreadystatechange = function(){
                      //     if (xml.readyState==4 && xml.status==200){
                      //         var d = eval('('+xml.responseText+');')
                      //         console.log(d)
                      //     }
                      // }
                    }},{id:"btn2",title:"手动打印",func:function(){
                      if(tbl.data[rows][7] == "2"){
                        var memorandum = dlg.querySelector("#memorandum").querySelector("span")
                        var cqdept = document.querySelector("#cqdept")
                        var xml = new XMLHttpRequest()
                        xml.open("POST","/sc/order/printself?orderid=" + Number(memorandum.innerHTML) +"&department="+ Number(cqdept.value),true)
                        xml.send()
                        xml.onreadystatechange = function(){
                            if (xml.readyState==4 && xml.status==200){
                                var d = eval('('+xml.responseText+');')
                                _e["msgBox"]({
                                    msg: d.msg,
                                    className: d.res==-1 ? "error":"success",
                                    timeout:3000
                                })
                            }
                        }
                      }
                    }}
                    ]})
                dlg.show()
                if (tbl.data[rows][7] != "2") {
                    document.querySelector("#btn2").style.display = "none"
                }
            }
        })
    },title:"查看计划"}]

    rows_actions = []

    ext_row = function(rows,i){
        return "<div class='com'></div>"
    }
    after_Load = function(tbl,tblDom) {
        for(var i = 0;i < tbl.data.length;i++){
            tblName(tbl.data[i],i,tblDom)
        }

    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/statistics/manageorder",after_Load)

        var tbl_head = document.querySelector("#tbl").querySelector("thead")  //删除单位
        tbl_head.querySelector("#trunit").parentNode.removeChild(tbl_head.querySelector("#trunit"))

        var trtime = tbl_head.querySelector("#trtime")
        var trSearch = document.createElement("tr") //添加快捷键
        trSearch.innerHTML = '<td colspan="9"><input type="button" value="今天" onclick="dateSearch(1)"/>'+
          ' <input type="button" value="近三天" onclick="dateSearch(3)"/>'+
          ' <input type="button" value="近一周" onclick="dateSearch(7)"/>'+
          ' <input type="button" value="近一个月" onclick="dateSearch(30)"/>'+
          ' <select id="upOrDown" onchange = "upOrDown(this)"> '+
          ' <option value="1">现金</option><option value="2">商城</option>' +
          ' <option value="3">代购</option><option value="4">地推</option>' +
          ' <option value="5">门店退货</option><option value="6">微信门店</option>'+
          ' <option value="7">银行卡门店</option><option value="8">线上团购</option>'+
          ' </select></td>'
        trtime.parentNode.insertBefore(trSearch,trtime)
}
loadtbl()
t.funcs.loadData.call(t,{    //在table.js中的204行显示
    qseq: -1, //id
    qverb: 'g',// >
    qpt: -1,  //-1
    oseq: 5, //顺序的下标
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
       oseq: 5, //顺序的下标
       odir:"d" //升序降序
    })
}

function tblName(data,seq,tblDom){   //在扩展栏下面显示一到两个商品
    var com = tblDom.querySelectorAll(".com")[seq]
    loadDate({
        data:{id:Number(data[0])},
        method:"post",
        url:"/sc/statistics/getorderinfo"+_e.jurisdiction(),
        callback:function(d){
            for(var i = 0;i < d.stockinfo.length;i++){
            	com.innerHTML += i+1+":<span class='com'>"+d.stockinfo[i][0]+";</span>"
            }
        }
    })
}
