/**
 * Created by Administrator on 2016/6/8.
 */
if(typeof(_e) == "undefined") {
    _e = {}
}
_e["upload"]=function(files,cb){
    var args=arguments
    var xmlhttp = new XMLHttpRequest()
    var addFd = new FormData()
    for(var i=0;i<files.length;i++){
        var suffix= files[i].name.substring(files[i].name.lastIndexOf('.'))
        addFd.append("name",files[i].name)
        addFd.append("suffix",suffix)
    }
    xmlhttp.open("POST", "/qn/upload",true)
    xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var data=eval('('+xmlhttp.responseText+');')
            var keys=data["Keys"]
            for(var i=0;i<files.length;i++){
                var xp = new XMLHttpRequest(), fd = new FormData
                xp.open("POST", "http://up.qiniu.com",true)
                fd.append("file",files[i])
                fd.append("token",data["Token"])
                fd.append("key",data["Keys"][i])
                xp.send(fd)
                xp.onreadystatechange=function(){
                    if (xp.readyState==4 && xp.status==200){
                    }
                }
            }
            args[0]=keys
            cb(args)
        }
    }
    xmlhttp.send(addFd)
}
