
if(typeof(_e) == "undefined") {
_e = {}
}
_e["dialog"] = function(cfg){ // #id
  if(!Handlebars) return
  var dlgTpl =
    '<div class="pure-g titleBar" draggable="true"'+
    ' style="cursor:move">'+
      '<div class="pure-u-5-6"><h2 class="shopten">{{title}}</h2></div>'+
      '<div class="pure-u-1-6" style="text-align:right;">'+
        '<span style="cursor:default" class="close">×</span>'+// font-awesome
      '</div></div>'+
      '   <div class="main" style="margin-left:30px;height:300px;overflow-y: auto;"></div>'+
      '   <div class="bottomBar"></div>'
  var dlg = document.createElement("div")
  dlg.id = cfg.id
  dlg.className="dlg-top dlgData"
  dlg.style.width = cfg.width || "400px"

  dlg.style.background = "white"
  dlg.style.position = "absolute"


  dlg.innerHTML = Handlebars.compile(dlgTpl)(cfg)
  dlg.querySelector(".main").innerHTML = cfg.mainBody
  var bottom = dlg.querySelector(".bottomBar")
  var dlgMain = dlg.querySelector(".main")
  if(cfg.actions){
    for(var i=0; i<cfg.actions.length;i++){
      var btn = document.createElement("button")
      btn.id = cfg.actions[i].id
      btn.className='pure-button pure-button-primary bottom'
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
  _e.bind(".titleBar","mousedown",mouseDown,dlg,true)
  _e.bind(".close","click",function(){
    dlg.parentNode.removeChild(dlg)
  },dlg,false)
  _e.bind(".titleBar","dblclick",function(){
    if(dlg.querySelector(".main").style.display == "none"){
      dlg.querySelector(".main").style.display = "block"
      dlg.querySelector(".bottomBar").style.display = "block"
      dlg.style.top="15%"
      dlg.style.left="35%"
    }else{
      dlg.querySelector(".main").style.display = "none"
      dlg.querySelector(".bottomBar").style.display = "none"
      dlg.style.top="95%"
      dlg.style.left="0%"
    }
  },dlg,false)
  dlg["show"] = function(){
    this.style.display = "block"
  }
  dlg["hide"] = function(){
    var len=document.querySelectorAll(".titleBar").length
    len*=5
    var left=len+'%'
    dlg.querySelector(".main").style.display = "none"
    dlg.querySelector(".bottomBar").style.display = "none"
    dlg.style.top="95%"
    dlg.style.left=left
  }

  if(cfg.afterCreated){
    cfg.afterCreated(dlg,cfg.params)

  }
  return dlg
}
