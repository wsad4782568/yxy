function tr(){}
var treeConf = {}
/*init
id: #tree
data: url or [[],[]]
flag:静态或动态
gn:本树的全局名，唯一性

*/
treeConf["init"] = function(id,data,flag,gn){ // 1:静态 2：动{
    var container = document.querySelector(id)
    this["container"] = container
    this["data"] = data
    this["flag"] = flag
    this["globalName"] = "_eachmaTREE_"+gn
    this["bfunc"] = bfunc
    this["lfunc"] = lfunc
    window[this["globalName"]] = this
    
    container.appendChild(this["genUL"](0))
}

treeConf["genSubTree"] = function () {
    var loaded = this.getAttribute("data-isLoaded")
    if(loaded==1) return    
    var pid = this.getAttribute("data-id"),
        gn = this.getAttribute("data-gn")
    
          
    this.parentNode.insertBefore(window[gn]["genUL"](pid),this.nextSibling)
    this.setAttribute("data-isLoaded","1")    
    
}
treeConf["genUL"] = function(pid){
    
    if(this["flag"] == 1){
        var data = this["data"]
        var ul = document.createElement("ul")
        for(var i=0; i<data.length;i++){ 
            if(data[i][2]!=pid) continue      
            var li = document.createElement("li")
            li.innerText = data[i][1]
            // 绑上附加数据
            li.setAttribute("data-id",data[i][0])
            li.setAttribute("data-isLeaf",data[i][3])
            //非叶子
            if(data[i][3]==0){
                li.setAttribute("data-gn",this["globalName"])
                li.setAttribute("data-isLoaded",0)
                li.addEventListener("click",this["genSubTree"],false)            
            }        
            ul.appendChild(li)
        }
        return ul
        
        
    }
    
}
tr.prototype = treeConf