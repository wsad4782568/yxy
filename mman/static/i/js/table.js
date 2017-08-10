/**
 * Created by eachma on 16-7-19.
 */
// 把tbl（含data等）、tbldom传入到afterLoad
// 把数据行的class和id加上了，前缀为：property_row  加上 _8(行数)作为id
// 把扩展行加上了id extrow_行数
if(typeof(_e) == "undefined") {
    _e = {}
}
_e["table"] = function () {
    function table(){}
    tblConf = {}
    tblConf["funcs"] = {}
    tblConf["pgSize"] = 10
    tblConf["pgCurrent"] = 0
    tblConf["pgCount"] = 0
    tblConf["funcs"]["init"] = function(container_id,
                                        coldefs,row_actions,rows_actions,tbl_class,global_name,ext_row,dataurl, after_load){
        if(!Handlebars) return
        this["dataUrl"] = dataurl
        this["containerID"] = container_id
        this["pgCount"] = 0
        this["pgCurrent"] = 1
        this["pgSize"] = 10
        this["rowActions"] = row_actions
        this["rowsActions"] = rows_actions
        this["colDefs"] = coldefs
        this["extRow"] = ext_row //扩展行
        this["afterLoad"] = after_load
        // 查询和排序
        this["qseq"] = "-1"
        this["qverb"] = "k"
        this["qpt"] = "" // query pattern
        this["odir"] = "d" // 排序串
        this["oseq"] = "-1"
        this["div"] = ""
        this["start"] = 0  // limit
        this["cq"] = false // complex query condition
        var colnum = this["rowActions"]?1:0
        for(var col in coldefs){
            if(coldefs[col].visible) colnum ++
        }
        //用于mrten的复杂查询
        this["alldept"]  = JSON.parse(localStorage.getItem("alldept"))
        this["cq_dept"] = "-1"
        this["cq_unit"] = [0,0,0,0,0]
        this["cq_time"] = [0,0]

        if(colnum==1) return
        this["colCount"] = colnum
        this["tblClass"] = tbl_class
        this["globalName"] = "_eachmaTBL_"+global_name
        this["tplMain"] = '<table class="{{tblClass}}">'+
            //'<thead style="position:fixed"><tr><td colspan="{{colCount}}">'+
            '<thead><tr><td colspan="{{colCount}}">'+
            ' <select id="selColname">'+
            '{{#each colDefs}}{{#if retrievable}}'+
            '<option value="{{seq}}" id="selRCol">{{title}}</option>'+
            '{{/if}}{{/each}}</select><select id="selVerb"><option value="k">包含</option>'+
            '<option value="p">前缀</option><option value="s">后缀</option>'+
            '<option value="g">大于</option><option value="l">小于</option><option value="e">等于</option></select>'+
            '<input type="text" id="txtQuery" size="5" data-gn="{{globalName}}"/>'+
            '<button id="btnRetrive" data-gn="{{globalName}}">查找</button>'+
                /*'<select id="selSCol">{{#each  }}{{#if sortable}}'+
                 '<option value="-1">不排序</option><option  value="{{seq}}">{{title}}</option>'+*/
            '<select id="selSCol"><option value="-1">不排序</option>'+
            '{{#each colDefs}}{{#if sortable}}<option  value="{{seq}}">{{title}}</option>'+
            '{{/if}}{{/each}}</select><select id="selDirection">'+
            '<option value="d">降序</option><option value="a">升序</option></select><button id="btnSort" '+
            ' data-gn="{{globalName}}">排序</button>'+
            '{{#if extRow}}' +
            '<button id="btnExtRow" data-show="n" title="实现/隐藏扩展行">'+
            '显示</button>{{/if}} <button id="btnResetQc">查询复位</button>' +
            '</td><tr>'+
                // 复杂查询特殊处理：不需要的可以隐藏掉
            '<tr id="trdept"><td colspan={{colCount}}><span>部门</span> <select id="cqdept">' +
            '{{#each alldept}}<option  value="{{id}}">{{name}}{{/each}}</option>'+
            '</select></td></tr>'+
            '<tr id="trunit"><td colspan={{colCount}}>单位 '+
            '<input type="checkbox" data-seq="0" class="cqunit" />全部'+
            '<input type="checkbox" data-seq="1" class="cqunit" />拆分'+
            '<input type="checkbox" data-seq="2" class="cqunit" />重量'+
            '<input type="checkbox" data-seq="3" class="cqunit" />采购'+
            '<input type="checkbox" data-seq="4" class="cqunit" />最小'+
            '</td>'+
            '</tr>'+
            '<tr id="trtime"><td colspan={{colCount}}>开始:<input type="date" data-seq="0" class="cqtime"/>'+
            '截至:<input type="date" data-seq="1" class="cqtime"/>'+
            '</td></tr><tr class="colDefs">'+
                // 特殊处理结束
            '{{#each colDefs}}{{#if  visible}}<th>{{#if isID}}'+
            '<input id="checkAll" type="checkbox" />{{/if}}{{title}}'+
            '</th>{{/if}}{{/each}}{{#if rowActions}}<th>操作</th>{{/if}}</tr></thead>'+
            '<tbody></tbody><tfoot><tr><td colspan="{{colCount}}">'+
            '<button data-act="1" data-gn="{{globalName}}" class="pg">首页</button>'+
            '<button data-act="2" data-gn="{{globalName}}" class="pg">上一页</button>'+
            '<button data-act="3" data-gn="{{globalName}}" class="pg">下一页</button>'+
            '<button data-act="4" data-gn="{{globalName}}" class="pg">末页</button>'+
            '<button data-act="5" data-gn="{{globalName}}" class="pg">跳转</button>'+
            '<button data-act="6" data-gn="{{globalName}}" class="pg">设置</button>'+
            '<label id="pginfo"></label>&nbsp;&nbsp;'+
            '{{#each rowsActions}}<button data-gn="{{../globalName}}" '+
            'data-action="{{@index}}" class="rowsaction">{{title}}</button>'+
            '{{/each}}</td></tr></tfoot>'+
            '</table>'
        tblInit(this)
        window[this["globalName"]]  = this
    }

    tblConf["funcs"]["setDataUrl"] = function(url){
        this["dataUrl"] = url
    }
    table.prototype = tblConf
    function tblInit(tbl){
        var tpl = Handlebars.compile(tbl["tplMain"])
        var theTbl = document.querySelector("#"+tbl["containerID"])
        theTbl.innerHTML = tpl(tbl)
        // 检索与排序
        var getQueryConf = function(){
            tbl["qseq"] = theTbl.querySelector("#selColname").value
            tbl["qverb"] = theTbl.querySelector("#selVerb").value
            tbl["qpt"] = theTbl.querySelector("#txtQuery").value.trim()
            tbl["odir"] = theTbl.querySelector("#selDirection").value
            tbl["oseq"] = theTbl.querySelector("#selSCol").value
            if(tbl["qpt"].length == 0){
                tbl["qseq"]  = "-1"
            }
            if(tbl["qverb"] == "g" || tbl["qverb"] == "l" || tbl["qverb"] == "e"){
                var n = Number(tbl["qpt"]);
                if (isNaN(n)) {
                    alert("请输入数字!");
                    return -1
                }
            }

        }
        _e.bind("#btnRetrive","click",function(){
            var tb = window[this.getAttribute("data-gn")]
            if(getQueryConf()==-1) return
            tb.funcs.loadData.call(tb)
        },theTbl)
        _e.bind("#txtQuery","change",function(){  //回车直接查询
            var tb = window[this.getAttribute("data-gn")]
            if(getQueryConf()==-1) return
            tb.funcs.loadData.call(tb)
        },theTbl)
        _e.bind("#btnSort","click",function(){
            var tb = window[this.getAttribute("data-gn")]
            if(getQueryConf()==-1) return
            tb.funcs.loadData.call(tb)
        },theTbl)
        var checkall = function(){
            var chinputs = theTbl.querySelectorAll(".check")
            for (var i=0; i<chinputs.length;i++){
                chinputs[i].checked  = this.checked
            }
        }
        _e.bind("#checkAll","click",checkall,theTbl)
        var pg = function(){
            var tbl = window[this.getAttribute("data-gn")]
            var action = parseInt(this.getAttribute("data-act"),10)
            var pgno = tbl["pgCurrent"]
            switch (action){
                case 1: pgno=1;break
                case 2: pgno--;break
                case 3: pgno++;break
                case 4: pgno=tbl["pgCount"];break
                case 5: pgno = parseInt(prompt("输入页码",10),10);break
                default:
                    pgno = parseInt(prompt("输入显示记录条数",30),10)
                    tbl["pgSize"] = pgno
                    pgno = 1
            }
            if(pgno>0 && pgno<tbl["pgCount"]+1){
                tbl["pgCurrent"] = pgno
                tbl.funcs.loadData.call(tbl)
            }else{
                alert("不能翻页")
            }
            theTbl.querySelector("#pginfo").innerHTML = tbl["pgCurrent"]+"/<b>"+tbl["pgCount"]+"</b>"
        }
        _e.bindAll(".pg","click",pg,theTbl)
        // rowactions 预处理
        for(var k in tbl["rowActions"]){
            tbl["rowActions"][k]["supplement"] = '{{rowno}}'
        }
        var rowActionTpl
        if (tbl["rowActions"].length>1){
            rowActionTpl = '<div class="pure-menu pure-menu-horizontal">'+
                '<li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">'+
                '<button class="btn dropdown-toggle pure-menu-link" type="button" id="dropdownMenu" data-toggle="dropdown">'+
                '操作<span class="caret"></span></button>'+
                '<ul class="dropdown-menu pure-menu-children " role="menu" aria-labelledby="dropdownMenu">'+
                '{{#each rowActions}}<li class="pure-menu-item" ><a data-gn="{{../globalName}}"'+
                ' class="{{cls}} rowact pure-menu-link " data-funcno="{{@index}}" data-rowno="{{supplement}}">{{title}}</ a></li>{{/each}}</ul></li></ul></div>'
            tbl["genRowActions"] = Handlebars.compile((Handlebars.compile(rowActionTpl))(tbl))
        }
        else if(tbl["rowActions"].length==1){
            rowActionTpl='{{#each rowActions}}<button data-gn="{{../globalName}}"'+
                ' class="{{cls}} rowact pure-menu-link" data-funcno={{@index}} data-rowno="{{supplement}}">{{title}}</button>{{/each}}'
            tbl["genRowActions"] = Handlebars.compile((Handlebars.compile(rowActionTpl))(tbl))
        } else if(tbl["rowActions"].length==0){

        }
        // 操作多行
        var rowsaction = function(){
            var tbl = window[this.getAttribute("data-gn")]
            var fn = tbl["rowsActions"][this.getAttribute("data-action")]
            var selRows = []
            var chinputs = theTbl.querySelectorAll(".check")
            for(var i=0; i<chinputs.length;i++){
                if(chinputs[i].checked){
                    selRows.push(chinputs[i].getAttribute("data-val"))
                }
            }
            fn.func(tbl,selRows)
        }
        //清除附加查询条件
        var resetQc = function(){
            tbl["ext_condi"] = false
            tbl["qseq"] = -1
            tbl.funcs.loadData.call(tbl)
        }
        _e.bind("#btnResetQc","click",resetQc,theTbl)

        // 绑定多行操作
        _e.bindAll(".rowsaction","click",rowsaction,theTbl)
        var showExt = function(){
            var flag = this.getAttribute("data-show")
            var trs = theTbl.querySelectorAll("tr.extrow")
            if(flag=='y') {
                for(var i=0; i<trs.length;i++){
                    trs[i].style.display = "none"
                }
                this.setAttribute("data-show",'n')
                this.innerHTML = "显示"
            }else{
                for(var i=0; i<trs.length;i++){
                    trs[i].style.display = "inline"
                }
                this.setAttribute("data-show",'y')
                this.innerHTML = "隐藏"
            }
        }
        _e.bind("#btnExtRow","click",showExt,theTbl)
        // 复杂查询
        var changeCqdept = function(){
            // 此处更改cqdept的值
            localStorage.setItem("show_dept",theTbl.querySelector("#cqdept").value);
            tbl["cq_dept"]=theTbl.querySelector("#cqdept").value
            tbl.funcs.loadData.call(tbl)
        }
        _e.bindAll("#cqdept","change",changeCqdept,theTbl)
        var changeCqunit = function(){
            //修改unit的值
            var cqunit = theTbl.querySelectorAll(".cqunit")
            var cq_unit = []
            var check_amount = 0
            for(var i=0;i<cqunit.length;i++){
                if(cqunit[i].checked){
                    check_amount++
                    cq_unit.push(1)
                }else{
                    cq_unit.push(0)
                }
            }
            tbl["cq_unit"]=cq_unit
            if(check_amount>0) tbl.funcs.loadData.call(tbl)
        }
        _e.bindAll(".cqunit","change",changeCqunit,theTbl)
        var changeCqtime = function(){
            var cqtime = theTbl.querySelectorAll(".cqtime")
            var cq_time = []
            for(var i=0;i<cqtime.length;i++){
                var timestamp = Date.parse(cqtime[i].value)
                cq_time.push(timestamp/1000 - 28800)
            }
            tbl["cq_time"]=cq_time
            tbl.funcs.loadData.call(tbl)
        }
        _e.bindAll(".cqtime","change",changeCqtime,theTbl)

        var load_default_cq = function(){
            //初始化默认value 值
            var units=theTbl.querySelectorAll(".cqunit")
            units[1].checked=true
            var times=theTbl.querySelectorAll(".cqtime")
            var tody=_e["CurentTime"]()
            times[0].value=tody
            times[1].value=_e["addDate"](tody,1)
            //将初始化的value值放入tbl中 方便第一次loadData
            theTbl.querySelector("#cqdept").value=localStorage.getItem("show_dept")
            var opt = theTbl.querySelector("#cqdept").children
            var has_this_opthion = false
            for (var i=0;i<opt.length;i++){
              if (opt[i].value == localStorage.getItem("show_dept")) has_this_opthion=true
            }
            if (has_this_opthion) theTbl.querySelector("#cqdept").value=opt[0].value
            tbl["cq_dept"]=theTbl.querySelector("#cqdept").value
            localStorage.setItem("show_dept",tbl["cq_dept"]);

            var cqunit = theTbl.querySelectorAll(".cqunit")
            var cq_unit = []
            for(var i=0;i<cqunit.length;i++){
                if(cqunit[i].checked) cq_unit.push(1)
                else cq_unit.push(0)
            }
            tbl["cq_unit"]=cq_unit
            var cqtime = theTbl.querySelectorAll(".cqtime")
            var cq_time = []
            for(var i=0;i<cqtime.length;i++){
                var timestamp = Date.parse(cqtime[i].value)
                cq_time.push(timestamp/1000 -28800)
            }
            tbl["cq_time"]=cq_time
        }
        //初始默认的 复杂查询
        load_default_cq()

    }

    tblConf["funcs"]["reloadOption"] = function(){
      var tbl = this
      var theTbl = document.querySelector("#"+tbl["containerID"])
      var cqtime = theTbl.querySelectorAll(".cqtime")
      var cq_time = []
      for(var i=0;i<cqtime.length;i++){
          var timestamp = Date.parse(cqtime[i].value)
          cq_time.push(timestamp/1000 - 28800)
      }
      tbl["cq_time"]=cq_time

      var cqunit = theTbl.querySelectorAll(".cqunit")
      var cq_unit = []
      for(var i=0;i<cqunit.length;i++){
          if(cqunit[i].checked) cq_unit.push(1)
          else cq_unit.push(0)
      }
      tbl["cq_unit"]=cq_unit

      tbl["cq_dept"]=theTbl.querySelector("#cqdept").value

    }

    tblConf["funcs"]["loadData"] = function(qc){
        var tbl = this
        var fd = new FormData(), xhr = new XMLHttpRequest()
        if(qc && (qc["qverb"] || qc["odir"])){
            fd.append("qseq",qc["qseq"]) // query column seq
            fd.append("qverb",qc["qverb"]) //
            fd.append("qpt",qc["qpt"]) // query pattern
            tbl["qseq"] = qc["qseq"]
            tbl["qverb"] = qc["qverb"]
            tbl["qpt"] = qc["qpt"]
            if (qc["odir"]) {
                tbl["odir"] = qc["odir"]
                tbl["oseq"] = qc["oseq"]
            }
            tbl["ext_condi"] = qc
            if(qc.qseq==-1){
                tbl["ext_condi"] = false
            }
        }else{
            fd.append("qseq",tbl["qseq"]) // query column seq
            fd.append("qverb",tbl["qverb"]) //
            fd.append("qpt",tbl["qpt"]) // query pattern
            if(tbl["ext_condi"]){
                fd.append("qseq",tbl["ext_condi"]["qseq"])
                fd.append("qverb",tbl["ext_condi"]["qverb"])
                fd.append("qpt",tbl["ext_condi"]["qpt"])
            }
        }
        fd.append("cq_dept",tbl["cq_dept"])
        fd.append("cq_unit",tbl["cq_unit"])
        fd.append("cq_time",tbl["cq_time"])

        fd.append("pgsize", tbl["pgSize"])
        fd.append("start",(tbl["pgCurrent"]-1)*tbl["pgSize"])
        fd.append("oseq",tbl["oseq"]) //
        fd.append("odir",tbl["odir"])
        xhr.open("POST" ,tbl["dataUrl"] , true)
        xhr.send(fd)
        xhr.onreadystatechange=function()  {
            if (xhr.readyState==4 && xhr.status==200){
                var d = eval('('+xhr.responseText+');')
                // console.log(d)
                tbl["data"] = d["rows"]
                var c = d["count"]/tbl["pgSize"]
                tbl["pgCount"] = d["count"]%tbl["pgSize"]==0 ? c:Math.floor(c)+1
                tbl["funcs"]["genTBody"](tbl)
            }
        }
    }
    tblConf["funcs"]["genTBody"] = function(tbl){
        var theTbl = document.querySelector("#"+tbl["containerID"])
        tbodyStr = "", colDefs = tbl["colDefs"],  rowActionStr = ""
        for(var i in tbl["data"]){
            var trStr = ""
            var tds = ""
            for(var k in colDefs){
                if(!colDefs[k].visible) continue
                tds +="<td>"
                if(colDefs[k].isID){
                    /*
                     if (tbl["extRow"]){
                     tds += '<button class="expand" data-rowno="'+i+'">+</button>'
                     }*/
                    tds += '<input type="checkbox" class="check" '+
                        'data-val="'   + i+'" />'
                }
                if(colDefs[k].render){
                    tds +=
                        colDefs[k].render(tbl["data"][i][colDefs[k].seq])
                }else{
                    tds +=""+tbl["data"][i][colDefs[k].seq]
                }
                tds += "</td>"
            }
            // 补上row_actions，前面预定义好模板了。
            if (tbl["rowActions"].length>0) {
                trStr += tds+"<td>"+tbl["genRowActions"]({"rowno":i})+"</td>"
            }else {
                trStr += tds
            }
            tbodyStr += "<tr class='property_row' id='property_row_"+
                i+"'>"+  trStr+"</tr>"
            // 也许还有扩展行
            if(tbl["extRow"]){
                tbodyStr += '<tr class="extrow" id="extrow_'+i+'"><td colspan="' +tbl["colCount"]+'">'+
                    tbl["extRow"](tbl["data"],i)+'</td></tr>'
            }
        }
        theTbl.querySelector("tbody").innerHTML = tbodyStr
        // 绑单行事件
        var rowact = function(){
            var funcno = this.getAttribute("data-funcno")
                ,tbl = window[this.getAttribute("data-gn")]
                ,rowno = this.getAttribute("data-rowno")
            tbl["rowActions"][funcno].func.call(this,tbl,rowno)
        }
        _e.bindAll(".rowact","click",rowact,theTbl)
        // 显示、隐藏扩展行
        var ch = theTbl.querySelector("#btnExtRow").getAttribute("data-show")
        if(ch=='n'){
            var trs = theTbl.querySelectorAll("tr.extrow")
            for(var i=0; i<trs.length;i++){
                trs[i].style.display = "none"
            }
        }
        if(tbl.afterLoad) tbl.afterLoad(tbl,theTbl)
    }
    return new table()


}
