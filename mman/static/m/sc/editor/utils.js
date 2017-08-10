_e = function() {};

//优惠开关(false所有的都禁止)
_e.Discounted = true;

//department_id:部门ID,discountMinu:满多少减多少(false禁止),discount:打折(false禁止),discountRate:折扣率
_e.DepartmentArr = [
    {"department_id":52,"discountMinu":false,"discount":true,"discountRate":0.9},
    {"department_id":500001,"discountMinu":false,"discount":false,"discountRate":0.9}
];

// 使用id获取dom对象
_e.getById = function(id) {
    return document.getElementById(id)
}
_e.getByClass = function(className) {
    return document.getElementsByClassName(className)
}
//如果包含不合法字符则返回true，否则返回false
_e.filterText = function(text){
  return (/[\[\]{}'",();`]|\s$|^\s/).test(text);
}

_e.Q = function(elm, bool) {
    // Return a NodeList of all instances of elm
    if (typeof bool === "undefined") return document.querySelectorAll(elm);
    // Grab the first .myClass class name
    return document.querySelector(elm);


}


_e.removeClass = function(el, className) {
    for (var i in el) {
        if ((typeof el[i].classList) == "undefined") return false;
        el[i].classList.remove(className);
    }
}

_e.addClass = function(el, className) {
    for (var i in el) {
        if ((typeof el[i].classList) == "undefined") return false;
        if (el[i].classList) {
            el[i].classList.add(className);
        } else {
            el[i].className += ' ' + className;
        }
    }
}

// 获取url链?后面的命名参数值
_e.getQs = function(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"))
    if (result == null || result.length < 1) {
        return ""
    }
    return result[1]
}

// 获取url链#后面的命名参数值
_e.getQss = function(name) {
    var result = location.href.match(new RegExp("[\#\&]" + name + "=([^\&]+)", "i"))
    if (result == null || result.length < 1) {
        return ""
    }
    return result[1]
}

_e.isFunc = function(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
_e.validateEmail = function(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }
    /**
     * Checking length of the value is not equal zero.
     * @return {true || false}
     */
_e.check_length = function() {
    for (var k in arguments) {
        if (arguments[k].length == 0) return false
    }
    return true;
};

_e.get_ev_target = function(e) {
    return e.srcElement ? e.srcElement : e.target;
};
/**
 * unix timestamp format
 * @return {string}
 * b is bool,when b is true,return format of value  is 2015-10-29 10:10:10
 * When b is false, return format is 2015年10月10日 10:10:10
 */
_e.UnixToDate = function(UNIX_timestamp, b) {
        var a = new Date(UNIX_timestamp * 1000);
        //var now = new Date(parseInt(UNIX_timestamp) * 1000);
        //return now.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        var months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var _month = a.getMonth() + 1;
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        if (b) return year + '-' + _month + '-' + date + ' ' + hour + ':' + min + ':' + sec;

        return year + '年' + month + date + '日 ' + hour + ':' + min + ':' + sec;
    }
    // string format
    // String.format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET');
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1)
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match

        })
    }
}
Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp*/ ) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var res = new Array();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this))
                    res.push(val);
            }
        }
        return res;
    };
}


_e.toTimestamp = function(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
}

//取窗口可视范围的高度
_e.getClientHeight = function(elm) {
        var clientHeight = 0;
        if (elm.clientHeight && elm.clientHeight) {
            var clientHeight = (elm.clientHeight < document.documentElement.clientHeight) ? elm.clientHeight : document.documentElement.clientHeight;
        } else {
            var clientHeight = (elm.clientHeight > document.documentElement.clientHeight) ? elm.clientHeight : document.documentElement.clientHeight;
        }
        return clientHeight;
    }
    //取窗口滚动条高度
_e.getScrollTop = function(elm) {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if (elm) {
            scrollTop = elm.scrollTop;
        }
        return scrollTop;
    }
    //取文档内容实际高度
_e.getScrollHeight = function(elm) {
    return Math.max(elm.scrollHeight, document.documentElement.scrollHeight);
}
_e.scrollFix = function(option) {
    var elem = option.wrapElm;
    if (!elem) return;
    event.initEvent("touchmove", false, true); //envent init:eventType,冒泡,是否允许preventDefault
    option.scrollElm.split(",").forEach(function(_elm_) {
        var _elem = Array.apply(null, document.querySelectorAll(_elm_));
        _elem.forEach(function(obj) {
            obj.addEventListener("touchmove", function(ev) {
                ev.stopPropagation(); //停止冒泡
            }, false);
        });
    });
    document.addEventListener("touchmove", function(evt) {
        evt.preventDefault(); //阻止默认事件
    }, false);


    elem = Array.apply(null, document.querySelectorAll(elem));
    elem.forEach(function(elm) {
        // Handle the start of interactions
        elm.addEventListener('touchstart', function(event) {
            var startY, startTopScroll;
            startY = event.touches[0].pageY;
            startTopScroll = elm.scrollTop;

            if (startTopScroll <= 0)
                elm.scrollTop = 1;

            if (startTopScroll + elm.offsetHeight >= elm.scrollHeight)
                elm.scrollTop = elm.scrollHeight - elm.offsetHeight - 1;
        }, false);

        elm.onscroll = function() {

            var height = _e.getClientHeight(elm); //浏览器可见区域高度

            var theight = _e.getScrollTop(elm); //文档内容实际高度

            var rheight = _e.getScrollHeight(elm); //滚动条距离顶部的高度

            var bheight = rheight - theight - height; //滚动条距离底部的高度
            if (theight == 0 || bheight == 0) {
                option.scrollElm.split(",").forEach(function(_elm_) {
                    var _elem = Array.apply(null, document.querySelectorAll(_elm_));
                    _elem.forEach(function(obj) {
                        obj.addEventListener("touchmove", function(evt) {
                            evt.stopPropagation();
                        }, false);
                    })
                })

            }

        }
    })
};
/**
 * Msg Box
 * _.MsgBox({
 *  msg:"请扫描条码", //MsgBox content
 *  className:"error"  //MsgBox css Style
 *
 * })
 */


_e.MsgBox = function(option) {

    var msg = option.hasOwnProperty("msg") ? option.msg : "";
    var timeout = option.hasOwnProperty("timeout") ? option.timeout : 2000;
    var className = option.hasOwnProperty("className") ? option.className : "default";

    var msgElement = document.createElement("div");
    msgElement.className = "e-msg-bar animated fadeInDown alert-" + className;
    msgElement.innerHTML = msg;
    document.getElementsByTagName("body")[0].appendChild(msgElement);
    setTimeout((function() {
        return function() {
            msgElement.className = "e-msg-bar animated fadeOutUp alert-" + className;
        }
    })(this), timeout);
    setTimeout((function() {
        return function() {
            msgElement.parentNode.removeChild(msgElement);
        }
    })(this), timeout + 1000)
};
_e.time_range = function() {
    var date = new Date(),
        temp = [],
        flag_time;
    var b = false;
    if (date.getHours() == 23) {
        b = true;
    }
    if (date.getHours() >= 23 || date.getHours() < 9) {
        flag_time = 9
    } else {
        flag_time = date.getHours();
    }
    for (var i = flag_time; i < 24; i++) {
        var obj = {
            value: 0,
            text: "",
            timestamp: ""
        };
        var tmp_date = new Date();
        var convertDate = (tmp_date.getMonth() + 1) + "/" + tmp_date.getDate() + "/" + tmp_date.getFullYear() + " " + i + ":00:00";
        if (b) {
            convertDate = (tmp_date.getMonth() + 1) + "/" + (tmp_date.getDate() + 1) + "/" + tmp_date.getFullYear() + " " + i + ":00:00";
        }
        if (i != 23) {
            if (i == date.getHours() && i < 23) {
                obj.text = "即时";
                obj.value = i;
                obj.timestamp = 0;
                temp.push(obj);
                continue;
            }
        }

        obj.text = "".concat(new Date(convertDate).getDate(), "日 ", i, "点");
        obj.value = i;
        obj.timestamp = new Date(convertDate).getTime() / 1000;
        temp.push(obj);
    }
    return temp;
};


/*
 *_e.uploadFile({
 *file:file,
 *token:token,
 *key:key //option
 *});
 */
_e.uploadFile = function(option) {
    return new Promise(function(resolve, reject) {
        var QiniuUploadUrl = "http://up.qiniu.com";
        if (!(option instanceof Object)) throw new Error("Arguments is not object!");
        if (option.file.length > 0 && option.token != "") throw new Error("form input error!");
        var xhr = new XMLHttpRequest();
        xhr.open('POST', QiniuUploadUrl, true);
        var formData, startDate;
        formData = new FormData();
        if (option.key !== null && option.key !== undefined) formData.append('key', option.key);
        formData.append('token', option.token);
        formData.append('file', option.file);
        var taking;
        //进度条dom
        var progressWrapDiv = document.createElement("div");
        progressWrapDiv.style = "opacity: 1;position: fixed;top: 0;left: 0;z-index: 9999;-webkit-transition: opacity 0.4s linear 0.4s;transition: opacity 0.4s linear 0.4s"
        var progressInnerDiv = document.createElement("div");
        progressInnerDiv.style = "position: fixed;top: 0;left: 0;height: 5px;background: #77b6ff;box-shadow: 0 0 10px rgba(119,182,255,0.7);-webkit-transition: width 0.4s ease;transition: width 0.4s ease";
        progressWrapDiv.appendChild(progressInnerDiv)
        document.body.appendChild(progressWrapDiv);
        //上传进度事件
        xhr.upload.addEventListener("progress", function(event) {

            if (event.lengthComputable) {
                //计算上传速率:已经完成文件大小/1024/(当前时间－开始上传时间)
                //(loaded)/1024/(nowDate - startDate)
                var nowDate = new Date().getTime();
                taking = nowDate - startDate;
                var x = (event.loaded) / 1024;
                var y = taking / 1000;
                var uploadSpeed = (x / y);
                var formatSpeed;
                if (uploadSpeed > 1024) {
                    formatSpeed = (uploadSpeed / 1024).toFixed(2) + "Mb\/s";
                } else {
                    formatSpeed = uploadSpeed.toFixed(2) + "Kb\/s";
                }
                //event.loaded已经完成上传的大小
                var percentComplete = Math.round(event.loaded * 100 / event.total);
                progressInnerDiv.style.width = percentComplete + "%";
            }
        }, false);

        xhr.onreadystatechange = function(response) {
            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                var blkRet = JSON.parse(xhr.responseText);
                console && console.log(blkRet);
                resolve(xhr.responseText)
                progressWrapDiv.remove();
            } else if (xhr.status != 200 && xhr.responseText) {
                reject(JSON.parse(xhr.responseText).error);
                progressWrapDiv.remove();
            }
        };
        startDate = new Date().getTime();
        xhr.send(formData);
    })
}

_e.flyer = function(e) {


    var userAgent = navigator.userAgent;
    var isAndroid = userAgent.indexOf("Android") > -1 ? true : false;
    if (isAndroid) {

        setTimeout(function() {
            _e.Q(".e-openCartWin", true).className = "e-shopCart";
        }, 20);
        setTimeout(function() {
            _e.Q(".e-shopCart", true).className = "e-openCartWin"
        }, 600);
        return false
    }
    var clientX = e.clientX;
    var clientY = e.clientY;
    var flyer = document.createElement("div");
    flyer.setAttribute("style", "left:" + (clientX - 20) + "px;top:" + (clientY - 15) + "px;position: fixed;width:15px;height: 15px;background: red;border-radius: 100px;z-index:9999;")
    document.getElementsByTagName("body")[0].appendChild(flyer);
    (function doThrow(eleFlyElement) {
        setTimeout(function() {
            flyer.setAttribute("style", "" +
                    "left:30px;" +
                    "top:91%;" +
                    "position: fixed;" +
                    "width:15px;" +
                    "height: 15px;" +
                    "background: red;" +
                    "border-radius: 100px;" +
                    "z-index:9999;" +
                    "-webkit-transition: left 0.5s linear, top 0.5s cubic-bezier(0.5, -0.5, 1, 1);" +
                    "-moz-transition: left 0.5s linear, top 0.5s cubic-bezier(0.5, -0.5, 1, 1);" +
                    "-o-transition: left 0.5s linear, top 0.5s cubic-bezier(0.5, -0.5, 1, 1);" +
                    "transition: left 0.5s linear, top 0.5s cubic-bezier(0.5, -0.5, 1, 1);")
                //document.write(e.clientX+","+e.clientY+","+flyer.style.left+"<br>");
            _e.Q(".e-openCartWin", true).className = "e-shopCart"
        }, 20);
    })(flyer);
    setTimeout(function() {
        flyer.parentNode.removeChild(flyer)
        _e.Q(".e-shopCart", true).className = "e-openCartWin"
    }, 600);

    e.stopPropagation();
};

_e.isNumeric = function(input, title) {

    var title = typeof title != "undefined" ? title + "," : ""
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    if (!RE.test(input)) {
        _e.MsgBox({
            msg: title + "请输入合法的数字",
            className: "error",
            timeout: 2200
        });
        return false;
    }
    return RE.test(input);
}
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "")
    }
}

_e.updateDataTableSelectAllCtrl = function(table) {
    var $table = table.table().node();
    var $chkbox_all = $('tbody input[type="checkbox"]', $table);
    var $chkbox_checked = $('tbody input[type="checkbox"]:checked', $table);
    var chkbox_select_all = $('thead input[name="select_all"]', $table).get(0);
    if ($chkbox_checked.length === 0) {
        chkbox_select_all.checked = false;
        if ('indeterminate' in chkbox_select_all) chkbox_select_all.indeterminate = false;
    } else if ($chkbox_checked.length === $chkbox_all.length) {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) chkbox_select_all.indeterminate = false;
    } else {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) chkbox_select_all.indeterminate = true;
    }
};


function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function unique(array) {
    var n = {},
        r = [],
        len = array.length,
        val, type;
    for (var i = 0; i < array.length; i++) {
        val = array[i];
        type = typeof val;
        if (!n[val]) {
            n[val] = [type];
            r.push(val);
        } else if (n[val].indexOf(type) < 0) {
            n[val].push(type);
            r.push(val);
        }
    }
    return r;
}

function arr1DeleteByarr2(arr1, arr2) {
    var temp = []; //临时数组1
    var temporary = []; //临时数组2
    for (var i = 0; i < arr1.length; i++) {
        temp[arr1[i]] = true; //巧妙地方：把数组B的值当成临时数组1的键并赋值为真
    }

    for (var i = 0; i < arr2.length; i++) {
        if (!temp[arr2[i]]) {
            temporary.push(arr2[i]); //巧妙地方：同时把数组A的值当成临时数组1的键并判断是否为真，如果不为真说明没重复，就合并到一个新数组里，这样就可以得到一个全新并无重复的数组
        }
    }
    return temporary;
}
(function() {
    var hostname = window.location.hostname;

    if (hostname == 'shopten.octlife.cn') {
        var _hmt = _hmt || [];
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?0e172c7c33672571bafff2560ad0a051";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    }
})();
