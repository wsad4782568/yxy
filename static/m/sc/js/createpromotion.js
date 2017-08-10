/**
 * Created by bobodaren007 on 2016/7/20 0020.
 * 新增促销方式：包括出促销方式的有效范围（线上、门店...）、具体的促销方式
 * 分为从上到下的结构：   上：有效范围
 *                      中：促销方式
 *                      下：促销方式基本信息（红包直接新增、tbl2买送的jiben 信息、tbl4优惠券的基本信息、折扣直接新增）
 */

 var xhr = new XMLHttpRequest();
 xhr.open("GET", "/sc/commodity/getext", true);
 xhr.send();
 xhr.onreadystatechange = function () {
     if (xhr.readyState == 4 && xhr.status == 200) {
         others = eval('('+xhr.responseText+');')
         others.comclass = []// id 和 姓名  对比  商品tbl里面对应的
         for(var i in others.tree) {
             if (others.tree[i][8]==1){//只需要叶子节点的,商品只在这个种类下面
                 others.comclass.push([others.tree[i][1],others.tree[i][2]]);
             }
         }
         trs=[]
         trs.push([0,"父节点"])
         for(var i in others.tree) {
             trs.push([others.tree[i][0],others.tree[i][2],others.tree[i][7],others.tree[i][8],["data-code",others.tree[i][1]]]);
         }
         loadtree(trs)
         loadtbl()
         t1.funcs.loadData.call(t1)
     }
 }

 function loadtree(treedata){
     var trs=new _e["tree"]()
     var event=[{e:"click",func:function () { //需要绑定的函数，绑定tbl
         t1.funcs.loadData.call(t1,{    //在table.js中的204行显示
             qseq:7, //数组中下标
             qverb:'e',// = 条件
             qpt:this.getAttribute("data-code") //值
             //qpt:7791 //值
         })
     }, is_leaf:1}]
     trs.init("#trees",treedata,1,"TR",event)    //创建树
 }
_e.bindAll(".promotionbtn","click",promotionbtn)
function promotionbtn() {
    //document.querySelector('.right-coupon').style.display="none"
    document.querySelectorAll(".right-giftpakage")[0].style.display="none"
    document.querySelectorAll(".right-giftpakage")[1].style.display="none"

    document.querySelector('.right-cash').style.display="none"
    document.querySelector('.right-discount').style.display="none"
    for(var i=0;i<document.querySelectorAll(".promotionbtn").length;i++){
        if ( document.querySelectorAll(".promotionbtn")[i].checked==true){
            if (document.querySelectorAll(".promotionbtn")[i].getAttribute("data-id")==3){
                document.querySelector('.right-coupon').style.display="block"
            }
            if (document.querySelectorAll(".promotionbtn")[i].getAttribute("data-id")==1){
              document.querySelectorAll(".right-giftpakage")[0].style.display="block"
                document.querySelectorAll(".right-giftpakage")[1].style.display="block"
                loadtbl()
                t1.funcs.loadData.call(t1)

            }
            if (document.querySelectorAll(".promotionbtn")[i].getAttribute("data-id")==4){
                document.querySelector('.right-cash').style.display="block"
            }
            if (document.querySelectorAll(".promotionbtn")[i].getAttribute("data-id")==2){
                document.querySelector('.right-discount').style.display="block"
            }
        }
    }
}


function loadtbl(){
    coldefs1 = [
        { seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
        render:function(v){
            return "<span>"+v+"</span>"
        },// 这里render是function，它可以组合或变换当前数据行，然后进行显示
        sortable:true, // 可排序 function
        retrievable: false, // 可检索 function
        title:"id", // 列标题
        visible:true, //是否可见
        checkall:false,// 是否可全选
        // isID:1,
        name:"id",//和后端对应，FormData里面的key，后端解析时要一致
        type:-1,//-1:不可见 0:input 1:select 2:不可修改 3:radio 4:checkbox  目前只实现-1,0,1三种方式
        data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列

    },
        { seq:1,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"商品名",
            visible:true,
            name:"name",
            type:0,
            data:[]
        },

        { seq:2,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"单位",
            visible:true,
            name:"unit",
            type:0,
            data:[]
        },
        { seq:3,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: true,
            title:"规格",
            visible:true,
            name:"specification",
            type:0,
            data:[]
        },
        { seq:4,
            render:function(item){return "<b>"+parseInt(item)+"</b>"},
            sortable:true,
            retrievable: true,
            title:"数量",
            visible:true,
            name:"amount",
            type:0,
            data:[]
        },{ seq:5,
            render:function(item){return "<b>"+(item/100).toFixed(2)+"</b>"},
            sortable:true,
            retrievable: true,
            title:"价格",
            visible:true,
            name:"price_onsale",
            type:0,
            data:[]
        },
        { seq:6,
            render:function(item){return "<b>"+item+"</b>"},
            sortable:true,
            retrievable: false,
            title:"优惠方式",
            visible:false,
            name:"promotion",
            type:0,
            data:[]
        }
    ]

    t1 = new _e["table"]()
    row_actions =[
        {cls:"does",func:function(tbl,rows){
            if(document.querySelector(".tblGoods").children.length!=0){
                for(var i=0;i<document.querySelectorAll(".tbl_goods_id").length;i++){
                    if(document.querySelectorAll(".tbl_goods_id")[i].innerHTML==tbl["data"][rows][0]){
                        _e.msgBox({
                            msg:"已选中！",
                            timeout:2000,
                            className:"warning"
                        })
                        return
                    }
                }
            }
            var tblgoods='  <tr> <td class="tbl_goods_id">'+tbl["data"][rows][0]+'</td> <td>'+tbl["data"][rows][1]+'</td> <td>'+tbl["data"][rows][2]+'</td> <td>'+tbl["data"][rows][3]+'</td><td>'+parseInt(tbl["data"][rows][4])+'</td><td>'+(tbl["data"][rows][5]/100).toFixed(2)+'</td> <td><input class="removeGoodsNode" type="button" value="删除"></td></tr>'
            document.querySelector(".tblGoods").innerHTML+=tblgoods
            _e.bindAll(".removeGoodsNode","click",removeGoodsNode)
        },title:"选中"}
    ]

    rows_actions = [
    ]

    var ext_row = function(rows,i){
        return "this is row "+i
    }
    var afterLoad = function(tbl,tblDom){
   /*     _e.bindAll(".check","click",function(e){
            // 获得当前的行的id
            // alert(this.getAttribute("data-val"))
            document.querySelector(".goodsidname").innerHTML+='<input class="checknode" ' +
                'data-id="'+this.parentNode.childNodes[1].innerText+'" data-name="'
                +this.parentNode.parentNode.childNodes[1].innerText+'" style="margin: 10px;" type="checkbox"' +
                ' name="gooodsNode">'+this.parentNode.childNodes[1].innerText+
                '-'+this.parentNode.parentNode.childNodes[1].innerText
        },tblDom)*/

    }

    t1.funcs.init.call(t1,"tbl",
        coldefs1,row_actions,rows_actions,"table","1__THE__TABLE__",ext_row, "/sc/promotion/getcoms",
        afterLoad
    )
    var tbl_head = document.querySelector("#tbl").querySelector("thead")
    tbl_head.querySelector("#trtime").parentNode.removeChild( tbl_head.querySelector("#trtime"))
    tbl_head.querySelector("#trunit").parentNode.removeChild( tbl_head.querySelector("#trunit"))

}

function removeGoodsNode() {
    this.parentNode.parentNode.remove(this.parentNode.parentNode)
}



_e.bind(".submitPromotion","click",submitPromotion)
function submitPromotion() {
    var validiptArr=""
    var fd = new FormData(),xhr = new XMLHttpRequest()
    for(var k=0;k<document.querySelectorAll(".validipt").length;k++){
        if(document.querySelectorAll(".validipt")[k].checked==true){
            validiptArr+="1"
        }else {
            validiptArr+="0"
        }
    }
    if(validiptArr=="00"){
        _e.msgBox({
            msg:"请填写规范！",
            timeout:2000,
            className:"error"
        })
        return
    }
    fd.append("validflag",validiptArr)

    if(document.querySelector(".getcount").value==""){
        _e.msgBox({
            msg:"请填写规范！",
            timeout:2000,
            className:"error"
        })
        return
    }else{
        fd.append("repeattimes",Number(document.querySelector(".getcount").value))
    }
    if(document.querySelector(".getGoodCount").value==""){
        _e.msgBox({
            msg:"用户可购买数量！",
            timeout:2000,
            className:"error"
        })
        return
    }else{
        fd.append("repeatpurchasetimes",Number(document.querySelector(".getGoodCount").value))
    }
    for(var i=0;i<document.querySelectorAll(".promotionbtn").length;i++){
        if (document.querySelectorAll(".promotionbtn")[i].checked==true) {
            var dataId=document.querySelectorAll(".promotionbtn")[i].getAttribute("data-id")
            fd.append("promotionflag",dataId)
            if(dataId==1){


                if (document.querySelector(".giftname").value == " " || document.querySelector(".giftinfo").value == " " || document.querySelector(".giftbuy").value == ""|| document.querySelector(".giftsale").value == ""||document.querySelector(".tblGoods").children.length==0) {
                    _e.msgBox({
                        msg: "请填写规范！",
                        timeout: 2000,
                        className: "error"
                    })
                    return
                } else {
                    fd.append("name", document.querySelector(".giftname").value)
                    fd.append("intro", document.querySelector(".giftinfo").value)
                    fd.append("buys", Number(document.querySelector(".giftbuy").value))
                    fd.append("gifts",Number(document.querySelector(".giftsale").value))
                    for (var m = 0; m < document.querySelectorAll(".tbl_goods_id").length; m++) {
                        fd.append("com", Number(document.querySelectorAll(".tbl_goods_id")[m].innerHTML))
                        console.log(Number(document.querySelectorAll(".tbl_goods_id")[m].innerHTML));
                    }
                }
            }
            if(dataId==2){
                if(document.querySelector(".discount").value==""){
                    _e.msgBox({
                        msg:"请填写规范！",
                        timeout:2000,
                        className:"error"
                    })
                    return
                }else{
                    fd.append("discount",Number(document.querySelector(".discount").value))
                }
            }
            if(dataId==3){
                if(document.querySelector(".cash").value==" "||document.querySelector(".valid").value==""||document.querySelector(".expired").value==""){
                    _e.msgBox({
                        msg:"请填写规范！",
                        timeout:2000,
                        className:"error"
                    })
                    return
                }else{
                    fd.append("pv",Number(document.querySelector(".cash").value)*100)
                    fd.append("valid",_e.dateToInt(document.querySelector(".valid").value))
                    fd.append("expired",_e.dateToInt(document.querySelector(".expired").value))
                    _e.dateToInt(document.querySelector(".valid").value)
                    console.log(document.querySelector(".cash").value)
                    console.log(document.querySelector(".valid").value)
                    console.log(document.querySelector(".expired").value)
                }
            }

            if(dataId==4){
                  if(document.querySelector(".cashgift").value==""){
                      _e.msgBox({
                          msg:"请填写规范！",
                          timeout:2000,
                          className:"error"
                      })
                      return
                  }else{

                      fd.append("cashgift",Number(document.querySelector(".cashgift").value)*100)
                      console.log(document.querySelector(".cashgift").value)
                  }
            }
        }
    }
    if(document.querySelector(".valid").value.length==0||document.querySelector(".expired").value.length==0){
      _e.msgBox({
          msg:"请填写规范！",
          timeout:700,
          className:"error"
      })
      return
    }else{
      fd.append("starttime", timeStamap(document.querySelector(".valid").value))
      fd.append("endtime",  timeStamap(document.querySelector(".expired").value))
    }

    xhr.open("POST","/sc/promotion/makepromotion",true)
    xhr.send(fd)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            giftpackageInfo = eval('(' + xhr.responseText + ');')
            console.log(giftpackageInfo)
            if(giftpackageInfo.res==1){
                _e.msgBox({
                    msg:"添加成功！",
                    timeout:2000,
                    className:"success"
                })
              //  setTimeout("window.location.reload()",2000)
            }else{
                _e.msgBox({
                    msg: "操作无效！",
                    timeout: 2000,
                    className: "error"
                })
                return
            }
        }
    }
}


function timeStamap(timestring){
  time=timestring
  timestam = time.replace('T',' ');
  var timestamp2 = Date.parse(new Date(timestam));
  console.log(timestamp2)
  timestamp2 = timestamp2 / 1000;
  //2014-07-10 10:21:12的时间戳为：1404958872
  console.log( "timestring的时间戳为：" + timestamp2);
  return timestamp2
}
