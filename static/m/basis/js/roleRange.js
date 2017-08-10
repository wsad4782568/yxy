/**
 * Created by bobodaren007 on 2016/8/4 0004.
 */
var xhr = new XMLHttpRequest()
xhr.open("POST", "/basis/manageStaffRole/showRole", true)
xhr.send()
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        roleRangeJson = eval('(' + xhr.responseText + ');')
        if (roleRangeJson.res==-1){
          _e["msgBox"]({msg:roleRangeJson.msg})
        }else{
          loadRole(roleRangeJson)
          console.log(roleRangeJson);
        }

    }
}

function loadRole(roleRangeJson) {
    for (var i = 0; i < roleRangeJson.role.length; i++) {
        var roleHtml = '<div style="border-top: 1px solid #c1c1c1" data-id="' + roleRangeJson.role[i].id + '"> <input class="iputRole" type="radio" data-id="' + roleRangeJson.role[i].id + '" name="role" style="height: 20px;width: 17px;margin-top: 7px;margin-left: 10px;"><span style="font-size: 15px;position: absolute;margin-top: 7px">' + roleRangeJson.role[i].name + '</span> </div>'
        document.querySelector(".role").innerHTML += roleHtml
    }
    _e.bindAll(".iputRole", "click", lookPageRange)
}

function lookPageRange() {
    document.querySelector(".action").innerHTML = ""
    document.querySelector(".page").innerHTML = ""

    var iputRole = document.querySelectorAll(".iputRole")
    var fd = new FormData(),
        xhr = new XMLHttpRequest()

    for (var i = 0; i < iputRole.length; i++) {
        if (iputRole[i].checked == true) {
            fd.append("roleid", iputRole[i].getAttribute("data-id"))
        }
    }
    xhr.open("POST", "/basis/manageStaffRole/passRoleGetAtPage", true)
    xhr.send(fd)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            getRP = eval('(' + xhr.responseText + ');')
            if (getRP.res == 1) {
                loadPageAction(getRP)
                console.log(getRP);
            } else {
                _e.msgBox({
                    msg: "没有权限",
                    timeout: 2000,
                    className: "error"
                })
            }
        }
    }
}

function loadPageAction(getRP) {
    for (var a = 0; a < getRP.Action.length; a++) {
        if (getRP.Action[a].flag == 1) {
            var actionHtml = '<div style="border-top: 1px solid #c1c1c1"> ' +
                '<input checked="true" class="iputActoin" data-flag="' + getRP.Action[a].flag + '"  data-id="' + getRP.Action[a].id + '" type="checkbox" name="action" style="height: 20px;width: 17px;margin-top: 7px;margin-left: 10px;">' +
                '<span style="font-size: 15px;position: absolute;margin-top: 7px">' + getRP.Action[a].descripiton +
                '</span> </div>'
        } else {
            var actionHtml = '<div style="border-top: 1px solid #c1c1c1"> ' +
                '<input class="iputActoin" data-flag="' + getRP.Action[a].flag + '"  data-id="' + getRP.Action[a].id + '" type="checkbox" name="action" style="height: 20px;width: 17px;margin-top: 7px;margin-left: 10px;">' +
                '<span style="font-size: 15px;position: absolute;margin-top: 7px">' + getRP.Action[a].descripiton +
                '</span> </div>'
        }
        document.querySelector(".action").innerHTML += actionHtml
    }

    for (var p = 0; p < getRP.Page.length; p++) {
        if (getRP.Page[p].flag == 1) {
            var pageHtml = '<div style="border-top: 1px solid #c1c1c1"> ' +
                '<input checked="true" class="iputPage" data-id="' + getRP.Page[p].id + '" ' +
                'type="checkbox" name="page" style="height: 20px;width: 17px;margin-top: 7px;margin-left: 10px;">' +
                '<span style="font-size: 15px;position: absolute;margin-top: 7px">' + getRP.Page[p].descripiton + '</span> </div>'
        } else {
            var pageHtml = '<div style="border-top: 1px solid #c1c1c1"> ' +
                '<input class="iputPage" data-id="' + getRP.Page[p].id + '" ' +
                'type="checkbox" name="page" style="height: 20px;width: 17px;margin-top: 7px;margin-left: 10px;">' +
                '<span style="font-size: 15px;position: absolute;margin-top: 7px">' + getRP.Page[p].descripiton + '</span> </div>'
        }
        document.querySelector(".page").innerHTML += pageHtml
    }
}



//提交roleId actionId pageId
_e.bind(".btnRoleRange", "click", subRoleRange)

function subRoleRange() {
    var iputRole = document.querySelectorAll(".iputRole")
    var iputActoin = document.querySelectorAll(".iputActoin")
    var iputPage = document.querySelectorAll(".iputPage")

    var fd = new FormData(),
        xhr = new XMLHttpRequest()
    for (var i = 0; i < iputRole.length; i++) {
        if (iputRole[i].checked == true) {
            fd.append("roleid", iputRole[i].getAttribute("data-id"))
        }
    }
    for (var a = 0; a < iputActoin.length; a++) {
        if (iputActoin[a].checked == true) {
            // console.log(iputActoin[a].getAttribute("data-id"))
            fd.append("actionid", iputActoin[a].getAttribute("data-id"))
        }
    }
    for (var p = 0; p < iputPage.length; p++) {
        if (iputPage[p].checked == true) {
            // console.log('pageid='+iputPage[p].getAttribute("data-id"))
            fd.append("pageid", iputPage[p].getAttribute("data-id"))
        }
    }
    if (fd.get("roleid") == null || fd.get("actionid") == null || fd.get("pageid") == null) {
        _e.msgBox({
            msg: "请操作规范！",
            timeout: 2000,
            className: "warning"
        })
        return
    }
    // console.log(fd.get("roleid"))
    xhr.open("POST", "/basis/manageStaffRole/updateRoleAtPage", true)
    xhr.send(fd)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            returnD = eval('(' + xhr.responseText + ');')
            if (returnD.res == 1) {
                _e.msgBox({
                        msg: "添加成功！",
                        timeout: 2000,
                        className: "success"
                    })
                    //setTimeout("window.location.reload()",2000)
                return
            } else {
                _e.msgBox({
                    msg: "添加失败！",
                    timeout: 2000,
                    className: "warning"
                })
            }
        }
    }
}

_e.bind(".actionAll","click",clickAction)
function clickAction(){
  var actionIpt=document.querySelectorAll(".iputActoin")
  for(var i=0;i<actionIpt.length;i++){
  if(this.firstChild.checked==true){
      actionIpt[i].checked= true
  }else{
      actionIpt[i].checked= false
    }
  }
}


_e.bind(".pageAll","click",clickPage)
function clickPage(){
  var pageIpt=document.querySelectorAll(".iputPage")
  for(var j=0;j<pageIpt.length;j++){
  if(this.firstChild.checked==true){
      pageIpt[j].checked= true
  }else{
      pageIpt[j].checked= false
    }
  }
}
