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
	"web/session"
)

func StockTransferHandlers() {
	ctrl.HMAP["/sc/stocktransfer/getout"] = getoutStockTransfer // 得到本部门出库单信息
	ctrl.HMAP["/sc/stocktransfer/getin"] = getinStockTransfer   // 得到本部门入库信息
	ctrl.HMAP["/sc/stocktransfer/getchange"] = getStockchange   // 得到入库改变的信息
	ctrl.HMAP["/sc/stocktransfer/insert"] = insertStockingTransfer
	ctrl.HMAP["/sc/stocktransfer/transferpass"] = transferpass
	ctrl.HMAP["/sc/stocktransfer/transfernotpass"] = transfernotpass
	ctrl.HMAP["/sc/stocktransfer/getstocktransferinfo"] = getstocktransferinfo //得到入库信息
	ctrl.HMAP["/sc/stocktransfer/dispatchstock"] = dispatchstock
	ctrl.HMAP["/sc/stocktransfers/getallStock"] = getallStock
	ctrl.HMAP["/sc/stockingplanfer/update"] = updateStocktransfer
	ctrl.HMAP["/sc/stockingplanfer/delete"] = deletestocktransfrer
	ctrl.HMAP["/sc/stockingplanfer/getallunit"] = getAllUnit
	ctrl.HMAP["/sc/stockingplanfer/purchasetotransfer"] = purchasetotransfer //采购单转换成调度单
	ctrl.HMAP["/sc/stockingplanfer/getallstaff"] = getallstaff               //得到所有员工的信息
	//	ctrl.HMAP["/sc/stocktransfer/gettransferinfo"] = gettransferinfo    //得到调库的tbl.js信息
	//	ctrl.HMAP["/sc/stocktransfer/gettransferinfoall"] = gettransferinfo //得到全部关于这个的数据。这个针对于特权入库
}

type transferinfo struct {
	models.Stock     `xorm:"extends"`
	models.Commodity `xorm:"extends"`
}

func (transferinfo) TableName() string {
	return "stock"
}

type change struct {
	models.StockChange `xorm:"extends"`
	models.Stock       `xorm:"extends"`
	models.Commodity   `xorm:"extends"`
}

func (change) TableName() string {
	return "stock_change"
}

type ComMore struct {
	models.Commodity `xorm:"extends"`
	models.Stock     `xorm:"extends"`
}

func (ComMore) TableName() string {
	return "commodity"
}

type outstock struct { //更新和审核通用
	Stocktransferid int       `schema:"stocktransferid"`
	Stockid         []int     `schema:"stockid"`
	Amount          []float64 `schema:"amount"`
	Outmemo         string    `schema:"outmemo"`
	checkedby       int       //审核用
	DeptOut         int       `schema:"deptout"` //调出部门
	DeptIn          int       `schema:"deptin"`  //调入部门
	Cdept           int       `xorm:"-" schema:"cdept"`
}

type dispatch struct { //调度入库
	Stocktransferid int       `schema:"stocktransferid"`
	HandlerIn       int       //入库人员
	InMemo          string    `schema:"inmemo"` //入库说明
	Stockid         []int     `schema:"stockid"`
	Amount          []float64 `schema:"amount"`
	ProduceTime     []int64   `schema:"producetime"` //生产日期
	ShelfDays       []int     `schema:"shelfdays"`   //　保质期
	Cdept           int       `xorm:"-" schema:"cdept"`
	Commodity       []int     `schema:"commodity"`
}

type StockingTransferExtend struct { //采购
	Id      int    `schema:"id"`
	OutMemo string `schema:"outmemo"` //调出说明
	/*	InMemo     string `schema:"inmemo"`  */ //调入说明
	DeptOut                                    int       `schema:"deptout"`    //调出部门
	DeptIn                                     int       `schema:"deptin"`     //调入部门
	HandlerOut                                 int       `schema:"handlerout"` //调出处理人
	Amount                                     []float64 `schema:"amount"`     //接收到的数量
	StockId                                    []int     `schema:"stockid"`    //库存id
	Cdept                                      int       `xorm:"-" schema:"cdept"`
	Commodity                                  []int     `schema:"commodity"`
}

type stockingtransferinfo struct { //得到和本部门所有相关的信息
	models.StockTransfer     `xorm:"extends"`
	models.StockTransferItem `xorm:"extends"`
	models.Stock             `xorm:"extends"`
	models.Commodity         `xorm:"extends"`
}

func (stockingtransferinfo) TableName() string {
	return "stock_transfer"
}

func getoutStockTransfer(w http.ResponseWriter, r *http.Request) {
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	dept := strconv.Itoa(queryob.Cq_dept)
	start := strconv.FormatInt(queryob.Cq_time[0], 10)
	end := strconv.FormatInt(queryob.Cq_time[1], 10)
	eng := models.GetEngine()
	var tables []models.StockTransfer
	table := new(models.StockTransfer)
	n := schema.ExtBasicQuery(eng, r, []string{"id", "ticket_code", "status", "out_memo", "in_memo", "created", "updatetime",
		"dept_out", "dept_in", "handler_out", "check_by", "handler_in"}, &tables, table,
		[]string{"dept_out = ?", "transfer_type = ? ", "updatetime>?", "updatetime<?"}, []string{dept, "1", start, end}, []string{"and", "and", "and"})
	fs := `[%d,"%s",%d,"%s","%s","%s","%s",%d,%d,%d,%d,%d],`
	s := ""
	for _, u := range tables {
		created := schema.IntToTimeStr(u.Created)
		updated := schema.IntToTimeStr(u.Updatetime)
		s += fmt.Sprintf(fs, u.Id, u.TicketCode, u.Status, u.OutMemo, u.InMemo, created, updated, u.DeptOut, u.DeptIn, u.HandlerOut, u.CheckBy, u.HandlerIn)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getinStockTransfer(w http.ResponseWriter, r *http.Request) {
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	dept := strconv.Itoa(queryob.Cq_dept)
	start := strconv.FormatInt(queryob.Cq_time[0], 10)
	end := strconv.FormatInt(queryob.Cq_time[1], 10)
	eng := models.GetEngine()
	var tables []models.StockTransfer
	table := new(models.StockTransfer)
	n := schema.ExtBasicQuery(eng, r, []string{"id", "ticket_code", "status", "out_memo", "in_memo", "created", "updatetime",
		"dept_out", "dept_in", "handler_out", "check_by", "handler_in"}, &tables, table,
		[]string{"dept_in = ?", "transfer_type = ? ", "updatetime>?", "updatetime<?"}, []string{dept, "1", start, end}, []string{"and", "and", "and"})
	fs := `[%d,"%s",%d,"%s","%s","%s","%s",%d,%d,%d,%d,%d],`
	s := ""
	for _, u := range tables {
		updatetime := schema.IntToTimeStr(u.Updatetime)
		created := schema.IntToTimeStr(u.Created)
		s += fmt.Sprintf(fs, u.Id, u.TicketCode, u.Status, u.OutMemo, u.InMemo, created, updatetime, u.DeptOut, u.DeptIn, u.HandlerOut, u.CheckBy, u.HandlerIn)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func insertStockingTransfer(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	staffid := session.HGet(r, "staff", "staff_id")
	table := &StockingTransferExtend{}
	schema.FormParse(r, table)
	stocktransfer := &models.StockTransfer{}
	stocktransfer.Created = time.Now().Unix()
	stocktransfer.DeptOut = table.DeptOut
	stocktransfer.HandlerOut, _ = strconv.Atoi(staffid)
	stocktransfer.OutMemo = table.OutMemo
	stocktransfer.Status = 1
	stocktransfer.TransferType = 1 //1是正常调度
	stocktransfer.DeptIn = table.DeptIn
	stocktransfer.Updatetime = time.Now().Unix()
	stocktransfer.TicketCode = redi.GetStockTransferNo()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	affecteds, err := session.Insert(stocktransfer)
	if err != nil || affecteds != 1 {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}
	length := len(table.StockId)
	for i := 0; i < length; i++ {
		stocktransferitem := &models.StockTransferItem{}
		stocktransferitem.OutAmount = table.Amount[i]
		stocktransferitem.StockTransfer = stocktransfer.Id
		stocktransferitem.Stock = table.StockId[i]
		affecteds, err = session.Insert(stocktransferitem)
		if err != nil || affecteds != 1 {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
			return
		}
	}
	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"插入成功"}`))
}

func transferpass(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	tables := &outstock{}
	schema.FormParse(r, tables)
	staffid := session.HGet(r, "staff", "staff_id")
	tables.checkedby, _ = strconv.Atoi(staffid)
	eng := models.GetEngine()
	session := eng.NewSession()
	stocktransfer := &models.StockTransfer{}
	stocktransfer.Id = tables.Stocktransferid
	eng.Get(stocktransfer)
	if stocktransfer.Status != 1 {
		w.Write([]byte(`{"res":-1,"msg":"请查看改单状态，只有待审核才能进行此操作"}`))
		return
	}
	defer session.Close()
	err := session.Begin()
	affected, err := session.Exec("update stock_transfer set status=2,check_by=?,updatetime=? where id=?", tables.checkedby, time.Now().Unix(), tables.Stocktransferid)
	row, _ := affected.RowsAffected()
	if err != nil || row != 1 {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查审核物品"}`))
		return
	} else {
		length := len(tables.Stockid)
		for i := 0; i < length; i++ {
			stock := &models.Stock{}
			stock.Id = tables.Stockid[i]
			eng.Get(stock)
			if stock.Amount >= tables.Amount[i] {
				affected, err = session.Exec("update stock set amount=amount-? where id=?", tables.Amount[i], tables.Stockid[i])
				row, _ := affected.RowsAffected()
				if err != nil || row != 1 {
					Logger.Error(err)
					session.Rollback()
					w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查审核物品"}`))
					return
				} else {
					change := &models.StockChange{}
					change.Amount = tables.Amount[i]
					change.Created = time.Now().Unix()
					change.Reason = stocktransfer.OutMemo
					change.CheckedBy = stocktransfer.CheckBy
					change.ChangeType = 2
					change.Operator = stocktransfer.HandlerOut
					change.RelId = stocktransfer.Id
					change.Stock = tables.Stockid[i]
					affecteds, err := session.Insert(change)
					if err != nil || affecteds != 1 {
						Logger.Error(err)
						session.Rollback()
						w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查审核物品"}`))
						return
					}
				}
			} else {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"审核失败，商品库存不足"}`))
				return
			}
		}
	}
	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"插入成功"}`))
}

func getstocktransferinfo(w http.ResponseWriter, r *http.Request) {
	var tables []stockingtransferinfo
	table := &models.StockTransfer{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Join("INNER", "stock_transfer_item", "stock_transfer.id = stock_transfer_item.stock_transfer ")
	sess.Join("INNER", "stock", "stock_transfer_item.stock=stock.id ")
	sess.Join("INNER", "commodity", "stock.commodity=commodity.id ")
	sess.Where("stock_transfer.id=?", table.Id)
	sess.And("stock.dept=?", table.Cdept).Find(&tables)
	fs := `[%d,%d,"%s",%f,%f,%d,"%s","%s","%s"],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Id, u.Commodity.Name,
			u.StockTransferItem.OutAmount, u.StockTransferItem.InAmount, u.Commodity.IsMainUnit, u.Commodity.Unit, u.Commodity.Specification, u.Commodity.CommodityNo)
	}
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func dispatchstock(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	table := &dispatch{}
	schema.FormParse(r, table)
	staffid := session.HGet(r, "staff", "staffid")
	//	staffdept := session.HGet(r, "staff", "dept_id")
	//	dept, _ := strconv.Atoi(staffdept)
	staff, _ := strconv.Atoi(staffid)
	stocktransfer := &models.StockTransfer{}
	stocktransfer.Id = table.Stocktransferid
	stocktransfer.Id = table.Stocktransferid
	eng := models.GetEngine()
	eng.Get(stocktransfer)
	if stocktransfer.Status != 2 {
		w.Write([]byte(`{"res":-1,"msg":"入库失败，入库状态已修改，请刷新查看"}`))
		return
	}
	session := eng.NewSession()
	eng.Get(stocktransfer)
	defer session.Close()
	err := session.Begin()
	affected, err := session.Exec("update stock_transfer set status=3 ,in_memo=?,handler_in=? where id=?", table.InMemo, staff, table.Stocktransferid)
	row, _ := affected.RowsAffected()
	if err != nil || row != 1 {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"调度失败，请检查调度商品信息"}`))
		return
	} else {
		length := len(table.Stockid)
		for i := 0; i < length; i++ {
			affected, err = session.Exec("update stock set amount=amount+? where commodity=? and dept=?", table.Amount[i], table.Commodity[i], stocktransfer.DeptIn)
			row, _ := affected.RowsAffected()
			if err != nil || row != 1 {
				Logger.Error(err)
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"调度失败，请检查调度商品信息"}`))
				return
			} else {
				stock := &models.Stock{}
				stock.Commodity = table.Commodity[i]
				stock.Dept = stocktransfer.DeptIn
				eng.Get(stock)
				stockchang := &models.StockChange{}
				stockchang.Created = time.Now().Unix()
				stockchang.ChangeType = 2
				stockchang.Operator = staff
				stockchang.Amount = table.Amount[i]
				stockchang.CheckedBy = stocktransfer.CheckBy
				stockchang.Stock = stock.Id
				stockchang.RelId = stocktransfer.Id
				stockchang.Reason = table.InMemo
				affecteds, err := session.Insert(stockchang)
				if err != nil || affecteds != 1 {
					Logger.Error(err)
					session.Rollback()
					w.Write([]byte(`{"res":-1,"msg":"调度失败，请检查调度商品信息"}`))
					return
				} else {

					_, err = session.Exec("update stock_transfer_item set in_amount=? where stock=? and stock_transfer=?", table.Amount[i], table.Stockid[i], stocktransfer.Id)
					if err != nil {
						Logger.Error(err)
						session.Rollback()
						w.Write([]byte(`{"res":-1,"msg":"调度失败，请检查调度商品信息"}`))
						return
					}
				}
			}
		}
	}
	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"入库成功"}`))
}

func gettransferinfoall(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	var tables []transferinfo
	table := new(transferinfo)
	n := schema.JoindQuery(eng, r, []string{"stock.id", "commodity.id", "commodity.name", "stock.dept", "commodity.specification",
		"stock.amount", "stock.unit"}, &tables, table,
		[][]string{{"INNER", "commodity", "stock.commodity = commodity.id"}})
	fs := `[%d,%d,"%s",%d,"%s",%d,"%s"],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Id, u.Commodity.Name, u.Stock.Dept, u.Commodity.Specification, u.Stock.Amount, u.Stock.Unit)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getallStock(w http.ResponseWriter, r *http.Request) {
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
		"stock.available_amount", "stock.stock_type", "stock.unit", "commodity.specification", "stock.commodity", "commodity.class_id", "stock.home_page",
		"stock.expiration_time", "stock.warn_time", "commodity.commodity_no", "stock.commodity_type"}, &tables, table,
		[][]string{{"INNER", "commodity", "stock.commodity = commodity.id"}},
		[]string{"stock.dept = ?", "stock_type"}, []string{dept, units}, []string{"in"})
	fs := `[%d,"%s",%f,%d,%f,%f,%d,%d,%d,%d,%f,%f,%f,%d,"%s","%s",%d,"%s",%d,"%s","%s","%s",%d,"%s",%d],`
	s := ""
	for _, u := range tables {
		file := &models.CommodityFile{}
		eng.Where("commodity = ?", u.Stock.Commodity).And("seq = 0").Get(file)
		barcode := &models.Barcode{}
		barcode.Commodity = u.Commodity.Id
		eng.Get(barcode)
		expirationtime := schema.IntToTimeStr(u.Stock.ExpirationTime)
		warntime := u.Stock.WarnTime / 86400
		s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Amount, u.Stock.OffShelf, u.Stock.Minimum, u.Stock.StandardAmount, u.Stock.Recommended, u.Stock.Price,
			u.Stock.PriceOnsale, u.Stock.OnlineSale, u.Stock.PreorderStock, u.Stock.WarnStock, u.Stock.AvailableAmount, u.Stock.StockType, u.Stock.Unit,
			u.Commodity.Specification, u.Stock.Commodity, u.Commodity.ClassId, u.Stock.HomePage, barcode.Code, file.FileKey, expirationtime, warntime, u.Commodity.CommodityNo, u.Stock.CommodityType)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}
func updateStocktransfer(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	tables := &outstock{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	affected, err := session.Exec("update stock_transfer set out_memo=? , updatetime=?,dept_in=?,dept_out=?  where id=?", tables.Outmemo, time.Now().Unix(), tables.DeptIn, tables.DeptOut, tables.Stocktransferid)
	row, _ := affected.RowsAffected()
	if err != nil || row != 1 {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"更新失败，请检查信息"}`))
		return
	} else {
		_, err = session.Exec("delete from stock_transfer_item where stock_transfer=? ", tables.Stocktransferid)

		if err != nil {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"更新失败，请检查信息"}`))
			return
		} else {
			length := len(tables.Stockid)
			for i := 0; i < length; i++ {
				stocktansferitem := &models.StockTransferItem{}
				stocktansferitem.Stock = tables.Stockid[i]
				stocktansferitem.OutAmount = tables.Amount[i]
				stocktansferitem.StockTransfer = tables.Stocktransferid
				affecteds, err := eng.Insert(stocktansferitem)
				if err != nil || affecteds != 1 {
					Logger.Error(err)
					session.Rollback()
					w.Write([]byte(`{"res":-1,"msg":"更新失败，请检查采购商品信息"}`))
					return
				}
			}
		}
	}

	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))
}

func getStockchange(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	stockchang := &models.StockChange{}
	schema.FormParse(r, stockchang)
	var tables []change
	sess := eng.AllCols()
	sess.Join("INNER", "stock", "stock.id = stock_change.stock")
	sess.Join("INNER", "commodity", "stock.commodity=commodity.id")
	sess.Where("stock_change.rel_id= ?", stockchang.RelId).Find(&tables)
	fs := `["%s",%d,%d,"%s"],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Commodity.Name, u.StockChange.Amount,
			u.StockChange.RelId, u.Stock.Unit)
	}
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func deletestocktransfrer(w http.ResponseWriter, r *http.Request) {
	tables := &models.StockTransfer{}
	schema.FormParse(r, tables)
	staffid := session.HGet(r, "staff", "staff_id")
	staff, _ := strconv.Atoi(staffid)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	stocktransfer := &models.StockTransfer{}
	stocktransfer.Id = tables.Id
	affected, err := session.Get(stocktransfer)
	if err != nil || !affected {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"废单失败，请检查信息"}`))
		return
	}
	if stocktransfer.Status != 2 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"不能将此单改为无效单"}`))
		return
	}
	_, err = session.Exec("update stock_transfer set  status=?,check_by=?,updatetime=? where id=?", 5, staff, time.Now().Unix(), stocktransfer.Id)
	if err != nil {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
		return
	} /*else {
		_, err = eng.Exec("delete from stock_transfer_item where stock_transfer=? ", tables.Id)
		if err != nil {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"删除失败，请检查信息"}`))
			return
		}
	}*/
	var table []models.StockTransferItem
	sess := eng.AllCols()
	sess.Where("stock_transfer_item.stock_transfer= ?", stocktransfer.Id).Find(&table)
	if len(table) == 0 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
		return
	}
	for _, u := range table {
		_, err = eng.Exec("update stock set amount=amount+? where id=?", u.OutAmount, u.Stock)
		if err != nil {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"删除失败，请检查信息"}`))
			return
		}
	}
	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"改单已是无效单"}`))

}

func getAllUnit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, _ := strconv.Atoi(r.FormValue("id"))
	comm := &models.Commodity{}
	schema.FormParse(r, comm)
	var cmrel []ComMore
	comm.Id = id
	fst := `[%d,%d,%f,"%s",%d,"%s"],`
	t := ""
	eng := models.GetEngine()
	eng.Get(comm)
	sess := eng.AllCols()
	sess = sess.Join("INNER", "stock", "commodity.id=stock.commodity")
	sess = sess.Where("commodity.commodity_no = ?", comm.CommodityNo).And("stock.dept = ?", comm.Cdept)
	err := sess.Find(&cmrel)
	fmt.Println(err)
	for _, u := range cmrel {
		t += fmt.Sprintf(fst, u.Commodity.Id, u.Commodity.IsMainUnit, u.Stock.Amount, u.Commodity.Unit, u.Stock.Id, u.Commodity.Specification)
	}
	fst = `{"commodityunit":[%s]}`
	w.Write([]byte(fmt.Sprintf(fst, t)))
}

func getallstaff(w http.ResponseWriter, r *http.Request) {
	var tables []models.Staff
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Where("id>?", -1).Find(&tables)
	fs := `[%d,"%s"],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Id, u.Username)
	}
	fs = `{'res':0,"purchseinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func transfernotpass(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	tables := &models.StockTransfer{}
	schema.FormParse(r, tables)
	staffid := session.HGet(r, "staff", "staff_id")
	staff, _ := strconv.Atoi(staffid)
	eng := models.GetEngine()
	stocktransfer := &models.StockTransfer{}
	stocktransfer.Id = tables.Id
	eng.Get(stocktransfer)
	if stocktransfer.Status != 1 {
		w.Write([]byte(`{"res":-1,"msg":"请查看改单状态，只有待审核才能进行此操作"}`))
		return
	}
	_, err := eng.Exec("update stock_transfer set status=4,updatetime=?,check_by=? where id=? ", time.Now().Unix(), staff, tables.Id)
	if err == nil {
		w.Write([]byte(`{"res":0,"msg":"该单审核不通过"}`))
		return
	}
}

func purchasetotransfer(w http.ResponseWriter, r *http.Request) {

	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	staffid := session.HGet(r, "staff", "staff_id")
	table := &StockingTransferExtend{}
	schema.FormParse(r, table)
	stocktransfer := &models.StockTransfer{}
	stocktransfer.Created = time.Now().Unix()
	stocktransfer.DeptOut = table.DeptOut
	stocktransfer.HandlerOut, _ = strconv.Atoi(staffid)
	stocktransfer.OutMemo = table.OutMemo
	stocktransfer.Status = 1
	stocktransfer.TransferType = 1 //1是正常调度
	stocktransfer.DeptIn = table.DeptIn
	stocktransfer.Updatetime = time.Now().Unix()
	stocktransfer.TicketCode = redi.GetStockTransferNo()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	affecteds, err := session.Insert(stocktransfer)
	if err != nil || affecteds != 1 {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
		return
	}
	_, err = session.Exec("update stocking_plan set status=11,updatetime=? where id=?", time.Now().Unix(), table.Id)
	if err != nil {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查审核物品"}`))
		return
	}
	length := len(table.Commodity)
	for i := 0; i < length; i++ {
		stock := &models.Stock{}
		stock.Commodity = table.Commodity[i]
		stock.Dept = table.DeptOut
		_, err = session.Get(stock)
		fmt.Println(stock.Id)
		if err != nil {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
			return
		}
		stocktransferitem := &models.StockTransferItem{}
		stocktransferitem.OutAmount = table.Amount[i]
		stocktransferitem.StockTransfer = stocktransfer.Id
		stocktransferitem.Stock = stock.Id
		affecteds, err = session.Insert(stocktransferitem)
		if err != nil || affecteds != 1 {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
			return
		}
	}
	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))
}
