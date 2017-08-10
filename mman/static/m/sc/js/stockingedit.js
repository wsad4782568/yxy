/**
 * Created by Administrator on 2016/6/25.
 */
function becomeTbl(e){
    t.funcs.loadData.call(t,{    //在table.js中的204行显示
        qseq:1, //数组中下标
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
        title: "编号", // 列标题
        visible: true, //是否可见
        // checkall: false, // 是否可全选
        // isID: 1,
        name: "id", //和后端对应，FormData里面的key，后端解析时要一致
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
        seq: 5, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "更新时间", // 列标题
        visible: true, //是否可见
        name: "updatetime", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 2, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "计划备忘录", // 列标题
        visible: true, //是否可见
        name: "memoofapply", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 1, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            if(item == 1){
                return "<b>审核中</b>"
            }
            if(item == 2){
                return "<b>审核通过</b>"
            }
            if(item == 3){
                return "<b>入库成功</b>"
            }
            if(item == 4){
                return "<b>审核不通过</b>"
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
    row_actions =[{cls:"doerow",func:function(tbl,rows){
        var fd = new FormData(),xml = new XMLHttpRequest()
        fd.append("id",Number(tbl.data[rows][0]))
        xml.open("POST","/sc/stockingplan/getstockingplaninfo"+_e.jurisdiction(),true)
        xml.send(fd)
        xml.onreadystatechange = function(){
            if (xml.readyState==4 && xml.status==200){
                var d = eval('(' +xml.responseText+ ');')
                // console.log(d)
                var detailTbody = document.querySelector("#detailTbody")
                detailTbody.innerHTML = ''
                for(var i = 0;i < d.stockinfo.length;i++){
                    detailTbody.innerHTML += "<tr>" +
                        "<td>"+d.stockinfo[i][0]+"</td>" +    //计划id
                        "<td>"+d.stockinfo[i][3]+"</td>" +    //本次计划备忘
                        "<td comId='"+d.stockinfo[i][5]+"' comNum='"+d.stockinfo[i][7]+"'>"+d.stockinfo[i][1]+"</td>" +  //商品名
                        "<td>"+d.stockinfo[i][2]+"</td>" +   //商品数量
                        "<td>"+d.stockinfo[i][6]+"</td>" +   //商品单位
                        "<td>"+d.stockinfo[i][4]+"</td></tr>"   //商品备忘
                }
                var editButtonOld = document.querySelector(".editButton")   //删除先前的编辑按钮
                if(editButtonOld){
                  editButtonOld.parentNode.removeChild(editButtonOld)
                }

                var tblRight = document.querySelector("#tblRight")
                tblRight.innerHTML += '<input type="button" value="编辑" class="editButton"/>'
                var editButton = document.querySelector(".editButton")
                if(tbl.data[rows][1] == '1' || tbl.data[rows][1] == '2' || tbl.data[rows][1] == '5' || tbl.data[rows][1] == '3'){    //无编辑按钮
                    editButton.parentNode.removeChild(editButton)
                }
                if(tbl.data[rows][1] == '4'){            //有编辑按钮
                    editButton.style.backgroundColor = "rgb(17, 202, 63)"
                    editButton.addEventListener("click",function(){
                        var detailTbody = document.querySelector("#detailTbody")
                        var tbodyCom = document.querySelector("#detailTbody").children
                        var ComTr = new Object()
                        ComTr.stockId = tbl.data[rows][0]
                        ComTr.stute = tbl.data[rows][1]
                        var stockCom = new Array()
                        for(var i = 0;i < tbodyCom.length;i++){
                            var detailTbodyTr = detailTbody.children[i]
                            var comList = {}
                            comList.comNum = detailTbodyTr.children[2].getAttribute("comNum")
                            comList.comId = detailTbodyTr.children[2].getAttribute("comId")
                            comList.comName = detailTbodyTr.children[2].innerHTML
                            comList.comAmount = detailTbodyTr.children[3].innerHTML
                            comList.comUnit = detailTbodyTr.children[4].innerHTML
                            comList.comMemo = detailTbodyTr.children[5].innerHTML
                            stockCom.push(comList)
                        }
                        ComTr.stockCom = stockCom
                        var frm = window.parent.document.querySelector("#frm")  //找到父页面的frame节点
                        frm.setAttribute("src","stockingplan.html")       //在子页面更改当前子页面
                        frm.setAttribute("editPurchase","editPurchaseAble")
                        localStorage.setItem("editCom",JSON.stringify(ComTr))
                    },true)
                }
            }
        }
    },title:"查看计划"}]

    rows_actions = []

    ext_row = function(rows,i){
        return "this is row "+i
    }

    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/checkstockingplan/get"+_e.jurisdiction())

        var tbl_head = document.querySelector("#tbl").querySelector("thead")  //删除单位
        tbl_head.querySelector("#trunit").parentNode.removeChild(tbl_head.querySelector("#trunit"))

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

//编辑，返回采购页面
function editCom(){
    var tbodyCom = document.querySelector("#stockCom").querySelector("tbody").children
    var ComTr = new Object()
    ComTr.stockId = Number(document.querySelector("#memorandum").querySelector("span").innerHTML)
    ComTr.stockMemo = document.querySelector("#memorandum").querySelector("input").value
    var stockCom = new Array()
    for(var i = 0;i < tbodyCom.length;i++){
        var comList = new Array()
        comList[0] = tbodyCom[i].children[0].innerHTML
        comList[1] = tbodyCom[i].children[1].innerHTML
        comList[2] = tbodyCom[i].children[2].innerHTML
        comList[3] = tbodyCom[i].children[3].innerHTML
        comList[4] = tbodyCom[i].children[4].innerHTML
        stockCom.push(comList)
    }
    ComTr.stockCom = stockCom
    var frm = window.parent.document.querySelector("#frm")  //找到父页面的frame节点
    frm.setAttribute("src","stockingplan.html")       //在子页面更改当前子页面
    frm.setAttribute("editPurchase","editPurchaseAble")
    localStorage.setItem("editCom",JSON.stringify(ComTr))
}
