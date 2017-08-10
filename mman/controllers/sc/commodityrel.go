package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"web/redi"
	"web/schema"
	ss "web/session"
)

func CommodityRelHandlers() {
	ctrl.HMAP["/sc/commodityrel/insert"] = makeComRel
	ctrl.HMAP["/sc/commodityrel/newpackage"] = makeNewComPackage
	ctrl.HMAP["/sc/commodityrel/getUnitbyStk"] = getUnitbyStk
	ctrl.HMAP["/sc/commodityrel/updateamount"] = updateComRelAmount
	ctrl.HMAP["/sc/commodityrel/deleterel"] = deleteComRel
	ctrl.HMAP["/sc/commodityrel/getUnitbysubCom"] = getUnitbysubCom
	ctrl.HMAP["/sc/commodityrel/getbycom"] = getComRelbyCom

}

type ComRelMore struct {
	models.CommodityRel `xorm:"extends"`
	models.Commodity    `xorm:"extends"`
	models.Stock        `xorm:"extends"`
}

func (ComRelMore) TableName() string {
	return "commodity_rel"
}

type ComRelMore1 struct {
	models.CommodityRel `xorm:"extends"`
	models.Commodity    `xorm:"extends"`
}

func (ComRelMore1) TableName() string {
	return "commodity_rel"
}

type CommodityPackage struct {
	Name          string    `schema:"name"`
	Intro         string    `schema:"intro"`
	Price         int       `schema:"price"`
	Specification string    `schema:"specification"`
	Unit          string    `schema:"unit"`
	ClassId       string    `schema:"classid"`
	Commodityid   []int     `schema:"commodityid"`
	Amount        []float64 `schema:"amount"`
	Cdept         int       `schema:"cdept"`
}

func getComRelbyCom(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id := r.FormValue("id")
	var cmrel []ComRelMore1
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess = sess.Join("INNER", "commodity", "commodity_rel.comm_b=commodity.id")
	sess = sess.Where("commodity_rel.comm_a = ?", id).In("rel_type", 4, 5, 6, 7)
	e := sess.Find(&cmrel)
	if e != nil {
		fmt.Println(e)
	} else {
		if len(cmrel) < 1 {
			w.Write([]byte(`{"res":-1,"msg":"没有其他商品关系"}`))
			return
		}
		fst := `[%d,%d,%d,%f,"%s","%s","%s",%d,%d],`
		t := ""
		for _, u := range cmrel {
			t += fmt.Sprintf(fst, u.CommodityRel.Id, u.CommodityRel.CommB, u.CommodityRel.RelType, u.CommodityRel.Amount,
				u.Commodity.Name, u.Commodity.Specification, u.Commodity.Unit, u.CommodityRel.IsExclusive, u.Commodity.IsMainUnit)
		}
		fst = `{"commodityrel":[%s]}`
		w.Write([]byte(fmt.Sprintf(fst, t)))
	}

}
func makeNewComPackage(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &CommodityPackage{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	comToDept := &models.Commodity{}
	session.Where("id = ?", tables.Commodityid[0]).Get(comToDept) //找到该部门
	newcoms := &models.Commodity{}
	newcoms.Name = tables.Name
	newcoms.Intro = tables.Intro
	newcoms.Price = tables.Price
	newcoms.Specification = tables.Specification
	newcoms.Unit = tables.Unit
	newcoms.IsMainUnit = 1
	newcoms.CommodityType = 4
	newcoms.Dept = comToDept.Dept
	newcoms.ClassId = tables.ClassId
	newcoms.CommodityNo = redi.GetComNo()
	affected, err := session.InsertOne(newcoms)
	if err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		Logger.Error(err)
		return
	}
	if affected != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}
	for i := 0; i < len(tables.Commodityid); i++ {
		rel := &models.CommodityRel{}
		rel.CommA = newcoms.Id
		rel.CommB = tables.Commodityid[i]
		rel.RelType = 5
		rel.Amount = tables.Amount[i]
		affected, err := session.Insert(rel)
		if err != nil {
			session.Rollback()
			Logger.Error(err)
			w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
			return
		}
		if affected != 1 {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
			return
		}
	}
	err = session.Commit()
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		Logger.Error(err)
		return
	}
	w.Write([]byte(`{"res":0,"msg":"新增组合商品成功"}`))
}

func getUnitbyStk(w http.ResponseWriter, r *http.Request) {
	//
	r.ParseForm()
	id, _ := strconv.Atoi(r.FormValue("id"))
	comm := &models.Commodity{}
	var cmrel []StockMore
	fst := `[%d,%d,%f,"%s",%d,"%s",%d,%d],`
	t := ""
	eng := models.GetEngine()
	stk := &models.Stock{}
	stk.Id = id
	has, err := eng.Get(stk)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"检索商品信息失败"}`))
		return
	}
	comm.Id = stk.Commodity
	has, err = eng.Get(comm)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"检索商品信息失败"}`))
		return
	}
	sess := eng.AllCols()
	sess = sess.Join("INNER", "commodity", "commodity.id=stock.commodity")
	sess = sess.Where("commodity.commodity_no = ?", comm.CommodityNo).And("stock.dept = ?", stk.Dept).And("commodity.is_main_unit > -1")
	e := sess.Find(&cmrel)
	if e != nil {
		panic(e)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	for _, u := range cmrel {
		t += fmt.Sprintf(fst, u.Commodity.Id, u.Commodity.IsMainUnit, u.Stock.Amount, u.Commodity.Unit, u.Stock.Id,
			u.Commodity.Specification, u.Stock.Price, u.Stock.PriceOnsale)
	}
	fst = `{"commodityunit":[%s]}`
	w.Write([]byte(fmt.Sprintf(fst, t)))
}

func getUnitbysubCom(w http.ResponseWriter, r *http.Request) {
	//
	r.ParseForm()
	id, _ := strconv.Atoi(r.FormValue("id"))
	comm := &models.Commodity{}
	staffdept := ss.HGet(r, "staff", "dept_id")
	var cmrel []ComRelMore
	fst := `[%d,%d,%f,"%s",%d,"%s"],`
	t := ""
	eng := models.GetEngine()
	comm.Id = id
	eng.Get(comm)
	if comm.IsMainUnit == 1 {
		id = comm.Id
	} else {
		commrel := &models.CommodityRel{}
		commrel.CommB = comm.Id
		commrel.RelType = comm.IsMainUnit - 1
		eng.Get(commrel)
		id = commrel.CommA
	}
	sess := eng.AllCols()
	sess = sess.Join("INNER", "commodity", "commodity_rel.comm_a=commodity.id")
	sess = sess.Join("INNER", "stock", "commodity.id=stock.commodity")
	sess = sess.Where("commodity.id = ?", id).And("stock.dept = ?", staffdept).Limit(1, 0)
	_ = sess.Find(&cmrel)
	if len(cmrel) < 1 {
		w.Write([]byte(`{"res":-1,"msg":"` + comm.Name + ` 没有其他单位"}`))
		return
	}
	cmrel[0].CommodityRel.RelType = 0
	sess = sess.Join("INNER", "commodity", "commodity_rel.comm_b=commodity.id")
	sess = sess.Join("INNER", "stock", "commodity.id=stock.commodity")
	sess = sess.Where("commodity_rel.comm_a = ?", id).And("stock.dept = ?", staffdept).In("rel_type", 1, 2, 3)
	e := sess.Find(&cmrel)
	if e != nil {
		panic(e)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	for _, u := range cmrel {
		t += fmt.Sprintf(fst, u.Commodity.Id, u.CommodityRel.RelType+1, u.Stock.Amount, u.Commodity.Unit, u.Stock.Id, u.Commodity.Specification)
	}
	fst = `{"commodityunit":[%s]}`
	w.Write([]byte(fmt.Sprintf(fst, t)))
}

func makeComRel(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &models.CommodityRel{}
	schema.FormParse(r, tables)
	fmt.Println(tables)
	var cm2 []models.CommodityRel
	eng := models.GetEngine()
	eng.Where("comm_a = ?", tables.CommA).And("comm_b = ?", tables.CommB).And("rel_type = ?", tables.RelType).Find(&cm2)
	if len(cm2) > 0 && (cm2[0].RelType == 6 || cm2[0].RelType == 7) {
		w.Write([]byte(`{"res":-1,'res':'已存在该关系"}`))
		return
	}
	affected, err := eng.InsertOne(tables)
	if err != nil {
		Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}

	w.Write([]byte(`{"res":0,"msg":"插入成功"}`))
}

func updateComRelAmount(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &models.CommodityRel{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	affected, err := eng.Table(new(models.CommodityRel)).Id(tables.Id).Update(tables)
	if err != nil {
			Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))

}
func deleteComRel(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &models.CommodityRel{}
	schema.FormParse(r, tables)
	fmt.Println(tables)
	eng := models.GetEngine()
	//var cmrel []models.CommodityRel
	affected, err := eng.Where("id = ?", tables.Id).Delete(&models.CommodityRel{})
	if err != nil {
		Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"删除失败"}`))
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"找不到这条数据"}`))
	} else {
		w.Write([]byte(`{"res":0,"msg":"删除成功"}`))
	}
}
