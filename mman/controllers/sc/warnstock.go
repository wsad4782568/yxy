/*
descripiton:库存管理
author:team—a
created:2016-6-6
updated:2016-6-6
*/
package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	//"strconv"
	"time"
	"web/schema"
	ss "web/session"
)

func WarnStockHandlers() {
	ctrl.HMAP["/sc/warnstock/getbystock"] = getWarnStockById
	ctrl.HMAP["/sc/warnstock/get"] = getWarnStock
	ctrl.HMAP["/sc/warnstock/updatetime"] = updateWarnStockTime
	ctrl.HMAP["/sc/warnstock/updateamount"] = updateWarnStockAmount
}

type WarnStockMore struct {
	models.Stock      `xorm:"extends"`
	models.Commodity  `xorm:"extends"`
	models.Department `xorm:"extends"`
}

func (WarnStockMore) TableName() string {
	return "stock"
}
func getWarnStockById(w http.ResponseWriter, r *http.Request) {
	stk := &models.Stock{}
	schema.FormParse(r, stk)
	eng := models.GetEngine()
	has, err := eng.Where("id = ?", stk.Id).Get(stk)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		fmt.Println(err.Error())
		return
	}
	if !has {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	fst := `{"warnstock":[%f,"%s",%d,%f]}`
	if stk.WarnTime == 0 {
		w.Write([]byte(fmt.Sprintf(fst, stk.WarnStock, "0", 0)))
		return
	} else {
		expirationtime := schema.IntToTimeStr(stk.ExpirationTime)
		warntime := stk.WarnTime / 86400
		w.Write([]byte(fmt.Sprintf(fst, stk.WarnStock, expirationtime, warntime, stk.Minimum)))
		return
	}
}

type Warns struct {
	Id     int `schema:"id"`
	Status int `schema:"status"` // 检索库存不足,还是时间不足
	Cdept  int `schema:"cdept"`
}

func getWarnStock(w http.ResponseWriter, r *http.Request) {
	warns := &Warns{}
	dept := &models.Department{}
	schema.FormParse(r, warns)
	eng := models.GetEngine()
	has, err := eng.Where("id = ?", warns.Id).Get(dept)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		fmt.Println(err.Error())
		return
	}
	if !has {
		w.Write([]byte(`{"res":-1,"msg":"找不到该部门信息"}`))
		return
	}
	var stk []WarnStockMore
	sess := eng.AllCols()
	sess = sess.Join("INNER", "commodity", "stock.commodity=commodity.id")
	sess = sess.Join("INNER", "department", "stock.dept=department.id")
	if warns.Status == 1 {
		sess = sess.Where("stock.amount <= stock.warn_stock*2").And("stock.amount > 0")
	} else {
		tody := time.Now().Unix() + 86400*15  //当天的十天后
		oldday := time.Now().Unix() - 86400*3 //当天的三天前
		sess = sess.Where("stock.expiration_time > ?", oldday).And("stock.expiration_time < ?", tody).And("stock.warn_time > 0").Asc("stock.expiration_time")
	}
	if dept.Supervisor == -1 {
		sess = sess.And("commodity.dept = ?", dept.Id)
	} else {
		sess = sess.And("stock.dept = ?", dept.Id)
	}
	err2 := sess.Find(&stk)
	if err2 != nil {
		w.Write([]byte(`{"res":-1,"msg":"没有预警商品"}`))
		panic(err2)
		return
	}
	fs := `[%d,"%s",%f,%d,%f,%f,%d,%d,%d,%d,%f,%f,%f,%d,"%s","%s",%d,"%s",%d,"%s","%s","%s",%d,"%s"],`
	s := ""
	count := len(stk)
	for _, u := range stk {
		file := &models.CommodityFile{}
		file.Commodity = u.Stock.Commodity
		eng.Get(file)
		barcode := &models.Barcode{}
		barcode.Commodity = u.Stock.Commodity
		eng.Get(barcode)
		expirationtime := schema.IntToTimeStr(u.Stock.ExpirationTime)
		warntime := u.Stock.WarnTime / 86400
		s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Amount, u.Stock.OffShelf, u.Stock.Minimum, u.Stock.StandardAmount, u.Stock.Recommended, u.Stock.Price,
			u.Stock.PriceOnsale, u.Stock.OnlineSale, u.Stock.PreorderStock, u.Stock.WarnStock, u.Stock.AvailableAmount, u.Stock.StockType, u.Stock.Unit,
			u.Commodity.Specification, u.Stock.Commodity, u.Commodity.ClassId, u.Stock.HomePage, barcode.Code, file.FileKey, expirationtime, warntime, u.Department.Name)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, count, s)))
}


func updateWarnStockTime(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.Stock{}
	schema.FormParse(r, tables)
	_, err := eng.Query("UPDATE stock SET expiration_time = ?,warn_time = ? WHERE id = ?  ", tables.ExpirationTime,tables.WarnTime, tables.Id)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"修改失败"}`))
		Logger.Error(err)
		return
	}

	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))
}

func updateWarnStockAmount(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.Stock{}
	schema.FormParse(r, tables)
	_, err := eng.Query("UPDATE stock SET warn_stock = ? WHERE id = ?  ", tables.WarnStock, tables.Id)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"修改失败"}`))
		Logger.Error(err)
		return
	}

	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))
}
//func getWarnStock(w http.ResponseWriter, r *http.Request) {
//	dept := &models.Department{}
//	schema.FormParse(r, dept)
//	eng := models.GetEngine()
//	has, err := eng.Where("id = ?", dept.Id).Get(dept)
//	if err != nil {
//		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
//		fmt.Println(err.Error())
//		return
//	}
//	if !has {
//		w.Write([]byte(`{"res":-1,"msg":"找不到该部门信息"}`))
//		return
//	}
//	fmt.Println("dept is :", dept.Id, dept.Name)
//	var stk []WarnStockMore
//	sess := eng.AllCols()
//	sess = sess.Join("INNER", "commodity", "stock.commodity=commodity.id")
//	sess = sess.Join("INNER", "department", "stock.dept=department.id")
//	sess = sess.Where("stock.amount <= stock.warn_stock*2")
//	if dept.Supervisor == -1 {
//		sess = sess.And("commodity.dept = ?", dept.Id)
//	} else {
//		sess = sess.And("stock.dept = ?", dept.Id)
//	}
//	err2 := sess.Find(&stk)
//	if err2 != nil {
//		w.Write([]byte(`{"res":-1,"msg":"没有预警商品"}`))
//		panic(err2)
//		return
//	}
//	fs := `[%d,"%s",%f,%d,%f,%f,%d,%d,%d,%d,%f,%f,%f,%d,"%s","%s",%d,"%s",%d,"%s","%s","%s",%d,"%s"],`
//	s := ""
//	count := len(stk)
//	for _, u := range stk {
//		file := &models.CommodityFile{}
//		file.Commodity = u.Stock.Commodity
//		eng.Get(file)
//		expirationtime := schema.IntToTimeStr(u.Stock.ExpirationTime)
//		warntime := u.Stock.WarnTime / 86400
//		s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Amount, u.Stock.OffShelf, u.Stock.Minimum, u.Stock.StandardAmount, u.Stock.Recommended, u.Stock.Price,
//			u.Stock.PriceOnsale, u.Stock.OnlineSale, u.Stock.PreorderStock, u.Stock.WarnStock, u.Stock.AvailableAmount, u.Stock.StockType, u.Stock.Unit,
//			u.Commodity.Specification, u.Stock.Commodity, u.Commodity.ClassId, u.Stock.HomePage, u.Commodity.Barcode, file.FileKey, expirationtime, warntime, u.Department.Name)
//	}
//	fs = `{"count":%d,"rows":[%s]}`
//	w.Write([]byte(fmt.Sprintf(fs, count, s)))
//}
