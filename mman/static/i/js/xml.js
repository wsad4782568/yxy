function  loadDate(options){
    var options_ = options?options:{},
        fData = new FormData(),
        xhr =  new XMLHttpRequest(), urlStr="",method=options_["async"]?options_["async"]:true;
    xhr.onreadystatechange=function () {
        if (xhr.readyState==4 && xhr.status==200){
            var d = eval('('+xhr.responseText+');')
            options["callback"](d)
        }
    };
    if(options["method"].toLocaleLowerCase()=='post'){
        for(var i in options_["data"]){
            fData.append(i,options["data"][i]);
        }
        urlStr=options_["url"];
    }
    if(options["method"].toLocaleLowerCase()=='get'){
        for(var i in options_["data"]){
            urlStr=urlStr.concat("&",i,"=",options_["data"][i])
        }
        urlStr=options_["data"].length===0?options_["url"]:"".concat(options["url"],"?",urlStr.slice(1,urlStr.length));
        fData="";
    }
    xhr.open(options["method"],urlStr,method);
    xhr.send(fData);
}