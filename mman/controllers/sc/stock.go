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
	"strconv"
	"time"
	"web/schema"
	ss "web/session"
)

func StockHandlers() {
	ctrl.HMAP["/sc/stock/get"] = getStock
	ctrl.HMAP["/sc/stock/getbyname"] = getStockByName
	ctrl.HMAP["/sc/stock/getStockIdByCode"] = getStockIdByCode
	ctrl.HMAP["/sc/stock/getextend"] = getStockExtend
	ctrl.HMAP["/sc/stock/update"] = updateStock
	ctrl.HMAP["/sc/stock/updateprice"] = updateStockPrice
	ctrl.HMAP["/sc/stock/changeamount"] = stockChangeAmount
	ctrl.HMAP["/sc/stock/getsplit"] = getStockSsplit
	ctrl.HMAP["/sc/stock/getsplitstockchange"] = getStockChange
}

type StockCom struct {
	Commodity string `schema:"commodity"`
}
type StockSplit struct {
	StockId     int   `schema:"stockid"`
	StockAmount int   `schema:"stockamount"`
	ItemId      []int `schema:"itemid"`
	ItemAmount  []int `schema:"itemamount"`
	Cdept       []int `schema:"cdept"`
}
type StockExtend struct {
	Id        int  `schema:"id"`
	Commodity int  `schema:"commodity"`
	Dept      int  `schema:"dept"`
	Amount    int  `schema:"amount"`
	OffShelf  int8 `schema:"offshelf"` //是否售卖中
	Minimum   int  `schema:"minimum"`  //最小库存
	// 预定控制库存
	StandardAmount int `schema:"standardamount"` //标准数量
	Recommended    int `schema:"recommended"`    //推荐等级
	Price          int `schema:"price"`          //标准价格
	PriceOnsale    int `schema:"priceonsale"`    //标准零售价

	OnlineSale int8 `schema:"onlinesale"` //线上售卖
	// 售卖方式
	// 预定标准库存，每天11点恢复
	PreorderStock int `schema:"preorderstock"` //
	// 预警库存
	WarnStock int `schema:"warnstock"`
	// 预定可用库存
	AvailableAmount int `schema:"availableamount"`
	// 1:进货单位 2：最小库存单位 3：售卖单位 4：售卖单位下架暂存
	StockType int8 `schema:"stocktype"`
	// 售卖方式 各店可不一样
	SaleType int    `schema:"saletype"`
	Unit     string `schema:"unit"`
	SaleUnit string `schema:"saleunit"`
	Cdept    int    `schema:"cdept"`
}

type StockMore struct {
	models.Stock     `xorm:"extends"`
	models.Commodity `xorm:"extends"`
}

func (StockMore) TableName() string {
	return "stock"
}

type CommodituRelMore struct {
	models.CommodityRel `xorm:"extends"`
	models.Stock        `xorm:"extends"`
	models.Commodity    `xorm:"extends"`
}

func (CommodituRelMore) TableName() string {
	return "commodity_rel"
}

type StkChangeAmount struct {
	StockAdd     int     `schema:"stockadd"`
	AmountAdd    float64 `schema:"amountadd"`
	PriceAdd     int     `schema:"priceadd"`
	StockReduce  int     `schema:"stockreduce"`
	AmountReduce float64 `schema:"amountreduce"`
	PriceReduce  int     `schema:"pricereduce"`
	Cdept        int     `schema:"cdept"`
}

func getStockByName(w http.ResponseWriter, r *http.Request) {
	//
	com := &StockCom{}
	schema.FormParse(r, com)
	var skm []StockMore
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess = sess.Join("INNER", "commodity", "stock.commodity=commodity.id")
	sess = sess.Where("commodity.name like ?", "%"+com.Commodity+"%")
	e := sess.Find(&skm)
	if e != nil {
		fmt.Print(`{err:"错误"}`)
	} else {
		fst := `[%d,%d,"%s","%s","%s",%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,"%s"],`
		t := ""
		for _, u := range skm {
			t += fmt.Sprintf(fst, u.Stock.Id, u.Commodity.Id, u.Commodity.Name, u.Commodity.Specification, u.Commodity.Unit,
				u.Stock.Dept, u.Stock.Amount, u.Stock.OffShelf, u.Stock.Minimum, u.Stock.StandardAmount, u.Stock.Recommended,
				u.Stock.Price, u.Stock.PriceOnsale, u.Stock.OnlineSale, u.Stock.PreorderStock, u.Stock.WarnStock,
				u.Stock.AvailableAmount, u.Stock.StockType, u.Stock.Unit)
		}
		fst = `{"stock":[%s]}`
		w.Write([]byte(fmt.Sprintf(fst, t)))
	}
}

func getStockIdByCode(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	eng := models.GetEngine()
	barcode := &models.Barcode{}
	has, err := eng.Where("code = ?", code).Get(barcode)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"条形码信息有误"}`))
		return
	}
	w.Write([]byte(fmt.Sprintf(`{"commodity":%d}`, barcode.Commodity)))
}

func getStock(w http.ResponseWriter, r *http.Request) {
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
		"stock.available_amount", "commodity.is_main_unit", "stock.unit", "commodity.specification", "stock.commodity", "commodity.class_id", "stock.home_page",
		"stock.expiration_time", "stock.warn_time", "commodity.commodity_no", "stock.commodity_type"}, &tables, table,
		[][]string{{"INNER", "commodity", "stock.commodity = commodity.id"}},
		[]string{"stock.dept = ?", "is_main_unit"}, []string{dept, units}, []string{"in"})
	fs := `[%d,"%s",%f,%d,%f,%f,%d,%d,%d,%d,%f,%f,%f,%d,"%s","%s",%d,"%s",%d,"%s","%s","%s",%d,"%s"],`
	s := ""
	for _, u := range tables {
		file := &models.CommodityFile{}
		eng.Where("commodity = ?", u.Stock.Commodity).And("seq = 0").Get(file)
		var barcode []models.Barcode
		eng.Where("commodity = ?", u.Stock.Commodity).Find(&barcode)
		codes := ""
		for _, c := range barcode {
			codes += c.Code + ","
		}

		expirationtime := schema.IntToTimeStr(u.Stock.ExpirationTime)
		warntime := u.Stock.WarnTime / 86400
		s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Amount, u.Stock.OffShelf, u.Stock.Minimum, u.Stock.StandardAmount, u.Stock.Recommended, u.Stock.Price,
			u.Stock.PriceOnsale, u.Stock.OnlineSale, u.Stock.PreorderStock, u.Stock.WarnStock, u.Stock.AvailableAmount, u.Commodity.IsMainUnit, u.Stock.Unit,
			u.Commodity.Specification, u.Stock.Commodity, u.Commodity.ClassId, u.Stock.HomePage, codes, file.FileKey, expirationtime, warntime, u.Commodity.CommodityNo)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getStockExtend(w http.ResponseWriter, r *http.Request) {
	var tree []models.CommodityClass
	_ = models.ExtQuery([]string{"id", "code", "name", "weight", "color", "visible_on_line", "image", "pid", "is_leaf"}, &tree, "pid > ?", -1)
	fs := `[%d,"%s","%s",%d,%d],`
	t := ""
	for _, u := range tree {
		t += fmt.Sprintf(fs, u.Id, u.Code, u.Name, u.Pid, u.IsLeaf)
	}
	fs = `{"tree":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, t)))
}

func getStockSsplit(w http.ResponseWriter, r *http.Request) {
	//
	stk := &StockExtend{}
	schema.FormParse(r, stk)
	var skm []StockMore
	st1 := &models.Stock{}
	com1 := &models.Commodity{}

	eng := models.GetEngine()
	has, err := eng.Where("id = ?", stk.Id).Get(st1)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"获取商品信息失败"}`))
		return
	}
	has, err = eng.Where("id = ?", stk.Commodity).Get(com1)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"获取商品信息失败"}`))
		return
	}
	sess := eng.AllCols()
	fmt.Println(st1.Dept)
	fmt.Println(com1)
	sess = sess.Join("INNER", "commodity", "stock.commodity=commodity.id")
	sess = sess.Where("commodity.commodity_no = ?", com1.CommodityNo).And("stock.dept = ?", st1.Dept)
	e := sess.Find(&skm)
	if e != nil {
		panic(e)
	} else {
		fst := `[%d,%d,"%s",%d,%d,"%s","%s"],`
		t := ""
		for _, u := range skm {
			t += fmt.Sprintf(fst, u.Stock.Id, u.Stock.Amount, u.Stock.Unit, u.Stock.StockType, u.Stock.Price, u.Commodity.Name, u.Commodity.Specification)
		}
		fst = `{"stock":[%s]}`
		w.Write([]byte(fmt.Sprintf(fst, t)))
	}
}

func updateStock(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.Stock{}
	schema.FormParse(r, tables)
	affected, err := eng.Id(tables.Id).Update(tables)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查数据"}`))
		Logger.Error(err)
		return
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查数据"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))
}
func updateStockPrice(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.Stock{}
	schema.FormParse(r, tables)
	_, err := eng.Query("UPDATE stock SET price = ? ,price_onsale = ? WHERE id = ?  ", tables.Price, tables.PriceOnsale, tables.Id)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"修改价格失败"}`))
		Logger.Error(err)
		return
	}
	w.Write([]byte(`{"res":0,"msg":"修改价格成功"}`))
}

func stockChangeAmount(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	staffid, _ := strconv.Atoi(ss.HGet(r, "staff", "staff_id"))
	tables := &StkChangeAmount{}
	schema.FormParse(r, tables)
	fmt.Println(tables)
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	addstk := &models.Stock{}
	reducestk := &models.Stock{}
	addstk.Id = tables.StockAdd
	reducestk.Id = tables.StockReduce
	session.Get(addstk)
	session.Get(reducestk)
	addamount := addstk.Amount + tables.AmountAdd
	reduceamount := reducestk.Amount - tables.AmountReduce
	if reduceamount < 0 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"库存数量不足以转换"}`))
		return
	}
	affected, err := session.Table(new(models.Stock)).Id(addstk.Id).Update(map[string]interface{}{
		"amount": addamount, "price": tables.PriceAdd})
	if err != nil || affected != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"转换失败"}`))
		Logger.Error(err)
		return
	}
	affected2, err2 := session.Table(new(models.Stock)).Id(reducestk.Id).Update(map[string]interface{}{
		"amount": reduceamount, "price": tables.PriceReduce})
	if err2 != nil || affected2 != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"转换失败"}`))
		Logger.Error(err)
		return
	}

	addcomdity := &models.Commodity{}
	reducecomdity := &models.Commodity{}
	addcomdity.Id = addstk.Commodity
	reducecomdity.Id = reducestk.Commodity
	session.Get(addcomdity)
	session.Get(reducecomdity)

	addchange := &models.StockChange{}
	addchange.Created = time.Now().Unix()
	addchange.ChangeType = 10
	addchange.Reason = fmt.Sprintf("将 %f %s 转换为 %f %s！",reduceamount,reducecomdity.Unit,addamount,addcomdity.Unit)
	addchange.Operator = staffid
	addchange.Amount = addamount
	addchange.CheckedBy = staffid
	addchange.Stock = addstk.Id
	affected, err = session.InsertOne(addchange)
	if err != nil || affected != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"转换失败"}`))
		Logger.Error(err)
		return
	}

	reducechange := &models.StockChange{}
	reducechange.Created = time.Now().Unix()
	reducechange.ChangeType = 11
	reducechange.Reason = fmt.Sprintf("将 %f %s 转换为 %f %s！",reduceamount,reducecomdity.Unit,addamount,addcomdity.Unit)
	reducechange.Operator = staffid
	reducechange.Amount = reduceamount
	reducechange.CheckedBy = staffid
	reducechange.Stock =	reducestk.Id
	affected, err = session.InsertOne(reducechange)
	if err != nil || affected != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"转换失败"}`))
		Logger.Error(err)
		return
	}
	err = session.Commit()
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		Logger.Error(err)
		return
	}
	w.Write([]byte(`{"res":0,"msg":"转换成功"}`))

}


type StockChangeMore struct {
	models.Stock     `xorm:"extends"`
	models.Commodity `xorm:"extends"`
	models.StockChange `xorm:"extends"`
	models.Staff `xorm:"extends"`
}

func (StockChangeMore) TableName() string {
	return "stock"
}
func getStockChange(w http.ResponseWriter, r *http.Request) {
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
	time1 := fmt.Sprintf("%d", queryob.Cq_time[0])
	time2 := fmt.Sprintf("%d", queryob.Cq_time[1])
	eng := models.GetEngine()
	var allstaff []models.Staff
	var tables []StockChangeMore
	table := new(StockChangeMore)
	eng.Find(&allstaff)
	n := schema.ExtJoindQuery(eng, r, []string{ "stock.id","commodity.name", "stock.commodity","commodity.class_id",
		 "commodity.unit", "commodity.specification", "commodity.commodity_no","stock.off_shelf","stock.online_sale",
		 "stock.home_page","stock.price","stock.price_onsale","stock_change.created","stock_change.change_type","stock_change.reason",
		 "staff.username","stock_change.amount","stock_change.checked_by"}, &tables, table,
		[][]string{{"INNER", "commodity", "stock.commodity = commodity.id"},
							 {"INNER", "stock_change", "stock.id = stock_change.stock"},
							 {"INNER", "staff", "stock_change.operator = staff.id"}},
		[]string{"stock.dept = ?","stock_change.change_type > ?","stock_change.change_type < ?","stock_change.created >= ?", "stock_change.created <= ?", "is_main_unit"}, []string{dept,"9","12",time1, time2, units}, []string{"and", "and","and", "and","in"})
	fs := `[%d,"%s",%d,"%s","%s","%s","%s",%d,%d,%d,%d,%d,"%s",%d,"%s","%s",%f,"%s","%s"],`
	s := ""
	for _, u := range tables {
		var barcode []models.Barcode
		eng.Where("commodity = ?", u.Stock.Commodity).Find(&barcode)
		codes := ""
		for _, c := range barcode {
			codes += c.Code + ","
		}
		created := schema.IntToTimeStr(u.StockChange.Created)
		staffname := ""
		for _,b := range allstaff{
			if b.Id == u.StockChange.CheckedBy {
				staffname = b.Username
			}
		}
		s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Commodity, u.Commodity.ClassId,
			u.Stock.Unit,u.Commodity.Specification,u.Commodity.CommodityNo,u.Stock.OffShelf, u.Stock.OnlineSale,
			u.Stock.HomePage,u.Stock.Price,u.Stock.PriceOnsale,created, u.StockChange.ChangeType, u.StockChange.Reason,
			u.Staff.Username,u.Stock.Amount, staffname,codes)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}
