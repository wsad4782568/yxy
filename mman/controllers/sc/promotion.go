package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"web/schema"
	//	"web/session"
)

func PromotionHandlers() {
	ctrl.HMAP["/sc/promption/bindpromotion"] = bindPromotion       //给商品绑定促销方式
	ctrl.HMAP["/sc/promotion/getpromotion"] = getPromotion         //获取促销方式
	ctrl.HMAP["/sc/promotion/makepromotion"] = makePromotion       //生成促销方式
	ctrl.HMAP["/sc/promotion/getdept"] = getDept                   //获取部门信息
	ctrl.HMAP["/sc/promotion/getcoms"] = getComs                   //获取部门信息
	ctrl.HMAP["/sc/promotion/getallgiftpackge"] = getAllGiftPackge //获取所有买送包
	//ctrl.HMAP["/sc/promotion/getcoupon"] = getCoupon
	ctrl.HMAP["/sc/promotion/getpromotioncoms"] = getPromotionComs //获取促销商品

	ctrl.HMAP["/sc/promotion/deletepromotion"] = DeletePromotion //删除promotion
}

type StockComPro struct {
	models.Stock     `xorm:"extends"`
	models.Commodity `xorm:"extends"`
	models.Promotion `xorm:"extends"`
}

func (StockComPro) TableName() string {
	return "stock"
}

type compro struct {
	Sto   []int `schema:"comid"`
	Pro   int   `schema:"promotion"`
	Cdept int   `schema:"cdept"`
}

func bindPromotion(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	cp := &compro{}
	schema.FormParse(r, cp)
	fmt.Println("cp", cp)
	if len(cp.Sto) == 0 {
		w.Write([]byte(`{"res":1,"msg":"未选择商品"}`))
		return
	}
	for i := 0; i < len(cp.Sto); i++ {
		stock := &models.Stock{}
		stock.Id = cp.Sto[i]

		b, erro := eng.Get(stock)
		if erro != nil || !b {
			fmt.Println(erro)
		}
		stock.Promotion = cp.Pro
		fmt.Println("st", stock)

		affect, err := eng.AllCols().Id(stock.Id).Update(stock)
		if err != nil || affect != 1 {
			w.Write([]byte(`{"res":1,"msg":"指定失败"}`))
			return
		}
	}

	w.Write([]byte(`{"res":0,"msg":"指定成功"}`))
}

func getPromotionComs(w http.ResponseWriter, r *http.Request) {
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
	var tables []StockComPro
	table := new(StockComPro)
	n := schema.ExtJoindQuery(eng, r, []string{"stock.id", "commodity.name",
		"stock.unit", "commodity.specification", "stock.amount", "stock.price_onsale", "stock.promotion", "promotion.promotion_flag", "promotion.gift_package", "promotion.valid_flag",
		"promotion.repeat_times", "promotion.start_time", "promotion.end_time", "promotion.cash_gift", "promotion.discount", "promotion.repeat_purchase_times"}, &tables, table,
		[][]string{{"INNER", "commodity", "stock.commodity = commodity.id"}, {"INNER", "promotion", "stock.promotion = promotion.id"}},
		[]string{"stock.dept = ?", "stock_type"}, []string{dept, units}, []string{"in"})
	//后四个 线上线下，	方式	,详情 ，优惠次数，可买该商品个数
	fs := `[%d,"%s","%s","%s","%f","%d","%s","%s","%s",%d,"%s","%s","%d"],`
	s := ""
	for _, u := range tables {
		start_time := schema.IntToTimeStr(u.Promotion.StartTime)
		end_time := schema.IntToTimeStr(u.Promotion.EndTime)
		switch u.Promotion.PromotionFlag {
		case 1: //买送
			promotionflag := "买送"
			detail := getgiftdetail(u.Promotion.GiftPackage)
			validflag := vfToString(u.Promotion.ValidFlag)
			s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Unit, u.Commodity.Specification, u.Stock.Amount, u.Stock.PriceOnsale, validflag, promotionflag, detail, u.Promotion.RepeatTimes, start_time, end_time, u.Promotion.RepeatPurchaseTimes)
		case 2: //折扣
			promotionflag := "折扣"
			detail := "该商品打" + fmt.Sprintf("%.1f", float64(u.Promotion.Discount)/10) + "折"
			validflag := vfToString(u.Promotion.ValidFlag)
			s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Unit, u.Commodity.Specification, u.Stock.Amount, u.Stock.PriceOnsale, validflag, promotionflag, detail, u.Promotion.RepeatTimes, start_time, end_time, u.Promotion.RepeatPurchaseTimes)
		case 4:
			promotionflag := "红包"
			detail := "价值" + fmt.Sprintf("%.2f", float64(u.Promotion.CashGift)/100) + "元红包"
			validflag := vfToString(u.Promotion.ValidFlag)
			s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Unit, u.Commodity.Specification, u.Stock.Amount, u.Stock.PriceOnsale, validflag, promotionflag, detail, u.Promotion.RepeatTimes, start_time, end_time, u.Promotion.RepeatPurchaseTimes)
		default:
			w.Write([]byte(`{"res":-1}`))
			return
		}
		//
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getPromotion(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getPromotion")
	eng := models.GetEngine()
	var tables []models.Promotion
	table := &models.Promotion{}

	n := schema.BasicQuery(eng, r, []string{"id", "dept", "valid_flag", "promotion_flag", "repeat_times",
		"coupon", "gift_package", "discount", "cash_gift", "start_time", "end_time", "repeat_purchase_times"}, &tables, table)
	//id 部门，范围，方式 , 详情 ,客户享用该优惠次数，开始时间，结束时间，客户可买该商品个数
	fs := `[%d,"%s","%s","%s","%s",%d,"%s","%s","%d"],`
	t := ""
	for _, u := range tables {
		start_time := schema.IntToTimeStr(u.StartTime)
		end_time := schema.IntToTimeStr(u.EndTime)
		switch u.PromotionFlag {
		case 1: //买送
			promotionflag := "买送"
			dep := getdept(u.Dept)
			detail := getgiftdetail(u.GiftPackage)
			validflag := vfToString(u.ValidFlag)
			t += fmt.Sprintf(fs, u.Id, dep, validflag, promotionflag, detail, u.RepeatTimes, start_time, end_time, u.RepeatPurchaseTimes)
		case 2: //折扣
			promotionflag := "折扣"
			dep := getdept(u.Dept)
			detail := "该商品打" + fmt.Sprintf("%.1f", float64(u.Discount)/10) + "折"
			validflag := vfToString(u.ValidFlag)
			t += fmt.Sprintf(fs, u.Id, dep, validflag, promotionflag, detail, u.RepeatTimes, start_time, end_time, u.RepeatPurchaseTimes)
		case 4:
			promotionflag := "红包"
			dep := getdept(u.Dept)
			fmt.Println("cash:", u)
			detail := "价值" + fmt.Sprintf("%.2f", float64(u.CashGift)/100) + "元红包"
			validflag := vfToString(u.ValidFlag)
			t += fmt.Sprintf(fs, u.Id, dep, validflag, promotionflag, detail, u.RepeatTimes, start_time, end_time, u.RepeatPurchaseTimes)
		default:
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}
	fmt.Println("t", t)
	w.Write([]byte(fmt.Sprintf(`{"count":%d,"rows":[%s]}`, n, t)))
}

func vfToString(vf string) string {
	var st string
	switch vf {
	case "10":
		st = "线上"
	case "01":
		st = "线下"
	case "11":
		st = "线上线下"
	}
	return st
}

//func coupon(cou int) string {
//	eng := models.GetEngine()
//	cp := &models.Coupon{}
//	cp.Id = cou
//	b, err := eng.Get(cp)
//	if err != nil || !b {
//		return ""
//	}
//	res := "面值：" + fmt.Sprintf("%.2f", float64(cp.Pv)/100) + "元"
//	return res
//}
func getgiftdetail(giftpackageid int) string {
	eng := models.GetEngine()
	gp := &models.GiftPackage{}
	gp.Id = giftpackageid
	b, err := eng.Get(gp)
	if err != nil || !b {
		return ""
	}
	res := gp.Name + "(" + gp.Intro + ")"
	return res
}
func getdept(deptid int) string {
	eng := models.GetEngine()
	dep := &models.Department{}
	dep.Id = deptid
	b, err := eng.Get(dep)
	if err != nil || !b {
		return ""
	}
	res := dep.Name
	return res
}

type GiftPackageRequest struct {
	Commodity []int  `schema:"com"` //传来的是stock id
	Name      string `schema:"name"`
	Intro     string `schema:"intro"`
	Buys      int    `schema:"buys"`
	Gifts     int    `schema:"gifts"`
}

func makeGiftPackage(pro *ProRequest) int {
	fmt.Println("makeGiftPackage")
	eng := models.GetEngine()

	gp := &GiftPackageRequest{}
	gp.Buys = pro.Buys
	gp.Gifts = pro.Gifts
	gp.Name = pro.Name
	gp.Intro = pro.Intro
	gp.Commodity = pro.Commodity
	//

	giftpackage := &models.GiftPackage{}

	giftpackage.Name = gp.Name
	giftpackage.Intro = gp.Intro
	giftpackage.Buys = gp.Buys
	giftpackage.Gifts = gp.Gifts
	if affect, err := eng.InsertOne(giftpackage); err != nil || affect != 1 {
		fmt.Println(err)
		return -1
	}
	for i := 0; i < len(gp.Commodity); i++ {
		stock := &models.Stock{}
		fmt.Println("stockid ......", gp.Commodity[i])
		stock.Id = gp.Commodity[i]
		ok, err := eng.Get(stock)
		if err != nil || !ok {
			fmt.Println(err)
			return -1
		}
		fmt.Println(stock.Commodity)
		giftitem := &models.GiftPackageItem{}
		giftitem.GiftPackage = giftpackage.Id
		giftitem.Commodity = stock.Commodity
		if affect, err := eng.InsertOne(giftitem); err != nil || affect != 1 {
			fmt.Println(err)
			return -1
		}
	}

	return giftpackage.Id
}

func getAllGiftPackge(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("getAllGiftPackge")
	eng := models.GetEngine()
	var tables []models.GiftPackage
	table := new(models.GiftPackage)
	n := schema.BasicQuery(eng, r, []string{"gift_package.id", "gift_package.name", "gift_package.intro", "gift_package.buys", "gift_package.gifts"},
		&tables, table)
	//id,name,intro,buys,gifts
	fs := `[%d,"%s","%s",%d,%d],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Id, u.Name, u.Intro, u.Buys, u.Gifts)
	}
	fmt.Println("s:", s)
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

type ProRequest struct {
	Reason              string `schema:"reason"`
	ValidFlag           string `schema:"validflag"`
	PromotionFlag       int    `schema:"promotionflag"`
	RepeatTimes         int    `schema:"repeattimes"`
	StartTime           int64  `schema:"starttime"`
	Endtiem             int64  `schema:"endtime"`
	RepeatPurchaseTimes int    `schema:"repeatpurchasetimes"`
	//1买送
	Commodity []int  `schema:"com"`
	Name      string `schema:"name"`
	Intro     string `schema:"intro"`
	Buys      int    `schema:"buys"`
	Gifts     int    `schema:"gifts"`
	//2折扣
	Discount int `schema:"discount"`
	//3优惠券
	Pv      int `schema:"pv"`
	Valid   int `schema:"valid"`
	Expired int `schema:"expired"`
	Dept    int `schema:"dept"`
	//4红包
	CashGift int `schema:"cashgift"` //红包
}

func makePromotion(w http.ResponseWriter, r *http.Request) {
	fmt.Println("makePromotion")
	eng := models.GetEngine()
	proRequest := &ProRequest{}
	pro := &models.Promotion{}
	schema.FormParse(r, proRequest)

	fmt.Println("pro", proRequest)
	pro.ValidFlag = proRequest.ValidFlag
	pro.PromotionFlag = proRequest.PromotionFlag
	pro.Reason = proRequest.Reason
	pro.RepeatTimes = proRequest.RepeatTimes
	pro.StartTime = proRequest.StartTime
	pro.EndTime = proRequest.Endtiem
	pro.RepeatPurchaseTimes = proRequest.RepeatPurchaseTimes

	if pro.PromotionFlag == 2 {
		pro.Discount = proRequest.Discount
		if affected, err := eng.InsertOne(pro); err != nil || affected != 1 {
			w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
			return
		}
		w.Write([]byte(`{"res":1}`))
		return
	}
	if pro.PromotionFlag == 4 {
		pro.CashGift = proRequest.CashGift
		if affected, err := eng.InsertOne(pro); err != nil || affected != 1 {
			w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
			return
		}
		w.Write([]byte(`{"res":1}`))
		return
	}
	if pro.PromotionFlag == 1 {
		packageid := makeGiftPackage(proRequest)
		if packageid == -1 {
			w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
			return
		} else {
			pro.GiftPackage = packageid
			if affected, err := eng.InsertOne(pro); err != nil || affected != 1 {
				fmt.Println(err)
				w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
				return
			}
			w.Write([]byte(`{"res":1}`))
			return
		}
	}

}

func getDept(w http.ResponseWriter, r *http.Request) {
	var dept []models.Department
	eng := models.GetEngine()
	sess := eng.AllCols()
	err := sess.Find(&dept)
	if err != nil {
		w.Write([]byte(`{"res":-1}`))
	}
	fs := `{"id":%d,"name":"%s"},`
	d := ""
	for _, u := range dept {
		d += fmt.Sprintf(fs, u.Id, u.Name)
	}
	fmt.Println("dept")
	w.Write([]byte(fmt.Sprintf(`{"dept":[%s]}`, d)))

}

type coms struct {
	models.Commodity `xorm:"extends"`
	models.Stock     `xorm:"extends"`
}

func (coms) TableName() string {
	return "commodity"
}

func getComs(w http.ResponseWriter, r *http.Request) {
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
		"stock.unit", "commodity.specification", "stock.amount", "stock.price_onsale", "stock.promotion", "commodity.class_id"}, &tables, table,
		[][]string{{"INNER", "commodity", "stock.commodity = commodity.id"}},
		[]string{"stock.dept = ?", "is_main_unit"}, []string{dept, units}, []string{"in"})
	fs := `[%d,"%s","%s","%s","%f","%d","%s","%s"],`
	s := ""
	for _, u := range tables {
		promess := ""
		if u.Stock.Promotion != 0 {
			promotion := &models.Promotion{}
			promotion.Id = u.Stock.Promotion
			ok, err := eng.Get(promotion)
			if err != nil || !ok {
				fmt.Println(err)
				w.Write([]byte(`{"res":-1,"msg":"获取promotion失败"}`))
				return
			}
			if promotion.PromotionFlag == 1 {
				promess = strconv.Itoa(promotion.Id) + ":" + "买送"
			}
			if promotion.PromotionFlag == 2 {
				promess = strconv.Itoa(promotion.Id) + ":" + "折扣"
			}
			if promotion.PromotionFlag == 4 {
				promess = strconv.Itoa(promotion.Id) + ":" + "红包"
			}

		} else {
			promess = "无"
		}

		s += fmt.Sprintf(fs, u.Stock.Id, u.Commodity.Name, u.Stock.Unit, u.Commodity.Specification, u.Stock.Amount, u.Stock.PriceOnsale, promess, u.Commodity.ClassId)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

//func makeCoupon(pro *ProRequest) int {
//	eng := models.GetEngine()
//	coupon := &models.Coupon{}
//	coupon.Pv = pro.Pv
//	coupon.Valid = pro.Valid
//	coupon.Expired = pro.Expired
//	fmt.Println("cp", coupon)
//	if affect, err := eng.InsertOne(coupon); err != nil || affect != 1 {
//		fmt.Println(err)
//		return -1
//	}
//	return coupon.Id
//}

//func getCoupon(w http.ResponseWriter, r *http.Request) {
//	w.Header().Set("Access-Control-Allow-Origin", "*")
//	fmt.Println("getCoupon")
//	eng := models.GetEngine()
//	var tables []models.Coupon
//	table := new(models.Coupon)

//	staffdept, _ := strconv.Atoi(session.HGet(r, "staff", "dept_id"))
//	dept := &models.Department{}
//	dept.Id = staffdept
//	affect, erro := eng.Get(dept)
//	if erro != nil || !affect {
//		w.Write([]byte(`{"res":-1,"msg":"获取部门信息失败"}`))
//		return
//	}
//	if dept.Supervisor == -1 {
//		dept.Supervisor = dept.Id
//	}
//	spvs := strconv.Itoa(dept.Supervisor)

//	n := schema.ExtBasicQuery(eng, r, []string{"id", "pv", " valid", "expired", "dept"},
//		&tables, table, []string{"dept = ?"}, []string{spvs}, []string{})
//	fs := `[%d,%d,%d,%d,"%s"],`
//	s := ""
//	for _, u := range tables {
//		dept := getdept(u.Dept)
//		s += fmt.Sprintf(fs, u.Id, u.Pv, u.Valid, u.Expired, dept)
//	}
//	fs = `{"count":%d,"rows":[%s]}`
//	w.Write([]byte(fmt.Sprintf(fs, n, s)))
//}

func DeletePromotion(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	r.ParseMultipartForm(32 << 20)
	proid, _ := strconv.Atoi(r.MultipartForm.Value["promotion"][0])
	promotion := &models.Promotion{}
	promotion.Id = proid
	ok, err := eng.Get(promotion)
	if err != nil || !ok {
		fmt.Println(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	var stocks []models.Stock
	sess := eng.AllCols()
	err = sess.Where("promotion = ?", proid).Find(&stocks)
	if err != nil {
		fmt.Println(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	if len(stocks) != 0 {
		w.Write([]byte(`{"res":-2,"msg":"这个优惠方式已经绑定商品,不能删除"}`))
		return
	}
	affected, erro := eng.Id(promotion.Id).Delete(promotion)
	if erro != nil || affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"删除失败"}`))
		return
	}
	w.Write([]byte(`{"res":1,"msg":"删除成功"}`))
}
