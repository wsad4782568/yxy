
if(typeof(_e) == "undefined") {
    _e = {}
}
_e["msgBox"] = function(option){
    var msg = option.hasOwnProperty("msg")?option.msg:"";
    var timeout = option.hasOwnProperty("timeout")?option.timeout:2000;
    // error(default)  info warning  success
    var className=option.hasOwnProperty("className")?option.className:"error";

    var msgElement=document.createElement("div");
    msgElement.className="e-msg-bar animated fadeInDown alert-"+className;
    msgElement.innerHTML=msg;
    document.getElementsByTagName("body")[0].appendChild(msgElement);
    setTimeout((function(){
        return function(){
            msgElement.className="e-msg-bar animated fadeOutUp alert-"+className;
        }
    })(this),timeout);
    setTimeout((function(){
        return function(){
            msgElement.parentNode.removeChild(msgElement);
        }
    })(this),timeout+1000)
}

_e["deleteBox"] = function(cfg){
	if(!Handlebars) return
  var dlgTpl =
    '<div class="titleBar1" draggable="true"'+
    ' style="cursor:move;height: 30px;background-color: #CBCBCB;text-align: center;margin-top: -14px;">'+
      '<div><h3>{{title}}</h3></div></div>'+
      '   <div class="bottomBar"></div>'
  var dlg = document.createElement("div")
  dlg.id = cfg.id
  dlg.className="dlg-top dlgData"
  dlg.style.width = "190px"
  dlg.style.height = "90px"
  dlg.style.background = "white"
  dlg.style.position = "absolute"


  dlg.innerHTML = Handlebars.compile(dlgTpl)(cfg)
  var bottom = dlg.querySelector(".bottomBar")
  if(cfg.actions){
    for(var i=0; i<cfg.actions.length;i++){
      var btn = document.createElement("button")
      btn.id = cfg.actions[i].id
      btn.className='bottom1'
      btn.onclick = cfg.actions[i].func
      btn.innerHTML = cfg.actions[i].title
      bottom.appendChild(btn)
    }

  }
  document.querySelector("body").appendChild(dlg)
  dlg.style.left=(document.body.clientWidth - dlg.offsetWidth)/2 + document.body.scrollLeft
  dlg.style.top= (document.body.clientHeight - dlg.offsetHeight)/2 + document.body.scrollTop

  dlg.style.display = "none"
  var deltaX = 0, deltaY = 0
  var mouseMove = function(e){
    dlg.style.left = (e.clientX - deltaX) + 'px'
    dlg.style.top = (e.clientY - deltaY) + 'px'

  }
  var mouseUp = function(e){
    document.removeEventListener("mouseup", mouseUp, true)
    document.removeEventListener("mousemove", mouseMove, true)
    e.stopPropagation()

  }
  var mouseDown = function(e){
    deltaX = e.clientX - this.parentNode.offsetLeft
    deltaY = e.clientY - this.parentNode.offsetTop

    document.addEventListener('mousemove', mouseMove, true)
    document.addEventListener('mouseup', mouseUp, true)
    e.stopPropagation()
    e.preventDefault()

  }
  _e.bind(".titleBar1","mousedown",mouseDown,dlg,true)
  dlg["show"] = function(){
    this.style.display = "block"
  }
  dlg["hide"] = function(){
    var len=document.querySelectorAll(".titleBar1").length
    len*=5
    var left=len+'%'
    dlg.querySelector(".bottomBar").style.display = "none"
    dlg.style.top="95%"
    dlg.style.left=left
  }

  if(cfg.afterCreated){
    cfg.afterCreated(dlg,cfg.params)

  }
  return dlg
}
