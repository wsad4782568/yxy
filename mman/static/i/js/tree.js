if (typeof(_e) == "undefined") {
    _e = {}
}

_e["tree"] = function() {
    var treeConf = {}
        /*init
         id: #tree
         data: url or [[]]  0.ID 1.Name 2.pid 3.is_leaf 4["name",value] 扩展属性
         flag:静态或动态
         gn:本树的全局名，唯一性

         */
        //传入的id，传入的数据,传入的标记(是否执行),需要绑定的事件
    treeConf["init"] = function(id, data, flag, gn, events) {
        var container = document.querySelector(id)
        this["container"] = container
        //把值传入到this里面，在下面的函数中就可以调
            // 用了，不然后面的函数调用不要前面传进来的函数
        this["data"] = data
        this["flag"] = flag
        this["globalName"] = "_eachmaTREE_" + gn
            /* events 示例：
            [{
            e:"click",
            func:function () {
                 console.log(this)
             },
             is_leaf:0
             }]
             参数obj{e:事件名称,func：需要绑定的函数,is_leaf:绑定到什么节点上}
                  is_leaf 0：非叶子节点 1:叶子节点 2：所有树节点
                */
        if (events) this["events"] = events
        //

        window[this["globalName"]] = this //保存当前的tree实例
        container.appendChild(this["genUL"](0))

    }

    treeConf["genSubTree"] = function() {
      //通过data-isLoaded来display
        var loaded = this.getAttribute("data-isLoaded")
        if (loaded == 1) { //关闭
            this.nextElementSibling.style.display = "none" //下一个标签ul隐藏
            this.setAttribute("data-isLoaded", "2")
        } else if (loaded == 2) { //展开
            this.nextElementSibling.style.display = "block" //下一个标签ul显示
            this.setAttribute("data-isLoaded", "1")
        } else {
            var pid = this.getAttribute("data-id"),
                gn = this.getAttribute("data-gn")
            this.parentNode.insertBefore(window[gn]["genUL"](pid), this.nextSibling)
            //将this.nextSibling值放
            // 在window[gn]["genUL"](pid)后面,
            // window[gn]["genUL"](pid)得到的是return出来的值，也就是ul标签
            this.nextElementSibling.style.position = "relative"
            this.setAttribute("data-isLoaded", "1")
        }
    }

    treeConf["genUL"] = function(pid) {
        if (this["flag"] == 1) {
            var data = this["data"]
            var ul = document.createElement("ul")
            var trs = this
            for (var i = 0; i < data.length; i++) { //遍历所有data值
                // console.log(i + ":" + data[i])
                if (data[i][2] != pid) { //是否是根节点,不是就continue，每次只有等于pid才通过，也就是每次调用
                    // 这个函数只是出来几个子节点，但是在treeConf["genSubTree"]里面是改变pid的值，使后面的
                    //节点显示出来
                    continue
                }
                // console.log(i + ":" + data[i])
                var li = document.createElement("li") //创建一个li标签
                li.className = "task"
                li.innerText = data[i][1] //在li标签的text上写上name值
                    // 绑上附加数据
                li.setAttribute("data-id", data[i][0]) //设置两个跟id,是否叶子节点相同的data值
                li.setAttribute("data-isLeaf", data[i][3])
                li.setAttribute("onclick","taskAll(this)")
                li.style.cursor = "-webkit-grab"
                    //非叶子
                if (data[i][3] == 0) {
                    li.setAttribute("data-gn", this["globalName"]) //将init函数里面的this保存起来,在后面时进行调用
                    li.setAttribute("data-isLoaded", 0) //根节点设值，为了跟后面的不是叶子节点的子节点区分
                    li.addEventListener("click", this["genSubTree"], false)
                }
                if(data[i].length>4){
                    li.setAttribute(data[i][4][0], data[i][4][1]) //根节点设值，为了跟后面的不是叶子节点的子节点区分
                }
                if (trs["events"]) {
                    for (var k = 0; k < trs["events"].length; k++) { //可以根据叶子节点或者不是叶子节点绑定事件
                        if (data[i][3] == trs["events"][k].is_leaf) {//这里是亮点 :data[i][3] 有0,1两种 这样处理  就不需要写if(data[i][3]==0) if(data[i][3]==1)
                            li.addEventListener(trs["events"][k].e, trs["events"][k].func, false)
                        }
                        if (3 == trs["events"][k].is_leaf) {
                            li.addEventListener(trs["events"][k].e, trs["events"][k].func, false)
                        }
                    }
                }
                ul.appendChild(li)
            }
            return ul //return这个ul标签出去
        }

    }

    function tree() {}

    tree.prototype = treeConf
    return new tree()
}

function taskAll(e){
    var task = document.querySelectorAll(".task")
    for(var i = 0;i < task.length;i++){
       task[i].style.color = "#000000"
    }
    e.style.color = "#1616d4"
}
