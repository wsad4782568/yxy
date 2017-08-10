package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"time"
//	"web/redi"
	"web/schema"
	ss "web/session"
)

func LowerPriceHandlers() {
	ctrl.HMAP["/sc/lowerprice/getstock"] = getLowerPriceStock               //查看tbl现有商品
	ctrl.HMAP["/sc/lowerprice/gettransfer"] = getLowerTransfer              //查看计划
	ctrl.HMAP["/sc/lowerprice/getbylowerprice"] = getStockByLowerPriceStock //查询原有的特价
	ctrl.HMAP["/sc/lowerprice/getbarcode"] = getLowerPriceBarcode           //显示现有特价商品的条形码和价格
	ctrl.HMAP["/sc/lowerprice/makenew"] = makeLowPriceCommodity             //新增特价商品
	//ctrl.HMAP["/sc/lowerprice/newpaln"] = newLowerPricePlan                 //新的计划，
	ctrl.HMAP["/sc/lowerprice/updatelowerprice"] = updateLowerPrice         //修改条形码和价格
	//ctrl.HMAP["/sc/lowerprice/pass"] = passLowerTransfer                    //审核通过，直接修改库存
	//ctrl.HMAP["/sc/lowerprice/unpass"] = unpassLowerTransfer
	ctrl.HMAP["/sc/lowerprice/getLoswePriceStock"] = getLoswePriceStock
	ctrl.HMAP["/sc/lowerprice/getNormalById"] = getNormalById
	ctrl.HMAP["/sc/lowerprice/addamount"] = addLowerPriceAmount
}

type NewLowPrice struct {
	Stockid int    `schema:"stockid"`
	Code    string `schema:"code"`
	Price   int    `schema:"price"`
	Cdept   int    `schema:"cdept"`
}

func getLowerPriceStock(w http.ResponseWriter, r *http.Request) {
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
	n := schema.ExtJoindQuery(eng, r, []string{"stock.id", "commodity.name", "stock.amount",
		"stock.price", "stock.price_onsale", "stock.minimum", "stock.stock_type",
		"stock.unit", "commodity.specification", "stock.commodity", "commodity.class_id", "commodity.is_main_unit",
		"commodity.commodity_no"},
		&tables, table, [][]string{{"INNER", "commodity", "stock.commodity = commodity.id"}},
		[]string{"stock.dept = ?", "is_main_unit"},
		[]string{dept, units}, []string{"in"})
	fs := `[%d,"%s",%f,%d,%d,%f,%d,"%s","%s",%d,"%s",%d,"%s","%s"],`
	s := ""
	for _, u := range tables {
		var barcode []models.Barcode
		eng.Where("commodity = ?", u.Stock.Commodity).Find(&barcode)
		codes := ""
		for _, c := range barcode {
			codes += c.Code + ","
		}
		s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Amount, u.Stock.Price,
			u.Stock.PriceOnsale, u.Stock.Minimum, u.Stock.StockType,
			u.Stock.Unit, u.Commodity.Specification, u.Stock.Commodity, u.Commodity.ClassId,
			u.Commodity.IsMainUnit, u.Commodity.CommodityNo, codes)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}
func getStockByLowerPriceStock(w http.ResponseWriter, r *http.Request) {
	//
	tables := &NewLowPrice{}
	schema.FormParse(r, tables)
	stk := &models.Stock{}
	staffdept := r.URL.Query().Get("cdept")
	var cmrel []ComRelMore
	eng := models.GetEngine()
	eng.Where("id = ?", tables.Stockid).Get(stk)
	fmt.Println(stk)
	sess := eng.AllCols()
	sess = sess.Join("INNER", "commodity", "commodity_rel.comm_b=commodity.id")
	sess = sess.Join("INNER", "stock", "commodity.id=stock.commodity")
	sess = sess.Where("commodity_rel.comm_a = ?", stk.Commodity).And("rel_type = ?", 6).And("stock.dept = ?", staffdept)
	e := sess.Find(&cmrel)
	if e != nil {
		panic(e)
	} else {
		if len(cmrel) < 1 {
			w.Write([]byte(`{"res":-1,"msg":"没有特价商品"}`))
			return
		} else {
			fst := `[%d,"%s",%f,%d,"%s","%s",%d,%d],`
			t := ""
			for _, u := range cmrel {
				t += fmt.Sprintf(fst, u.Stock.Id, u.Commodity.Name, u.Stock.Amount,
					u.Stock.PriceOnsale, u.Commodity.Specification, u.Commodity.Unit, u.Commodity.Id, u.Stock.Price)
			}
			fst = `{"stock":[%s]}`
			w.Write([]byte(fmt.Sprintf(fst, t)))
		}
	}
}

func getLowerTransfer(w http.ResponseWriter, r *http.Request) {
	//
	eng := models.GetEngine()
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	dept := strconv.Itoa(queryob.Cq_dept)
	time1 := fmt.Sprintf("%d", queryob.Cq_time[0])
	time2 := fmt.Sprintf("%d", queryob.Cq_time[1])
	var tables []models.StockTransfer
	table := new(models.StockTransfer)
	n := schema.ExtBasicQuery(eng, r, []string{"stock_transfer.id", "stock_transfer.status", "stock_transfer.ticket_code",
		"stock_transfer.out_memo", "stock_transfer.in_memo", "stock_transfer.created", "stock_transfer.updatetime",
		"stock_transfer.handler_out", "stock_transfer.check_by", "stock_transfer.handler_in", "stock_transfer.dept_out"},
		&tables, table, []string{"stock_transfer.dept_out = ?", "stock_transfer.transfer_type = ?",
			"stock_transfer.updatetime >= ?", "stock_transfer.updatetime <= ?"}, []string{dept, "5", time1, time2}, []string{"and", "and", "and"})
	fs := `[%d,%d,"%s","%s","%s","%s","%s",%d,%d,%d,%d],`
	s := ""
	for _, u := range tables {
		created := schema.IntToTimeStr(u.Created)
		updatetime := schema.IntToTimeStr(u.Updatetime)
		s += fmt.Sprintf(fs, u.Id, u.Status, u.TicketCode, u.OutMemo, u.InMemo,
			created, updatetime, u.HandlerOut, u.CheckBy, u.HandlerIn, u.DeptOut)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}
func getLowerPriceBarcode(w http.ResponseWriter, r *http.Request) {
	//
	tables := &NewLowPrice{}
	schema.FormParse(r, tables)
	stk := &models.Stock{}
	bcd := &models.Barcode{}
	eng := models.GetEngine()
	eng.Where("id = ?", tables.Stockid).Get(stk)
	eng.Where("commodity = ?", stk.Commodity).Get(bcd)
	fst := `[%d,"%s"],`
	t := ""
	t += fmt.Sprintf(fst, stk.PriceOnsale, bcd.Code)
	fst = `{"barcode":%s}`
	w.Write([]byte(fmt.Sprintf(fst, t)))
}

func updateLowerPrice(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &NewLowPrice{}
	schema.FormParse(r, tables)
	stk := &models.Stock{}
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	has, err := session.Where("id = ?", tables.Stockid).Get(stk)
	if !has || err != nil {
		Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"特价商品信息有误"}`))
		return
	} else {
		_, err = session.Exec("update stock set price_onsale=? where id=?", tables.Price, tables.Stockid)
		if err != nil {
			Logger.Error(err)
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"修改价格失败，请检查信息"}`))
			return
		} else {
			_, err = session.Exec("update barcode set code=? where commodity=?", tables.Code, stk.Commodity)
			if err != nil {
				Logger.Error(err)
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"修改条形码失败，请检查信息"}`))
				return
			} else {

			}
		}
	}
	err = session.Commit()
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		Logger.Error(err)
		return
	}
	w.Write([]byte(`{"res":0,"msg":"修改特价商品信息成功"}`))
}

// func newLowerPricePlan(w http.ResponseWriter, r *http.Request) {
// 	defer Logger.Flush()
// 	Logger.Info(ss.HGet(r, "staff", "staff_id"))
// 	tables := &transferExtend{}
// 	schema.FormParse(r, tables)
// 	staffid := ss.HGet(r, "staff", "staff_id")
// 	staffdept := r.URL.Query().Get("cdept")
// 	eng := models.GetEngine()
// 	stocktransfer := &models.StockTransfer{}
// 	stocktransfer.TicketCode = redi.GetStockTransferNo()
// 	stocktransfer.Status = 1
// 	stocktransfer.OutMemo = tables.OutMemo
// 	stocktransfer.Updatetime = time.Now().Unix()
// 	stocktransfer.DeptOut, _ = strconv.Atoi(staffdept)
// 	stocktransfer.HandlerOut, _ = strconv.Atoi(staffid)
// 	stocktransfer.DeptIn, _ = strconv.Atoi(staffdept)
// 	stocktransfer.HandlerIn, _ = strconv.Atoi(staffid)
// 	stocktransfer.TransferType = 5
// 	session := eng.NewSession()
// 	defer session.Close()
// 	err := session.Begin()
// 	if tables.Id > 0 && tables.Status == 1 {
// 		stocktransfer.Id = tables.Id
// 		_, err = session.Exec("delete from stock_transfer_item where stock_transfer = ?", tables.Id)
// 		_, err = session.Id(tables.Id).Update(stocktransfer)
// 	} else {
// 		stocktransfer.Created = time.Now().Unix()
// 		_, err = session.Insert(stocktransfer)
// 	}
// 	if err != nil {
// 		fmt.Println(err.Error())
// 		session.Rollback()
// 		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
// 		return
// 	} else {
// 		length := len(tables.StockId)
// 		for i := 0; i < length; i++ {
// 			stocktansferitem := &models.StockTransferItem{}
// 			stocktansferitem.Stock = tables.StockId[i]
// 			stocktansferitem.OutAmount = tables.Amount[i]
// 			stocktansferitem.StockTransfer = stocktransfer.Id
// 			stocktansferitem.Price = tables.Price[i]
// 			_, err = session.Insert(stocktansferitem)
// 			if err != nil {
// 				fmt.Println(err.Error())
// 				session.Rollback()
// 				w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查调度商品信息"}`))
// 				return
// 			}
// 		}
// 	}
// 	err = session.Commit()
// 	if err != nil {
// 		return
// 	}
// 	if tables.Id > 0 && tables.Status == 1 {
// 		w.Write([]byte(`{"res":0,"msg":"特价计划修改成功"}`))
// 		return
// 	}
// 	w.Write([]byte(`{"res":0,"msg":"特价计划申请成功"}`))
// }

func passLowerTransfer(w http.ResponseWriter, r *http.Request) {
	tables := &transferExtend{}
	schema.FormParse(r, tables)
	staffid, _ := strconv.Atoi(ss.HGet(r, "staff", "staff_id"))
	staffdept := r.URL.Query().Get("cdept")
	eng := models.GetEngine()
	stocktransfer := &models.StockTransfer{}
	stocktransfer.Id = tables.Id
	has, _ := eng.Get(stocktransfer)
	if !has {
		w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查信息"}`))
		return
	}
	if stocktransfer.Status != 1 {
		w.Write([]byte(`{"res":-1,"msg":"否决失败，计划不是待审状态"}`))
		return
	}
	stocktransfer.Status = 3
	stocktransfer.Updatetime = time.Now().Unix()
	stocktransfer.CheckBy = staffid
	stocktransfer.InMemo = tables.InMemo
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	_, err = session.Id(tables.Id).Update(stocktransfer)
	if err != nil {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查信息"}`))
		return
	}
	if err != nil {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"审核失败，请检查信息"}`))
		return
	} else {
		var items []models.StockTransferItem
		session.Where("stock_transfer = ? ", stocktransfer.Id).Find(&items)
		length := len(items)
		for i := 0; i < length; i++ {
			stock := &models.Stock{}
			stock.Id = items[i].Stock
			eng.Get(stock)
			cmsrel := &models.CommodityRel{}
			eng.Where("comm_b = ?", stock.Commodity).And("rel_type = ?", 6).Get(cmsrel)
			stock_old := &models.Stock{}
			eng.Where("commodity = ?", cmsrel.CommA).And("dept = ?", staffdept).Get(stock_old)
			if stock_old.Id < 1 {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"找不到原价商品"}`))
				return
			}
			var amountLowerPrice float64
			var amountOld float64
			amountLowerPrice = stock.Amount + items[i].OutAmount //原有的数量加新增的数量
			amountOld = stock_old.Amount - items[i].OutAmount    //原来的商品数量 要减去 申请的数量
			if amountOld < 0 {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"申请特价商品的数量小于现有数量"}`))
				return
			}
			_, err = session.Exec("update stock set amount=? where id=?", amountOld, stock_old.Id)
			if err != nil {
				fmt.Println(err.Error())
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"减少原价商品数量失败"}`))
				return
			}
			_, err = session.Exec("update stock set amount = ? ,price = ?where id=?", amountLowerPrice, items[i].Price, stock.Id)
			if err != nil {
				fmt.Println(err.Error())
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"增加特价商品数量失败"}`))
				return
			} else {
				changeOut := &models.StockChange{}
				changeOut.Created = time.Now().Unix()
				changeOut.ChangeType = 5
				changeOut.Reason = "特价处理商品"
				changeOut.Operator = stocktransfer.HandlerOut
				changeOut.Amount = items[i].OutAmount
				changeOut.CheckedBy = tables.CheckBy
				changeOut.RelId = stocktransfer.Id
				changeOut.Stock = stock_old.Id
				_, err = session.Insert(changeOut)
				if err != nil {
					fmt.Println(err.Error())
					session.Rollback()
					w.Write([]byte(`{"res":-1,"msg":"出库失败，请检查信息"}`))
					return
				}
				changeIn := &models.StockChange{}
				changeIn.Created = time.Now().Unix()
				changeIn.ChangeType = 5
				changeIn.Reason = stocktransfer.OutMemo
				changeIn.Operator = stocktransfer.HandlerOut
				changeIn.Amount = items[i].OutAmount
				changeIn.CheckedBy = tables.CheckBy
				changeIn.RelId = stocktransfer.Id
				changeIn.Stock = items[i].Stock
				_, err = session.Insert(changeIn)
				if err != nil {
					fmt.Println(err.Error())
					session.Rollback()
					w.Write([]byte(`{"res":-1,"msg":"出库失败，请检查信息"}`))
					return
				}
			}
		}
	}
	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"快速出库完成"}`))
}

func makeLowPriceCommodity(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &NewLowPrice{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	st := &models.Stock{}
	has, err := session.Where("id = ?", tables.Stockid).Get(st)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"商品信息有误"}`))
		return
	}
	commodity := &models.Commodity{}
	has, err = session.Where("id = ?", st.Commodity).Get(commodity)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"商品信息有误"}`))
		return
	}
	newcoms := &models.Commodity{}
	newcoms.Name = commodity.Name + "(特)"
	newcoms.ClassCode = commodity.ClassCode
	newcoms.Dept = commodity.Dept
	newcoms.Intro = commodity.Intro
	newcoms.IsMainUnit = commodity.IsMainUnit
	newcoms.Price = tables.Price
	newcoms.Specification = commodity.Specification
	newcoms.Supplier = commodity.Supplier
	newcoms.CommodityType = 9
	newcoms.ClassId = commodity.ClassId
	newcoms.Unit = commodity.Unit
	newcoms.DiscountOn = commodity.DiscountOn
	newcoms.Coupon = commodity.Coupon
	newcoms.CouponOn = commodity.CouponOn
	newcoms.OnlineBuy = commodity.OnlineBuy
	newcoms.Details = commodity.Details
	//默认值
	newcoms.CommodityNo = commodity.CommodityNo

	affected, err := session.Insert(newcoms)
	if err != nil {
		session.Rollback()
		Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}
	if affected == 0 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}

	//同时增加特价商品关系，都是以上架单位为准
	ComRel := &models.CommodityRel{}
	ComRel.CommA = st.Commodity
	ComRel.CommB = newcoms.Id
	ComRel.RelType = 6
	affected2, err2 := session.Insert(ComRel)
	if err2 != nil {
		session.Rollback()
		Logger.Error(err2)
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}
	if affected2 == 0 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}

	//copy 图片信息
	var cmfiles []models.CommodityFile
	_ = session.Where("commodity = ?", commodity.Id).Find(&cmfiles)
	for _, u := range cmfiles {
		cmf := &models.CommodityFile{}
		cmf.Commodity = newcoms.Id
		cmf.FileKey = u.FileKey
		cmf.FileKey = u.FileKey
		cmf.Seq = u.Seq
		affected2, err2 := session.Insert(cmf)
		if err2 != nil {
			session.Rollback()
			Logger.Error(err2)
			w.Write([]byte(`{"res":-1,"msg":"同步图片失败"}`))
			return
		}
		if affected2 == 0 {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"同步图片失败"}`))
			return
		}
	}
	barcode := &models.Barcode{}
	barcode.Commodity = ComRel.CommB
	barcode.Code = tables.Code
	affected3, err3 := session.Insert(barcode)
	if err3 != nil {
		session.Rollback()
		Logger.Error(err3)
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}
	if affected3 == 0 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查条形码信息"}`))
		return
	}

	err = session.Commit()
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		Logger.Error(err)
		return
	}
	w.Write([]byte(`{"res":0,"msg":"插入成功"}`))
}

func unpassLowerTransfer(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &transferExtend{}
	schema.FormParse(r, tables)
	staffid, _ := strconv.Atoi(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	stocktransfer := &models.StockTransfer{}
	stocktransfer.Id = tables.Id
	has, _ := eng.Get(stocktransfer)
	if !has {
		w.Write([]byte(`{"res":-1,"msg":"否决失败，请检查信息"}`))
		return
	}
	if stocktransfer.Status != 1 {
		w.Write([]byte(`{"res":-1,"msg":"否决失败，计划不是待审状态"}`))
		return
	}
	stocktransfer.Status = 4
	stocktransfer.Updatetime = time.Now().Unix()
	stocktransfer.CheckBy = staffid
	stocktransfer.InMemo = tables.InMemo
	affected, err := eng.Id(tables.Id).Update(stocktransfer)
	if err != nil || affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"否决失败，请检查信息"}`))
		Logger.Error(err)
		return
	}
	w.Write([]byte(`{"res":0,"msg":"否决计划成功"}`))
}

func getLoswePriceStock(w http.ResponseWriter, r *http.Request) {
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
		[]string{"stock.dept = ?", "commodity.commodity_type = ?", "stock_type"}, []string{dept, "9", units}, []string{"and", "in"})
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

func getNormalById(w http.ResponseWriter, r *http.Request) {
	//
	tables := &models.Stock{}
	schema.FormParse(r, tables)
	var cmrel []ComRelMore
	eng := models.GetEngine()
	has, err := eng.Get(tables)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"获取正常商品信息失败"}`))
		return
	}
	fmt.Println(tables)
	sess := eng.AllCols()
	sess = sess.Join("INNER", "commodity", "commodity_rel.comm_a=commodity.id")
	sess = sess.Join("INNER", "stock", "commodity_rel.comm_a=stock.commodity")
	sess = sess.Where("commodity_rel.comm_b = ?", tables.Commodity).And("rel_type = ?", 6).And("stock.dept = ?", tables.Dept)
	e := sess.Find(&cmrel)
	if e != nil {
		w.Write([]byte(`{"res":-1,"msg":"获取正常商品信息失败"}`))
		fmt.Println(err.Error())
		return
	}
	if len(cmrel) < 1 {
		w.Write([]byte(`{"res":-1,"msg":"获取正常商品信息失败"}`))
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

type lowerPriceAdd struct {
	LowerStockId  int     `schema:"lowerstockid"`
	NormelStockId int     `schema:"normelstockid"`
	Amount        float64 `schema:"amount"`
	Name          string  `schema:"name"`
	Status        int     `schema:"status"`
	Cdept         int     `schema:"cdept"`
}

func addLowerPriceAmount(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	staffid, err := strconv.Atoi(ss.HGet(r, "staff", "staff_id"))
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"员工登录超时"}`))
		return
	}
	tables := &lowerPriceAdd{}
	schema.FormParse(r, tables)
	lstk := &models.Stock{}
	nstk := &models.Stock{}
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err = session.Begin()
	has, err := session.Where("id = ?", tables.LowerStockId).Get(lstk)
	if !has || err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"获取特价商品信息失败"}`))
		return
	}

	has, err = session.Where("id = ?", tables.NormelStockId).Get(nstk)
	if !has || err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"获取原价商品信息失败"}`))
		return
	}
	changeAmountMsg := ""
	normel := ""
	if tables.Status == 1 { //增加
		lstk.Amount += tables.Amount
		nstk.Amount -= tables.Amount
		changeAmountMsg = "增加"
		normel = "减少"
		if nstk.Amount < 0 {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"原价商品数量不够"}`))
			return
		}
	} else { //减少
		lstk.Amount -= tables.Amount
		nstk.Amount += tables.Amount
		changeAmountMsg = "减少"
		normel = "增加"
		if lstk.Amount < 0 {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"特价商品数量不足"}`))
			return
		}
	}

	_, err = session.Query("UPDATE stock SET amount = ? WHERE id = ?  ", lstk.Amount, lstk.Id)
	if err != nil {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"` + changeAmountMsg + `特价商品数量失败"}`))
		return
	}

	_, err = session.Query("UPDATE stock SET amount = ? WHERE id = ?  ", nstk.Amount, nstk.Id)
	if err != nil {
		Logger.Error(err)
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"` + normel + `原价商品数量失败"}`))
		return
	}
	if tables.Status == 1 {
		change := &models.StockChange{}
		change.Amount = tables.Amount
		change.ChangeType = 4
		change.Stock = nstk.Id
		change.Reason = "转换成" + tables.Name
		change.CheckedBy = staffid
		change.Created = time.Now().Unix()
		change.Operator = staffid
		change.RelId = lstk.Id
		affected, err := session.InsertOne(change)
		if affected != 1 || err != nil {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"记录` + tables.Name + `的数量修改失败"}`))
			Logger.Error(err)
			return
		}
	} else {
		change := &models.StockChange{}
		change.Amount = tables.Amount
		change.ChangeType = 4
		change.Stock = lstk.Id
		change.Reason = "退还特价商品" + tables.Name
		change.CheckedBy = staffid
		change.Created = time.Now().Unix()
		change.Operator = staffid
		change.RelId = nstk.Id
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
	w.Write([]byte(`{"res":0,"msg":"增加数量成功"}`))
}
