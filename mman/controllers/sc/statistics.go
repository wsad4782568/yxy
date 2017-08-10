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

func Statisticstrue() {
	ctrl.HMAP["/sc/statistics/statisticsplan"] = statisticstrueplan     // 采购的统计
	ctrl.HMAP["/sc/statistics/statisticsorder"] = statisticsorder       // 销售统计
	ctrl.HMAP["/sc/statistics/statisticssupplier"] = statisticssupplier //供应商统计
	ctrl.HMAP["/sc/statistics/getSubdistrictById"] = getSubdistrictById
	ctrl.HMAP["/sc/statistics/manageorder"] = manageorder //订单管理
	ctrl.HMAP["/sc/statistics/getClass"] = getClass
	ctrl.HMAP["/sc/statistics/getorderinfo"] = getorderinfo       //查看订单详情
	ctrl.HMAP["/sc/statistics/searchcommodity"] = searchcommodity //商品名字模糊查询
	ctrl.HMAP["/sc/statistics/wastesingle"] = wastesingle         //废除订单

}

type orderinfo struct {
	models.Orders       `xorm:"extends"`
	models.OrdersDetail `xorm:"extends"`
	models.Commodity    `xorm:"extends"`
}

func (orderinfo) TableName() string {
	return "orders"
}

type getsubdistrict struct { //得到和本部门所有相关的信息
	models.Subdistrict  `xorm:"extends"`
	models.DeliveryType `xorm:"extends"`
	Cdept               int `xorm:"-" schema:"cdept"`
}

func (getsubdistrict) TableName() string {
	return "subdistrict"
}

type plan struct {
	Code          string  `schema:"code"`
	Sum           float64 `schema:"sum"`
	Id            int     `schema:"id"`
	Name          string  `schema:"name"`
	Unit          string  `schema:"unit"`
	Specification string  `schema:"specification"`
	Price         int     `schema:"price"`
	Classname     string  `schema:"classname"`
	Classid       int     `schema:"classid"`
}

type order struct {
	Code          string  `schema:"code"`
	Sum           float64 `schema:"sum"`
	Id            int     `schema:"id"`
	Name          string  `schema:"name"`
	Unit          string  `schema:"unit"`
	Specification string  `schema:"specification"`
	Priceonsale   int     `schema:"priceonsale"`
	Classname     string  `schema:"classname"`
	Classid       int     `schema:"classid"`
	Price         int     `schema:"price"`
}

type supplier struct {
	Classid   int `schema:"classid"`
	Supplier  int `schema:"supplier"`
	Cdept     int `xorm:"-" schema:"cdept"`
	StartTime int `schema:"starttime"`
	EndTime   int `schema:"endtime"`
	//1.部门不全部，2部门全部
	Flag int `schema:"flag"`
}

type supplierext struct {
	Amount        float64 `schema:"amount"`
	Commodity     int     `schema:"commodity"`
	Unit          string  `schema:"unit"`
	Specification string  `schema:"specification"`
	Class         int     `schema:"class"`
	Price         int     `schema:"price"`
	Name          string  `schema:"name"`
}

type planext struct {
	StartTime int64 `schema:"starttime"`
	EndTime   int64 `schema:"endtime"`
	Cdept     int   `xorm:"-" schema:"cdept"`
	//1代表全部 2选择了类别全部，没有选择部门全部
	//3选择了部门全部，没有选择类全部
	//4两个都没选全部
	Flag        int `schema:"flag"`
	Class       int `schema:"class"`
	Commodityno int `schema:"commodityno"`
}

type orderext struct {
	StartTime int `schema:"starttime"`
	EndTime   int `schema:"endtime"`
	Cdept     int `xorm:"-" schema:"cdept"`
	//1代表全部 2选择了类别全部，部门全部，线上不全部
	//3选择了类别全部，线上全部，部门不全部
	//4线上全部，部门全部，类别不全部
	//5部门全选，其他两个选一个
	//6类别全选，其他两个选一个
	//7线上全选，其他两个选一个
	//8都选
	Flag        int `schema:"flag"`
	Class       int `schema:"class"`
	Is_online   int `schema:"is_online"` //线上是2，线下是1
	Subdistrict int `schema:"subdistrict"`
	Commodityno int `schema:"commodityno"`
}

type ordersMore struct {
	models.Orders       `xorm:"extends"`
	models.OrdersDetail `xorm:"extends"`
}

func (ordersMore) TableName() string {
	return "orders"
}

func statisticstrueplan(w http.ResponseWriter, r *http.Request) {
	var tables []plan
	table := &planext{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	sql := "select commodity_class.pid as classid,sum(stock_change.amount) ,stock.id,commodity_class.name as classname,code,commodity.name,commodity.specification,commodity.unit,stock_change.price from stock_change inner join stock on stock_change.stock=stock.id inner join commodity on stock.commodity=commodity.id inner join commodity_class on commodity.class_id=commodity_class.code where  stock_change.change_type in (1,9,2) and created>? and created<? "
	var condition []int
	if table.Cdept > 0 {
		sql = sql + "and stock.dept=?"
		condition = append(condition, table.Cdept)
	}
	if table.Class > 0 {
		sql = sql + "and commodity_class.pid=?"
		condition = append(condition, table.Class)
	}
	if table.Commodityno > 0 {
		sql = sql + "and commodity.commodity_no=?"
		condition = append(condition, table.Commodityno)
	}
	sql = sql + " group by stock.id,commodity_class.name,code,commodity.name,commodity.specification,commodity.unit,stock_change.price, commodity_class.id"

	if len(condition) == 0 {
		err := eng.Sql(sql, table.StartTime, table.EndTime).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	if len(condition) == 1 {
		err := eng.Sql(sql, table.StartTime, table.EndTime, condition[0]).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	if len(condition) == 2 {
		err := eng.Sql(sql, table.StartTime, table.EndTime, condition[0], condition[1]).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}
	if len(condition) == 3 {
		err := eng.Sql(sql, table.StartTime, table.EndTime, condition[0], condition[1], condition[2]).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}
	fs := `%s[%d,"%s","%s",%d,"%s","%s","%s",%d,%f],`
	s := ""
	for _, u := range tables {
		s = fmt.Sprintf(fs, s, u.Classid, u.Classname, u.Code, u.Id, u.Name, u.Specification, u.Unit, u.Price, u.Sum)
	}
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

//func statisticsorder(w http.ResponseWriter, r *http.Request) {
//	var tables []order
//	table := &orderext{}
//	schema.FormParse(r, table)
//	eng := models.GetEngine()
//	if table.Flag == 1 {
//		eng.Sql("select commodity.id,commodity_class.pid as classid,sum(orders_detail.amount) ,commodity_class.name as classname,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale  from orders  inner join orders_detail on orders.id=orders_detail.orders inner join commodity on commodity.id=orders_detail.commodity inner join commodity_class on commodity.class_id=commodity_class.code where update_time>? and update_time<? group by commodity.id,commodity_class.pid  ,commodity_class.name ,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale ", table.StartTime, table.EndTime).Find(&tables)
//	} else if table.Flag == 2 {
//		eng.Sql("select commodity.id,commodity_class.pid as classid,sum(orders_detail.amount) ,commodity_class.name as classname,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale  from orders  inner join orders_detail on orders.id=orders_detail.orders inner join commodity on commodity.id=orders_detail.commodity inner join commodity_class on commodity.class_id=commodity_class.code where orders.orders_type=? and  update_time>? and update_time<? group by commodity.id,commodity_class.pid  ,commodity_class.name ,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale ", table.Is_online, table.StartTime, table.EndTime).Find(&tables)
//	} else if table.Flag == 3 {
//		eng.Sql("select commodity.id,commodity_class.pid as classid,sum(orders_detail.amount) ,commodity_class.name as classname,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale  from orders  inner join orders_detail on orders.id=orders_detail.orders inner join commodity on commodity.id=orders_detail.commodity inner join commodity_class on commodity.class_id=commodity_class.code where  orders.department=? and  update_time>? and update_time<? group by commodity.id,commodity_class.pid  ,commodity_class.name ,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale ", table.Cdept, table.StartTime, table.EndTime).Find(&tables)
//	} else if table.Flag == 4 {
//		eng.Sql("select commodity.id,commodity_class.pid as classid,sum(orders_detail.amount) ,commodity_class.name as classname,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale  from orders  inner join orders_detail on orders.id=orders_detail.orders inner join commodity on commodity.id=orders_detail.commodity inner join commodity_class on commodity.class_id=commodity_class.code where  commodity_class.pid=? and update_time>? and update_time<? group by commodity.id,commodity_class.pid  ,commodity_class.name ,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale ", table.Class, table.StartTime, table.EndTime).Find(&tables)
//	} else if table.Flag == 5 {
//		eng.Sql("select commodity.id,commodity_class.pid as classid,sum(orders_detail.amount) ,commodity_class.name as classname,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale  from orders  inner join orders_detail on orders.id=orders_detail.orders inner join commodity on commodity.id=orders_detail.commodity inner join commodity_class on commodity.class_id=commodity_class.code where orders.orders_type=? and  commodity_class.pid=? and update_time>? and update_time<? group by commodity.id,commodity_class.pid  ,commodity_class.name ,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale ", table.Is_online, table.Class, table.StartTime, table.EndTime).Find(&tables)
//	} else if table.Flag == 6 {
//		eng.Sql("select commodity.id,commodity_class.pid as classid,sum(orders_detail.amount) ,commodity_class.name as classname,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale  from orders  inner join orders_detail on orders.id=orders_detail.orders inner join commodity on commodity.id=orders_detail.commodity inner join commodity_class on commodity.class_id=commodity_class.code where orders.orders_type=? and orders.department=? and update_time>? and update_time<? group by commodity.id,commodity_class.pid  ,commodity_class.name ,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale ", table.Is_online, table.Cdept, table.StartTime, table.EndTime).Find(&tables)
//	} else if table.Flag == 7 {
//		eng.Sql("select commodity.id,commodity_class.pid as classid,sum(orders_detail.amount) ,commodity_class.name as classname,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale  from orders  inner join orders_detail on orders.id=orders_detail.orders inner join commodity on commodity.id=orders_detail.commodity inner join commodity_class on commodity.class_id=commodity_class.code where  orders.department=? and commodity_class.pid=? and update_time>? and update_time<? group by commodity.id,commodity_class.pid  ,commodity_class.name ,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale ", table.Cdept, table.Class, table.StartTime, table.EndTime).Find(&tables)
//	} else if table.Flag == 8 {
//		eng.Sql("select commodity.id,commodity_class.pid as classid,sum(orders_detail.amount) ,commodity_class.name as classname,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale  from orders  inner join orders_detail on orders.id=orders_detail.orders inner join commodity on commodity.id=orders_detail.commodity inner join commodity_class on commodity.class_id=commodity_class.code where orders.orders_type=? and orders.department=? and commodity_class.pid=? and update_time>? and update_time<? group by commodity.id,commodity_class.pid  ,commodity_class.name ,commodity_class.code,commodity.name,commodity.specification,commodity.unit,orders_detail.price_onsale ", table.Is_online, table.Cdept, table.Class, table.StartTime, table.EndTime).Find(&tables)
//	}

//	fs := `%s[%d,"%s","%s",%d,"%s","%s","%s",%f,%d],`
//	s := ""
//	fmt.Println(tables)
//	for _, u := range tables {
//		s = fmt.Sprintf(fs, s, u.Classid, u.Classname, u.Code, u.Id, u.Name, u.Specification, u.Unit, u.Sum, u.PriceOnsale)
//	}
//	fs = `{'res':0,"stockinfo":[%s]}`
//	w.Write([]byte(fmt.Sprintf(fs, s)))
//}

//func statisticssupplier(w http.ResponseWriter, r *http.Request) {
//	var tables []supplierext
//	table := &supplier{}
//	schema.FormParse(r, table)
//	eng := models.GetEngine()
//	if table.Flag == 1 {
//		eng.Sql(" stock.dept=? and commodity_class.pid=? and stock_change.supplier=? and stock_change.created>? and stock_change.created<? group by commodity.id,commodity.name,commodity.unit,commodity.specification,commodity_class.id,stock.price,commodity_class.name", table.Cdept, table.Classid, table.Supplier, table.StartTime, table.EndTime).Find(&tables)
//	} else if table.Flag == 2 {
//		eng.Sql("select sum(stock_change.amount) as amount,commodity.id as commodity,commodity.name,commodity.unit,commodity.specification,commodity_class.id as class,stock.price,commodity_class.name from commodity inner join commodity_class on commodity.class_id=commodity_class.code inner join stock on stock.commodity=commodity.id inner join stock_change on stock_change.stock=stock.id where  commodity_class.pid=? and stock_change.supplier=? and stock_change.created>? and stock_change.created<? group by commodity.id,commodity.name,commodity.unit,commodity.specification,commodity_class.id,stock.price,commodity_class.name", table.Classid, table.Supplier, table.StartTime, table.EndTime).Find(&tables)
//	}

//	fs := `%s[%f,%d,"%s",%d,%d,"%s","%s"],`
//	s := ""
//	for _, u := range tables {
//		s = fmt.Sprintf(fs, s, u.Amount, u.Commodity, u.Name, u.Class, u.Price, u.Specification, u.Unit)
//	}
//	fs = `{'res':0,"stockinfo":[%s]}`
//	w.Write([]byte(fmt.Sprintf(fs, s)))
//}

func statisticssupplier(w http.ResponseWriter, r *http.Request) {
	var tables []supplierext
	table := &supplier{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	sql := "select sum(stock_change.amount) as amount,commodity.id as commodity,commodity.name,commodity.unit,commodity.specification,commodity_class.id as class,stock.price,commodity_class.name from commodity inner join commodity_class on commodity.class_id=commodity_class.code inner join stock on stock.commodity=commodity.id inner join stock_change on stock_change.stock=stock.id where stock_change.created>?"
	var condition []int
	if table.Cdept > 0 {
		sql = sql + "and stock.dept=?"
		condition = append(condition, table.Cdept)
	}
	if table.Classid > 0 {
		sql = sql + "and commodity_class.pid=?"
		condition = append(condition, table.Classid)
	}
	if table.EndTime > 0 {
		sql = sql + "  and stock_change.created<?"
		condition = append(condition, table.EndTime)
	}
	if table.Supplier > 0 {
		sql = sql + "and stock_change.supplier=?"
		condition = append(condition, table.Supplier)
	}
	sql = sql + " group by commodity.id,commodity.name,commodity.unit,commodity.specification,commodity_class.id,stock.price,commodity_class.name"

	if len(condition) == 0 {
		err := eng.Sql(sql, table.StartTime).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	if len(condition) == 1 {
		err := eng.Sql(sql, table.StartTime, condition[0]).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	if len(condition) == 2 {
		err := eng.Sql(sql, table.StartTime, condition[0], condition[1]).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	if len(condition) == 3 {
		err := eng.Sql(sql, table.StartTime, condition[0], condition[1], condition[2]).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	if len(condition) == 4 {
		err := eng.Sql(sql, table.StartTime, condition[0], condition[1], condition[2], condition[3]).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	fs := `%s[%f,%d,"%s",%d,%d,"%s","%s"],`
	s := ""
	for _, u := range tables {
		s = fmt.Sprintf(fs, s, u.Amount, u.Commodity, u.Name, u.Class, u.Price, u.Specification, u.Unit)
	}
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func statisticsorder(w http.ResponseWriter, r *http.Request) {
	var tables []order
	table := &orderext{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	sql := "select commodity.id,commodity_class.pid as classid,sum(orders_detail.amount) ,sum(orders_detail.price_onsale) as priceonsale,commodity_class.name as classname,commodity_class.code,commodity.name,commodity.specification,commodity.unit,stock.price  from orders  inner join orders_detail on orders.id=orders_detail.orders inner join commodity on commodity.id=orders_detail.commodity inner join commodity_class on commodity.class_id=commodity_class.code inner join stock on stock.commodity=commodity.id where update_time>? and orders.department=stock.dept and orders.status!=5 and orders.status!=11 and order.status!=1  "
	var condition []int
	if table.Cdept > 0 {
		sql = sql + "and orders.department=?"
		condition = append(condition, table.Cdept)
	}
	if table.Class > 0 {
		sql = sql + "and commodity_class.pid=?"
		condition = append(condition, table.Class)
	}
	if table.Is_online > 0 {
		sql = sql + "and orders.orders_type=?"
		condition = append(condition, table.Is_online)
	}
	if table.Subdistrict > 0 {
		sql = sql + "and orders.subdistrict=?"
		condition = append(condition, table.Subdistrict)
	}
	if table.EndTime > 0 {
		sql = sql + "and update_time<?"
		condition = append(condition, table.EndTime)
	}
	if table.Commodityno > 0 {
		sql = sql + "and commodity.commodity_no=?"
		condition = append(condition, table.Commodityno)
	}
	sql = sql + " group by commodity.id,commodity_class.pid  ,commodity_class.name ,commodity_class.code,commodity.name,commodity.specification,commodity.unit,stock.price"

	if len(condition) == 0 {
		err := eng.Sql(sql, table.StartTime).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	if len(condition) == 1 {
		err := eng.Sql(sql, table.StartTime, condition[0]).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	if len(condition) == 2 {
		err := eng.Sql(sql, table.StartTime, condition[0], condition[1]).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	if len(condition) == 3 {
		err := eng.Sql(sql, table.StartTime, condition[0], condition[1], condition[2]).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	if len(condition) == 4 {
		err := eng.Sql(sql, table.StartTime, condition[0], condition[1], condition[2], condition[3]).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	if len(condition) == 5 {
		err := eng.Sql(sql, table.StartTime, condition[0], condition[1], condition[2], condition[3], condition[4]).Find(&tables)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(`{"res":-1}`))
			return
		}
	}

	fs := `%s[%d,"%s","%s",%d,"%s","%s","%s",%f,%d,%d],`
	s := ""
	//	var rateOfMargin float32
	for _, u := range tables {
		//		rateOfMargin = (float32(u.PriceOnsale) - float32(u.Price)) / float32(u.PriceOnsale)
		//		fmt.Println(rateOfMargin)
		s = fmt.Sprintf(fs, s, u.Classid, u.Classname, u.Code, u.Id, u.Name, u.Specification, u.Unit, u.Sum, u.Priceonsale, u.Price)
	}
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func getSubdistrictById(w http.ResponseWriter, r *http.Request) {
	var sub []getsubdistrict
	tables := &models.DeliveryType{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Join("inner", "delivery_type", "delivery_type.subdistrict=subdistrict.id")
	sess = sess.Where("delivery_type.dept=?", tables.Dept)
	e := sess.Find(&sub)
	if e != nil {
		w.Write([]byte(`{"res":-1,"msg":"查询失败"}`))
	}
	fmt.Println(sub)
	fs := `[%d,"%s","%s"],`
	s := ""
	for _, u := range sub {
		s += fmt.Sprintf(fs, u.Subdistrict.Id, u.Subdistrict.Name, u.Subdistrict.Memo)
	}
	fs = `{"subdistrict":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func manageorder(w http.ResponseWriter, r *http.Request) {
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	dept := strconv.Itoa(queryob.Cq_dept)
	start := strconv.FormatInt(queryob.Cq_time[0], 10)
	end := strconv.FormatInt(queryob.Cq_time[1], 10)
	var tables []ordersMore
	table := new(ordersMore)
	eng := models.GetEngine()
	n := schema.ExtBasicQuery(eng, r, []string{"orders.id", "orders.name", "orders.phone", "orders.address",
		"orders.created", "orders.department", "orders.out_of_pocket", "orders.status",
		"orders.subdistrict", "orders.total_price", "orders.orders_type"}, &tables, table,
		[]string{"orders.department = ?", "created>?", "created<?"},
		[]string{dept, start, end}, []string{"and", "and"})

	fs := `[%d,"%s","%s","%s","%s",%d,%d,%d,%d,%d],`
	s := ""
	for _, u := range tables {
		created := schema.IntToTimeStr(u.Created)
		s += fmt.Sprintf(fs, u.Orders.Id, u.Orders.Name, u.Orders.Phone, u.Orders.Address,
			created, u.Orders.Department, u.Orders.OutOfPocket, u.Orders.Status, u.Orders.TotalPrice, u.Orders.OrdersType)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func getClass(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var class []models.CommodityClass
	eng := models.GetEngine()
	sess := eng.AllCols()
	err := sess.Asc("id").Where("commodity_class.visible_on_line = ?", 1).Find(&class)
	if err != nil {
		fmt.Println(err)
		w.Write([]byte(`{"res":-1}`))
		return
	}
	fs := `[%d,"%s","%s",%d,%d,%d],`
	t := ""
	for _, u := range class {
		t += fmt.Sprintf(fs, u.Id, u.Code, u.Name, u.Pid, u.IsLeaf, 1)
	}
	var module []models.Module
	sess.Where("module.flag = ?", 2).Find(&module)
	// id, , name , , ,
	mo := `[%d,"%s","%s",%d,%d,%d],`
	m := ""
	for _, v := range module {
		commoditytype := 1
		if v.Name == "预订" {
			commoditytype = 7
		}
		if v.Name == "团购" {
			commoditytype = 2
		}
		if v.Name == "代购" {
			commoditytype = 8
		}
		m += fmt.Sprintf(mo, v.Id, "", v.Name, 0, 0, commoditytype)
	}
	fs = `{"class":[%s],"module":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, t, m)))
}

func getorderinfo(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	orders := &models.Orders{}
	schema.FormParse(r, orders)
	var tables []orderinfo
	sess := eng.AllCols()
	sess.Join("INNER", "orders_detail", "orders_detail.orders = orders.id")
	sess.Join("INNER", "commodity", "orders_detail.commodity=commodity.id")
	sess.Where("orders.id= ?", orders.Id).Find(&tables)
	fs := `["%s","%s","%s","%s",%d,%d,%f],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Commodity.Name,
			u.Commodity.Unit, u.Commodity.Specification, u.OrdersDetail.Memo, u.OrdersDetail.PriceOnsale,
			u.OrdersDetail.OrderType, u.OrdersDetail.Amount)
	}
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func searchcommodity(w http.ResponseWriter, r *http.Request) {
	var tables []models.Commodity
	table := &models.Commodity{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Where("name like ?", "%"+table.Name+"%").Find(&tables)
	fs := `%s[%d,"%s","%s","%s","%s"],`
	s := ""
	for _, u := range tables {
		s = fmt.Sprintf(fs, s, u.Id, u.Name, u.Unit, u.Specification, u.CommodityNo)
	}
	fs = `{'res':0,"commodityinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func wastesingle(w http.ResponseWriter, r *http.Request) {
	tables := &models.Orders{}
	var table []models.OrdersDetail
	schema.FormParse(r, tables)
	fmt.Println(tables.Id)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	order := &models.Orders{}
	order.Id = tables.Id
	affected, err := session.Get(order)
	if err != nil || !affected {

		session.Rollback()
		panic(err)
		w.Write([]byte(`{"res":-1,"msg":"废单失败，请检查信息"}`))
		return
	}
	_, err = session.Exec("update orders set  status=? where id=?", 11, order.Id)
	if err != nil {

		session.Rollback()
		panic(err)
		w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
		return
	}
	_, err = session.Exec("update delivery set  status=? where orders=", 11, order.Id)
	if err != nil {

		session.Rollback()
		panic(err)
		w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
		return
	}
	sess := session.AllCols()
	sess.Where("orders=?", tables.Id).Find(&table)
	fmt.Println(table)
	for _, u := range table {
		if u.OrderType == 2 {
			_, err = session.Exec("update stock set available_amount=available_amount-? where commodity=? and dept=?", u.Amount, u.Commodity, order.Department)
			if err != nil {
				session.Rollback()
				panic(err)
				w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
				return
			}
		} else {
			_, err = session.Exec("update stock set amount=amount+? where commodity=? and dept=?", u.Amount, u.Commodity, order.Department)
			if err != nil {

				session.Rollback()
				panic(err)
				w.Write([]byte(`{"res":-1,"msg":"修改失败，请检查信息"}`))
				return
			}
		}

	}

	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"改单已是无效单"}`))

}
