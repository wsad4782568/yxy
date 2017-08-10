## 初始化
table对象
调用：
```
t = new tbl()
t.funcs.loadData.call(t)
```

## 行操作及多行操作定义
```
row_actions =[{cls:"doerow",func:function(){var data=this.getAttribute("data-rowno"); alert(data)},title:"do"},
{cls:"dorow",func:function(){var data=this.getAttribute("data-rowno"); alert("e"+data)},title:"doe"}]


rows_actions = [{
func:function(tbl,rows){

	alert(rows.length)
	if(rows.length>0) alert(tbl["data"][rows[0]][1])
},title:"do"},{
func:function(tbl){

	alert(tbl["pgSize"])
},title:"pgsize"}]
```
## 列定义
```
coldefs = [{ seq:0,//在数据[[],[]]中的位置rows[i][seq] 返回值
render:function(v){ return v%2==0? 0:v},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
sortable:true, // 可排序 function
retrievable: false, // 可检索 function
title:"序号", // 列标题
visible:true, //是否可见

checkall:false,// 是否可全选
prefix:"my", // 前缀，自定义本列独有的cls等，全选要
isID:1
},
{ seq:1,//在数据[[],[]]中的位置rows[i][seq] 返回值
render:function(item){return "<b>"+item+"</b>"},// 这里render是function，它可以组合或变换当前数据行，然后进行显示
sortable:true, // 可排序 function
retrievable: true, // 可检索 function
title:"姓名", // 列标题
visible:true, //是否可见

checkall:false,// 是否可全选
prefix:"myr", // 前缀，自定义本列独有的cls等，全选要
}
]
```
## 扩展行
```
//tblContainerID,coldefs,row_actions,rows_action,tblClass
ext_row = function(rows,i){
	return "this is row "+i
}
t.funcs.init.call(t,"my",
	coldefs,row_actions,rows_actions,"table","__THE__TABLE__",ext_row,"/u/test")
```
## 数据加载
```
t["data"] =[[8,"dsd"],[9,"   dsd"]]

```
