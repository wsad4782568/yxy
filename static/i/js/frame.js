/*
功能页面加载
*/
var rolepage  = JSON.parse(localStorage.getItem("rolepage"))
var rootuser  = localStorage.getItem("rootuser")
if(!rolepage || !rootuser){
  _e.msgbox({msg:"权限验证失败，请重新登陆"})
  	setTimeout(" window.location.href='/m/index.html'",2000);
}
var subpageAnchors = document.querySelectorAll(".anchorPage")
var drafts=document.querySelectorAll(".drafts")
  if(rootuser=="非超级用户"){
    for (var i = 0; i < subpageAnchors.length; i++) {
    var no_rolepage = 1
    for(var j=0;j<rolepage.length;j++){
      if(subpageAnchors[i].id == rolepage[j]) no_rolepage=0
    }
    if (no_rolepage) {
        var this_li=subpageAnchors[i].parentNode
        this_li.parentNode.removeChild(this_li)
    }
  }

  var no_rolepage2 = 1
  for(var i=0;i<drafts.length;i++){
          for(var j=0;j<rolepage.length;j++){
            if(drafts[i].getAttribute("data-name") == rolepage[j]) no_rolepage2=0
          }
          if (no_rolepage2) {
              var this_li2=drafts[i].parentNode
              this_li2.parentNode.removeChild(this_li2)
          }
  }
}

for (var i = 0; i < subpageAnchors.length; i++) {
    subpageAnchors[i].onclick = function() {
        document.querySelector("title").innerHTML=this.innerText
        gotoPage(this.id)
    }
}
for(var i=0;i<drafts.length;i++){
    drafts[i].onclick = function() {
        document.querySelector("title").innerHTML=this.innerText
        var frm = document.getElementById("frm")
        frm.src = this.getAttribute("data-name") + ".html?drafts=1"
    }
}

function gotoPage(page) {
    var frm = document.getElementById("frm")
    frm.src = page + ".html"
}
var em_s = document.querySelectorAll(".em_")
var em_length = em_s.length - 1
for (var i = em_length; i >= 0; i--) {
  if(em_s[i].children[2].children[0].children.length==0)  em_s[i].style.display="none"
}



var fd = new FormData(), xhr = new XMLHttpRequest()

xhr.open("POST", "/staff/getstaffinfo",true)
xhr.onreadystatechange = function(){
    if (xhr.readyState==4 && xhr.status==200){
        var da = eval('(' +xhr.responseText+ ');')
        if(da.res==-1) {
           alert(da.msg)
            return
        }
        document.querySelector("#staff_id").innerHTML=da.staff[1]
        document.querySelector("#staff_dept").innerHTML=da.dept[1]
        var alldept_obj=[]
        for (var i=0;i<da.alldept.length;i++){
            alldept_obj.push({
                id:da.alldept[i][0],
                name:da.alldept[i][1]
            })
        }
        localStorage.setItem("alldept",JSON.stringify(alldept_obj));
        localStorage.setItem("show_dept",da.alldept[0][0]);
    }
}
xhr.send()

function change_show_dept(option){
    localStorage.setItem("show_dept",option.value);
}
window.onbeforeunload = function(){
    var frm = document.querySelector("#frm")
    var src = frm.getAttribute("src")
    localStorage.setItem("subpage",JSON.stringify(src))
    return src
}
window.onload = function(){
    if(localStorage.getItem("subpage").length != 0){
        var frm = document.querySelector("#frm")
        frm.setAttribute("src",JSON.parse(localStorage.getItem("subpage")))
    }
}

//点击左边的功能会有显示
function anchorPage(e){
  var anchorPage = document.querySelectorAll(".anchorPage")
  for(var i = 0;i < anchorPage.length;i++){
    anchorPage[i].children[0].style.backgroundColor = "#FFFFFF"
  }
  e.style.backgroundColor = "#EEEEEE"
}
