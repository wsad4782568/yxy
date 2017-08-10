
if(typeof(_e) == "undefined") {
_e = {}
}
_e["genForm"] = function(coldefs){

     /* name:"isonline",//和后端对应，FormData里面的key，后端解析时要一致
      type:0,////-1:不可见 0:input 1:select 2:不可修改input 3:不可修改select（需要跨表转换时）
      data:[]//为select时，这里为需要传入的数据,others里面  如商品，这里应该为商品种类对应的id和name   参考下面种类列*/
  var dlgMain = ""
  if(coldefs.length < 5){
    dlgMain = '<form class="smallform clear">'
  }else{
    dlgMain = '<form class="bigform clear">'
  }
  for(var i=0; i<coldefs.length; i++){
    switch (coldefs[i].type) {//-1:不可见 0:input 1:select 2:不可修改input 3:不可修改select（需要跨表转换时）
      case -1:
        dlgMain += "<div class='form-input' style='display: none'>"+"<div class='form-name'>"+coldefs[i].title +"</div>"+"<input type='text' class='form-data' name='"+coldefs[i].name+"'></div>"
        break;
      case 0:
        dlgMain += "<div class='form-input'>"+"<div class='form-name'>"+coldefs[i].title +"</div>"+"<input type='text' class='form-data' name='"+coldefs[i].name+"'></div>"
        break;
      case 1:
        dlgMain += "<div class='form-select' style='float:left'><div class='form-name'>"+coldefs[i].title +"</div><select class='form-data' name='"+coldefs[i].name+"'>"
          for(var j = 0 ; j < coldefs[i].data.length; j++){
            dlgMain += "<option value='"+coldefs[i].data[j][0]+"'>"+coldefs[i].data[j][1]+"</option>"
          }
        dlgMain +="</select></div>"
        break;
      case 2:
        dlgMain += "<div class='form-input'>"+"<div class='form-name'>"+coldefs[i].title +"（不可修改）</div>"+"<input readOnly='true' type='text' class='form-data' name='"+coldefs[i].name+"'></div>"
        break;
      case 3:
        dlgMain += "<div class='form-select' style='float:left'><div class='form-name'>"+coldefs[i].title +"（不可修改）</div><select class='form-data' name='"+coldefs[i].name+"' disabled='disabled'>"
        for(var j = 0 ; j < coldefs[i].data.length; j++){
          dlgMain += "<option value='"+coldefs[i].data[j][0]+"'>"+coldefs[i].data[j][1]+"</option>"
        }
          
        dlgMain +="</select></div>"
        break;
    }
  }
  dlgMain += "</from>"
  return dlgMain
}