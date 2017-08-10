/**
 * Created by bobdoaren007 on 2016/8/4 0004.
 */
var xhr = new XMLHttpRequest()
xhr.open("POST","/basis/manageStaffRole/showStfRole",true)

xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
         console.log(xhr.responseText)
        staffRoleJson = eval('(' + xhr.responseText + ');')
        loadStaffRole(staffRoleJson)
    }
}
xhr.send()
function loadStaffRole(staffRoleJson) {
    for(var i=0 ;i<staffRoleJson.staff.length;i++){
        var staffHtml='<div style="border-top: 1px solid #c1c1c1">' +
            ' <input class="inptStaff" name="staff" data-id="'+staffRoleJson.staff[i].staffid+'" type="checkbox"  style="height: 20px;width: 17px;margin-top: 7px">' +
            ' <span style="font-size: 15px;position: absolute;margin-top: 7px">'+staffRoleJson.staff[i].username+'</span> </div>'
        document.querySelector(".staff").innerHTML+=staffHtml
    }
    for(var r=0;r<staffRoleJson.role.length;r++){
        var roleHtml='  <div style="border-top: 1px solid #c1c1c1"> ' +
            '<input class="inptRole" data-id="'+staffRoleJson.role[r].id+'" type="radio" name="relo"  style="height: 20px;width: 17px;margin-top: 7px">' +
            ' <span style="font-size: 15px;position: absolute;margin-top: 7px">'+staffRoleJson.role[r].name+'</span> </div>'
        document.querySelector(".relo").innerHTML+=roleHtml
    }
    _e.bindAll(".inptRole","click",loadRole)
}

function loadRole() {
    var fdRoleId = new FormData(),xhr = new XMLHttpRequest()
    fdRoleId.append("roleid",this.getAttribute("data-id"))
    // console.log(fdRoleId.get("roleid"))
    xhr.open("POST","/basis/manageStaffRole/getRoleAtPage",true)
    xhr.send(fdRoleId)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            roleActionJson = eval('(' + xhr.responseText + ');')
            if(roleActionJson.res==1){
                loadRoleAction(roleActionJson)
            }else{
                _e.msgBox({
                    msg: "没有绑定权限范围！",
                    timeout: 2000,
                    className: "warning"
                })
                return
            }
        }
    }
}

function loadRoleAction(roleActionJson) {
    var action=document.querySelector(".action")
    var page=document.querySelector(".page")
    action.innerHTML=''
    page.innerHTML=''
    for(var i=0;i<roleActionJson.action.length;i++){
        var actionHtml='<div style="border-top: 1px solid #c1c1c1"> <p style="font-size: 15px;margin-top: 7px">'+roleActionJson.action[i].descripiton+'</p> </div>'
       action.innerHTML+=actionHtml
    }
    for(var p=0;p<roleActionJson.page.length;p++){
        var pageHtml='<div style="border-top: 1px solid #c1c1c1"> <p style="font-size: 15px;margin-top: 7px">'+roleActionJson.page[p].descripiton+'</p> </div>'
        page.innerHTML+=pageHtml
    }
}

_e.bind(".btnRoleRange","click",subRoleStaff)
function subRoleStaff() {
    var iputStaff=document.querySelectorAll(".inptStaff")
    var iputRole=document.querySelectorAll(".inptRole")
    var fdSidRid = new FormData(),xhr = new XMLHttpRequest()
    for(var i=0;i<iputStaff.length;i++){
        if(iputStaff[i].checked==true){
            fdSidRid.append("staffid",iputStaff[i].getAttribute("data-id"))
        }
    }
    for(var r=0;r<iputRole.length;r++){
        if(iputRole[r].checked==true){
            fdSidRid.append("roleid",iputRole[r].getAttribute("data-id"))
        }
    }
    if(fdSidRid.get("staffid")==null||fdSidRid.get("roleid")==null){
        _e.msgBox({
            msg: "请操作规范！",
            timeout: 2000,
            className: "warning"
        })
        return
    }
    xhr.open("POST","/basis/manageStaffRole/updateStaffRole",true)
    xhr.send(fdSidRid)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            stafRoleD = eval('(' + xhr.responseText + ');')
            if(stafRoleD.res==1){
                _e.msgBox({
                    msg: "添加成功！",
                    timeout: 2000,
                    className: "success"
                })
                setTimeout("window.location.reload()",2000)
            }else{
                _e.msgBox({
                    msg: "添加失败！",
                    timeout: 2000,
                    className: "warning"
                })
            }
        }
    }
}
