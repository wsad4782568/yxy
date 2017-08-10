package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"time"
	"web/redi"
	"web/schema"
	ss "web/session"
)

func ExpressstockHandlers() {
	ctrl.HMAP["/sc/expressstock/getext"] = getTransferExtend
	ctrl.HMAP["/sc/expressstock/getstocks"] = getallExpressStock
	ctrl.HMAP["/sc/expressstock/getitem"] = getTransferItem
	ctrl.HMAP["/sc/expressstock/gettransferout"] = getOutExpressStock
	ctrl.HMAP["/sc/expressstock/inerttransferout"] = insertStockTransferOut
	ctrl.HMAP["/sc/expressstock/inerttransferin"] = insertStockTransferIn
	ctrl.HMAP["/sc/expressstock/passtransfer"] = passStockTransferOut
	ctrl.HMAP["/sc/expressstock/unpasstransfer"] = unpassStockTransferOut
}

type transferExtend struct {
	Id         int    `schema:"id"`      //调出部门
	OutMemo    string `schema:"outmemo"` //调出说明
	InMemo     string `schema:"inmemo"`
	Status     int    `schema:"status"`     //调出部门
	DeptOut    int    `schema:"deptout"`    //调出部门
	DeptIn     int    `schema:"deptin"`     //调出部门
	HandlerOut int    `schema:"handlerout"` //调出处理人
	CheckBy    int    `schema:"checkby"`    // 审核人
	HandlerIn  int    `schema:"handlerin"`  //调入处理人
	//Item
	StockId []int     `schema:"stockid"`
	Price   []int     `schema:"price"`
	Amount  []float64 `schema:"amount"`
	Cdept   int       `schema:"cdept"`
}

type DeptStaffMore struct {
	models.Staff     `xorm:"extends"`
	models.DeptStaff `xorm:"extends"`
}

func (DeptStaffMore) TableName() string {
	return "staff"
}

type StockTransferItemInfo struct {
	models.StockTransferItem `xorm:"extends"`
	models.Stock             `xorm:"extends"`
	models.Commodity         `xorm:"extends"`
}

func (StockTransferItemInfo) TableName() string {
	return "stock_transfer_item"
}

func getTransferExtend(w http.ResponseWriter, r *http.Request) { //获取部门下其他员工，对照审核人姓名
	//
	var stf []models.Staff
	eng := models.GetEngine()
	eng.Find(&stf)
	fs := `[%d,"%s"],`
	s := ""
	for _, u := range stf {
		s += fmt.Sprintf(fs, u.Id, u.Username)
	}
	fs = `{"staff":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func getOutExpressStock(w http.ResponseWriter, r *http.Request) { //获取快捷出库的Transfer信息
	eng := models.GetEngine()
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	dept := strconv.Itoa(queryob.Cq_dept)
	time1 := fmt.Sprintf("%d", queryob.Cq_time[0])
	time2 := fmt.Sprintf("%d", queryob.Cq_time[1])
	var tables []models.StockTransfer
	table := new(models.StockTransfer)
	n := schema.ExtBasicQuery(eng, r, []string{"stock_transfer.id", "stock_transfer.status",
		"stock_transfer.ticket_code", "stock_transfer.out_memo", "stock_transfer.created",
		"stock_transfer.updatetime", "stock_transfer.handler_out", "stock_transfer.check_by", "stock_transfer.in_memo", "stock_transfer.handler_in"},
		&tables, table, []string{"stock_transfer.dept_out = ?", "stock_transfer.transfer_type = ?",
			"stock_transfer.updatetime >= ?", "stock_transfer.updatetime <= ?"}, []string{dept, "3", time1, time2}, []string{"and", "and", "and"})
	fs := `[%d,%d,"%s","%s","%s","%s",%d,%d,"%s",%d],`
	s := ""
	for _, u := range tables {
		created := schema.IntToTimeStr(u.Created)
		updatetime := schema.IntToTimeStr(u.Updatetime)
		s += fmt.Sprintf(fs, u.Id, u.Status, u.TicketCode, u.OutMemo,
			created, updatetime, u.HandlerOut, u.CheckBy, u.InMemo, u.HandlerIn)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getallExpressStock(w http.ResponseWriter, r *http.Request) { //查看现有库存，所有商品的tbl
	//
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
	n := schema.ExtJoindQuery(eng, r, []string{"stock.id", "commodity.name",
		"stock.amount", "stock.off_shelf", "stock.minimum", "stock.standard_amount",
		"stock.online_sale", "stock.stock_type", "stock.unit", "commodity.specification", "stock.commodity",
		"commodity.class_id", "commodity.commodity_no", "stock.price", "stock.price_onsale", "stock.dept"},
		&tables, table, [][]string{{"INNER", "commodity", "stock.commodity = commodity.id"}},
		[]string{"stock.dept = ?", "is_main_unit"},
		[]string{dept, units}, []string{"in"})
	fs := `[%d,"%s",%f,%d,%f,%f,%d,%d,"%s","%s",%d,"%s","%s",%d,%d,"%s",%d],`
	s := ""
	for _, u := range tables {
		var barcode []models.Barcode
		eng.Where("commodity = ?", u.Stock.Commodity).Find(&barcode)
		codes := ""
		for _, c := range barcode {
			codes += c.Code + ","
		}
		s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Amount, u.Stock.OffShelf,
			u.Stock.Minimum, u.Stock.StandardAmount, u.Stock.OnlineSale, u.Stock.StockType,
			u.Stock.Unit, u.Commodity.Specification, u.Stock.Commodity, u.Commodity.ClassId,
			u.Commodity.CommodityNo, u.Stock.Price, u.Stock.PriceOnsale, codes, u.Stock.Dept)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getTransferItem(w http.ResponseWriter, r *http.Request) { //根据id来获取transfer下面对应的商品信息
	//
	r.ParseForm()
	id := r.FormValue("id")
	var tables []StockTransferItemInfo
	eng := models.GetEngine()
	stockTransfer := &models.StockTransfer{}
	has, err := eng.Where("id = ?", id).Get(stockTransfer)
	if !has || err != nil {
		w.Write([]byte(`{"iteminfo":[],"memo":"信息获取失败"}`))
		return
	}
	sess := eng.AllCols()
	sess.Join("INNER", "stock", "stock_transfer_item.stock=stock.id ")
	sess.Join("INNER", "commodity", "stock.commodity=commodity.id ")
	sess.Where("stock_transfer_item.stock_transfer=?", id).Find(&tables)
	fs := `[%d,"%s","%s",%f,%f,%f,"%s",%d,%d,%d,"%s",%d,%d,%d],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.StockTransferItem.Id, u.Commodity.Name, u.Commodity.Specification,
			u.Stock.Amount, u.StockTransferItem.OutAmount, u.StockTransferItem.InAmount, u.Stock.Unit,
			u.Commodity.IsMainUnit, u.Stock.Id, u.Commodity.Id, u.Commodity.CommodityNo, u.Commodity.Id, u.StockTransferItem.Price, u.Commodity.Price)
	}
	fs = `{"iteminfo":[%s],"outmemo":"%s","inmemo":"%s"}`
	w.Write([]byte(fmt.Sprintf(fs, s, stockTransfer.OutMemo, stockTransfer.InMemo)))
}

func insertStockTransferOut(w http.ResponseWriter, r *http.Request) { //新增快捷出库计划
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &transferExtend{}
	schema.FormParse(r, tables)
	staffid := ss.HGet(r, "staff", "staff_id")
	staffdept := r.URL.Query().Get("cdept")
	eng := models.GetEngine()
	stocktransfer := &models.StockTransfer{}
	stocktransfer.TicketCode = redi.GetStockTransferNo()
	stocktransfer.Status = 1
	stocktransfer.OutMemo = tables.OutMemo
	stocktransfer.Updatetime = time.Now().Unix()
	stocktransfer.DeptOut, _ = strconv.Atoi(staffdept)
	stocktransfer.HandlerOut, _ = strconv.Atoi(staffid)
	stocktransfer.TransferType = 3
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	if tables.Id > 0 && tables.Status == 1 {
		stocktransfer.Id = tables.Id
		_, err = eng.Exec("delete from stock_transfer_item where stock_transfer = ?", tables.Id)
		_, err = eng.Id(tables.Id).Update(stocktransfer)
	} else {
		stocktransfer.Created = time.Now().Unix()
		_, err = session.Insert(stocktransfer)
	}
	if err != nil {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}
	length := len(tables.StockId)
	for i := 0; i < length; i++ {
		stocktansferitem := &models.StockTransferItem{}
		stocktansferitem.Stock = tables.StockId[i]
		stocktansferitem.OutAmount = tables.Amount[i]
		stocktansferitem.StockTransfer = stocktransfer.Id
		stock := &models.Stock{}
		stock.Id = tables.StockId[i]
		eng.Get(stock)
		dept, err := strconv.Atoi(staffdept)
		if err != nil || stock.Dept != dept {
			cm := &models.Commodity{}
			cm.Id = stock.Commodity
			eng.Get(cm)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"插入失败，快捷出库商品:` + cm.Name + `不属于出库部门"}`))
		}
		_, err = eng.Insert(stocktansferitem)
		if err != nil {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查调度商品信息"}`))
			return
		}

	}
	err = session.Commit()
	if err != nil {
		Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		return
	}
	if tables.Id > 0 && tables.Status == 1 {
		w.Write([]byte(`{"res":0,"msg":"更新计划成功"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"快速出库计划申请成功"}`))
}

func insertStockTransferIn(w http.ResponseWriter, r *http.Request) { //快速入库，直接修改库存
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &transferExtend{}
	schema.FormParse(r, tables)
	staffid := ss.HGet(r, "staff", "staff_id")
	staffdept := r.URL.Query().Get("cdept")
	eng := models.GetEngine()
	stocktransfer := &models.StockTransfer{}
	stocktransfer.TicketCode = redi.GetStockTransferNo()
	stocktransfer.Status = 10
	stocktransfer.InMemo = tables.InMemo
	stocktransfer.Created = time.Now().Unix()
	stocktransfer.Updatetime = time.Now().Unix()
	stocktransfer.DeptOut, _ = strconv.Atoi(staffdept)
	stocktransfer.DeptIn, _ = strconv.Atoi(staffdept)
	stocktransfer.HandlerIn, _ = strconv.Atoi(staffid)
	stocktransfer.CheckBy = tables.CheckBy
	stocktransfer.TransferType = 3
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	affected, err := session.InsertOne(stocktransfer)
	if err != nil {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}
	if affected != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}
	length := len(tables.StockId)
	for i := 0; i < length; i++ {
		stocktansferitem := &models.StockTransferItem{}
		stocktansferitem.Stock = tables.StockId[i]
		stocktansferitem.InAmount = tables.Amount[i]
		stocktansferitem.StockTransfer = stocktransfer.Id
		affected, err = eng.InsertOne(stocktansferitem)
		if err != nil {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查调度商品信息"}`))
			return
		}
		if affected != 1 {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
			return
		}
		for i := 0; i < len(tables.StockId); i++ {
			stock := &models.Stock{}
			stock.Id = tables.StockId[i]
			eng.Get(stock)
			dept, err := strconv.Atoi(staffdept)
			if err != nil || stock.Dept != dept {
				cm := &models.Commodity{}
				cm.Id = stock.Commodity
				eng.Get(cm)
				Logger.Error(err)
				w.Write([]byte(`{"res":-1,"msg":"插入失败，快捷入库商品:` + cm.Name + `不属于入库部门"}`))
				return
			}
			var changetype int8
			var amount float64
			amount = stock.Amount + tables.Amount[i]
			changetype = 9
			_, err = session.Query("UPDATE stock SET amount = ?,price = ? WHERE id = ?  ", amount, tables.Price[i], stock.Id)
			if err != nil {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"入库失败，请检查信息"}`))
				Logger.Error(err)
				return
			}
			change := &models.StockChange{}
			change.Created = time.Now().Unix()
			change.ChangeType = changetype
			change.Reason = tables.InMemo
			change.Operator = tables.HandlerIn
			change.Amount = tables.Amount[i]
			change.CheckedBy = tables.CheckBy
			change.RelId = stocktransfer.Id
			change.Stock = tables.StockId[i]
			change.Price = tables.Price[i]
			_, err = session.Insert(change)
			if err != nil {
				Logger.Error(err)
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"入库失败，请检查信息"}`))
				return
			}

		}

	}
	err = session.Commit()
	if err != nil {
		Logger.Error(err)
		w.Write([]byte(`{"res":0,"msg":"未知的错误"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"快速入库成功"}`))
}

func passStockTransferOut(w http.ResponseWriter, r *http.Request) { //审核快捷出库，修改库存
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &transferExtend{}
	schema.FormParse(r, tables)
	staffid, _ := strconv.Atoi(ss.HGet(r, "staff", "staff_id"))
	//staffdept := ss.HGet(r, "staff", "dept_id")
	eng := models.GetEngine()
	stocktransfer := &models.StockTransfer{}
	stocktransfer.Id = tables.Id
	has, err := eng.Get(stocktransfer)
	if !has || err !=nil  {
		w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查信息"}`))
		return
	}
	if stocktransfer.Status == 3 {
		w.Write([]byte(`{"res":-1,"msg":"该计划已经审核过了"}`))
		return
	}
	stocktransfer.Status = 3
	stocktransfer.Updatetime = time.Now().Unix()
	stocktransfer.CheckBy = staffid
	stocktransfer.InMemo = tables.InMemo
	session := eng.NewSession()
	defer session.Close()
	err = session.Begin()
	affected, err := session.Id(tables.Id).Update(stocktransfer)
	if err != nil {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查信息"}`))
		return
	}
	if affected != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查信息"}`))
		return
	}
	var items []models.StockTransferItem
	session.Where("stock_transfer = ? ", stocktransfer.Id).Find(&items)
	length := len(items)
	for i := 0; i < length; i++ {
		stock := &models.Stock{}
		stock.Id = items[i].Stock
		eng.Get(stock)
		fmt.Println(stock.Id)
		var changetype int8
		var amount float64
		amount = stock.Amount - items[i].OutAmount
		if amount < 0 {
			w.Write([]byte(`{"res":-1,"msg":"申请出库的数量小于现有数量"}`))
			return
		}
		changetype = 8
		stock.Amount = amount
		_, err = session.Query("UPDATE stock SET amount = ? WHERE id = ?  ", amount, stock.Id)
		if err != nil {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"出库失败，请检查信息"}`))
			Logger.Error(err)
			return
		}

		change := &models.StockChange{}
		change.Created = time.Now().Unix()
		change.ChangeType = changetype
		change.Reason = stocktransfer.OutMemo
		change.Operator = stocktransfer.HandlerOut
		change.Amount = items[i].OutAmount
		change.CheckedBy = tables.CheckBy
		change.RelId = stocktransfer.Id
		change.Stock = items[i].Stock
		_, err = session.Insert(change)
		if err != nil {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"出库失败，请检查信息"}`))
			return
		}

	}

	err = session.Commit()
	if err != nil {
		Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"快速出库完成"}`))
}

func unpassStockTransferOut(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	table := &models.StockTransfer{}
	staffid, _ := strconv.Atoi(ss.HGet(r, "staff", "staff_id"))
	schema.FormParse(r, table)
	table.Status = 4
	table.CheckBy = staffid
	affected, err := eng.Id(table.Id).Update(table)
	if err != nil {
		Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"否决失败，请检查信息"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"否决成功"}`))

}
