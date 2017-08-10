package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"web/schema"
	ss "web/session"
)

func FreeGiftHandlers() {
	ctrl.HMAP["/sc/freegift/getcommoditys"] = getFreeGiftCommoditys
	ctrl.HMAP["/sc/freegift/getbyid"] = getGiftById
}
func getFreeGiftCommoditys(w http.ResponseWriter, r *http.Request) {
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	units := ""
	if queryob.Cq_unit[0] == 1 {
		units = "1,2,3,4,"
	} else {
		for i := 1; i < len(queryob.Cq_unit); i++ {
			if queryob.Cq_unit[i] == 1 {
				units = units + strconv.Itoa(i) + ","
			}
		}
	}
	units = units[0 : len(units)-1]
	staffdept := ss.HGet(r, "staff", "dept_id")
	dept := &models.Department{}
	eng := models.GetEngine()
	eng.Where("id = ?", staffdept).Get(dept)
	if dept.Supervisor == -1 {
		dept.Supervisor = dept.Id
	}
	spvs := strconv.Itoa(dept.Supervisor)
	var coms []ComRelMore
	com := new(ComRelMore)
	n := schema.ExtJoindQuery(eng, r, []string{"commodity.id", "commodity.name", "commodity.class_code", "commodity.commodity_no", "commodity.price", "commodity.specification",
		"commodity.commodity_type", "commodity.unit", "commodity.class_id", "commodity.is_main_unit"}, &coms, com,
		[][]string{{"INNER", "commodity", "commodity_rel.comm_a = commodity.id"}},
		[]string{"commodity.dept = ?", "commodity_rel.rel_type = ?", "is_main_unit"}, []string{spvs, "4", units}, []string{"and", "in"})
	fs := `[%d,"%s","%s","%s",%d,"%s","%s","%s",%d,"%s"],`
	s := ""
	for _, u := range coms {
		var barcode []models.Barcode
		eng.Where("commodity = ?", u.CommodityRel.Id).Find(&barcode)
		codes := ""
		for _, c := range barcode {
			codes += c.Code + ","
		}
		s += fmt.Sprintf(fs, u.CommodityRel.Id, u.Commodity.Name, u.Commodity.ClassCode, u.Commodity.CommodityNo, u.Commodity.Price,
			u.Commodity.Specification, u.Commodity.Unit, u.Commodity.ClassId, u.Commodity.IsMainUnit, codes)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getGiftById(w http.ResponseWriter, r *http.Request) {
	//
	tables := &models.Commodity{}
	schema.FormParse(r, tables)
	fmt.Println(tables.Id)
	var cmrel []ComRelMore1
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess = sess.Join("INNER", "commodity", "commodity_rel.comm_b=commodity.id")
	sess = sess.Where("commodity_rel.comm_a = ?", tables.Id).And("rel_type = ?", 4)
	e := sess.Find(&cmrel)
	if e != nil {
		fmt.Println(e)
	}
	if len(cmrel) < 1 {
		w.Write([]byte(`{"res":-1,"msg":"没有赠送商品"}`))
		return
	}
	fst := `[%d,"%s",%d,"%s","%s",%f,%d,%d],`
	t := ""
	for _, u := range cmrel {
		t += fmt.Sprintf(fst, u.Commodity.Id, u.Commodity.Name, u.Commodity.Price,
			u.Commodity.Specification, u.Commodity.Unit, u.CommodityRel.Amount, u.CommodityRel.Id, u.Commodity.IsMainUnit)
	}
	fst = `{"freegift":[%s]}`
	w.Write([]byte(fmt.Sprintf(fst, t)))

}
