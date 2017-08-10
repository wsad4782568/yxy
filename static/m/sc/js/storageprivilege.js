var xmlEmployee = new XMLHttpRequest()
xmlEmployee.open("POST","/staff/getstaffinfo",true)
xmlEmployee.send()
xmlEmployee.onreadystatechange = function(){
    if (xmlEmployee.readyState==4 && xmlEmployee.status==200){
        staffinfo = eval('('+xmlEmployee.responseText+');')
    }
}


var alldepts=JSON.parse(localStorage.getItem("alldept"))
var xhr = new XMLHttpRequest();
xhr.open("GET", "/sc/commodity/getext", true);
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        others = eval('('+xhr.responseText+');')
        trs=[]
        trs.push([0,"父节点"])
        for(var i in others.tree) {
            trs.push([others.tree[i][0],others.tree[i][2],others.tree[i][7],others.tree[i][8],["data-code",others.tree[i][1]]]);
        }
        loadtree(trs)
        loadtbl()
        t.funcs.loadData.call(t, {
            qseq: 0, //id
            qverb: 'g',// >
            qpt: -1,  //-1
            oseq: 12, //顺序的下标
            odir:"a" //升序降序
        })
        _e.bind("#cqdept","change",function(){
          document.querySelector("#commodityList").innerHTML=""
          // _e.msgBox({msg:"切换门店后入库列表中商品还是原来的门店，请确认手动删除",timeout:10000})
          // if(document.querySelector("#commodityList").children.length>0){
          //   if(!confirm("计划内商品只能属于同一个部门，是否要保留原先部门的商品信息？")){
          //     document.querySelector("#commodityList").innerHTML=""
          //   }
          // }
       })
    }
}
function loadtree(treedata){
    var trs=new _e["tree"]()
    var event=[{e:"click",func:function () { //需要绑定的函数，绑定tbl
        t.funcs.loadData.call(t,{    //在table.js中的204行显示
            qseq:11, //数组中下标
            qverb:'k',// like '% %' 条件
            qpt:this.getAttribute("data-code") //值
        })
    }, is_leaf:1}]
    trs.init("#trees",treedata,1,"TR",event)    //创建树
}
function loadtbl(){
    coldefs = [{
        seq: 1, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function (item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "商品名", // 列标题
        visible: true, //是否可见
        name: "name", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 10, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function (item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "流水号", // 列标题
        visible: true, //是否可见
        checkall: false, // 是否可全选
        name: "id", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 12, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function (item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "编号", // 列标题
        visible: true, //是否可见
        name: "minimum"//和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 11, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function (item) {
            for(var i = 0;i<window["others"].tree.length;i++){
                if (others.tree[i][1]==item) return "<b>"+others.tree[i][2]+item+"</b>"
            }
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: false, // 可排序 function
        retrievable: false, // 可检索 function
        title: "种类", // 列标题
        visible: true, //是否可见
        name: "stocktype", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 9, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function (item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "规格", // 列标题
        visible: true, //是否可见
    }, {
        seq: 8, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function (item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "单位", // 列标题
        visible: true, //是否可见
        name: "unit", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 13, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function (item) {
            return "<b>" + (item/100).toFixed(2) + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: false, // 可排序 function
        retrievable: false, // 可检索 function
        title: "进价 ", // 列标题
        visible: true, //是否可见
    }, {
        seq: 14, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function (item) {
            return "<b>" + (item/100).toFixed(2) + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: false, // 可排序 function
        retrievable: false, // 可检索 function
        title: "零售价 ", // 列标题
        visible: true, //是否可见
    }, {
        seq: 2, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function (item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "库存", // 列标题
        visible: true, //是否可见
        name: "amount", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 3, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function (item) {
            if (item == 1) return "<b>销售</b>"
            return "<b></b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: false, // 可排序 function
        retrievable: false, // 可检索 function
        title: "销售状态", // 列标题
        visible: true, //是否可见
        name: "offshelf", //和后端对应，FormData里面的key，后端解析时要一致
    }, {
        seq: 6, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function (item) {
            if (item == 1) return "<b>商城</b>"
            return "<b></b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: false, // 可排序 function
        retrievable: false, // 可检索 function
        title: "线上", // 列标题
        visible: true, //是否可见
        name: "onlinesale", //和后端对应，FormData里面的key，后端解析时要一致
    }, { seq:15,
        title:"条形码",
        render:function(item){
            var codes=item.split(",")
            var barcode = ''
            for(var i = 0 ;i < codes.length-1;i++){
                barcode+='<i>'+codes[i]+'</i><br>'
            }
            return "<b>"+barcode+"</b>"
        },
        visible:true,
    }]

    t = new _e["table"]()
    row_actions =[{cls:"doerow",func:function(tbl,rows){
        var datas = tbl.data[rows]
        var tr_id=document.querySelector("#commodityList").children
        for(var i = 0;i< tr_id.length;i++){
            if(datas[12] == tr_id[i].getAttribute("data-id")){
                if(datas[10] == Number(tr_id[i].children[1].innerHTML)){
                    _e["msgBox"]({msg:"该商品该单位已经在列表中了"})
                    return
                }
            }
        }
        var tr=document.createElement("tr")
        tr.setAttribute("data-id",datas[12])
        tr.innerHTML =
            '<td>' + datas[1] + '</td>'+
            '<td data-id="'+datas[0]+'">' + datas[10] + '</td>'+
            '<td>' + datas[9] + '</td>'+
            '<td> <input class="price" type="number" style="width: 80px;" value="'+(datas[13]/100).toFixed(2)+'" /></td>'+
            '<td> <input class="amount" type="number" style="width: 80px;" value="" storageCapacity="'+datas[2] +'"/>' + datas[8] + '</td>'
        tr.innerHTML += '<td><a href="#" style="color: #0a0a0a"><i class="icon iconfont icon-delete" onclick="deleteCom(this)"></i></a></td>'
        document.querySelector("#commodityList").appendChild(tr)
    },title:"添加至计划"}]

    rows_actions = []

    document.querySelector("#planCommodity").addEventListener("click",function(){
        var strabsferout_appened = false
        var fd = new FormData(),xhr = new XMLHttpRequest()
        var dlg = _e.dialog({id:"dlgData",width:"500px",
            title:"确认入库计划商品",
            mainBody:" <div><i>入库人 : </i><h3 id='handlerin'></h3>" +
            "<i>入库部门 : </i><h3 id='deptin'></h3>" +
            "</div>" +
            "<table class='pure-table pure-table-bordered'> <thead> <tr> " +
            "<th>商品名</th> " +
            "<th>流水号</th> " +
            "<th>规格</th> " +
            "<th>进价</th> " +
            "<th>入库数量</th> " +
            "</tr> </thead> <tbody id='lookstks'></tbody></table>",
            actions:[{id:"btn",title:"确定入库",func:function(){
              if(strabsferout_appened){
                _e["msgBox"]({  msg: "已经点击过入库，切勿重复入库"})
                return
              }
              strabsferout_appened=true
                xhr.open("POST","/sc/expressstock/inerttransferin"+_e["jurisdiction"](),true)
                xhr.send(fd)
                xhr.onreadystatechange = function(){
                    if (xhr.readyState==4 && xhr.status==200){
                        var d = eval('('+xhr.responseText+');')
                        _e["msgBox"]({
                            msg: d.msg,
                            className: d.res==-1 ? "error":"success",
                            timeout:3000
                        })
                        if(d.res==0){
                          dlg.parentNode.removeChild(dlg)
                            document.querySelector(".plan").querySelector("tbody").innerHTML = ''
                            document.querySelector("#commodityList").innerHTML = ''
                        }
                    }
                }
            }}]})

        var comList = document.querySelector("#commodityList")
        var stks=comList.children
        var all_Amount = comList.querySelectorAll(".amount")
        var all_Price = comList.querySelectorAll(".price")
        var lookstks = dlg.querySelector("#lookstks")
        if (comList.children.length == 0) {
            alert("订单不能为空！")
            return
        }
        for (var i = 0; i < all_Amount.length; i++) {
          console.log(Number(all_Amount[i].value))
          if (Number(all_Amount[i].value) <= 0 || isNaN(Number(all_Amount[i].value))) {
              _e["msgBox"]({msg:"不能有数量小于0的存在"})
              return
          }
          if (Number(all_Price[i].value) <= 0 || isNaN(Number(all_Price[i].value))) {
              _e["msgBox"]({msg:"不能有进价小于0的存在"})
              return
          }
          fd.append("stockid", comList.children[i].children[1].getAttribute("data-id"))
          fd.append("amount", all_Amount[i].value)
          fd.append("price", parseInt(Number(all_Price[i].value)*100))
          var tr=document.createElement("tr")
         // tr.innerHTML = stks[i].innerHTML
          tr.innerHTML="<th>"+stks[i].children[0].innerHTML+"</th> " +
              "<th>"+stks[i].children[1].innerHTML+"</th> " +
              "<th>"+stks[i].children[2].innerHTML+"</th> " +
              "<th>"+stks[i].children[3].children[0].value+"</th> " +
              "<th>"+stks[i].children[4].children[0].value+"  "+stks[i].children[4].innerText+"</th> "
          lookstks.appendChild(tr)

      }
      var cqdept=document.querySelector("#cqdept")
      var index = cqdept.selectedIndex; // 选中索引
        dlg.querySelector("#handlerin").innerHTML=staffinfo.staff[1]
        dlg.querySelector("#deptin").innerHTML=cqdept.options[index].text
        fd.append("handlerin",staffinfo.staff[0])
        fd.append("checkby",staffinfo.staff[0])
        fd.append("deptin",cqdept.value)
        fd.append("inmemo",document.querySelector("#orderForm").value)

        dlg.show()

    },true)


    ext_row = function(rows,i){
        return "this is row "+i
    }
    after_Load = function(tbl,tblDom){}
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/expressstock/getstocks",after_Load)
    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
}
function deleteCom(e){
    e.parentNode.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode.parentNode)
}


var drafts=_e["getQueryString"]("drafts")
if(drafts){
    _e["gethtml"](document.querySelector('#commodityList'),'storageprivilege',['price','amount'])
}else{
    var t2 = window.setInterval("_e.sethtml(document.querySelector('#commodityList'),'storageprivilege',['price','amount'])",10000);
}
