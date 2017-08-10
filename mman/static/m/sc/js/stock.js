/**
 * Created by Administrator on 2016/6/6.
 */
var xhr = new XMLHttpRequest();
xhr.open("POST", "/sc/stock/getextend", true);
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        others = eval('('+xhr.responseText+');')
        trs=[]
        trs.push([0,"父节点"])
        for(var i in others.tree) {
            trs.push([others.tree[i][0],others.tree[i][2],others.tree[i][3],others.tree[i][4],["data-code",others.tree[i][1]]]);
        }
        loadtree(trs)
        loadtbl()
        t.funcs.loadData.call(t, {
            qseq: 0, //id
            qverb: 'g',// >
            qpt: -1,  //-1
            oseq: 21, //顺序的下标
            odir:"a" //升序降序
        })
        addBarcodeSelect ()
        addOtherTree()
    }
}
function loadtree(treedata){
    var trs=new _e["tree"]()
    var event=[{e:"click",func:function () { //需要绑定的函数，绑定tbl
        t.funcs.loadData.call(t,{
            qseq:17, //数组中下标
            qverb:'k',// = 条件
            qpt:this.getAttribute("data-code") //值
        })
    }, is_leaf:1}]
    trs.init("#trees",treedata,1,"TR",event)    //创建树
}

function loadtbl(){
    coldefs = [ { seq:1,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable:true, // 可排序 function
        retrievable: true, // 可检索 function
        title:"品名", // 列标题
        visible:true, //是否可见

    },{ seq:16,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(item){ return item},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable:true, // 可排序 function
        retrievable: true, // 可检索 function
        title:"流水号", // 列标题
        visible:true, //是否可见
        name:"id",//和后端对应，FormData里面的key，后端解析时要一致
        type:-1,
        data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列

    }, { seq:20,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(item){
            if(item.length>3) return "<img src=' http://od35wia0b.bkt.clouddn.com/"+item+"?imageMogr2/thumbnail/80x80!' />"
            return "<b>"+item+"</b>"
        },
        title:"图片", // 列标题
        visible:true, //是否可见

    },{ seq:17,
        render:function(item){return item},
        sortable:false,
        retrievable: false,
        title:"种类",
        visible:true,
    },{ seq:111,
        render:function(item){return "<b>0</b>" },
        sortable:false,
        retrievable: false,
        title:"排名",
        visible:true,
    },{ seq:19,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(item){
          var codes=item.split(",")
          var barcode = ''
          for(var i = 0 ;i < codes.length-1;i++){
              barcode+='<i>'+codes[i]+'</i><br>'
          }
          return "<b>"+barcode+"</b>"
        },
        title:"条码",
        visible:true,
    },{ seq:15,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable:true, // 可排序 function
        retrievable: true,
        title:"规格", // 列标题
        visible:true, //是否可见
    }, { seq:14,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable:true, // 可排序 function
        retrievable: true, // 可检索 function
        title:"单位", // 列标题
        visible:true, //是否可见
    }, { seq:7,
        render:function(item){return "<b>"+(item/100).toFixed(2)+"</b>"},
        sortable:true,
        title:"进价",
        visible:true,
        name:"price",
        type:0,
        data:[]
    }, { seq:8,
        render:function(item){return "<b>"+(item/100).toFixed(2)+"</b>"},
        sortable:true,
        title:"零售价",
        visible:true,
        name:"priceonsale",
        type:0,
        data:[]
    }, { seq:2,
        render:function(item){return "<b>"+item+"</b>"},
        sortable:true,
        retrievable: true,
        title:"库存",
        visible:true,
    }, { seq:3,
        render:function(item){
            if (item==1) return "<b>在售</b>"
            return "<b></b>"},
        title:"销售状态",
        sortable:true,
        retrievable: true,
        visible:true,
        name:"offshelf"
    }, { seq:9,
        render:function(item){
            if (item==1) return "<b>商城</b>"
            return "<b></b>"},
        title:"线上",
        sortable:true,
        retrievable: true,
        visible:true,
        name:"offshelf"
    },{ seq:18,
            render:function(item){
                if (item==1) return "<b>首页</b>"
                return "<b></b>"},
            title:"首页状态",
            sortable:true,
            retrievable: true,
            visible:true,
            name:"homepage"
        }
    ]

    t = new _e["table"]()
    row_actions =[{cls:"doerow",func:function(tbl,rows){
        var fd = new FormData(),xhr = new XMLHttpRequest()
        fd.append("id",tbl.data[rows][0])
        fd.append("offshelf",1)
        xhr.open("POST","/sc/stock/update"+_e["jurisdiction"](),true)
        xhr.send(fd)
        xhr.onreadystatechange = function(){
            if (xhr.readyState==4 && xhr.status==200){
                var d = eval('('+xhr.responseText+');')
                _e["msgBox"]({
                    msg: d.msg,
                    className: d.res==-1 ? "error":"success",
                    timeout:3000
                })
                if(d.res!=-1){
                    tblDom.querySelectorAll(".property_row")[rows].children[11].innerHTML= "<b>在售</b>"
                }
            }
        }
    },title:"售卖"},{cls:"doerow",func:function(tbl,rows){
        var fd = new FormData(),xhr = new XMLHttpRequest()
        fd.append("id",tbl.data[rows][0])
        fd.append("offshelf",2)
        xhr.open("POST","/sc/stock/update"+_e["jurisdiction"](),true)
        xhr.send(fd)
        xhr.onreadystatechange = function(){
            if (xhr.readyState==4 && xhr.status==200){
                var d = eval('('+xhr.responseText+');')
                _e["msgBox"]({
                    msg: d.msg,
                    className: d.res==-1 ? "error":"success",
                    timeout:3000
                })
                if(d.res!=-1){
                    tblDom.querySelectorAll(".property_row")[rows].children[11].innerHTML= "<b></b>"
                }
            }
        }
    },title:"撤销售卖"},{cls:"doerow",func:function(tbl,rows){
        var fd = new FormData(),xhr = new XMLHttpRequest()
        fd.append("id",tbl.data[rows][0])
        fd.append("onlinesale",1)
        xhr.open("POST","/sc/stock/update"+_e["jurisdiction"](),true)
        xhr.send(fd)
        xhr.onreadystatechange = function(){
            if (xhr.readyState==4 && xhr.status==200){
                var d = eval('('+xhr.responseText+');')
                _e["msgBox"]({
                    msg: d.msg,
                    className: d.res==-1 ? "error":"success",
                    timeout:3000
                })
                if(d.res!=-1){
                    tblDom.querySelectorAll(".property_row")[rows].children[12].innerHTML= "<b>商城</b>"
                }
            }
        }
    },title:"商城"},{cls:"doerow",func:function(tbl,rows){
        var fd = new FormData(),xhr = new XMLHttpRequest()
        fd.append("id",tbl.data[rows][0])
        fd.append("onlinesale",2)
        xhr.open("POST","/sc/stock/update"+_e["jurisdiction"](),true)
        xhr.send(fd)
        xhr.onreadystatechange = function(){
            if (xhr.readyState==4 && xhr.status==200){
                var d = eval('('+xhr.responseText+');')
                _e["msgBox"]({
                    msg: d.msg,
                    className: d.res==-1 ? "error":"success",
                    timeout:3000
                })
                if(d.res!=-1){
                    tblDom.querySelectorAll(".property_row")[rows].children[12].innerHTML= "<b></b>"
                }
            }
        }
    },title:"线下"},{cls:"doerow",func:function(tbl,rows){
        var fd = new FormData(),xhr = new XMLHttpRequest()
        fd.append("id",tbl.data[rows][0])
        fd.append("homepage",1)
        xhr.open("POST","/sc/stock/update"+_e["jurisdiction"](),true)
        xhr.send(fd)
        xhr.onreadystatechange = function(){
            if (xhr.readyState==4 && xhr.status==200){
                var d = eval('('+xhr.responseText+');')
                _e["msgBox"]({
                    msg: d.msg,
                    className: d.res==-1 ? "error":"success",
                    timeout:3000
                })
                if(d.res!=-1){
                    tblDom.querySelectorAll(".property_row")[rows].children[13].innerHTML= "<b>首页</b>"
                }
            }
        }
    },title:"上首页"},{cls:"doerow",func:function(tbl,rows){
        var fd = new FormData(),xhr = new XMLHttpRequest()
        fd.append("id",tbl.data[rows][0])
        fd.append("homepage",2)
        xhr.open("POST","/sc/stock/update"+_e["jurisdiction"](),true)
        xhr.send(fd)
        xhr.onreadystatechange = function(){
            if (xhr.readyState==4 && xhr.status==200){
                var d = eval('('+xhr.responseText+');')
                _e["msgBox"]({
                    msg: d.msg,
                    className: d.res==-1 ? "error":"success",
                    timeout:3000
                })
                if(d.res!=-1){
                    tblDom.querySelectorAll(".property_row")[rows].children[13].innerHTML= "<b></b>"
                }
            }
        }
    },title:"撤销首页"},
    {cls:"doerow",func:function(tbl,rows){
      if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
      var dlg = _e.dialog({id:"dlgData",width:"500px",
          title:tbl.data[rows][1] + "的进价",
          mainBody:'<h1>'+ tbl.data[rows][1]+'</h1>' +
          '<span>进价：</span><input type="text" value="" id="price"/></br>'+
          '<span>零售价：</span><input type="text" value="" id="priceonsale"/>',
          actions:[{id:"btn",title:"提交",func:function(){
            var price= Math.round(Number(dlg.querySelector("#price").value)*100)
            var priceonsale= Math.round(Number(dlg.querySelector("#priceonsale").value)*100)
            if (price < 0 || isNaN(price) || priceonsale < 0 || isNaN(priceonsale)){
              _e.msgBox({msg:"价格应该大于0"})
              return
            }
            var fd = new FormData(),xhr = new XMLHttpRequest()
            fd.append("id",tbl.data[rows][0])
            fd.append("price",price)
            fd.append("priceonsale",priceonsale)
            xhr.open("POST","/sc/stock/updateprice"+_e["jurisdiction"](),true)
            xhr.send(fd)
            xhr.onreadystatechange = function(){
                if (xhr.readyState==4 && xhr.status==200){
                    var d = eval('('+xhr.responseText+');')
                    _e["msgBox"]({
                        msg: d.msg,
                        className: d.res==-1 ? "error":"success",
                        timeout:3000
                    })
                    if(d.res!=-1){
                        tblDom.querySelectorAll(".property_row")[rows].children[8].innerHTML= "<b>"+ dlg.querySelector("#price").value +"</b>"
                        dlg.parentNode.removeChild(dlg)
                    }
                }
            }
           }},
          {id:"btn",title:"关闭",func:function(){
              dlg.parentNode.removeChild(dlg)
          }}]})
      dlg.querySelector("#price").value=(tbl.data[rows][7]/100).toFixed(2)
      dlg.querySelector("#priceonsale").value=(tbl.data[rows][8]/100).toFixed(2)
      dlg.show()

    },title:"修改价格"},
        {cls:"doerow",func:function(tbl,rows){
            var xhr = new XMLHttpRequest()
            var url="/sc/commodityrel/getUnitbyStk?id="+tbl.data[rows][0]
            xhr.open("POST" ,url , true)
            xhr.send()
            xhr.onreadystatechange=function()  {
                if (xhr.readyState==4 && xhr.status==200){
                    var dat = eval('(' +xhr.responseText+ ');')
                    if(dat.res==-1) {
                        _e["msgBox"]({msg: dat.msg})
                        return
                    }else{
                        if (document.querySelector("#dlgData")) document.querySelector("#dlgData").parentNode.removeChild(document.querySelector("#dlgData"));
                        var dlg = _e.dialog({id:"dlgData",width:"500px",
                            title:"具体库存",
                            mainBody:'<p id="com_name">'+ tbl.data[rows][1]+'</p>' +
                            '<table class="pure-table"><thead><tr>' +
                            '<th>单位种类</th> <th>数量</th> <th>单位</th><th>规格</th><th>进价</th><th>零售价</th></tr> ' +
                            '</thead> <tbody id="unit_tbody"></tbody> </table>'+
                            '<input type="button" value="单位转换" onclick="split_unit(this)"/>',
                            actions:[{id:"btn",title:"关闭",func:function(){
                                dlg.parentNode.removeChild(dlg)
                            }}]})
                        dlg.show()
                        var unit_tbody=dlg.querySelector("#unit_tbody")
                        for(var i=0;i<dat.commodityunit.length;i++){
                            var tr=document.createElement("tr")
                            tr.innerHTML='<td data-id="'+dat.commodityunit[i][4]+'">'+_e.unit[dat.commodityunit[i][1]]+
                            '</td> <td>'+dat.commodityunit[i][2]+'</td> <td>'+dat.commodityunit[i][3]+'</td>'+
                                '<td>'+dat.commodityunit[i][5]+'</td><td>'+(dat.commodityunit[i][6]/100).toFixed(2)+'</td><td>'+(dat.commodityunit[i][7]/100).toFixed(2)+'</td>'
                            unit_tbody.appendChild(tr)
                        }
                    }
                }
            }
        },title:"单位转换"}]
    rows_actions = []
    ext_row = function(rows,i){
        return "this is row "+i
    }
    t.funcs.init.call(t,"tbl",
        coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/sc/stock/get"+_e["jurisdiction"]())
    var tblDom=document.querySelector("#tbl")
    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
}

function split_unit(btn){
    var old_dlg=document.querySelector("#dlgData")
    if (!old_dlg) return
    if (document.querySelector("#dlgSplit")) document.querySelector("#dlgSplit").parentNode.removeChild(document.querySelector("#dlgSplit"));
    var dlg = _e.dialog({id:"dlgSplit",width:"600px",
        title:old_dlg.querySelector("#com_name").innerHTML+" 的单位转换",
        mainBody:'<div><div><i>进价：</i><input type="number" value="" placeholder="进价" class="input_price" style="width:60px;"><i>数量：</i><input type="number" value="" placeholder="减少的数量" class="input_amount" style="width:80px;"> <select id="be_converted"></select></div>' +
        '<i class="icon iconfont" style="    position: absolute;padding-top: 20px;padding-left: 150px;">&#xe64c;</i>'+
        '<div style="padding-top:60px;"><i>进价：</i><input type="number" value="" placeholder="进价" class="input_price" style="width:60px;"><i>数量：</i><input type="number" value="" placeholder="增加的数量" class="input_amount" style="width:80px;"> <select id="converted_to"></select></div></div>',
        actions:[{id:"btn",title:"提交",func:function(){
            var be_converted=dlg.querySelector("#be_converted")
            var converted_to=dlg.querySelector("#converted_to")
            var input_amount=dlg.querySelectorAll(".input_amount")
            if(be_converted.value==converted_to.value){
                _e.msgBox({msg:"相同单位不能转换"})
                return
            }
            if(Number(be_converted.value)<0||Number(converted_to.value)<0){
                _e.msgBox({msg:"输入的数量需>0"})
                return
            }
            if(Number(input_price[0].value)<0||Number(input_price[1].value)<0){
                _e.msgBox({msg:"请输入大于0的进价"})
                return
            }
            var fd = new FormData(), xhr = new XMLHttpRequest()
            fd.append("stockadd",converted_to.value)
            fd.append("amountadd",input_amount[1].value)
            fd.append("priceadd",Math.round(Number(input_price[1].value)*100))
            fd.append("stockreduce",be_converted.value)
            fd.append("amountreduce",input_amount[0].value)
            fd.append("pricereduce",Math.round(Number(input_price[0].value)*100))
            xhr.open("POST" ,"/sc/stock/changeamount" +_e["jurisdiction"](), true)
            xhr.send(fd)
            xhr.onreadystatechange=function()  {
                if (xhr.readyState==4 && xhr.status==200){
                    var dat = eval('(' +xhr.responseText+ ');')
                    _e["msgBox"]({
                        msg: dat.msg,
                        className: dat.res==-1 ? "error":"success",
                        timeout:3000
                    })
                    if(dat.res==0){
                        dlg.parentNode.removeChild(dlg)
                        t.funcs.loadData.call(t)
                    }
                }
            }
        }}]})
    var old_trs=old_dlg.querySelector("#unit_tbody").children
    var be_converted=dlg.querySelector("#be_converted")
    var converted_to=dlg.querySelector("#converted_to")
    var input_price = dlg.querySelectorAll(".input_price")
    _e.bind("#be_converted","change",function(){
      var values=this.value
        for(var i=0;i<old_trs.length;i++){
          if(values==old_trs[i].children[0].getAttribute("data-id")){
            input_price[0].value=old_trs[i].children[4].innerHTML
          }
        }
    },dlg)
    _e.bind("#converted_to","change",function(){
      var values=this.value
        for(var i=0;i<old_trs.length;i++){
          if(values==old_trs[i].children[0].getAttribute("data-id")){
            input_price[1].value=old_trs[i].children[4].innerHTML
          }
        }
    },dlg)
    for(var i=0;i<old_trs.length;i++){
        var opt1=document.createElement("option")
        var opt2=document.createElement("option")
        opt1.value=old_trs[i].children[0].getAttribute("data-id")
        opt1.innerHTML=old_trs[i].children[0].innerHTML+"("+old_trs[i].children[2].innerHTML+")"
        opt2.value=old_trs[i].children[0].getAttribute("data-id")
        opt2.innerHTML=old_trs[i].children[0].innerHTML+"("+old_trs[i].children[2].innerHTML+")"
        be_converted.appendChild(opt1)
        converted_to.appendChild(opt2)
        if(i==0){
            input_price[0].value=old_trs[i].children[4].innerHTML
            input_price[1].value=old_trs[i].children[4].innerHTML
        }
    }
    dlg.show()

}


function addBarcodeSelect (){
  var thead_td=document.querySelector("#tbl").querySelector("#btnResetQc").parentNode
  var inputs = document.createElement("input")
  var buttons = document.createElement("button")
  inputs.setAttribute("type","text")
  inputs.setAttribute("id","SltBarcode")
  inputs.setAttribute("placeholder","条形码")
  buttons.innerHTML="查询"
  buttons.id="btnBarcode"
  thead_td.appendChild(inputs)
  thead_td.appendChild(buttons)
  _e.bind("#btnBarcode","click",loadBarcode,thead_td)
  _e.bind("#SltBarcode","change",loadBarcode,thead_td)
  function loadBarcode(){
    var code = document.querySelector("#tbl").querySelector("#SltBarcode").value
    var  xhr = new XMLHttpRequest()
    var url = "/sc/stock/getStockIdByCode?code="+code
    xhr.open("POST" , url, true)
    xhr.send()
    xhr.onreadystatechange=function()  {
        if (xhr.readyState==4 && xhr.status==200){
            var dat = eval('(' +xhr.responseText+ ');')
            if(dat.res==-1){
              _e["msgBox"]({msg: dat.msg})
              return
            }
            t.funcs.loadData.call(t, {
                qseq: 16, //id
                qverb: 'e',// =
                qpt: dat.commodity,  //-1
                oseq: 16, //顺序的下标
                odir:"a" //升序降序
            })

        }
    }

  }
}



function addOtherTree (){
  var tree=document.querySelector("#trees")
  var ul = document.createElement("ul")
  ul.setAttribute("id","other_tree")
  ul.innerHTML='<li data-id="2" class="other task" onclick="taskAll(this)">团购</li>'+
  '<li data-id="7" class="other task" onclick="taskAll(this)">预定</li>'+
  '<li data-id="8" class="other task" onclick="taskAll(this)">代购</li>'+
  '<li data-id="9" class="other task" onclick="taskAll(this)">特价</li>'+
  '<li data-id="4" class="other task" onclick="taskAll(this)">组合套餐</li>'
  //tree.parentNode.insertBefore(div,tree)
  tree.insertBefore(ul,tree.children[0])
  _e.bindAll(".other","click",loadOther,tree.parentNode)
  function loadOther(){
        t.funcs.loadData.call(t, {
            qseq: 22, //id
            qverb: 'e',// =
            qpt: this.getAttribute("data-id"),  //-1
            oseq: 16, //顺序的下标
            odir:"a" //升序降序
        })
    }
}
