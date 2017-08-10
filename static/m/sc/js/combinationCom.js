function loadtbl(){
    coldefs = [{
        seq: 0, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "礼包id", // 列标题
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
        title: "礼包名", // 列标题
        visible: true, //是否可见
        name: "name", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 4, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>"+ (item/100).toFixed(2) +"</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "礼包单价", // 列标题
        visible: true, //是否可见
        name: "price", //和后端对应，FormData里面的key，后端解析时要一致
    },{
        seq: 7, //在数据[[],[]]中的位置rows[i][seq] 返回值
        render: function(item) {
            return "<b>" + item + "</b>"
        }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable: true, // 可排序 function
        retrievable: true, // 可检索 function
        title: "礼包规格", // 列标题
        visible: true, //是否可见
        name: "specification", //和后端对应，FormData里面的key，后端解析时要一致
    }]

    t = new _e["table"]()
    row_actions =[
        {cls:"doerow",func:function(tbl,rows){
            document.querySelector("#combinationComs").innerHTML = ""
            var combinationName = document.querySelector("#combinationName")
            combinationName.innerHTML = tbl.data[rows][1]
            combinationName.setAttribute("com",tbl.data[rows][0])
            loadDate({
                data:{id:Number(tbl.data[rows][0])},
                method:"POST",
                url:"/sc/conpackage/getbyid"+_e.jurisdiction(),
                async:true,
                callback:function(d){
                    var combinationComs = document.querySelector("#combinationComs")
                    combinationComs.innerHTML = ""
                    for(var i = 0;i < d.freegift.length;i++){
                        combinationComs.innerHTML += "<tr><td>"+d.freegift[i][0]+"</td>" +
                            "<td>"+d.freegift[i][1]+"</td>" +
                            "<td>"+d.freegift[i][2]+"</td>" +
                            "<td>"+d.freegift[i][3]+"</td>" +
                            "<td>"+d.freegift[i][7]+"</td></tr>"
                    }
                }
            })
        },title:"详情"}
    ]

    rows_actions = []

    ext_row = function(rows,i){
        return "this is " + i
    }

    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/conpackage/getcommoditys"+_e.jurisdiction())
}
loadtbl()
t.funcs.loadData.call(t)

_e["bind"]("#addCombinationCom","click",function(){
    var combinationComs = document.querySelector("#combinationComs")
    if(combinationComs.children.length == 0){
        alert("当前组合商品为空!")
        return
    }
    var addCombinationAmount = document.querySelector("#addCombinationAmount").value
    if(Number(addCombinationAmount) <= 0){
        alert("请输入正确的数量")
        return
    }
    var data = {}
    data.commodityid = []
    data.amountbycom = []
    data.commoditymainid = Number(document.querySelector("#combinationName").getAttribute("com"))
    data.amount = Number(document.querySelector("#addCombinationAmount").value)
    for(var i = 0;i < combinationComs.children.length;i++){
        data.commodityid.push(Number(combinationComs.children[i].children[0].innerHTML))
        data.amountbycom.push(Number(combinationComs.children[i].children[4].innerHTML))
    }
    loadDate({
        data:data,
        method:"POST",
        url:"/sc/comstock/add"+_e.jurisdiction(),
        async:true,
        callback:function(d){
            alert(d.msg)
            self.location.reload()
        }
    })
})

_e["bind"]("#lowerCombinationCom","click",function(){
    var combinationComs = document.querySelector("#combinationComs")
    if(combinationComs.children.length == 0){
        alert("当前组合商品为空!")
        return
    }
    var lowerCombinationAmount = document.querySelector("#lowerCombinationAmount").value
    if(Number(lowerCombinationAmount) <= 0){
        alert("请输入正确的数量")
        return
    }
    var data = {}
    data.commodityid = []
    data.amountbycom = []
    data.commoditymainid = Number(document.querySelector("#combinationName").getAttribute("com"))
    data.amount = Number(document.querySelector("#lowerCombinationAmount").value)
    for(var i = 0;i < combinationComs.children.length;i++){
        data.commodityid.push(Number(combinationComs.children[i].children[0].innerHTML))
        data.amountbycom.push(Number(combinationComs.children[i].children[4].innerHTML))
    }
    loadDate({
        data:data,
        method:"POST",
        url:"/sc/comstock/reduce"+_e.jurisdiction(),
        async:true,
        callback:function(d){
            alert(d.msg)
            self.location.reload()
        }
    })
})