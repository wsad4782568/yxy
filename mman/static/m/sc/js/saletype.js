 var xhr = new XMLHttpRequest();
    xhr.open("POST", "/sc/stock/getextend", true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            stockingextend = eval('(' + xhr.responseText + ');')

            stocktype=[[1,"进货单位"],[2,"最小库存单位"], [3,"售卖单位"], [4,"售卖单位下架暂存"]]
            loadtbl()
            t.funcs.loadData.call(t)
        }
    }
    function loadtbl() {
        coldefs = [{
            seq: 0, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function (item) {
                return item
            }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable: true, // 可排序 function
            retrievable: false, // 可检索 function
            title: "id", // 列标题
            visible: true, //是否可见
            checkall: false, // 是否可全选
            isID: 1,
            name: "id",
            type: -1,
            data: []

        }, {
            seq: 1, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function (item) {return "<b>" + item + "</b>"},
            sortable: true,
            retrievable: true,
            title: "名称", // 列标题
            visible: true, //是否可见
            name: "name", //和后端对应，FormData里面的key，后端解析时要一致
            type: 0,
            data: [] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        }, {
            seq: 3, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function (item) {
                if(item==1) return "<b>支持</b>"
                else return "<b>不支持</b>"
            }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable: false, // 可排序 function
            retrievable: false, // 可检索 function
            title: "支持预定", // 列标题
            visible: true, //是否可见
            name: "acceptpreorder", //和后端对应，FormData里面的key，后端解析时要一致
            type: 1, //-1:不可见 0:input 1:select 2:不可修改input 3:不可修改select（需要跨表转换时）
            data: [[1,"支持"],[2,"不支持"]] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        }, {
            seq: 4, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function (item) {return "<b>"+item+"</b>"}, // 这里render是function，它可以组合或变换当前数据行，然后进行显示},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable: false, // 可排序 function
            retrievable: false, // 可检索 function
            title: "开始时间", // 列标题
            visible: true, //是否可见
            name: "startorder", //和后端对应，FormData里面的key，后端解析时要一致
            type: 0, //-1:不可见 0:input 1:select 2:不可修改input 3:不可修改select（需要跨表转换时）
            data: [] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },{
            seq: 5, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function (item) {return "<b>" + item + "</b>"}, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable: true, // 可排序 function
            retrievable: false, // 可检索 function
            title: "结束时间", // 列标题
            visible: true, //是否可见
            name: "finishorder", //和后端对应，FormData里面的key，后端解析时要一致
            type: 0,
            data: [] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },{
            seq: 6, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function (item) {return "<b>" + item + "</b>"}, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable: true, // 可排序 function
            retrievable: false, // 可检索 function
            title: "下单后配送间隔（天）", // 列标题
            visible: true, //是否可见
            name: "deliveryinterval", //和后端对应，FormData里面的key，后端解析时要一致
            type: 0,
            data: [] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        }, {
            seq: 7, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function (item) {return "<b>" + item + "</b>"},
            sortable: true, // 可排序 function
            retrievable: false, // 可检索 function
            title: "配送提醒", // 列标题
            visible: true, //是否可见
            name: "deliveryhint", //和后端对应，FormData里面的key，后端解析时要一致
            type: 0,
            data:[] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        },{
            seq: 8, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function (item) {
                if(item==1) return "<b>是</b>"
                else return "<b>否</b>"
            },
            sortable: true, // 可排序 function
            retrievable: false, // 可检索 function
            title: "在线销售", // 列标题
            visible: true, //是否可见
            name: "isonsite", //和后端对应，FormData里面的key，后端解析时要一致
            type: 1,
            data: [[1,"是"],[2,"否"]] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        }, {
            seq: 9, //在数据[[],[]]中的位置rows[i][seq] 返回值
            render: function (item) {
                if(item==1) return "<b>是</b>"
                else return "<b>否</b>"
            }, // 这里render是function，它可以组合或变换当前数据行，然后进行显示
            sortable: true, // 可排序 function
            retrievable: true, // 可检索 function
            title: "是否默认", // 列标题
            visible: true, //是否可见
            name: "isdefault", //和后端对应，FormData里面的key，后端解析时要一致
            type: 1,
            data: [[1,"是"],[2,"否"]] //为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列
        }]
        t = new _e["table"]()
        row_actions = [{cls:"doerow",func:function(tbl,rows){
            if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
            var dlg = _e.dialog({id:"dlgData",width:"500px",
                title:"基本信息修改",
                mainBody:_e["genForm"](coldefs),
                actions:[{id:"btn",title:"确定",func:function(){
                    var dlg_form=dlg.querySelector("form")
                    var data=dlg.querySelectorAll(".form-data")
                    var fd = new FormData(), xhr = new XMLHttpRequest()
                    for(var i=0;i<data.length;i++){
                        fd.append(data[i].name,data[i].value)
                    }
                    xhr.open("POST" ,"/sc/saletype/update" , true)
                    xhr.send(fd)
                    xhr.onreadystatechange=function()  {
                        if (xhr.readyState==4 && xhr.status==200){
                            var d = eval('('+xhr.responseText+');')
                            _e["msgBox"]({
                                msg: d.msg,
                                className: d.res==-1 ? "error":"success"})
                            dlg.parentNode.removeChild(dlg)
                        }
                    }
                }}]})
            dlg.show()
            var forms = dlg.querySelector(".main").children[0]
            var form_data = forms.querySelectorAll(".form-data")//获取每个input或者select的DOM对象
            for(var i=0;i<form_data.length;i++){//将原来的数据添加进来，方便对比修改
                form_data[i].value=tbl["data"][rows][i] //将tbl里面的值填入input
            }
        },title:"基本信息"},
            {
                cls: "doerow",
                func: function(tbl, rows) {
                    if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                    var xhre = new XMLHttpRequest()
                    var url = "/sc/saletype/getitem?id=" + tbl["data"][rows][0]
                    xhre.open("POST", url, true)
                    xhre.send()
                    xhre.onreadystatechange = function() {
                        if (xhre.readyState == 4 && xhr.status == 200) {
                            var e = eval('(' + xhre.responseText + ');')
                            if (e.res == -1) {
                                _e["msgBox"]({
                                    msg: e.msg
                                })
                            } else {
                                console.log(e)
                                var coupon='红包<br><form id="coupon">' +
                                        'ID：<input name="couponid" value="">' +
                                        '面值:<input name="couponpv" value="">' +
                                        '过期时间：<input name="couponexpired" value="">' +
                                        '可用状态：<input name="couponstatus" value="">' +
                                        '</form><br>'
                                var discount= '打折<br><form id="discount">' +
                                        'ID:<input name="discountid" value="">' +
                                        'A:<input name="discounta" value="">' +
                                        'B:<input name="discountb" value="">' +
                                        'C:<input name="discountc" value="">' +
                                        'D:<input name="discountd" value="">' +
                                        '过期时间：<input name="discountexpired" value="">' +
                                        '可用状态：<input name="discountstatus" value="">' +
                                        '原因：<input name="discountreason" value="">' +
                                        '</form><br>'
                                var gift= '礼品<br><form id="gift">' +
                                        'ID:<input name="giftid" value="">' +
                                        '商品ID：<input name="giftcommodity" value="">' +
                                        '商品名:<input name="giftname" value="">' +
                                        '过期时间<input name="giftexpired" value="">' +
                                        '可用状态<input name="giftstatus" value="">' +
                                        '</form>'
                                var mainbody=""
                                if(e.coupon.length>0) mainbody+=coupon
                                if(e.discount.length>0) mainbody+=discount
                                if(e.gift.length>0) mainbody+=gift
                                var dlg = _e.dialog({
                                    id: "dlgData",
                                    width: "850px",
                                    title: "详细信息",
                                    mainBody:mainbody,
                                    actions: [{
                                        id: "btn",
                                        title: "关闭",
                                        func: function() {
                                            dlg.parentNode.removeChild(dlg)
                                        }
                                    }]
                                })
                                dlg.show()
                                var i=0
                                var forms
                                if(e.coupon.length>0){
                                    forms=dlg.querySelector("#coupon").children
                                    for(i=0;i< e.coupon[0].length;i++){
                                        forms[i].value=e.coupon[0][i]
                                    }
                                }
                                if(e.discount.length>0){
                                    forms=dlg.querySelector("#discount").children
                                    for(i=0;i< e.discount[0].length;i++){
                                        forms[i].value=e.discount[0][i]
                                    }
                                }
                                if(e.gift.length>0){
                                    forms=dlg.querySelector("#gift").children
                                    for(i=0;i< e.gift[0].length;i++){
                                        forms[i].value=e.gift[0][i]
                                    }
                                }
                            }
                        }
                    }
                },
                title: "查看详细"
            },{
                cls: "doerow",
                func: function(tbl, rows) {
                    if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                    var xhre = new XMLHttpRequest()
                    var url = "/sc/saletype/getitem?id=" + tbl["data"][rows][0]
                    xhre.open("POST", url, true)
                    xhre.send()
                    xhre.onreadystatechange = function() {
                        if (xhre.readyState == 4 && xhr.status == 200) {
                            var e = eval('(' + xhre.responseText + ');')
                            if (e.res == -1) {
                                _e["msgBox"]({
                                    msg: e.msg
                                })
                            } else {
                                console.log(e)
                                var coupon='红包<br><form id="coupon">' +
                                        'ID：<input name="id" value="">' +
                                        '面值:<input name="pv" value="">' +
                                        '过期时间：<input name="expired1" value="">' +
                                        '可用状态：<input name="status" value="">' +
                                        '</form><br>'
                                var dlg = _e.dialog({
                                    id: "dlgData",
                                    width: "850px",
                                    title: "新增或者修改红包",
                                    mainBody:coupon,
                                    actions: [{
                                        id: "btn",
                                        title: "提交更改",
                                        func: function() {
                                            var form1=dlg.querySelector("#coupon").children
                                            var fd2 = new FormData(), xh2 = new XMLHttpRequest()
                                            for(var x=0;x<form1.length;x++){
                                                fd2.append(form1[x].name,form1[x].value)
                                            }
                                            fd2.append("saletype",tbl.data[rows][0])
                                            xh2.open("POST" ,"http://211.69.228.169:8081/sc/saletype/salecoupon" , true)
                                            xh2.send(fd2)
                                            xh2.onreadystatechange=function(){
                                                if (xh2.readyState==4 && xh2.status==200){
                                                    var d = eval('('+xh2.responseText+');')
                                                    _e["msgBox"]({
                                                        msg: d.msg,
                                                        className: d.res==-1 ? "error":"success"})
                                                    //dlg.parentNode.removeChild(dlg)
                                                }
                                            }
                                            //dlg.parentNode.removeChild(dlg)
                                        }
                                    }]
                                })
                                dlg.show()
                                var i=0
                                var forms
                                if(e.coupon.length>0){
                                    forms=dlg.querySelector("#coupon").children
                                    for(i=0;i< e.coupon[0].length;i++){
                                        forms[i].value=e.coupon[0][i]
                                    }
                                }
                            }
                        }
                    }
                },
                title: "新增或修改红包"
            },{
                cls: "doerow",
                func: function(tbl, rows) {
                    if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                    var xhre = new XMLHttpRequest()
                    var url = "/sc/saletype/getitem?id=" + tbl["data"][rows][0]
                    xhre.open("POST", url, true)
                    xhre.send()
                    xhre.onreadystatechange = function() {
                        if (xhre.readyState == 4 && xhr.status == 200) {
                            var e = eval('(' + xhre.responseText + ');')
                            if (e.res == -1) {
                                _e["msgBox"]({
                                    msg: e.msg
                                })
                            } else {
                                var discount= '打折<br><form id="discount">' +
                                        'ID:<input name="id" value="">' +
                                        'A:<input name="discounta" value="">' +
                                        'B:<input name="discountb" value="">' +
                                        'C:<input name="discountc" value="">' +
                                        'D:<input name="discountd" value="">' +
                                        '过期时间：<input name="expired1" value="">' +
                                        '可用状态：<input name="status" value="">' +
                                        '原因：<input name="reason" value="">' +
                                        '</form><br>'
                                var dlg = _e.dialog({
                                    id: "dlgData",
                                    width: "850px",
                                    title: "新增或修改折扣",
                                    mainBody:discount,
                                    actions: [{
                                        id: "btn",
                                        title: "提交更改",
                                        func: function() {
                                            var form1=dlg.querySelector("#discount").children
                                            var fd2 = new FormData(), xh2 = new XMLHttpRequest()
                                            for(var x=0;x<form1.length;x++){
                                                fd2.append(form1[x].name,form1[x].value)
                                            }
                                            fd2.append("saletype",tbl.data[rows][0])
                                            xh2.open("POST" ,"/sc/saletype/salediscount" , true)
                                            xh2.send(fd2)
                                            xh2.onreadystatechange=function(){
                                                if (xh2.readyState==4 && xh2.status==200){
                                                    var d = eval('('+xh2.responseText+');')
                                                    _e["msgBox"]({
                                                        msg: d.msg,
                                                        className: d.res==-1 ? "error":"success"})
                                                    //dlg.parentNode.removeChild(dlg)
                                                }
                                            }
                                            //dlg.parentNode.removeChild(dlg)
                                        }
                                    }]
                                })
                                dlg.show()
                                var i=0
                                var forms
                                if(e.discount.length>0){
                                    forms=dlg.querySelector("#discount").children
                                    for(i=0;i< e.discount[0].length;i++){
                                        forms[i].value=e.discount[0][i]
                                    }
                                }
                            }
                        }
                    }
                },
                title: "新增或修改折扣"},
            {
                cls: "doerow",
                func: function(tbl, rows) {
                    if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                    var xhre = new XMLHttpRequest()
                    var url = "/sc/saletype/getitem?id=" + tbl["data"][rows][0]
                    xhre.open("POST", url, true)
                    xhre.send()
                    xhre.onreadystatechange = function() {
                        if (xhre.readyState == 4 && xhr.status == 200) {
                            var e = eval('(' + xhre.responseText + ');')
                            if (e.res == -1) {
                                _e["msgBox"]({
                                    msg: e.msg
                                })
                            } else {
                                var gift= '礼品<br><form id="gift">' +
                                        'ID:<input name="id" value="">' +
                                        '商品ID：<input name="commodity" value="">' +
                                        '商品名（修改无效）:<input name="giftname" value="">' +
                                        '过期时间<input name="expired1" value="">' +
                                        '可用状态<input name="status" value="">' +
                                        '</form>'
                                var dlg = _e.dialog({
                                    id: "dlgData",
                                    width: "850px",
                                    title: "新增或修改赠品",
                                    mainBody:gift,
                                    actions: [{
                                        id: "btn",
                                        title: "提交更改",
                                        func: function() {
                                            var form1=dlg.querySelector("#gift").children
                                            var fd2 = new FormData(), xh2 = new XMLHttpRequest()
                                            for(var x=0;x<form1.length;x++){
                                                if(x==2) continue
                                                fd2.append(form1[x].name,form1[x].value)
                                            }
                                            fd2.append("saletype",tbl.data[rows][0])
                                            xh2.open("POST" ,"/sc/saletype/salegift" , true)
                                            xh2.send(fd2)
                                            xh2.onreadystatechange=function(){
                                                if (xh2.readyState==4 && xh2.status==200){
                                                    var d = eval('('+xh2.responseText+');')
                                                    _e["msgBox"]({
                                                        msg: d.msg,
                                                        className: d.res==-1 ? "error":"success"})
                                                    //dlg.parentNode.removeChild(dlg)
                                                }
                                            }
                                            //dlg.parentNode.removeChild(dlg)
                                        }
                                    }]
                                })
                                dlg.show()
                                var i=0
                                var forms
                                if(e.gift.length>0){
                                    forms=dlg.querySelector("#gift").children
                                    for(i=0;i< e.gift[0].length;i++){
                                        forms[i].value=e.gift[0][i]
                                    }
                                }
                            }
                        }
                    }
                },
                title: "新增或修改赠品"}
        ]
        rows_actions = [{
            func:function(tbl,rows){
                if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                var dlg = _e.dialog({id:"dlgData",width:"500px",
                    title:"新增售卖方式",
                    mainBody:_e["genForm"](coldefs),
                    actions:[{id:"btn",title:"确定",func:function(){
                        var data=dlg.querySelectorAll(".form-data")
                        var fd = new FormData(), xhr = new XMLHttpRequest()
                        for(var i=0;i<data.length;i++){
                            fd.append(data[i].name,data[i].value)
                        }
                        xhr.open("POST" ,"/sc/saletype/insert" , true)
                        xhr.send(fd)
                        xhr.onreadystatechange=function(){
                            if (xhr.readyState==4 && xhr.status==200){
                                var d = eval('('+xhr.responseText+');')
                                _e["msgBox"]({
                                    msg: d.msg,
                                    className: d.res==-1 ? "error":"success"})
                                dlg.parentNode.removeChild(dlg)
                            }
                        }
                    }}]})
                dlg.show()
            },title:"新增售卖方式"}]

        ext_row = function (rows, i) {
            return "this is row " + i
        }
        t.funcs.init.call(t, "tbl",
                coldefs, row_actions, rows_actions, "table", "__THE__TABLE__", ext_row, "/sc/saletype/get")
    }