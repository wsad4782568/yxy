package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"time"
	"web/schema"
	"web/session"
)

func StocklossHandlers() {
	ctrl.HMAP["/sc/stockloss/insert"] = insertloss           //只查看编辑中的计划
	ctrl.HMAP["/sc/stockloss/checklosspass"] = checklosspass //审核报损单，成功直接修改库存 简单报损
	ctrl.HMAP["/sc/stockloss/get"] = getloss                 //得到loss信息
	ctrl.HMAP["/sc/stockloss/deleteloss"] = deleteloss
	//ctrl.HMAP["/sc/stockloss/checkcomplexlosspass"] = checkcomplexlosspass //审核报损单，成功直接修改库存 复杂报损
	ctrl.HMAP["/sc/stockloss/getlossinfo"] = getlossinfo //得到报损的具体原因
	ctrl.HMAP["/sc/stockloss/update"] = updateloss       //得到报损的具体原因
}

type stockloss struct {
	StockidAdd      []int     `schema:"stockidadd"`      //增加数量的stockid
	AmountAdd       []float64 `schema:"amountadd"`       //增加的数量
	StockidRduce    []int     `schema:"stockidreduce"`   //减少数量的stockid
	AmountRduce     []float64 `schema:"amountreduce"`    // 减少的数量
	Outmemo         string    `schema:"outmemo"`         //报损原因
	Stocktransferid int       `schema:"stocktransferid"` // 审核时候用
	Cdept           int       `xorm:"-" schema:"cdept"`
}

type getinfo struct { //得到和本部门所有相关的信息
	models.StockTransfer     `xorm:"extends"`
	models.StockTransferItem `xorm:"extends"`
	models.Stock             `xorm:"extends"`
	models.Commodity         `xorm:"extends"`
	//	IsUnit                   int //1 是的  0不是
	Cdept int `xorm:"-" schema:"cdept"`
}

func (getinfo) TableName() string {
	return "stock_transfer"
}

type lossinfo struct { //更新和审核通用
	Stocktransferid int   `schema:"stocktransferid"`
	Stockid         []int `schema:"stockid"`
	Amount          []int `schema:"amount"`
	EasyorComplex   int   `schema:"easyorcomplex"` //判断是简单报损还是复杂报损 1是简单 2是复杂
}

func insertloss(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	c_deptid, _ := strconv.Atoi(r.URL.Query().Get("cdept"))
	table := &stockloss{}
	schema.FormParse(r, table)
	fmt.Println("stock")
	fmt.Println(table)
	stocktransfer := &models.StockTransfer{}
	stocktransfer.Created = time.Now().Unix()
	stocktransfer.DeptOut = c_deptid
	stocktransfer.HandlerOut = c_deptid
	stocktransfer.OutMemo = table.Outmemo
	stocktransfer.Status = 1
	stocktransfer.TransferType = 4 //4是报损
	stocktransfer.DeptIn = -1
	stocktransfer.HandlerIn = -1
	stocktransfer.Updatetime = time.Now().Unix()
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
	length := len(table.StockidAdd)
	for i := 0; i < length; i++ {
		stocktransferitem := &models.StockTransferItem{}
		stocktransferitem.InAmount = table.AmountAdd[i]
		stocktransferitem.StockTransfer = stocktransfer.Id
		stocktransferitem.Stock = table.StockidAdd[i]
		affecteds, err = session.Insert(stocktransferitem)
		if err != nil || affecteds != 1 {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
			return
		}
	}
	length = len(table.StockidRduce)
	for i := 0; i < length; i++ {
		stocktransferitem := &models.StockTransferItem{}
		stocktransferitem.OutAmount = table.AmountRduce[i]
		stocktransferitem.StockTransfer = stocktransfer.Id
		stocktransferitem.Stock = table.StockidRduce[i]
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

func getloss(w http.ResponseWriter, r *http.Request) {
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
		[]string{"dept_out = ?", "transfer_type = ? ", "updatetime>?", "updatetime<?"}, []string{dept, "4", start, end}, []string{"and", "and", "and"})
	fs := `[%d,"%s",%d,"%s","%s","%s","%s",%d,%d,%d,%d,%d],`
	s := ""
	for _, u := range tables {
		created := schema.IntToTimeStr(u.Created)
		updated := schema.IntToTimeStr(u.Updatetime)
		s += fmt.Sprintf(fs, u.Id, u.TicketCode, u.Status, u.OutMemo, u.InMemo, created, updated, u.DeptOut, u.DeptIn, u.HandlerOut, u.CheckBy, u.HandlerIn)
	}
	fs = `{"count":%d,"rows":[%s]}`
	fmt.Println(s)
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func deleteloss(w http.ResponseWriter, r *http.Request) {

	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	table := &models.StockTransfer{}
	schema.FormParse(r, table)
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	_, err = session.Exec("delete from stock_transfer where id=?", table.Id)
	if err != nil {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"删除失败，请检查信息"}`))
		return
	} else {
		_, err = session.Exec("delete from stock_transfer_item where stock_transfer=?", table.Id)
		if err != nil {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"删除失败，请检查信息"}`))
			return
		}
	}
	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"删除成功"}`))

}

func getlossinfo(w http.ResponseWriter, r *http.Request) {
	var tables []getinfo
	table := &models.StockTransfer{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Join("INNER", "stock_transfer_item", "stock_transfer.id = stock_transfer_item.stock_transfer ")
	sess.Join("INNER", "stock", "stock_transfer_item.stock=stock.id ")
	sess.Join("INNER", "commodity", "stock.commodity=commodity.id ")
	sess.Where("stock_transfer.id=?", table.Id).Find(&tables)
	fs := `[%d,%d,"%s",%f,%f,%d,"%s","%s","%s",%d,%d,"%s",%f,%f,%d,"%s","%s","%s"],`
	s := ""

	for _, u := range tables {
		for _, v := range tables {
			if u.Commodity.CommodityNo == v.Commodity.CommodityNo && u.StockTransferItem.OutAmount > 0 && v.StockTransferItem.OutAmount == 0 {
				s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Id, u.Commodity.Name,
					u.StockTransferItem.OutAmount, u.StockTransferItem.InAmount, u.Commodity.IsMainUnit, u.Commodity.Unit, u.Commodity.CommodityNo, u.Commodity.Specification,
					v.Stock.Id, v.Commodity.Id, v.Commodity.Name,
					v.StockTransferItem.OutAmount, v.StockTransferItem.InAmount, v.Commodity.IsMainUnit, v.Commodity.Unit, v.Commodity.CommodityNo, v.Commodity.Specification)
			}

		}

	}
	fs = `{'res':0,"stockinfo":[%s]}`

	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func checklosspass(w http.ResponseWriter, r *http.Request) {

	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	table := &stockloss{}
	schema.FormParse(r, table)
	stocktransfer := &models.StockTransfer{}
	stocktransfer.Id = table.Stocktransferid
	staffid, _ := strconv.Atoi(session.HGet(r, "staff", "staff_id"))
	eng.Get(stocktransfer)
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	affected, err := session.Exec("update stock_transfer set status=2 , check_by=? where id=?", staffid, table.Stocktransferid)
	row, _ := affected.RowsAffected()
	if err != nil || row != 1 {
		fmt.Println(err.Error())
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查信息"}`))
		return
	}
	length := len(table.StockidRduce)
	for i := 0; i < length; i++ {
		stock := &models.Stock{}
		stock.Id = table.StockidRduce[i]
		eng.Get(stock)
		if stock.Amount >= table.AmountRduce[i] {
			affected, err = session.Exec("update stock set amount=amount-? where id=?", table.AmountRduce[i], table.StockidRduce[i])
			row, _ := affected.RowsAffected()
			if err != nil || row != 1 {
				Logger.Error(err)
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查信息"}`))
				return
			}
		} else {
			Logger.Error(err)
			w.Write([]byte(`{"res":-1,"msg":"库存不足，审核失败"}`))
			return
		}
		change := &models.StockChange{}
		change.Amount = table.AmountRduce[i]
		change.ChangeType = 3 //报损默认3
		change.CheckedBy = staffid
		change.Created = time.Now().Unix()
		change.Operator = stocktransfer.HandlerOut
		change.Reason = stocktransfer.OutMemo
		change.RelId = stocktransfer.Id
		change.Stock = table.StockidRduce[i]
		affecteds, err := eng.Insert(change)
		if err != nil || affecteds != 1 {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查信息"}`))
			return
		}
	}
	length = len(table.StockidAdd)
	for i := 0; i < length; i++ {
		affected, err = session.Exec("update stock set amount=amount+? where id=?", table.AmountAdd[i], table.StockidAdd[i])
		row, _ := affected.RowsAffected()
		if err != nil || row != 1 {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查信息"}`))
			return
		}
		change := &models.StockChange{}
		change.Amount = table.AmountAdd[i]
		change.ChangeType = 3 //报损默认3
		change.CheckedBy = staffid
		change.Created = time.Now().Unix()
		change.Operator = stocktransfer.HandlerOut
		change.Reason = stocktransfer.OutMemo
		change.RelId = stocktransfer.Id
		change.Stock = table.StockidAdd[i]
		affecteds, err := eng.Insert(change)
		if err != nil || affecteds != 1 {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查信息"}`))
			return
		}
	}
	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"审核成功"}`))
}

func updateloss(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	table := &stockloss{}
	schema.FormParse(r, table)
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	affected, err := session.Exec("update stock_transfer set out_memo=? ,updatetime=? where id=?", table.Outmemo, time.Now().Unix(), table.Stocktransferid)
	row, _ := affected.RowsAffected()
	if err != nil || row != 1 {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
		return
	}
	_, err = session.Exec("delete from stock_transfer_item where stock_transfer=?", table.Stocktransferid)
	if err != nil {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
		return
	}
	length := len(table.StockidAdd)
	for i := 0; i < length; i++ {
		stocktransferitem := &models.StockTransferItem{}
		stocktransferitem.InAmount = table.AmountAdd[i]
		stocktransferitem.StockTransfer = table.Stocktransferid
		stocktransferitem.Stock = table.StockidAdd[i]
		affecteds, err := session.Insert(stocktransferitem)
		if err != nil || affecteds != 1 {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
			return
		}
	}
	length = len(table.StockidRduce)
	for i := 0; i < length; i++ {
		stocktransferitem := &models.StockTransferItem{}
		stocktransferitem.OutAmount = table.AmountRduce[i]
		stocktransferitem.StockTransfer = table.Stocktransferid
		stocktransferitem.Stock = table.StockidRduce[i]
		affecteds, err := session.Insert(stocktransferitem)
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
