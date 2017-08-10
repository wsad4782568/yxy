package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"web/schema"
	ss "web/session"
)

func PreOrderHandlers() {
	ctrl.HMAP["/sc/preorder/setpreorder"] = setPreOrder
	ctrl.HMAP["/sc/preorder/insert"] = insertPreOrder
	ctrl.HMAP["/sc/preorder/bindall"] = bindallPreOrder
	ctrl.HMAP["/sc/preorder/getpreorder"] = getPreOrders
	ctrl.HMAP["/sc/preorder/getprecoms"] = getPreComs
	ctrl.HMAP["/sc/preorder/getbystock"] = getPreOrderByStock
}

type DivPreOrder struct {
	Stock    []int `schema:"stock"`
	PreOrder int `schema:"pre_order"`
	// 售卖方式助记名字
	Name string `schema:"name"`
	// 有效范围，虚拟仓库[总库] // 必须数据部门
	Dept int `schema:"dept"`
	// 9:30
	DeliveryStart int64 `schema:"delivery_start"`
	//大于21600为开始预定日期， // 21:00
	DeliveryEnd int64 `schema:"delivery_end"`
	// 下单后配送间隔，天为单位，1为次日
	DeliveryInterval int `schema:"delivery_interval"`
	PreOrderPrice    []int `schema:"pre_order_price"`
	// 配送说明
	DeliveryHint string `schema:"delivery_hint"`
	Cdept        int    `schema:"cdept"`
}

func setPreOrder(w http.ResponseWriter, r *http.Request) {
	// //
	// defer Logger.Flush()
	// Logger.Info(ss.HGet(r, "staff", "staff_id"))
	// eng := models.GetEngine()
	// pre := &DivPreOrder{}
	// schema.FormParse(r, pre)
	// if !(pre.Stock > 0) {
	// 	w.Write([]byte(`{"res":-1,"msg":"操作失败,请检查信息"}`))
	// 	return
	// }
	// stk := &models.Stock{}
	// has1, err1 := eng.Where("id = ?", pre.Stock).Get(stk)
	// if err1 != nil || !has1 {
	// 	w.Write([]byte(`{"res":-1,"msg":"获取商品信息失败"}`))
	// 	return
	// }
	// stk.PreOrderPrice = pre.PreOrderPrice
	// stk.CommodityType = 7
	// preorder := &models.PreOrder{}
	// preorder.Name = pre.Name
	// preorder.DeliveryStart = pre.DeliveryStart
	// preorder.DeliveryEnd = pre.DeliveryEnd
	// preorder.DeliveryInterval = pre.DeliveryInterval
	// preorder.DeliveryHint = pre.DeliveryHint
	// msg := ""
	// session := eng.NewSession()
	// defer session.Close()
	// _ = session.Begin()
	// if pre.PreOrder > 0 {
	// 	affected, err := session.Id(pre.Stock).Update(stk)
	// 	if err != nil {
	// 		session.Rollback()
	// 		w.Write([]byte(`{"res":-1,"msg":"修改预定价格失败"}`))
	// 		Logger.Error(err)
	// 		return
	// 	}
	// 	if affected != 1 {
	// 		session.Rollback()
	// 		w.Write([]byte(`{"res":-1,"msg":"修改预定价格失败"}`))
	// 		return
	// 	}
	// 	preorder.Id = pre.PreOrder
	// 	affected, err = session.Id(preorder.Id).Update(preorder)
	// 	if err != nil {
	// 		session.Rollback()
	// 			Logger.Error(err)
	// 		w.Write([]byte(`{"res":-1,"msg":"修改预定方式失败"}`))
	// 		return
	// 	}
	// 	if affected != 1 {
	// 		session.Rollback()
	// 		w.Write([]byte(`{"res":-1,"msg":"修改预定方式失败"}`))
	// 		return
	// 	}
	// 	msg = "修改成功"
	// } else {
	// 	affected, err := session.InsertOne(preorder)
	// 	if err != nil {
	// 		session.Rollback()
	// 		w.Write([]byte(`{"res":-1,"msg":"新增预定方式失败"}`))
	// 		Logger.Error(err)
	// 		return
	// 	}
	// 	if affected != 1 {
	// 		session.Rollback()
	// 		w.Write([]byte(`{"res":-1,"msg":"新增预定方式失败"}`))
	// 		return
	// 	}
	// 	stk.PreOrder = preorder.Id
	// 	affected, err = session.Id(pre.Stock).Update(stk)
	// 	if err != nil {
	// 		session.Rollback()
	// 		w.Write([]byte(`{"res":-1,"msg":"指定预定方式失败"}`))
	// 		Logger.Error(err)
	// 		return
	// 	}
	// 	if affected != 1 {
	// 		session.Rollback()
	// 		w.Write([]byte(`{"res":-1,"msg":"指定预定方式失败"}`))
	// 		return
	// 	}
	// 	msg = "插入成功"
	// }
	// err := session.Commit()
	// if err != nil {
	// 	w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
	// 	Logger.Error(err)
	// 	return
	// }
	// w.Write([]byte(`{"res":0,"msg":"` + msg + `"}`))
}

func bindallPreOrder(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	pre := &DivPreOrder{}
	schema.FormParse(r, pre)
	if len(pre.Stock)<1 || pre.PreOrder <1 {
		w.Write([]byte(`{"res":-1,"msg":"缺失信息,请检查"}`))
		Logger.Error("缺失信息,请检查")
		return
	}
	session := eng.NewSession()
	defer session.Close()
	_ = session.Begin()
	preorder := &models.PreOrder{}
	has, err := eng.Where("id = ?", pre.PreOrder).Get(preorder)
	if err != nil || !has {
		w.Write([]byte(`{"res":-1,"msg":"该预定方式不存在,请检查"}`))
		Logger.Error("该预定方式不存在,请检查")
		return
	}
	for i:=0;i<len(pre.Stock);i++ {
		stk := &models.Stock{}
		has1, err1 := eng.Where("id = ?", pre.Stock[i]).Get(stk)
		if err1 != nil || !has1 {
			w.Write([]byte(`{"res":-1,"msg":"获取商品信息失败"}`))
			return
		}
		stk.PreOrderPrice = pre.PreOrderPrice[i]
		stk.CommodityType = 7
		stk.PreOrder = preorder.Id
		affected, err := session.Cols("pre_order_price","commodity_type","pre_order").Id(stk.Id).Update(stk)
		if err != nil || affected != 1  {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"绑定预定方式失败"}`))
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
	w.Write([]byte(`{"res":0,"msg":"操作成功"}`))
}


func insertPreOrder(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	pre := &models.PreOrder{}
	schema.FormParse(r, pre)
	dept := &models.Department{}
	has, erro := eng.Where("id = ?", pre.Cdept).Get(dept)
	if erro != nil || !has {
		w.Write([]byte(`{"res":-1,"msg":"获取部门信息失败"}`))
		return
	}
	pre.Dept = dept.Id
	if b, err := eng.InsertOne(pre); err != nil || b != 1 {
		w.Write([]byte(`{"res":-1,"msg":"插入错误,请检查信息"}`))
		Logger.Error(err)
		return
	}
	w.Write([]byte(`{"res":0,"msg":"插入成功"}`))
}


func getPreOrders(w http.ResponseWriter, r *http.Request) {
	//
	fmt.Println("getPreOrders")
	eng := models.GetEngine()
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	var tables []models.PreOrder
	table := &models.PreOrder{}
	dept := strconv.Itoa(queryob.Cq_dept)

	n := schema.ExtBasicQuery(eng, r, []string{"id", "name", "dept", "delivery_start", "delivery_end", "delivery_interval", "delivery_hint"}, &tables, table,
		[]string{"dept = ?"}, []string{dept}, []string{"and"})
	fs := `[%d,"%s",%d,%d,%d,%d,"%s"],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Id, u.Name, u.Dept, u.DeliveryStart, u.DeliveryEnd, u.DeliveryInterval, u.DeliveryHint)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

type compre struct {
	Stk           int `schema:"stock"`
	Pre           int `schema:"preorder"`
	PreOrderPrice int `schema:"preorderprice"`
	Cdept         int `schema:"cdept"` // 权限
}

func getPreComs(w http.ResponseWriter, r *http.Request) {
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
	n := schema.ExtJoindQuery(eng, r, []string{"stock.id", "commodity.name", "stock.amount", "stock.off_shelf", "stock.pre_order_price",
		"stock.standard_amount", "stock.recommended", "stock.price_onsale", "stock.price_onsale", "stock.online_sale", "stock.preorder_stock", "stock.warn_stock",
		"stock.available_amount", "stock.stock_type", "stock.unit", "commodity.specification", "stock.commodity", "commodity.class_id", "stock.home_page", "stock.commodity_type", "commodity.commodity_no"}, &tables, table,
		[][]string{{"INNER", "commodity", "stock.commodity = commodity.id"}},
		[]string{"stock.dept = ?", "stock.commodity_type !=?", "stock.commodity_type !=?", "stock_type"}, []string{dept, "9", "4", units}, []string{"and", "and", "in"})
	fs := `[%d,"%s",%f,%d,%d,%f,%d,%d,%d,%d,%f,%f,%f,%d,"%s","%s",%d,"%s",%d,"%s",%d],`
	s := ""
	for _, u := range tables {
		var barcode []models.Barcode
		eng.Where("commodity = ?", u.Stock.Commodity).Find(&barcode)
		codes := ""
		for _, c := range barcode {
			codes += c.Code + ","
		}
		s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Amount, u.Stock.OffShelf, u.Stock.PreOrderPrice, u.Stock.StandardAmount, u.Stock.Recommended, u.Stock.PriceOnsale,
			u.Stock.PriceOnsale, u.Stock.OnlineSale, u.Stock.PreorderStock, u.Stock.WarnStock, u.Stock.AvailableAmount, u.Stock.StockType, u.Stock.Unit,
			u.Commodity.Specification, u.Stock.Commodity, u.Commodity.ClassId, u.Stock.HomePage, codes, u.Stock.CommodityType)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getPreOrderByStock(w http.ResponseWriter, r *http.Request) {
	//复杂查询
	stk := &models.Stock{}
	schema.FormParse(r, stk)
	eng := models.GetEngine()
	has, err := eng.Where("id = ?", stk.Id).Get(stk)
	if !has || err != nil {
		w.Write([]byte(`{"res":0,"preorder":[]}`))
		return
	}
	preorder := &models.PreOrder{}
	has, err = eng.Where("id = ?", stk.PreOrder).Get(preorder)
	if !has || err != nil {
		w.Write([]byte(`{"res":0,"preorder":[]}`))
		return
	}
	fs := `[%d,"%s",%d,%d,%d,%d,"%s",%d]`
	s := ""
	s += fmt.Sprintf(fs, preorder.Id, preorder.Name, preorder.Dept, preorder.DeliveryStart, preorder.DeliveryEnd,
		preorder.DeliveryInterval, preorder.DeliveryHint, stk.PreOrderPrice)

	fs = `{"res":0,"preorder":%s}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}
