loadDate({
    data:{},
    method:"post",
    url:"/basis/staff/getstaffinfo",
    callback:function(d){
        console.log(d)
        document.querySelector("#department").innerHTML = "部门："+ d.stockinfo[0][2]
        document.querySelector("#department").setAttribute("departmentType",d.stockinfo[0][1])
        document.querySelector("#staff").innerHTML = "姓名:"+ d.stockinfo[0][0]
    }
})

function loadtbl(){
    coldefs = [{
        seq: 0, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "商品id", // 列标题
        visible: true, //是否可见
        checkall: false, // 是否可全选
        isID: 1,
        name: "id", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 1, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "商品名", // 列标题
        visible: true, //是否可见
        name: "name", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 7, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "商品规格", // 列标题
        visible: true, //是否可见
        name: "specification", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 11, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>"+item+"</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "商品库存单位", // 列标题
        visible: true, //是否可见
        name: "unit", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 12,
        render: function(item) {
            for(var i =0;i<others.tree.length;i++){
                if(others.tree[i][1]==item){
                    return "<b>" + others.tree[i][2] + "</b>"}
            }
        },
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "商品种类", // 列标题
        visible: true, //是否可见
    }]

    t = new _e["table"]()
    row_actions =[
        {cls:"doerow",func:function(tbl,rows){
            var xhr = new XMLHttpRequest()
            xhr.open("POST","/sc/commodityrel/getUnitbysubCom?id=" + Number(tbl.data[rows][0]),true)
            xhr.send()
            xhr.onreadystatechange=function(){
                if (xhr.readyState==4 && xhr.status==200){
                    var d = eval('('+xhr.responseText+');')
                    addCom(tbl,rows,d.commodityunit)
                }
            }
        },title:"添加"}
    ]

    rows_actions = []

    ext_row = function(rows,i){
        return "this is " + i
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/commodity/getcommoditys")
}
loadtbl()
t.funcs.loadData.call(t)

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
        t.funcs.loadData.call(t)
    }
}
function loadtree(treedata){
    var trs=new _e["tree"]()
    var event=[{e:"click",func:function () { //需要绑定的函数，绑定tbl
        t.funcs.loadData.call(t,{    //在table.js中的204行显示
            qseq:12, //数组中下标
            qverb:'k',// like '% %' 条件
            qpt:this.getAttribute("data-code") //值
        })
    }, is_leaf:1}]
    trs.init("#trees",treedata,1,"TR",event)    //创建树
}

function deleteCom(e){   //删除列表
    e.parentNode.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode.parentNode)
}

function addCom(tbl,rows,comUnit){   //添加列表商品
    console.log(comUnit)
    for(var i = 0;i< document.querySelector("#commodityList").children.length;i++){
        if(tbl.data[rows][0] == document.querySelector("#commodityList").children[i].querySelector("td").getAttribute("comid")){
            alert("该商品已添加!")
            return
        }
    }
    var basisUnit,addedUnit,purchaseUnit,leastUnit
    for(var j = 0;j < comUnit.length;j++){
        if(Number(comUnit[j][1]) == 1){
            basisUnit = '<span class="basisUnit unit" comId="'+comUnit[j][0]+'" comStockId="'+comUnit[j][4]+'">'+comUnit[j][3]
        }
        if(Number(comUnit[j][1]) == 2){
            addedUnit = '<span class="addedUnit unit" comId="'+comUnit[j][0]+'" comStockId="'+comUnit[j][4]+'">'+comUnit[j][3]
        }
        if(Number(comUnit[j][1]) == 3){
            purchaseUnit = '<span class="purchaseUnit unit" comId="'+comUnit[j][0]+'" comStockId="'+comUnit[j][4]+'">'+comUnit[j][3]
        }
        if(Number(comUnit[j][1]) == 4){
            leastUnit = '<span class="leastUnit unit" comId="'+comUnit[j][0]+'" comStockId="'+comUnit[j][4]+'">'+comUnit[j][3]
        }
    }
    var tr = document.createElement("tr")
    tr.innerHTML = '<tr><td comId="'+tbl.data[rows][0]+'">'+ tbl.data[rows][1] +'</td>' +
        '<td style="width: 100px;" class="selectCom1"><input type="number"  class="numb basis" style="width: 80px;"/>'+basisUnit+'</span>' +
        '<hr/><input type="number"  class="numb1 basis" style="width: 60px;"/>'+basisUnit+'(补)'+'</span>' + '</td>'+

        '<td style="width: 100px;" class="selectCom2"><input type="number"  class="numb added" style="width: 80px;"/>'+addedUnit+'</span>' +
        '<hr/><input type="number"  class="numb1 added" style="width: 60px;"/>'+addedUnit+'(补)'+'</span>' + '</td>'+

        '<td style="width: 100px;" class="selectCom3"><input type="number"  class="numb purchase" style="width: 80px;"/>'+purchaseUnit+'</span>' +
        '<hr/><input type="number"  class="numb1 purchase" style="width: 60px;"/>'+purchaseUnit+'(补)'+'</span>' + '</td>'+

        '<td style="width: 100px;" class="selectCom4"><input type="number"  class="numb least" style="width: 80px;"/>'+leastUnit+'</span>' +
        '<hr/><input type="number"  class="numb1 least" style="width: 60px;"/>'+leastUnit+'(补)'+'</span>' + '</td>'+
        '<td><a href="#" style="color: #0a0a0a;text-decoration:none;"><i class="icon iconfont icon-delete"  onclick="deleteCom(this)"></i></a></td></tr>'
    document.querySelector("#commodityList").appendChild(tr)
}

document.querySelector("#planCommodity").addEventListener("click",function(){
    var commodityList = document.querySelector("#commodityList")
    if(commodityList.children.length == 0){
        alert("计划不能为空！")
        return
    }
    var numb = document.querySelectorAll(".numb")
    for(var j = 0;j < numb.length;j++){
        if(Number(numb[j].value) < 0){
            alert("数量不能小于0!")
            return
        }
    }
    for(j = 0;j <commodityList.children.length;j++){
        var basis = commodityList.children[j].querySelectorAll(".basis")      //判断基本单位的两个数量不能同时存在
        console.log(commodityList.children[j])
        if(Number(basis[0].value) > 0){
            if(basis[1].value != ''){
                alert("基本单位的增加数量和减少数量不能同时存在!")
                return
            }
        }
        if(Number(basis[1].value) > 0){
            if(basis[0].value != ''){
                alert("基本单位的增加数量和减少数量不能同时存在!")
                return
            }
        }

        var added = commodityList.children[j].querySelectorAll(".added")      //判断上架单位的两个数量不能同时存在
        if(Number(added[0].value) > 0){
            if(added[1].value != ''){
                alert("上架单位的增加数量和减少数量不能同时存在!")
                return
            }
        }
        if(Number(added[1].value) > 0){
            if(added[0].value != ''){
                alert("上架单位的增加数量和减少数量不能同时存在!")
                return
            }
        }

        var purchase = commodityList.children[j].querySelectorAll(".purchase")      //判断采购单位的两个数量不能同时存在
        if(Number(purchase[0].value) > 0){
            if(purchase[1].value != ''){
                alert("采购单位的增加数量和减少数量不能同时存在!")
                return
            }
        }
        if(Number(purchase[1].value) > 0){
            if(purchase[0].value != ''){
                alert("采购单位的增加数量和减少数量不能同时存在!")
                return
            }
        }

        var least = commodityList.children[j].querySelectorAll(".least")      //判断最小单位的两个数量不能同时存在
        if(Number(least[0].value) > 0){
            if(least[1].value != ''){
                alert("最小单位的增加数量和减少数量不能同时存在!")
                return
            }
        }
        if(Number(least[1].value) > 0){
            if(least[0].value != ''){
                alert("最小单位的增加数量和减少数量不能同时存在!")
                return
            }
        }
    }

    var fd = new FormData(),xml = new XMLHttpRequest();

    var orderMemo = document.querySelector("#orderMemo").value
    if(orderMemo == ''){
        fd.append("outmemo","无")
    }else{
        fd.append("outmemo",orderMemo)
    }

    var planCom = document.querySelector("#commodityList").children
    for(var i = 0;i < planCom.length;i++){
        for(var k = 0;k < planCom[i].querySelectorAll(".numb").length;k++){
            var numbK = planCom[i].querySelectorAll(".numb")[k]
            if(Number(numbK.value) > 0){
                fd.append("amountadd",Number(numbK.value))
                fd.append("stockidadd",Number(numbK.parentNode.querySelectorAll(".unit")[0].getAttribute("comStockId")))
            }

            var numb1K = planCom[i].querySelectorAll(".numb1")[k]
            if(Number(numb1K.value) > 0){
                fd.append("amountreduce",Number(numb1K.value))
                fd.append("stockidreduce",Number(numb1K.parentNode.querySelectorAll(".unit")[1].getAttribute("comStockId")))
            }
        }
    }
    xml.onreadystatechange = function(){
        if (xml.readyState==4 && xml.status==200){
            var d = eval('('+xml.responseText+');')
            alert(d.msg)
            document.querySelector("#orderMemo").value = ""
            self.location.reload()
        }
    }
    xml.open("POST","/sc/stockloss/insert",true);
    xml.send(fd);

},true)