package basis

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"web/schema"
	ss "web/session"
)

func DeliveryTypeHandlers() {
	ctrl.HMAP["/basis/deliverytype/get"] = getDeliveryType
	// ctrl.HMAP["/basis/deliverytype/getext"] = getDeliveryTypeExtend
	ctrl.HMAP["/basis/deliverytype/update"] = updateDeliveryType
	ctrl.HMAP["/basis/deliverytype/insert"] = insertDeliveryType
	ctrl.HMAP["/basis/deliverytype/delete"] = deleteDeliveryType
}

type DeliveryTypeSubdistrict struct {
	models.DeliveryType `xorm:"extends"`
	models.Subdistrict  `xorm:"extends"`
}

func (DeliveryTypeSubdistrict) TableName() string {
	return "delivery_type"
}

// func getDeliveryTypeExtend(w http.ResponseWriter, r *http.Request) {
// 	var sub []models.Department
// 	_ = models.ExtQuery([]string{"id", "name"}, &sub, "dept_type = ?", 1)
// 	eng := models.GetEngine()
// 	staffdept := ss.HGet(r, "staff", "dept_id")
// 	dept := &models.Department{}
// 	eng := models.GetEngine()
// 	eng.Where("id = ?", staffdept).Get(dept)
// 	if dept.Supervisor == -1 {
// 		dept.Supervisor = dept.Id
// 	}
// 	spvs := strconv.Itoa(dept.Supervisor)
// 	eng.in("dept_type",1,3,8).Where("")
// 	fs := `[%d,"%s"],`
// 	t := ""
// 	for _, u := range sub {
// 		t += fmt.Sprintf(fs, u.Id, u.Name)
// 	}
// 	fs = `{"dept":[%s]}`
// 	w.Write([]byte(fmt.Sprintf(fs, t)))
// }

func getDeliveryType(w http.ResponseWriter, r *http.Request) {
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	dept := strconv.Itoa(queryob.Cq_dept)
	eng := models.GetEngine()
	var tables []DeliveryTypeSubdistrict
	table := new(DeliveryTypeSubdistrict)
	n := schema.ExtJoindQuery(eng, r, []string{"delivery_type.id", "delivery_type.dept", "subdistrict.name",
		"delivery_type.delivery_fee", "delivery_type.delivery_time", "delivery_type.free_delivery_threshold", "delivery_type.order_type"}, &tables, table,
		[][]string{{"INNER", "subdistrict", "delivery_type.subdistrict = subdistrict.id"}},
		[]string{"delivery_type.dept = ?"},
		[]string{dept}, []string{})
	fs := `[%d,%d,"%s",%d,%d,%d,%d],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.DeliveryType.Id, u.DeliveryType.Dept, u.Subdistrict.Name, u.DeliveryType.DeliveryFee,
			u.DeliveryType.DeliveryTime, u.DeliveryType.FreeDeliveryThreshold, u.DeliveryType.OrderType)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func updateDeliveryType(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.DeliveryType{}
	schema.FormParse(r, tables)
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

func insertDeliveryType(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	c_deptid, _ := strconv.Atoi(r.URL.Query().Get("cdept"))
	eng := models.GetEngine()
	tables := &models.DeliveryType{}
	schema.FormParse(r, tables)
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	for i := 0; i < len(tables.SubdistrictArr); i++ {
		dlvt := &models.DeliveryType{}
		newdlvt := &models.DeliveryType{}
		newdlvt.Dept = c_deptid
		newdlvt.Subdistrict = tables.SubdistrictArr[i]
		newdlvt.DeliveryFee = tables.DeliveryFee
		newdlvt.DeliveryTime = tables.DeliveryTime
		newdlvt.FreeDeliveryThreshold = tables.FreeDeliveryThreshold
		newdlvt.OrderType = tables.OrderType
		Counts, err := session.Where("subdistrict = ?", newdlvt.Subdistrict).And("dept != ?", newdlvt.Dept).Count(dlvt)
		if err != nil {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"检索小区失败"}`))
			Logger.Error(err)
			return
		}
		if Counts > 0 {
			session.Rollback()
			sudit := &models.Subdistrict{}
			_, _ = eng.Where("id = ?", newdlvt.Subdistrict).Get(sudit)
			w.Write([]byte(`{"res":-1,"msg":"` + sudit.Name + `小区已被分配"}`))
			return
		}
		Counts, err = session.Where("subdistrict = ?", newdlvt.Subdistrict).And("dept = ?", newdlvt.Dept).Count(dlvt)
		if err != nil {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"检索部门下的小区失败"}`))
			Logger.Error(err)
			return
		}
		if Counts >= 2 {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"该部门下已存在该小区的两种配置"}`))
			return
		}
		if Counts == 1 {
			has, err := session.Where("subdistrict = ?", newdlvt.Subdistrict).And("dept = ?", newdlvt.Dept).Get(dlvt)
			if err != nil || !has {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"检索部门下的小区失败"}`))
				return
			}
			if dlvt.OrderType == tables.OrderType {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"已存在该种配送类型"}`))
				return
			}
		}
		affected, err := session.Insert(newdlvt)
		if err != nil {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
			Logger.Error(err)
			return
		}
		if affected == 0 {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
			return
		}
	}
	err = session.Commit()
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"插入成功"}`))
}

func deleteDeliveryType(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.DeliveryType{}
	schema.FormParse(r, tables)
	affected, err := eng.Where("id = ?", tables.Id).Delete(tables)
	if err != nil || affected < 1 {
		w.Write([]byte(`{"res":-1,"msg":"移除小区失败"}`))
		Logger.Error(err)
		return
	}
	w.Write([]byte(`{"res":0,"msg":"移除小区成功"}`))

}
