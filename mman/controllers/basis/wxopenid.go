package basis

import (
	ctrl "mman/controllers"
	"net/http"
	//"mrten/models"
	//"web/util"
)

func WxOpenIDHandlers() {
	ctrl.HMAP["/basis/wxopenid/get_wxopenid"] = GetWxOpenID // 部门
}

func GetWxOpenID(w http.ResponseWriter, r *http.Request) {
	/*eng := models.GetEngine()
	tables:=&models.Department{}
	util.FormParse(r,tables,2)
	affected,err:=eng.Insert(tables{
		"name":tables.Name,"is_allied":tables.IsAllied,"intro":tables.Intro,"active":tables.Active,"dept_type":tables.DeptType,
		"status":tables.Status,"supervisor":tables.Supervisor,"open_end":tables.OpenEnd,"open_start":tables.OpenStart})
	if err!=nil{
		panic(err)
		w.Write([]byte(`{"res":-1,'err':'数据库错误"}`))
	}
	if affected==0{
		w.Write([]byte(`{"res":0,'err':'找不到这条数据"}`))
	}else {
		w.Write([]byte(`{"res":1,'err':'修改成功"}`))
	}*/
}
