package basis

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	ss "web/session"
	"web/schema"
)

func DistrictHandlers() {
	ctrl.HMAP["/basis/district/get"] = getDistrict           // 地址
	ctrl.HMAP["/basis/district/update"] = updateDistrict     // 地址
	ctrl.HMAP["/basis/district/insert"] = insertDistrict     // 地址
	ctrl.HMAP["/basis/district/getbydis"] = getDistrictByDis // 地址
}

func getDistrict(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	var tables []models.District
	table := new(models.District)
	n := schema.BasicQuery(eng, r, []string{"id", "province", "city", "district", "zip"}, &tables, table)
	fs := `[%d,"%s","%s","%s","%s"],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Id, u.Province, u.City, u.District, u.Zip)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}
func updateDistrict(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.District{}
	schema.FormParse(r, tables)
	affected, err := eng.Table(new(models.District)).Id(tables.Id).Update(map[string]interface{}{
		"province": tables.Province, "city": tables.City, "district": tables.District, "zip": tables.Zip})
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		Logger.Error(err)
		return
	}
	if affected == 0 {
		w.Write([]byte(`{"res":-1,"msg":"找不到这条数据"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))

}

func insertDistrict(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.District{}
	schema.FormParse(r, tables)
	affected, err := eng.Insert(tables)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		Logger.Error(err)
		return
	}
	if affected == 0 {
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}
		w.Write([]byte(`{"res":0,"msg":"插入成功"}`))
}

func getDistrictByDis(w http.ResponseWriter, r *http.Request) {
	var dis []models.District
	tables := &models.District{}
	schema.FormParse(r, tables)
	fmt.Println(tables)
	eng := models.GetEngine()
	eng.Where("district like ?", "%"+tables.District+"%").Find(&dis)
	fs := `[%d,"%s","%s","%s"],`
	t := ""
	fmt.Println(dis)
	for _, u := range dis {
		t += fmt.Sprintf(fs, u.Id, u.Province, u.City, u.District)
	}
	fs = `{"district":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, t)))

}
