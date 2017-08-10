package basis

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"web/schema"
	ss "web/session"
)

func SubdistrictHandlers() {
	ctrl.HMAP["/basis/subdistrict/get"] = getSubdistrict
	ctrl.HMAP["/basis/subdistrict/update"] = updateSubdistrict
	ctrl.HMAP["/basis/subdistrict/insert"] = insertSubdistrict
	ctrl.HMAP["/basis/subdistrict/getbyname"] = getSubdistrictByName
	ctrl.HMAP["/basis/subdistrict/delete"] = deleteSubdistrict
}

type SubdistrictDistrict struct {
	models.Subdistrict `xorm:"extends"`
	models.District    `xorm:"extends"`
}

func (SubdistrictDistrict) TableName() string {
	return "subdistrict"
}

func getSubdistrict(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	var tables []SubdistrictDistrict
	table := new(SubdistrictDistrict)
	n := schema.JoindQuery(eng, r, []string{ "subdistrict.district","subdistrict.id", "district.province", "district.city",
		"district.district", "subdistrict.name", "subdistrict.memo"}, &tables, table,
		[][]string{{"INNER", "district", "subdistrict.district = district.id"}})
	fs := `[%d,%d,"%s","%s","%s","%s","%s"],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs,  u.Subdistrict.District,u.Subdistrict.Id, u.District.Province, u.District.City, u.District.District,
			u.Subdistrict.Name, u.Subdistrict.Memo)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func updateSubdistrict(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.Subdistrict{}
	schema.FormParse(r, tables)
	affected, err := eng.Table(new(models.Subdistrict)).Id(tables.Id).Update(map[string]interface{}{
		"name": tables.Name, "memo": tables.Memo})
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"更新失败，请检查信息"}`))
		Logger.Error(err)
		return
	}
	if affected == 0 {
		w.Write([]byte(`{"res":-1,"msg":"更新失败，请检查信息"}`))
		return
	}
		w.Write([]byte(`{"res":0,"msg":"修改成功"}`))
}

func insertSubdistrict(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.Subdistrict{}
	schema.FormParse(r, tables)
	affected, err := eng.InsertOne(tables)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"新增失败，请检查信息"}`))
		Logger.Error(err)
		return
	}
	if affected == 0 {
		w.Write([]byte(`{"res":-1,"msg":"新增失败，请检查信息"}`))
		return
	}
		w.Write([]byte(`{"res":0,"msg":"插入成功"}`))
}

func getSubdistrictByName(w http.ResponseWriter, r *http.Request) {
	var sub []SubdistrictDistrict
	tables := &models.Subdistrict{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	sess := eng.AllCols()
	fmt.Println(tables.Name)
	sess = sess.Join("INNER", "district", "subdistrict.district = district.id")
	sess = sess.Where("subdistrict.name like ?", "%"+tables.Name+"%")
	e := sess.Find(&sub)
	if e != nil {
		w.Write([]byte(`{"res":-1,"msg":"查询失败"}`))
	}
	fmt.Println(sub)
	fs := `[%d,"%s","%s","%s","%s","%s"],`
	s := ""
	for _, u := range sub {
		s += fmt.Sprintf(fs, u.Subdistrict.Id, u.District.Province, u.District.City, u.District.District,
			u.Subdistrict.Name, u.Subdistrict.Memo)
	}
	fs = `{"subdistrict":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))

}


func deleteSubdistrict(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables :=  &models.Subdistrict{}
	schema.FormParse(r, tables)
	affected, err := eng.Where("id = ?",tables.Id).Delete(tables)
	if err != nil || affected < 1 {
		w.Write([]byte(`{"res":-1,"msg":"删除小区信息失败"}`))
		return
	}
		w.Write([]byte(`{"res":0,"msg":"删除小区信息成功"}`))

}
