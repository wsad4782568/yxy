package basis

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"web/schema"
  ss "web/session"
)

func MemberHandlers() {
  ctrl.HMAP["/basis/member/get"] = getMember // 获取会员
  ctrl.HMAP["/basis/member/update"] = updateMember // 修改会员
  ctrl.HMAP["/basis/member/delete"] = deleteMember // 删除
  ctrl.HMAP["/basis/member/insert"] = insertMember // 删除

}

func getMember(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	var memb []models.MemberType
  err := eng.Asc("grade").Find(&memb)
  if err != nil || len(memb) < 1 {
    w.Write([]byte(`{"res":-1,"msg":"查询错误！"}`))
    return
  }
  fs := `[%d,"%s",%d,%d,%d,%d],`
	s := ""
	for _, u := range memb {
		s += fmt.Sprintf(fs, u.Id, u.Name, u.Discount, u.SatisfyMoney, u.SatisfyScores, u.Grade)
	}
	fs = `{"member":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs,  s)))
}


func updateMember(w http.ResponseWriter, r *http.Request) {
  defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.MemberType{}
	schema.FormParse(r, tables)
  count, err := eng.Where("grade = ?",tables.Grade).And("id != ?",tables.Id).Count(&models.MemberType{})
  if count > 0 || err != nil{
    w.Write([]byte(`{"res":-1,"msg":"不能有相同等级的会员"}`))
    return
  }
	affected, err := eng.Id(tables.Id).Update(tables)
	if err != nil {
		Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	if affected == 0 {
		w.Write([]byte(`{"res":-1,"msg":"找不到这条数据"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))

}

func deleteMember(w http.ResponseWriter, r *http.Request) {
  defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.MemberType{}
	schema.FormParse(r, tables)
	affected, err := eng.Id(tables.Id).Delete(tables)
	if err != nil {
		Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	if affected == 0 {
		w.Write([]byte(`{"res":-1,"msg":"找不到这条数据"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"删除成功"}`))

}


func insertMember(w http.ResponseWriter, r *http.Request) {
  defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.MemberType{}
	schema.FormParse(r, tables)
  count, err := eng.Where("grade = ?",tables.Grade).Count(tables)
  if count > 0 || err != nil{
    w.Write([]byte(`{"res":-1,"msg":"不能有相同等级的会员"}`))
    return
  }
	affected, err := eng.InsertOne(tables)
	if err != nil {
		Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	if affected == 0 {
		w.Write([]byte(`{"res":-1,"msg":"找不到这条数据"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"新增成功"}`))

}
