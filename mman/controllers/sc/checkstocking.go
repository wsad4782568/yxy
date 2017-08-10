package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"time"
	//	"time"
	"web/schema"
	"web/session"
)

func CheckStockingHandlers() {
	ctrl.HMAP["/sc/checkstockingplan/get"] = getCheckStockingplan //只查看编辑中的计划
	ctrl.HMAP["/sc/checkstockingplan/getpass"] = getpassStockingplan
	ctrl.HMAP["/sc/checkstockingplan/getpassandnopass"] = getpassandnopass //得到审核通过和未通过的
	ctrl.HMAP["/sc/checkstocking/checkpass"] = checkpass                   //审核通过
	ctrl.HMAP["/sc/checkstocking/deletestocking"] = deletestockingplan     //删除
	ctrl.HMAP["/sc/checkstocking/refuse"] = refuseplan                     //审核未通过
	ctrl.HMAP["/sc/checkstocking/trueplan"] = trueplan
	ctrl.HMAP["/sc/checkstocking/statisticsplanbydept"] = statisticsplanydept //点击快捷时间按钮
	ctrl.HMAP["/sc/checkstocking/gettrueplan"] = gettrueplan
	ctrl.HMAP["/sc/checkstocking/gettrueplanitem"] = gettrueplanitem
	ctrl.HMAP["/sc/checkstocking/wastesingle"] = WasteSingle
}

type trueplanitem struct {
	models.PurchasePlanItem `xorm:"extends"`
	models.PurchasePlan     `xorm:"extends"`
	models.Purchase         `xorm:"extends"`
}

func (trueplanitem) TableName() string {
	return "purchase_plan_item"
}

//真是采购单的形成
type statisticstrue struct {
	CommoditySerial []int     `schema:"commodityserial"` //商品流水号，4个商品为1个
	CommodityName   []string  `schema:"commodityname"`   //商品名字
	Unit            []string  `schema:"unit"`            //前端传过来的单位
	Dept            int       `schema:"dept"`            //部门
	AmountItem      []float64 `schema:"amountitem"`      //采购总监填写的数量
	Specification   []string  `schema:"specification"`   //商品规格
	Memo            []string  `schema:"memo"`            //每个商品的备忘录
	BigMemo         string    `schema:"bigmemo"`         //一个大的实际采购计划的备忘录
	Status          int       `schema:"status"`          //暂存还是提交
	Cdept           int       `xorm:"-" schema:"cdept"`
	StockId         int       `xorm:"-" schema:"stockid"` //如果是编辑的话就发stockid过来
}

type statisticsbydept struct {
	StartTime int64 `schema:"starttime"`
	Staff     int   `schema:"staff"` //那个部门的的员工
	Cdept     int   `xorm:"-" schema:"cdept"`
	Flag      int   `schema:"flag"` //1代表全部 2是单选部门 3选择部门的全部
}

func getCheckStockingplan(w http.ResponseWriter, r *http.Request) {
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	dept := strconv.Itoa(queryob.Cq_dept)
	start := strconv.FormatInt(queryob.Cq_time[0], 10)
	end := strconv.FormatInt(queryob.Cq_time[1], 10)
	eng := models.GetEngine()
	//	staffdept := session.HGet(r, "staff", "dept_id")
	//	dept, _ := strconv.Atoi(staffdept)
	var tables []models.StockingPlan
	table := new(models.StockingPlan)
	n := schema.ExtBasicQuery(eng, r, []string{"id", "status", "memo_of_apply", "ticket_code", "created", "updatetime", "dept",
		"applicant", "checked_by", "buyer", "stocking_type"}, &tables, table,
		[]string{"dept=?", "status>?", "updatetime>?", "updatetime<?"}, []string{dept, "-1", start, end}, []string{"and", "and", "and"})
	fs := `[%d,%d,"%s","%s","%s","%s",%d,%d,%d,%d,%d],`
	s := ""
	for _, u := range tables {
		created := schema.IntToTimeStr(u.Created)
		updatetime := schema.IntToTimeStr(u.Updatetime)
		s += fmt.Sprintf(fs, u.Id, u.Status, u.MemoOfApply, u.TicketCode, created, updatetime, u.Dept, u.Applicant, u.CheckedBy, u.Buyer, u.StockingType)
	}

	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getpassandnopass(w http.ResponseWriter, r *http.Request) {
	c_deptid := r.URL.Query().Get("cdept")
	eng := models.GetEngine()
	var tables []models.StockingPlan
	table := new(models.StockingPlan)
	n := schema.ExtBasicQuery(eng, r, []string{"id", "status", "memo_of_apply", "ticket_code", "created", "updatetime", "dept",
		"applicant", "checked_by", "buyer", "stocking_type"}, &tables, table,
		[]string{"dept=?", "status=?", "status = ? "}, []string{c_deptid, "2", "1"}, []string{"and", "or"})
	fs := `[%d,%d,"%s","%s","%s","%s",%d,%d,%d,%d,%d],`
	s := ""
	for _, u := range tables {
		created := schema.IntToTimeStr(u.Created)
		updatetime := schema.IntToTimeStr(u.Updatetime)
		s += fmt.Sprintf(fs, u.Id, u.Status, u.MemoOfApply, u.TicketCode, created, updatetime, u.Dept, u.Applicant, u.CheckedBy, u.Buyer, u.StockingType)
	}

	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getpassStockingplan(w http.ResponseWriter, r *http.Request) {
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	dept := strconv.Itoa(queryob.Cq_dept)
	start := strconv.FormatInt(queryob.Cq_time[0], 10)
	end := strconv.FormatInt(queryob.Cq_time[1], 10)
	eng := models.GetEngine()
	var tables []models.StockingPlan
	table := new(models.StockingPlan)
	n := schema.ExtBasicQuery(eng, r, []string{"id", "status", "memo_of_apply", "ticket_code", "created", "updatetime", "dept",
		"applicant", "checked_by", "buyer", "stocking_type"}, &tables, table,
		[]string{"dept=?", "status", "updatetime>?", "updatetime<?"}, []string{dept, "2,3,5,11", start, end}, []string{"in", "and", "and"})
	fs := `[%d,%d,"%s","%s","%s","%s",%d,%d,%d,%d,%d],`
	s := ""
	for _, u := range tables {
		created := schema.IntToTimeStr(u.Created)
		updatetime := schema.IntToTimeStr(u.Updatetime)
		s += fmt.Sprintf(fs, u.Id, u.Status, u.MemoOfApply, u.TicketCode, created, updatetime, u.Dept, u.Applicant, u.CheckedBy, u.Buyer, u.StockingType)
	}

	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func checkpass(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	tables := &models.StockingPlan{}
	staffid := session.HGet(r, "staff", "staff_id")
	tables.CheckedBy, _ = strconv.Atoi(staffid)
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	sp := &models.StockingPlan{}
	sp.Id = tables.Id
	eng.Get(sp)
	if sp.Status != 1 {
		w.Write([]byte(`{"res":-1,"msg":"请查看改单状态，只有待审核才能进行此操作"}`))
		return
	}
	_, err := eng.Exec("update stocking_plan set status=2 ,checked_by =?,updatetime=? where id=? ", tables.CheckedBy, time.Now().Unix(), tables.Id)
	if err == nil {
		w.Write([]byte(`{"res":0,"msg":"审核通过"}`))
	}
}

func refuseplan(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	tables := &models.StockingPlan{}
	staffid := session.HGet(r, "staff", "staff_id")
	tables.CheckedBy, _ = strconv.Atoi(staffid)
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	sp := &models.StockingPlan{}
	sp.Id = tables.Id
	eng.Get(sp)
	if sp.Status != 1 {
		w.Write([]byte(`{"res":-1,"msg":"请查看改单状态，只有待审核才能进行此操作"}`))
		return
	}
	_, err := eng.Exec("update stocking_plan set status=4 ,checked_by =?,updatetime=? where id=? ", tables.CheckedBy, time.Now().Unix(), tables.Id)
	if err == nil {
		w.Write([]byte(`{"res":0,"msg":"审核未通过"}`))
	}
}

func deletestockingplan(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(session.HGet(r, "staff", "staff_id"))
	tables := &models.StockingPlan{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	stockplan := &models.StockingPlan{}
	stockplan.Id = tables.Id
	affected, err := session.Get(stockplan)
	if err != nil || !affected {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"删除失败，请检查信息"}`))
		return
	}
	if stockplan.Status > 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"已经通过审核不能删除"}`))
		return
	}
	_, err = session.Exec("delete from stocking_plan where id=? ", tables.Id)
	if err != nil {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"删除失败，请检查信息"}`))
		return
	} else {
		_, err = eng.Exec("delete from stocking_plan_item where stocking_plan=? ", tables.Id)
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

func trueplan(w http.ResponseWriter, r *http.Request) {
	tables := &statisticstrue{}
	//	staffid := session.HGet(r, "staff", "staff_id")
	deptid, _ := strconv.Atoi(session.HGet(r, "staff", "dept_id"))
	//	tables.CheckedBy, _ = strconv.Atoi(staffid)
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	if tables.StockId > 0 { //欧阳
		p := &models.PurchasePlan{}
		p.Id = tables.StockId
		ok, err := session.Get(p)
		if err != nil || !ok {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"统计编辑失败，请检查信息"}`))
			return
		}
		_, err = eng.Exec("update purchase_plan set status=? ", tables.StockId)
		if err != nil {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"统编辑计失败，请检查信息"}`))
			return
		}
	}
	err := session.Begin()
	if err != nil {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"统计失败，请检查信息"}`))
		return
	}
	purchaseplan := &models.PurchasePlan{}
	purchaseplan.Created = time.Now().Unix()
	purchaseplan.Memo = tables.BigMemo
	purchaseplan.Status = tables.Status
	purchaseplan.Updated = time.Now().Unix()
	purchaseplan.Dept = deptid
	affected, err := session.Insert(purchaseplan)
	if err != nil || affected != 1 {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"统计失败，请检查信息"}`))
		return
	}
	length := len(tables.CommoditySerial)
	for i := 0; i < length; i++ {
		purchase := &models.Purchase{}
		purchase.CommoditySerial = tables.CommoditySerial[i]
		purchase.Name = tables.CommodityName[i]
		purchase.Specification = tables.Specification[i]
		purchase.Unit = tables.Unit[i]
		affected, err = session.Insert(purchase)
		if err != nil || affected != 1 {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"统计失败，请检查信息"}`))
			return
		}
		purchaseplanitem := &models.PurchasePlanItem{}
		purchaseplanitem.Amount = tables.AmountItem[i]
		purchaseplanitem.Memo = tables.Memo[i]
		purchaseplanitem.Purchase = purchase.Id
		purchaseplanitem.PurchasePlan = purchaseplan.Id
		purchaseplanitem.Specification = tables.Specification[i]
		purchaseplanitem.Unit = tables.Unit[i]
		affected, err = session.Insert(purchaseplanitem)
		if err != nil || affected != 1 {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"统计失败，请检查信息"}`))
			return
		}
	}
	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"统计成功"}`))
}

func statisticsplanydept(w http.ResponseWriter, r *http.Request) {
	var tables []Statistics
	table := &statisticsbydept{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	if table.Flag == 2 {
		eng.Sql("select commodity,sum(amount),name,unit,commodity_no,specification from stocking_plan inner join stocking_plan_item on stocking_plan.id=stocking_plan_item.stocking_plan inner join commodity on stocking_plan_item.commodity=commodity.id where  status=2 and stocking_plan.updatetime>? and  stocking_plan.applicant=? and stocking_plan.dept=? group by commodity,name,unit,commodity_no,specification", table.StartTime, table.Staff, table.Cdept).Find(&tables)
	} else if table.Flag == 1 {
		eng.Sql("select commodity,sum(amount),name,unit,commodity_no,specification from stocking_plan inner join stocking_plan_item on stocking_plan.id=stocking_plan_item.stocking_plan inner join commodity on stocking_plan_item.commodity=commodity.id where  status=2 and stocking_plan.updatetime>?  group by commodity,name,unit,commodity_no,specification", table.StartTime).Find(&tables)
	} else {
		eng.Sql("select commodity,sum(amount),name,unit,commodity_no,specification from stocking_plan inner join stocking_plan_item on stocking_plan.id=stocking_plan_item.stocking_plan inner join commodity on stocking_plan_item.commodity=commodity.id where  status=2 and stocking_plan.updatetime>?  and stocking_plan.dept=? group by commodity,commodity_no,name,unit,specification", table.StartTime, table.Cdept).Find(&tables)
	}

	fs := `%s[%d,%f,"%s","%s","%s","%s"],`
	s := ""
	for _, u := range tables {
		s = fmt.Sprintf(fs, s, u.Commodity, u.Sum, u.Name, u.Unit, u.CommodityNo, u.Specification)
	}
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func gettrueplan(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	start := strconv.FormatInt(queryob.Cq_time[0], 10)
	end := strconv.FormatInt(queryob.Cq_time[1], 10)
	var tables []models.PurchasePlan
	table := new(models.PurchasePlan)
	n := schema.ExtBasicQuery(eng, r, []string{"id", "created", "updated", "memo", "status"}, &tables, table,
		[]string{"id>?", "updated>?", "updated<?"}, []string{"0", start, end}, []string{"and", "and"})
	fs := `[%d,"%s","%s","%s",%d],`
	s := ""
	for _, u := range tables {
		created := schema.IntToTimeStr(u.Created)
		updatetime := schema.IntToTimeStr(u.Updated)
		s += fmt.Sprintf(fs, u.Id, created, updatetime, u.Memo, u.Status)
	}

	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func gettrueplanitem(w http.ResponseWriter, r *http.Request) {
	var tables []trueplanitem
	table := &models.PurchasePlan{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Join("INNER", "purchase_plan", "purchase_plan.id = purchase_plan_item.purchase_plan ")
	sess.Join("INNER", "purchase", "purchase_plan_item.purchase=purchase.id")
	sess.Where("purchase_plan.id=?", table.Id).Find(&tables)
	fs := `[%d,"%s","%s","%s",%f,"%s"],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Purchase.CommoditySerial, u.Purchase.Name, u.Purchase.Specification,
			u.Purchase.Unit, u.PurchasePlanItem.Amount, u.PurchasePlanItem.Memo)
	}
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

//废单
func WasteSingle(w http.ResponseWriter, r *http.Request) {
	tables := &models.PurchasePlan{}
	//	staffid := session.HGet(r, "staff", "staff_id")
	//	tables.CheckedBy, _ = strconv.Atoi(staffid)
	schema.FormParse(r, tables)
	//	fmt.Println(tables.Id)
	eng := models.GetEngine()
	_, err := eng.Exec("update purchase_plan set status=5 where id=? ", tables.Id)
	if err == nil {
		w.Write([]byte(`{"res":0,"msg":"该单变成无效单"}`))
		return
	}
}
