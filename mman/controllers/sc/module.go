package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	//	"strconv"
	//	"time"
	"web/schema"
	//	ss "web/session"
)

func Module() {
	//	ctrl.HMAP["/sc/module/getcommodity"] = getcommoditys    //得到已经上架的商品
	ctrl.HMAP["/sc/module/insert"] = insertmodule        // 插入所有情况
	ctrl.HMAP["/sc/module/inserttwo"] = insertmoduletwo  //插入新的推送类
	ctrl.HMAP["/sc/module/getmodule"] = getmodule        //得到所有module
	ctrl.HMAP["/sc/module/getclass"] = getcommodityclass //得到商品大类
	//	ctrl.HMAP["/sc/module/getmoduleclass"] = getmoduleclass //得到有class字段的module_itme
	//	//	ctrl.HMAP["/sc/module/getmodulecommodity"] = getmodulecommodity //得到有commodity的module_itme
	ctrl.HMAP["/sc/module/delete"] = deletemoduleitem // 删除相应的module_itme
	//	ctrl.HMAP["/sc/module/getcommname"] = getcommoditybyid //通过商品id得到商品名字
	//	ctrl.HMAP["/sc/module/getclassname"] = getclassbyname  //通过class的id得到class的名字
	//	ctrl.HMAP["/sc/module/updateone"] = updatemoduleone    //更新flag为1的module
	ctrl.HMAP["/sc/module/getmoduleitem"] = getmoduleitem
	ctrl.HMAP["/sc/module/showmoduleitem"] = showmoduleitem
}

//type moduleclass struct {
//	models.ModuleItem     `xorm:"extends"`
//	models.Module         `xorm:"extends"`
//	models.CommodityClass `xorm:"extends"`
//}

//func (moduleclass) TableName() string {
//	return "module_item"
//}

//type moduleinfo struct {
//	models.ModuleItem     `xorm:"extends"`
//	models.Commodity      `xorm:"extends"`
//	models.CommodityClass `xorm:"extends"`
//}

//func (moduleinfo) TableName() string {
//	return "module_item"
//}

//type modulecommodity struct {
//	models.ModuleItem `xorm:"extends"`
//	models.Module     `xorm:"extends"`
//}

//func (modulecommodity) TableName() string {
//	return "module_item"
//}

////插入module为1的情况
type moduleflagone struct {
	Seq            int    `schema:"seq"` //轮播顺序
	Image          string `schema:"image"`
	Url            string `schema:"url"`
	Module         int    `schema:"module"`
	Name           string `schema:"name"`
	Itro           string `schema:"intro"` //商品列的介绍
	Color          string `schema:"color"`
	Id             int    `schema:"id"`
	Commoditytype  int    `schema:"commoditytype"`
	Commodityclass int    `schema:"commodityclass"`
	Cdept          int    `schema:"cdept"`
}

//插入module为2的情况
type moduleflagtwo struct {
	Module         int    `schema:"module"`
	Text           string `schema:"modue"`
	Seq            int    `schema:"seq"`   //轮播顺序
	Intro          string `schema:"intro"` //商品列的介绍
	Commoditytype  int    `schema:"commoditytype"`
	Commodityclass int    `schema:"commodityclass"`
	Id             int    `schema:"id"` //更新时使用

}

//func getcommoditys(w http.ResponseWriter, r *http.Request) {
//	c_deptid, _ := strconv.Atoi(r.URL.Query().Get("cdept"))
//	dept := &models.Department{}
//	eng := models.GetEngine()
//	eng.Where("id = ?", c_deptid).Get(dept)
//	if dept.Supervisor == -1 {
//		dept.Supervisor = dept.Id
//	}
//	var c_type string
//	c_type = "2"
//	spvs := strconv.Itoa(dept.Supervisor)
//	var coms []models.Commodity
//	com := new(models.Commodity)
//	n := schema.ExtBasicQuery(eng, r, []string{"id", "name", "class_code", "intro", "price", "group_buy_price", "online_buy", "specification",
//		"supplier", "commodity_type", "dept", "unit", "class_id", "recommended", "discount_on", "coupon_on", "coupon"},
//		&coms, com, []string{"dept = ?", "is_main_unit = ? ", "online_buy=?"}, []string{spvs, c_type, "1"}, []string{"and", "and"})
//	fs := `[%d,"%s","%s","%s",%d,%d,%d,"%s",%d,%d,%d,"%s","%s",%d,%d,%d,%d],`
//	s := ""
//	for _, u := range coms {
//		s += fmt.Sprintf(fs, u.Id, u.Name, u.ClassCode, u.Intro, u.Price, u.GroupBuyPrice, u.OnlineBuy,
//			u.Specification, u.Supplier, u.CommodityType, u.Dept, u.Unit, u.ClassId, u.Recommended, u.DiscountOn, u.CouponOn, u.Coupon)
//	}
//	fs = `{"count":%d,"rows":[%s]}`
//	w.Write([]byte(fmt.Sprintf(fs, n, s)))
//}

func insertmodule(w http.ResponseWriter, r *http.Request) {
	module := &moduleflagone{}
	schema.FormParse(r, module)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	if err != nil {
		session.Rollback()
		fmt.Println(err.Error())
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	if module.Module != 0 {
		_, err = session.Exec("delete from module_item where module=? and seq=? and dept=?", module.Module, module.Seq, module.Cdept)
		if err != nil {
			session.Rollback()
			fmt.Println(err.Error())
			w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
			return
		}
	}

	moduleitem := &models.ModuleItem{}
	moduleitem.Image = module.Image
	moduleitem.Module = module.Module
	moduleitem.CommodityClass = module.Commodityclass
	moduleitem.CommodityType = module.Commoditytype
	moduleitem.Seq = module.Seq
	moduleitem.Url = module.Url
	moduleitem.Color = module.Color
	moduleitem.Intro = module.Itro
	moduleitem.Name = module.Name
	moduleitem.Dept = module.Cdept
	affected, err := session.Insert(moduleitem)
	if affected != 1 || err != nil {
		session.Rollback()
		fmt.Println(err.Error())
		w.Write([]byte(`{"res":-1,"msg":"设置失败"}`))
		return
	}
	err = session.Commit()
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		return
	}

	fs := `{"res":0,"msg":"插入成功","module":%d}`
	w.Write([]byte(fmt.Sprintf(fs, moduleitem.Id)))
}

func insertmoduletwo(w http.ResponseWriter, r *http.Request) {
	module := &moduleflagtwo{}
	eng := models.GetEngine()
	mo := &models.ModuleItem{}
	mo.CommodityClass = module.Commodityclass
	mo.CommodityType = module.Commoditytype
	affected, err := eng.InsertOne(mo)
	if err != nil || affected != 1 {
		fmt.Println(err.Error())
		w.Write([]byte(`{"res":-1,"msg":"设置失败，请检查信息"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"设置成功"}`))

}

func getmodule(w http.ResponseWriter, r *http.Request) {
	var module []models.Module
	_ = models.ExtQuery([]string{"id", "name", "intro", "flag"}, &module, "id > ?", -1)
	fs := `[%d,"%s","%s",%d],`
	t := ""
	for _, u := range module {
		t += fmt.Sprintf(fs, u.Id, u.Name, u.Intro, u.Flag)
	}
	fs = `{"module":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, t)))
}

func getcommodityclass(w http.ResponseWriter, r *http.Request) {
	var class []models.CommodityClass
	_ = models.ExtQuery([]string{"id", "code", "name"}, &class, "pid = ?", 0)
	fs := `[%d,"%s","%s"],`
	t := ""
	for _, u := range class {
		t += fmt.Sprintf(fs, u.Id, u.Code, u.Name)
	}
	fs = `{"class":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, t)))
}

//func getmoduleclass(w http.ResponseWriter, r *http.Request) {
//	var tables []moduleclass
//	table := &models.ModuleItem{}
//	schema.FormParse(r, table)
//	eng := models.GetEngine()
//	sess := eng.AllCols()
//	sess.Join("INNER", "module", "module.id = module_item.module")
//	sess.Join("INNER", "commodity_class", "module_item.commodity_class=commodity_class.id")
//	sess.Where("module_item.id= ?", table.Id).Find(&tables)
//	fs := `["%s","%s",%d,"%s",%d,"%s"],`
//	s := ""
//	for _, u := range tables {
//		s += fmt.Sprintf(fs, u.CommodityClass.Name, u.Module.Name, u.Module.Flag, u.Module.Intro,
//			u.ModuleItem.Seq, u.ModuleItem.Text)
//	}
//	fs = `{'res':0,"moduleclass":[%s]}`
//	w.Write([]byte(fmt.Sprintf(fs, s)))
//}

//func getmoduleitem(w http.ResponseWriter, r *http.Request) {
//	var tables []moduleinfo
//	table := &models.Module{}
//	schema.FormParse(r, table)
//	eng := models.GetEngine()
//	sess := eng.AllCols()
//	sess.Join("LEFT", "commodity", "commodity.id = module_item.commodity")
//	sess.Join("LEFT", "commodity_class", "commodity_class.id = module_item.commdity_class")
//	sess.Where("module_item.module= ?", table.Id).Find(&tables)
//	fs := `[%d,"%s",%d,"%s",%d,"%s",%d,"%s",%d,%d],`
//	s := ""
//	for _, u := range tables {
//		s += fmt.Sprintf(fs, u.ModuleItem.Seq, u.ModuleItem.Text, u.ModuleItem.CommodityType, u.Commodity.Name,
//			u.ModuleItem.Flag, u.ModuleItem.Image, u.ModuleItem.Id, u.CommodityClass.Name, u.CommodityClass.Id,
//			u.Commodity.Id)
//	}
//	fmt.Println(tables)
//	fs = `{'res':0,"moduleclass":[%s]}`
//	w.Write([]byte(fmt.Sprintf(fs, s)))
//}

func getmoduleitem(w http.ResponseWriter, r *http.Request) {
	table := &models.Module{}
	schema.FormParse(r, table)
	var item []models.ModuleItem
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Where("module= ?", table.Id).And("seq>?", 0).And("dept=?", table.Cdept).Find(&item)
	fs := `[%d,"%s",%d,"%s","%s","%s","%s",%d,%d],`
	t := ""
	for _, u := range item {
		t += fmt.Sprintf(fs, u.Id, u.Image, u.Seq, u.Url, u.Color, u.Name, u.Intro, u.CommodityClass, u.CommodityType)
	}
	fmt.Println(item)
	fs = `{"item":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, t)))
}

func deletemoduleitem(w http.ResponseWriter, r *http.Request) {
	table := &models.ModuleItem{}
	schema.FormParse(r, table)
	eng := models.GetEngine()
	moduleitem := &models.ModuleItem{}
	moduleitem.Id = table.Id
	eng.Get(moduleitem)
	_, err := eng.Exec("delete from module_item where id=?", table.Id)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"删除失败"}`))
		fmt.Println(err.Error())
		return
	}
	w.Write([]byte(`{"res":0,"msg":"删除成功"}`))
}

//func getcommoditybyid(w http.ResponseWriter, r *http.Request) {
//	table := &models.CommodityClass{}
//	schema.FormParse(r, table)
//	var class []models.CommodityClass
//	_ = models.ExtQuery([]string{"id", "code", "name"}, &class, "id = ?", table.Id)
//	fs := `[%d,"%s"],`
//	t := ""
//	for _, u := range class {
//		t += fmt.Sprintf(fs, u.Id, u.Name)
//	}
//	fs = `{"class":[%s]}`
//	w.Write([]byte(fmt.Sprintf(fs, t)))
//}

//func getclassbyname(w http.ResponseWriter, r *http.Request) {
//	table := &models.Commodity{}
//	schema.FormParse(r, table)
//	var commodity []models.Commodity
//	_ = models.ExtQuery([]string{"id", "name"}, &commodity, "id = ?", table.Id)
//	fs := `[%d,"%s"],`
//	t := ""
//	for _, u := range commodity {
//		t += fmt.Sprintf(fs, u.Id, u.Name)
//	}
//	fs = `{"commodity":[%s]}`
//	w.Write([]byte(fmt.Sprintf(fs, t)))
//}

//func updatemoduleone(w http.ResponseWriter, r *http.Request) {
//	module := &moduleflagone{}
//	schema.FormParse(r, module)
//	eng := models.GetEngine()
//	moduleitem := &models.ModuleItem{}
//	moduleitem.Image = module.Filekey
//	moduleitem.Id = module.Type
//	moduleitem.Seq = module.Seq
//	moduleitem.Text = module.Text
//	affected, err := eng.Id(moduleitem.Id).Update(moduleitem)
//	if affected != 1 || err != nil {
//		w.Write([]byte(`{"res":-1,"msg":"更新失败"}`))
//		fmt.Println(err.Error())
//		return
//	}
//	w.Write([]byte(`{"res":0,"msg":"更新成功"}`))

//}

func showmoduleitem(w http.ResponseWriter, r *http.Request) {
	module := &models.Module{}
	schema.FormParse(r, module)
	var item []models.ModuleItem
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Where("seq=?", 0).And("module=?", 0).Find(&item)
	fs := `[%d,"%s",%d,"%s"],`
	t := ""
	for _, u := range item {
		t += fmt.Sprintf(fs, u.Id, u.Image, u.Seq, u.Url)
	}
	fs = `{"item":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, t)))
}
