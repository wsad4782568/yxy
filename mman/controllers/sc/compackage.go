package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"time"
	"web/schema"
	ss "web/session"
)

func ComPackageHandlers() {
	ctrl.HMAP["/sc/conpackage/getcommoditys"] = getPackageCommoditys
	ctrl.HMAP["/sc/conpackage/getbyid"] = getPackageById
	ctrl.HMAP["/sc/conpackage/getstock"] = getPackageStock
	ctrl.HMAP["/sc/conpackage/getstockbyid"] = getPackageStockById
	ctrl.HMAP["/sc/conpackage/addamount"] = addPackageAmount
}

type packageExtend struct {
	StockId int     `schema:"stockid"`
	Name    string  `schema:"name"`
	Amount  float64 `schema:"amount"`
	Cdept   int     `schema:"cdept"`
	Status  int     `schema:"status"`
}

func getPackageCommoditys(w http.ResponseWriter, r *http.Request) {
	//
	staffdept := ss.HGet(r, "staff", "dept_id")
	dept := &models.Department{}
	eng := models.GetEngine()
	eng.Where("id = ?", staffdept).Get(dept)
	if dept.Supervisor == -1 {
		dept.Supervisor = dept.Id
	}
	spvs := strconv.Itoa(dept.Supervisor)
	var coms []models.Commodity
	com := new(models.Commodity)
	n := schema.ExtBasicQuery(eng, r, []string{"commodity.id", "commodity.name", "commodity.intro", "commodity.price", "commodity.specification",
		"commodity.commodity_type", "commodity.unit", "commodity.class_id"}, &coms, com,
		[]string{"commodity.dept = ?", "commodity.is_main_unit = ? ", "commodity.commodity_type = ?"}, []string{spvs, "1", "4"}, []string{"and", "and"})
	fmt.Println(coms)
	fs := `[%d,"%s","%s","%s",%d,"%s","%s","%s","%s","%s"],`
	s := ""
	for _, u := range coms {
		var barcode []models.Barcode
		eng.Where("commodity = ?", u.Id).Find(&barcode)
		codes := ""
		for _, c := range barcode {
			codes += c.Code + ","
		}
		s += fmt.Sprintf(fs, u.Id, u.Name, u.ClassCode, u.Intro, u.Price,
			u.Specification, u.Unit, u.ClassId, u.CommodityNo, codes)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getPackageById(w http.ResponseWriter, r *http.Request) {
	//
	tables := &models.Commodity{}
	schema.FormParse(r, tables)
	fmt.Println(tables.Id)
	var cmrel []ComRelMore1
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess = sess.Join("INNER", "commodity", "commodity_rel.comm_b=commodity.id")
	sess = sess.Where("commodity_rel.comm_a = ?", tables.Id).And("rel_type = ?", 5)
	e := sess.Find(&cmrel)
	if e != nil {
		fmt.Println(e)
	}
	if len(cmrel) < 1 {
		w.Write([]byte(`{"res":-1,"msg":"没有组合套餐"}`))
		return
	}
	fst := `[%d,"%s",%d,"%s","%s",%d,%d,%f,%d,"%s"],`
	t := ""
	for _, u := range cmrel {
		var barcode []models.Barcode
		eng.Where("commodity = ?", u.Commodity.Id).Find(&barcode)
		codes := ""
		for _, c := range barcode {
			codes += c.Code + ","
		}
		t += fmt.Sprintf(fst, u.Commodity.Id, u.Commodity.Name, u.Commodity.Price,
			u.Commodity.Specification, u.Commodity.Unit, u.CommodityRel.IsExclusive, u.CommodityRel.Id, u.CommodityRel.Amount, u.Commodity.IsMainUnit, codes)
	}
	fst = `{"freegift":[%s]}`
	w.Write([]byte(fmt.Sprintf(fst, t)))
}

func getPackageStock(w http.ResponseWriter, r *http.Request) {
	//复杂查询
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
	dept := strconv.Itoa(queryob.Cq_dept)
	eng := models.GetEngine()
	var tables []StockMore
	table := new(StockMore)
	n := schema.ExtJoindQuery(eng, r, []string{"stock.id", "commodity.name", "stock.amount", "stock.off_shelf", "stock.minimum",
		"stock.standard_amount", "stock.recommended", "stock.price", "stock.price_onsale", "stock.online_sale", "stock.preorder_stock", "stock.warn_stock",
		"stock.available_amount", "stock.stock_type", "stock.unit", "commodity.specification", "stock.commodity", "commodity.class_id", "stock.home_page"}, &tables, table,
		[][]string{{"INNER", "commodity", "stock.commodity = commodity.id"}},
		[]string{"stock.dept = ?", "commodity.commodity_type = ?", "stock_type"}, []string{dept, "4", units}, []string{"and", "in"})
	fs := `[%d,"%s",%f,%d,%f,%f,%d,%d,%d,%d,%f,%f,%f,%d,"%s","%s",%d,"%s",%d,"%s","%s"],`
	s := ""
	for _, u := range tables {
		file := &models.CommodityFile{}
		file.Commodity = u.Stock.Commodity
		eng.Get(file)
		var barcode []models.Barcode
		eng.Where("commodity = ?", u.Stock.Commodity).Find(&barcode)
		codes := ""
		for _, c := range barcode {
			codes += c.Code + ","
		}
		s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Amount, u.Stock.OffShelf, u.Stock.Minimum, u.Stock.StandardAmount, u.Stock.Recommended, u.Stock.Price,
			u.Stock.PriceOnsale, u.Stock.OnlineSale, u.Stock.PreorderStock, u.Stock.WarnStock, u.Stock.AvailableAmount, u.Stock.StockType, u.Stock.Unit,
			u.Commodity.Specification, u.Stock.Commodity, u.Commodity.ClassId, u.Stock.HomePage, codes, file.FileKey)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getPackageStockById(w http.ResponseWriter, r *http.Request) {
	//
	tables := &models.Stock{}
	schema.FormParse(r, tables)
	var cmrel []ComRelMore
	eng := models.GetEngine()
	has, err := eng.Get(tables)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"组合商品信息有误"}`))
		return
	}
	fmt.Println(tables)
	sess := eng.AllCols()
	sess = sess.Join("INNER", "commodity", "commodity_rel.comm_b=commodity.id")
	sess = sess.Join("INNER", "stock", "commodity_rel.comm_b=stock.commodity")
	sess = sess.Where("commodity_rel.comm_a = ?", tables.Commodity).And("rel_type = ?", 5).And("stock.dept = ?", tables.Dept)
	e := sess.Find(&cmrel)
	if e != nil {
		fmt.Println(e)
	}
	if len(cmrel) < 1 {
		w.Write([]byte(`{"res":-1,"msg":"没有组合套餐"}`))
		return
	}
	fst := `[%d,"%s",%d,"%s","%s",%d,%d,%f,%d,%d,"%s"],`
	t := ""
	for _, u := range cmrel {
		var barcode []models.Barcode
		eng.Where("commodity = ?", u.Stock.Commodity).Find(&barcode)
		codes := ""
		for _, c := range barcode {
			codes += c.Code + ","
		}
		t += fmt.Sprintf(fst, u.Stock.Id, u.Commodity.Name, u.Commodity.Price,
			u.Commodity.Specification, u.Commodity.Unit, u.CommodityRel.IsExclusive,
			u.CommodityRel.Id, u.CommodityRel.Amount, u.Commodity.IsMainUnit, u.Commodity.Id, codes)
	}
	fst = `{"freegift":[%s]}`
	w.Write([]byte(fmt.Sprintf(fst, t)))
}

func addPackageAmount(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &packageExtend{}
	schema.FormParse(r, tables)
	var cmrel []ComRelMore
	stk := &models.Stock{}
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	has, err := session.Where("id = ?", tables.StockId).Get(stk)
	if !has || err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"组合商品信息有误"}`))
		return
	}
	changeAmountMsg := ""
	if tables.Status == 1 { //增加
		stk.Amount += tables.Amount
		changeAmountMsg = "增加"
	} else { //减少
		stk.Amount -= tables.Amount
		changeAmountMsg = "减少"
		if stk.Amount < 0 {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"组合商品数量不足"}`))
			return
		}
	}

	_, err = session.Query("UPDATE stock SET amount = ? WHERE id = ?  ", stk.Amount, stk.Id)
	if err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"` + changeAmountMsg + `组合商品数量失败"}`))
		Logger.Error(err)
		return
	}

	sess := eng.AllCols()
	sess = sess.Join("INNER", "commodity", "commodity_rel.comm_b=commodity.id")
	sess = sess.Join("INNER", "stock", "commodity_rel.comm_b=stock.commodity")
	sess = sess.Where("commodity_rel.comm_a = ?", stk.Commodity).And("rel_type = ?", 5).And("stock.dept = ?", stk.Dept)
	e := sess.Find(&cmrel)
	if e != nil {
		session.Rollback()
		Logger.Error(e)
		w.Write([]byte(`{"res":-1,"msg":"获取其他商品信息有误，` + changeAmountMsg + `失败"}`))
		return
	}
	if len(cmrel) < 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"没有组合套餐"}`))
		return
	}
	staffid, err := strconv.Atoi(ss.HGet(r, "staff", "staff_id"))
	if err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"员工登录超时"}`))
		return
	}
	for _, u := range cmrel {
		var reduce_amount float64
		if tables.Status == 1 {
			reduce_amount = u.Stock.Amount - tables.Amount*u.CommodityRel.Amount //最后的数量等于 原来的减去 （rel中固定的×组合商品新增数量 ）
			if reduce_amount < 0 {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"` + u.Commodity.Name + `的数量不足"}`))
				return
			}
		} else {
			reduce_amount = u.Stock.Amount + tables.Amount*u.CommodityRel.Amount
		}
		_, err = session.Query("UPDATE stock SET amount = ? WHERE id = ?  ", reduce_amount, u.Stock.Id)
		if err != nil {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"` + u.Commodity.Name + `的数量修改失败"}`))
			Logger.Error(err)
			return
		}
		if tables.Status == 1 {
			change := &models.StockChange{}
			change.Amount = tables.Amount * u.CommodityRel.Amount
			change.ChangeType = 12
			change.Stock = u.Stock.Id
			change.Reason = "转换成" + tables.Name
			change.CheckedBy = staffid
			change.Created = time.Now().Unix()
			change.Operator = staffid
			change.RelId = tables.StockId
			affected, err := session.InsertOne(change)
			if affected != 1 || err != nil {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"记录` + u.Commodity.Name + `的数量修改失败"}`))
				Logger.Error(err)
				return
			}
		}

	}
	if tables.Status == 2 {
		change := &models.StockChange{}
		change.Amount = tables.Amount
		change.ChangeType = 13
		change.Stock = tables.StockId
		change.Reason = "拆分成其他商品"
		change.CheckedBy = staffid
		change.Created = time.Now().Unix()
		change.Operator = staffid
		change.RelId = tables.StockId
		affected, err := session.InsertOne(change)
		if affected != 1 || err != nil {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"记录` + tables.Name + `的数量修改失败"}`))
			Logger.Error(err)
			return
		}
	}
	err = session.Commit()
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		Logger.Error(err)
		return
	}
	if tables.Status == 2 {
		w.Write([]byte(`{"res":0,"msg":"减少数量成功"}`))
	} else {
		w.Write([]byte(`{"res":0,"msg":"增加数量成功"}`))

	}
}
