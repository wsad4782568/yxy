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

func StockingPlanHandlers() {
	ctrl.HMAP["/sc/stockingplan/insert"] = insertStockingPlan
	ctrl.HMAP["/sc/stockingplan/getstockingplaninfo"] = getstockingplaninfo //得到本部门采购单的详细
	ctrl.HMAP["/sc/stockingplan/update"] = updateStockingPlan
	ctrl.HMAP["/sc/stockingplan/putinstorage"] = putinstorage           //入库
	ctrl.HMAP["/sc/stockingplan/statisticsplan"] = statisticsplan       //统计完成的采购计划
	ctrl.HMAP["/sc/stockingplan/statisticsasstaff"] = statisticsasstaff //返回每个部门生成采购计划的员工
	ctrl.HMAP["/sc/stockingplan/searchsupplier"] = searchsupplier       //模糊查询供应商
	ctrl.HMAP["/sc/stockingplan/getpurchseplan"] = getpurchseplan
	ctrl.HMAP["/sc/stockingplan/wasteplan"] = WastePlan

}

type timeblock struct {
	StartTime int64 `schema:"starttime"`
	EndTime   int64 `schema:"endtime"`
	Staff     int   `schema:"staff"` //那个部门的的员工
	Cdept     int   `xorm:"-" schema:"cdept"`
	Flag      int   `schema:"flag"` //1代表全部 2是单选部门,3代表查看某个部门的全部
}

type intostorage struct { //入库
	StockingPlanId int     `schema:"stockingid"`
	CheckedBy      int     `schema:"checkedby"` //staff_id   谁入库
	DeptId         int     `schema:"deptid"`    //部门
	ComodityId     []int   `schema:"commodityid"`
	ProduceTime    []int64 `schema:"producetime"` //生产日期
	ShelfDays      []int   `schema:"shelfdays"`   //　保质期
	Operator       int
	Reason         []string `schema:"reason"`
	//	AmountReceiveBuy   []int    `schema:"amountreceivebuy"`   //接收到采购单位的数量
	//	AmountReceiveBasis []int    `schema:"amountreceivebasis"` //接收到基本单位的数量
	//	AmountReceivemin   []int    `schema:"amountreceivemin"`   //接收到的最小库存单位，因为这个单位可以不填写，所以采取不管填写与否，都先插入，数量为0，最后在清除数据
	//	StockIdBuy         []int    `schema:"stockidbuy"`         //采购单位的库存id
	//	StockIdbasis       []int    `schema:"stockidbasis"`       //基本单位的库存id
	//	StockIdmin         []int    `schema:"stockidmin"`         //最小单位的id
	StockId       []int     `schema:"stockid"`       //接收的单位对于的库存id
	AmountReceive []float64 `schema:"amountreceive"` //接收到的数量对于没个单位
	Stockingprice []int     `schema:"stockingprice"` //采购价格
	Cdept         int       `xorm:"-" schema:"cdept"`
	Supplier      []int     `schema:"supplier"`
}

type stockingplaninfo struct {
	models.StockingPlanItem `xorm:"extends"`
	models.StockingPlan     `xorm:"extends"`
	models.Commodity        `xorm:"extends"`
	models.Stock            `xorm:"extends"`
}

type Statistics struct {
	Commodity     int     `schema:"commodity"`
	Sum           float64 `schema:"sum"`
	Name          string  `schema:"name"`
	Unit          string  `schema:"unit"`
	CommodityNo   string  `schema:"commodityno"`
	Specification string  `schema:"specification"`
}

func (stockingplaninfo) TableName() string {
	return "stocking_plan_item"
}

//用来获取采购单位
type purchsecommodity struct {
	models.Commodity `xorm:"extends"`
	models.Stock     `xorm:"extends"`
}

func (purchsecommodity) TableName() string {
	return "commodity"
}

type stockingplanstaff struct {
	Username string `schema:"username"`
	Id       int    `schema:"id"`
}

type StockingPlanExtend struct { //采购
	MemoOfApply    string    `schema:"memoofapply"` //应用备忘录
	StockingplanId int       `schema:"stockingplanid"`
	ComodityId     []int     `schema:"commodityid"`
	StockAmount    []float64 `schema:"stockamount"`
	StockMemo      []string  `schema:"stockmemo"`
	Cdept          int       `xorm:"-" schema:"cdept"`
	Id             int       `schema:"id"`
	Status         int       `schema:"status"`
}

func insertStockingPlan(w http.ResponseWriter, r *http.Request) {
	staffid := session.HGet(r, "staff", "staff_id")
	c_deptid := r.URL.Query().Get("cdept")
	tables := &StockingPlanExtend{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	//	if tables.Id > 0 {
	//		if tables.Status == 5 {
	//			session.Rollback()
	//			w.Write([]byte(`{"res":-1,"msg":"无效单，不能再做任何操作"}`))
	//			return
	//		}
	//		stockingplan := &models.StockingPlan{}
	//		stockingplan.Status = 5
	//		affected, err := session.Id(tables.Id).Update(stockingplan)
	//		if err != nil || affected != 1 {
	//			fmt.Println(err.Error())
	//			session.Rollback()
	//			w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
	//			return
	//		}

	//	}
	stockingplan := &models.StockingPlan{}
	stockingplan.Applicant, _ = strconv.Atoi(staffid)
	stockingplan.Dept, _ = strconv.Atoi(c_deptid)
	stockingplan.Status = 1
	stockingplan.MemoOfApply = tables.MemoOfApply
	stockingplan.Created = time.Now().Unix()
	stockingplan.Updatetime = time.Now().Unix()
	stockingplan.StockingType = 2
	affected, err := session.Insert(stockingplan)
	if err != nil || affected != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	} else {
		length := len(tables.ComodityId)
		for i := 0; i < length; i++ {
			stockingplanitem := &models.StockingPlanItem{}
			stockingplanitem.Commodity = tables.ComodityId[i]
			stockingplanitem.Amount = tables.StockAmount[i]
			stockingplanitem.Memo = tables.StockMemo[i]
			stockingplanitem.StockingPlan = stockingplan.Id
			affected, err = session.Insert(stockingplanitem)
			if err != nil || affected != 1 {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查采购商品信息"}`))
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

func getstockingplaninfo(w http.ResponseWriter, r *http.Request) {
	var tables []stockingplaninfo
	table := &models.StockingPlan{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	fmt.Println(table.Cdept)
	sess := eng.AllCols()
	sess.Join("INNER", "stocking_plan", "stocking_plan.id = stocking_plan_item.stocking_plan")
	sess.Join("INNER", "commodity", "stocking_plan_item.commodity=commodity.id")
	sess.Join("INNER", "stock", "stock.commodity=commodity.id")
	sess.Where("stocking_plan.id = ?", table.Id)
	sess.And("stock.dept=?", table.Cdept).Find(&tables)
	fs := `[%d,"%s",%f,"%s","%s",%d,"%s","%s","%s",%d,%d,%d],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.StockingPlan.Id, u.Commodity.Name, u.StockingPlanItem.Amount,
			u.StockingPlan.MemoOfApply, u.StockingPlanItem.Memo, u.StockingPlanItem.Commodity, u.Commodity.Unit, u.Commodity.CommodityNo, u.Commodity.Specification, u.Commodity.Price, u.Stock.Price, u.Stock.Id)
	}
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func updateStockingPlan(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	tables := &StockingPlanExtend{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	affected, err := session.Exec("update stocking_plan set memo_of_apply=? , updatetime=? where id=?", tables.MemoOfApply, time.Now().Unix(), tables.StockingplanId)
	row, _ := affected.RowsAffected()
	if err != nil || row != 1 {
		fmt.Println(err.Error())
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"更新失败，请检查信息"}`))
		return
	} else {
		affected, err = session.Exec("delete from stocking_plan_item where stocking_plan=? ", tables.StockingplanId)
		row, _ := affected.RowsAffected()
		if err != nil || row == 0 {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"更新失败，请检查信息"}`))
			return
		} else {
			length := len(tables.ComodityId)
			for i := 0; i < length; i++ {
				stockingplanitem := &models.StockingPlanItem{}
				stockingplanitem.Commodity = tables.ComodityId[i]
				stockingplanitem.Amount = tables.StockAmount[i]
				stockingplanitem.Memo = tables.StockMemo[i]
				stockingplanitem.StockingPlan = tables.StockingplanId
				affecteds, err := session.Insert(stockingplanitem)
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
	w.Write([]byte(`{"res":0,"msg":"更新成功"}`))
}

func putinstorage(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	staffid := session.HGet(r, "staff", "staff_id")
	tables := &intostorage{}
	schema.FormParse(r, tables)
	Logger.Info(tables)
	buyer, _ := strconv.Atoi(staffid)
	tables.Operator, _ = strconv.Atoi(staffid)
	eng := models.GetEngine()
	sp := &models.StockingPlan{}
	sp.Id = tables.StockingPlanId
	eng.Get(sp)
	if sp.Status != 2 {
		w.Write([]byte(`{"res":-1,"msg":"入库失败，入库状态已修改，请刷新查看"}`))
		return
	}
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	affected, err := session.Exec("update stocking_plan set status=3, buyer=?,updatetime=? where id=?", buyer, time.Now().Unix(), tables.StockingPlanId)
	row, _ := affected.RowsAffected()
	if err != nil || row != 1 {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"入库失败，请检查信息"}`))
		return
	} else {
		stocktransfer := &models.StockTransfer{}
		stocktransfer.CheckBy = sp.CheckedBy
		stocktransfer.Created = time.Now().Unix()
		stocktransfer.DeptIn = sp.Dept
		stocktransfer.HandlerIn = sp.Buyer
		stocktransfer.InMemo = sp.MemoOfApply
		stocktransfer.TransferType = 2
		affecteds, err := session.Insert(stocktransfer)
		if err != nil || affecteds != 1 {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"入库失败，请检查采购商品信息"}`))
			return
		} else {
			length := len(tables.ComodityId)
			for i := 0; i < length; i++ {
				affected, err = session.Exec("update stocking_plan_item set amount_receive=?,stocking_price=? where commodity=? and stocking_plan=?", tables.AmountReceive[i], tables.Stockingprice[i], tables.ComodityId[i], tables.StockingPlanId)
				if err != nil {
					Logger.Error(err)
					session.Rollback()
					w.Write([]byte(`{"res":-1,"msg":"入库失败，请检查采购商品信息"}`))
					return
				} else {
					affected, err = session.Exec("update stock set amount=amount+?,price=?  where id=?", tables.AmountReceive[i], tables.Stockingprice[i], tables.StockId[i])
					row, _ = affected.RowsAffected()
					if err != nil || row != 1 {
						Logger.Error(err)
						session.Rollback()
						w.Write([]byte(`{"res":-1,"msg":"入库失败，请检查采购商品信息"}`))
						return
					}
					change := &models.StockChange{}
					change.Amount = tables.AmountReceive[i]
					change.Created = time.Now().Unix()
					change.ChangeType = 1
					change.Operator = tables.Operator
					change.CheckedBy = tables.CheckedBy
					change.Reason = tables.Reason[i]
					change.Stock = tables.StockId[i]
					change.RelId = tables.StockingPlanId
					change.Price = tables.Stockingprice[i]
					change.Supplier = tables.Supplier[i]
					affecteds, err = session.Insert(change)
					if err != nil || affecteds != 1 {
						Logger.Error(err)
						session.Rollback()
						w.Write([]byte(`{"res":-1,"msg":"入库失败，请检查采购商品信息"}`))
						return
					}
					stocktransferitem := &models.StockTransferItem{}
					stocktransferitem.InAmount = tables.AmountReceive[i]
					stocktransferitem.Stock = tables.StockId[i]
					stocktransferitem.StockTransfer = stocktransfer.Id
					affecteds, err = session.Insert(stocktransferitem)
					if err != nil || affecteds != 1 {
						Logger.Error(err)
						session.Rollback()
						w.Write([]byte(`{"res":-1,"msg":"入库失败，请检查采购商品信息"}`))
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

func statisticsplan(w http.ResponseWriter, r *http.Request) {
	var tables []Statistics
	table := &timeblock{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	if table.Flag == 2 {
		if table.StartTime < table.EndTime {
			eng.Sql("select commodity,sum(amount),name,unit,commodity_no,specification from stocking_plan inner join stocking_plan_item on stocking_plan.id=stocking_plan_item.stocking_plan inner join commodity on stocking_plan_item.commodity=commodity.id where  status=2 and stocking_plan.updatetime>? and  stocking_plan.updatetime<? and stocking_plan.applicant=? and stocking_plan.dept=? group by commodity,name,unit,commodity_no,specification", table.StartTime, table.EndTime, table.Staff, table.Cdept).Find(&tables)
		} else if table.StartTime > table.EndTime {
			eng.Sql("select commodity,sum(amount),name,unit,commodity_no,specification from stocking_plan inner join stocking_plan_item on stocking_plan.id=stocking_plan_item.stocking_plan inner join commodity on stocking_plan_item.commodity=commodity.id where  status=2 and stocking_plan.updatetime>? and  stocking_plan.updatetime<? and stocking_plan.applicant=? and stocking_plan.dept=? group by commodity,commodity_no,name,unit,specification", table.EndTime, table.StartTime, table.Staff, table.Cdept).Find(&tables)
		} else {
			w.Write([]byte(`{"res":-1,"msg":"请选择正确的日期"}`))
			return
		}
	} else if table.Flag == 1 {
		if table.StartTime < table.EndTime {
			eng.Sql("select commodity,sum(amount),name,unit,commodity_no,specification from stocking_plan inner join stocking_plan_item on stocking_plan.id=stocking_plan_item.stocking_plan inner join commodity on stocking_plan_item.commodity=commodity.id where  status=2 and stocking_plan.updatetime>? and  stocking_plan.updatetime<?   group by commodity,commodity_no,name,unit,specification", table.StartTime, table.EndTime).Find(&tables)
		} else if table.StartTime > table.EndTime {
			eng.Sql("select commodity,sum(amount),name,unit,commodity_no,specification from stocking_plan inner join stocking_plan_item on stocking_plan.id=stocking_plan_item.stocking_plan inner join commodity on stocking_plan_item.commodity=commodity.id where  status=2 and stocking_plan.updatetime>? and  stocking_plan.updatetime<?   group by commodity,commodity_no,name,unit,specification", table.EndTime, table.StartTime).Find(&tables)
		} else {
			w.Write([]byte(`{"res":-1,"msg":"请选择正确的日期"}`))
			return
		}
	} else {
		if table.StartTime < table.EndTime {
			eng.Sql("select commodity,sum(amount),name,unit,commodity_no,specification from stocking_plan inner join stocking_plan_item on stocking_plan.id=stocking_plan_item.stocking_plan inner join commodity on stocking_plan_item.commodity=commodity.id where  status=2 and stocking_plan.updatetime>? and  stocking_plan.updatetime<? and stocking_plan.dept=? group by commodity,commodity_no,name,unit,specification", table.StartTime, table.EndTime, table.Cdept).Find(&tables)
		} else if table.StartTime > table.EndTime {
			eng.Sql("select commodity,sum(amount),name,unit,commodity_no,specification from stocking_plan inner join stocking_plan_item on stocking_plan.id=stocking_plan_item.stocking_plan inner join commodity on stocking_plan_item.commodity=commodity.id where  status=2 and stocking_plan.updatetime>? and  stocking_plan.updatetime<? and stocking_plan.dept=? group by commodity,commodity_no,name,unit,specification", table.EndTime, table.StartTime, table.Cdept).Find(&tables)
		} else {
			w.Write([]byte(`{"res":-1,"msg":"请选择正确的日期"}`))
			return
		}
	}

	fs := `%s[%d,%f,"%s","%s","%s","%s"],`
	s := ""
	for _, u := range tables {
		s = fmt.Sprintf(fs, s, u.Commodity, u.Sum, u.Name, u.Unit, u.CommodityNo, u.Specification)
	}
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func statisticsasstaff(w http.ResponseWriter, r *http.Request) {
	var tables []stockingplanstaff
	table := &models.StockingPlan{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	eng.Sql("select  distinct(staff.id),staff.username  from stocking_plan inner join staff on stocking_plan.applicant=staff.id  where stocking_plan.dept=?", table.Cdept).Find(&tables)
	fs := `[%d,"%s"],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Id, u.Username)
	}
	fmt.Println(s)
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func searchsupplier(w http.ResponseWriter, r *http.Request) {
	var tables []models.Supplier
	table := &models.Supplier{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Where("name like ?", "%"+table.Name+"%").Find(&tables)
	fs := `%s[%d,"%s",%d],`
	s := ""
	for _, u := range tables {
		s = fmt.Sprintf(fs, s, u.Id, u.Name, u.Class)
	}
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func getpurchseplan(w http.ResponseWriter, r *http.Request) {
	var tables []purchsecommodity
	table := &models.Commodity{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Join("INNER", "stock", "stock.commodity=commodity.id")
	sess.Where("commodity.commodity_no = ?", table.CommodityNo)
	sess.And("commodity.is_main_unit=?", 3)
	sess.And("stock.dept=?", table.Cdept).Find(&tables)
	fs := `["%s",%d,"%s","%s","%s",%d],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Commodity.CommodityNo, u.Commodity.Id, u.Commodity.Name, u.Commodity.Specification, u.Commodity.Unit,
			u.Stock.Id)
	}
	fs = `{'res':0,"purchseinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func WastePlan(w http.ResponseWriter, r *http.Request) {
	tables := &models.StockingPlan{}
	schema.FormParse(r, tables)
	staffid := session.HGet(r, "staff", "staff_id")
	staff, _ := strconv.Atoi(staffid)
	eng := models.GetEngine()
	sp := &models.StockingPlan{}
	sp.Id = tables.Id
	eng.Get(sp)
	if sp.Status == 4 {
		w.Write([]byte(`{"res":-1,"msg":"改单已入库,无法变成无效单"}`))
		return
	}
	_, err := eng.Exec("update stocking_plan set status=5,updatetime=?,checked_by=? where id=? ", time.Now().Unix(), staff, tables.Id)
	if err == nil {
		w.Write([]byte(`{"res":0,"msg":"该单变成无效单"}`))
		return
	}
}
