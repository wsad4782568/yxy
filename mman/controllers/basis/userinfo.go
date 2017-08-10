package basis

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"web/schema"
)

func UserHandlers() {
	ctrl.HMAP["/basis/userinfo/get"] = getUser // 用户
	//ctrl.HMAP["/basis/userinfo/update_userinfo"] =  updateUserInfo // 用户信息修改
}

type UserMore struct {
	models.UserInfo    `xorm:"extends"`
	models.Subdistrict `xorm:"extends"`
	models.District    `xorm:"extends"`
}

func (UserMore) TableName() string {
	return "user_info"
}

func getUser(w http.ResponseWriter, r *http.Request) {

	eng := models.GetEngine()
	var tables []UserMore
	table := new(UserMore)
	n := schema.JoindQuery(eng, r, []string{"user_info.id", "user_info.name", "user_info.avatar", "user_info.gender", "user_info.created", "user_info.email", "user_info.phone", "user_info.pwd",
		"subdistrict.name", "user_info.balance", "user_info.scores", "user_info.openid", "user_info.source"}, &tables, table,
		[][]string{{"INNER", "subdistrict", "user_info.subdistrict = subdistrict.id"},
			{"INNER", "district", "subdistrict.district = district.id"}})
	fs := `[%d,"%s","%s",%d,"%s","%s","%s","%s","%s",%d,%d,"%s","%s"],`
	s := ""
	for _, u := range tables {
		sdt := u.District.Province + u.District.City + u.District.District + u.Subdistrict.Name
		s += fmt.Sprintf(fs, u.UserInfo.Id, u.UserInfo.Name, u.UserInfo.Avatar, u.UserInfo.Gender,
			schema.IntToTimeStr(u.UserInfo.Created), u.UserInfo.Email, u.UserInfo.Phone, u.UserInfo.Pwd,
			sdt, u.UserInfo.Balance, u.UserInfo.Scores, u.UserInfo.Openid, u.UserInfo.Source)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

/*func updateUserInfo(w http.ResponseWriter, r *http.Request) {)
	eng := models.GetEngine()
	tables:=&models.UserInfo{}
	util.FormParse(r,tables,2)
	fmt.Print(tables)
	affected,err:=eng.Table(new(models.UserInfo)).Id(tables.Id).Update(map[string]interface{}{
		"name":tables.Name,"avatar":tables.Avatar,"gender":tables.Gender,"email":tables.Email,"phone":tables.Phone,
		"pwd":tables.Pwd,"subdistrict":tables.Subdistrict})
	if err!=nil{
		panic(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
	}
	if affected==0{
		w.Write([]byte(`{"res":-1,"msg":"找不到这条数据"}`))
	}else {
		w.Write([]byte(`{"res":0,"msg":"修改成功"}`))
	}
}*/
