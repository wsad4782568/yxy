/*
descripiton:商品操作（基本信息，条形码，商品关联）
author:team—b
created:2016-6-6
updated:2016-6-6
*/

package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/logs"
	"mrten/models"
	"net/http"
	"strconv"
	"web/redi"
	"web/schema"
	ss "web/session"

	qnconf "qiniupkg.com/api.v7/conf"
	"qiniupkg.com/api.v7/kodo"
)

//接关联商品

func CommodityHandlers() {
	ctrl.HMAP["/sc/commodity/getext"] = getExt
	ctrl.HMAP["/sc/commodity/getcommoditys"] = getCommoditys
	ctrl.HMAP["/sc/commodity/updatecommodity"] = updateCommodity
	ctrl.HMAP["/sc/commodity/updatecommodityclass"] = updateCommodityClass
	ctrl.HMAP["/sc/commodity/insertcommodityclass"] = insertCommodityClass
	ctrl.HMAP["/sc/commodity/updatedeptclass"] = updateDeptClass
	ctrl.HMAP["/sc/commodity/getclassbydept"] = getClassByDept
	ctrl.HMAP["/sc/commodity/getcombyname"] = getComByName
	ctrl.HMAP["/sc/commodity/updatebarcode"] = updatebarcode
	ctrl.HMAP["/sc/commodity/insert"] = insertCommodity
	ctrl.HMAP["/sc/commodity/getbarcode"] = getBarcode
	ctrl.HMAP["/sc/commodity/deletebarcode"] = deleteBarcode
	ctrl.HMAP["/file/token/images/get"] = file_images_token
	ctrl.HMAP["/sc/commodity/intro/get"] = commodity_intro_get
	ctrl.HMAP["/sc/commodity/intro/update"] = commodity_intro_update
	ctrl.HMAP["/sc/commodity/getAllCmbyCom"] = getAllCmbyCom
	//ctrl.HMAP["/sc/commodity/deleteAllCmbyCom"] = deleteAllCmbyCom
	ctrl.HMAP["/sc/commodity/addCommodityUnit"] = addCommodityUnit
	ctrl.HMAP["/sc/commodity/deletebyComId"] = deletebyComId
}

type NewBarcode struct {
	Commodity int      `schema:"commodity"`
	Id        []int    `schema:"id"`
	Code      []string `schema:"code"`
	Cdept     int      `schema:"cdept"`
}

type CommodityCode struct {
	models.Commodity `xorm:"extends"`
	models.Barcode   `xorm:"extends"`
}

func (CommodityCode) TableName() string {
	return "commodity"
}

/*
name:getCommoditys
paras:w http.ResponseWriter, r *http.Request
description:所有商品信息调用接口
*/
func getCommoditys(w http.ResponseWriter, r *http.Request) {
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
	staffdept := ss.HGet(r, "staff", "dept_id")
	dept := &models.Department{}
	eng := models.GetEngine()
	eng.Where("id = ?", staffdept).Get(dept)
	if dept.Supervisor == -1 {
		dept.Supervisor = dept.Id
	}
	spvs := strconv.Itoa(dept.Supervisor)
	var coms []models.Commodity
	com := new(models.Commodity)
	n := schema.ExtBasicQuery(eng, r, []string{"id", "name", "class_code", "intro", "price",
		"group_buy_price", "online_buy", "specification", "supplier", "commodity_type",
		"dept", "unit", "class_id", "recommended", "discount_on", "coupon_on", "coupon",
		"details", "pre_order_price", "stall_price", "commodity_no", "is_main_unit"}, &coms, com,
		[]string{"dept = ?", "is_main_unit"}, []string{spvs, units}, []string{"in"})
	//&coms, com, []string{"dept = ?", "is_main_unit = ? "}, []string{spvs, "1"}, []string{"and"})
	fs := `[%d,"%s","%s","%s",%d,%d,%d,"%s",%d,%d,%d,"%s","%s",%d,%d,%d,%d,"%s",%d,%d,"%s",%d,"%s","%s"],`
	s := ""
	for _, u := range coms {
		file := &models.CommodityFile{}
		eng.Where("commodity = ?", u.Id).And("seq = 0").Get(file)
		var barcode []models.Barcode
		eng.Where("commodity = ?", u.Id).Find(&barcode)
		codes := ""
		for _, c := range barcode {
			codes += c.Code + ","
		}

		s += fmt.Sprintf(fs, u.Id, u.Name, u.ClassCode, u.Intro, u.Price, u.GroupBuyPrice, u.OnlineBuy,
			u.Specification, u.Supplier, u.CommodityType, u.Dept, u.Unit, u.ClassId, u.Recommended, u.DiscountOn, u.CouponOn, u.Coupon,
			u.Details, u.PreOrderPrice, u.StallPrice, u.CommodityNo, u.IsMainUnit, codes, file.FileKey)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

/*
name:getExt
paras:w http.ResponseWriter, r *http.Request
description:所有商品类调用接口
*/
func getExt(w http.ResponseWriter, r *http.Request) {
	//
	var sub []models.Department
	var stf []models.Staff
	var tree []models.CommodityClass
	eng := models.GetEngine()
	eng.Asc("weight").Find(&tree)
	//_ = models.ExtQuery([]string{"id", "code", "name", "weight", "color", "visible_on_line", "image", "pid", "is_leaf"}, &tree, "pid > ?", -1)
	fs := `[%d,"%s","%s",%d,"%s",%d,%d,%d,%d],`
	t := ""
	for _, u := range tree {
		t += fmt.Sprintf(fs, u.Id, u.Code, u.Name, u.Weight, u.Color, u.VisibleOnLine, u.Image, u.Pid, u.IsLeaf)
	}
	eng.Cols("id", "username").Find(&sub)
	fs = `[%d,"%s"],`
	d := ""
	for _, u := range sub {
		d += fmt.Sprintf(fs, u.Id, u.Name)
	}
	eng.Cols("id", "username").Find(&stf)
	s := ""
	for _, u := range stf {
		s += fmt.Sprintf(fs, u.Id, u.Username)
	}
	fs = `{"dept":[%s],"staff":[%s],"tree":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, d, s, t)))

}

/*
name:updataCommodity
paras:w http.ResponseWriter, r *http.Request
description:修改商品基本信息
*/
func updateCommodity(w http.ResponseWriter, r *http.Request) {
	//
	logger := logs.MmanLogger
	defer logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &models.Commodity{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	affected, err := eng.Id(tables.Id).Update(tables)
	if err != nil {
		logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"修改失败"}`))
		return
	}

	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))

}

func updatebarcode(w http.ResponseWriter, r *http.Request) {
	//
	logger := logs.MmanLogger
	defer logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &NewBarcode{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	for k := 0; k < len(tables.Id); k++ {
		barc := &models.Barcode{}
		if tables.Id[k] == -88 {
			barc.Commodity = tables.Commodity
			barc.Code = string(tables.Code[k])
			affected, err := eng.Insert(barc)
			if err != nil {
				logger.Error(err)
				w.Write([]byte(`{"res":-1,"msg":"新增数据有误"}`))
				return
			}
			if affected != 1 {
				w.Write([]byte(`{"res":-1,"msg":"新增数据有误"}`))
				return
			}
		}
		_, err := eng.Query("UPDATE barcode SET code =? WHERE id =? ", string(tables.Code[k]), tables.Id[k])
		if err != nil {
			logger.Error(err)
			w.Write([]byte(`{"res":-1,"msg":"修改数据有误"}`))
			return
		}

	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))
}

/*
name:updataCommodityClass
paras:w http.ResponseWriter, r *http.Request
description:修改商品类信息
*/
func updateCommodityClass(w http.ResponseWriter, r *http.Request) {
	logger := logs.MmanLogger
	defer logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.CommodityClass{}
	schema.FormParse(r, tables)
	affected, err := eng.Id(tables.Id).Update(tables)
	if err != nil {
		logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"找不到这条数据"}`))
	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))
}

func updateDeptClass(w http.ResponseWriter, r *http.Request) {
	logger := logs.MmanLogger
	defer logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.DeptClass{}
	schema.FormParse(r, tables)
	affected, err := eng.Id(tables.Id).Update(tables)
	if err != nil {
		logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"找不到这条数据"}`))
	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))
}

type FindDeptClass struct {
	IdArr    []int `schema:"idarr"`
	Cdept     int      `schema:"cdept"`
}
func getClassByDept(w http.ResponseWriter, r *http.Request) {
	fdc := &FindDeptClass{}
	schema.FormParse(r, fdc)
	var dpcls []models.DeptClass
	eng := models.GetEngine()
	eng.Where("dept = ?",fdc.Cdept).In("commodity_class",fdc.IdArr).Find(&dpcls)
	fs := `[%d,%d,%d,%d],`
	t := ""
	for _, u := range dpcls {
			t += fmt.Sprintf(fs, u.Id, u.CommodityClass, u.VisibleOnLine, u.Dept)
	}
	fs = `{"commodityClass":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, t)))
}

func insertCommodityClass(w http.ResponseWriter, r *http.Request) {
	//
	logger := logs.MmanLogger
	defer logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &models.CommodityClass{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	affected, err := eng.InsertOne(tables)
	if err != nil {
		logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
	}
	if affected == 0 {
		w.Write([]byte(`{"res":0,"msg":"添加失败"}`))
	}
	w.Write([]byte(`{"res":1,"msg":"添加商品种类成功"}`))

}

/*
name:getComByName
paras:w http.ResponseWriter, r *http.Request
description:根据商品名进行模糊查询，返回所有名字相似商品信息
*/
func getComByName(w http.ResponseWriter, r *http.Request) {
	//
	//var commo []models.Commodity
	var commo []models.Commodity
	tables := &models.Commodity{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	staffdept := ss.HGet(r, "staff", "dept_id")
	dept := &models.Department{}
	eng.Where("id = ?", staffdept).Get(dept)
	if dept.Supervisor == -1 {
		dept.Supervisor = dept.Id
	}
	spvs := strconv.Itoa(dept.Supervisor)
	eng.Where("name like ?", "%"+tables.Name+"%").And("dept = ?", spvs).Find(&commo)
	fs := `[%d,"%s","%s","%s",%d,%d,%d,"%s",%d,%d,%d,"%s","%s",%d,%d,%d,%d,%d,"%s"],`
	t := ""
	for _, u := range commo {
		t += fmt.Sprintf(fs, u.Id, u.Name, u.ClassCode, u.Intro, u.Price, u.GroupBuyPrice, u.OnlineBuy,
			u.Specification, u.Supplier, u.CommodityType, u.Dept, u.Unit, u.ClassId, u.Recommended,
			u.DiscountOn, u.CouponOn, u.Coupon, u.IsMainUnit, u.CommodityNo)
	}
	fs = `{"commodity":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, t)))

}

type NewCommodity struct {
	Id                int    `schema:"id"`
	Name              string `schema:"name"`
	Intro             string `schema:"intro"` // 标准价格
	ClassId           string `schema:"classid"`
	Dept              int
	CommodityNo       string
	Cdept             int      `schema:"cdept"`
	ExtUnit           []string `schema:"extunit"`           //扩展单位
	ExtUnitIsMainUnit []int8   `schema:"extunitismainunit"` //扩展单位的类型 拆分？采购？最小？重量？
	ExtSpecification  []string `schema:"extspecification"`
	ExtBarcode        []string `schema:"extbarcode"`
	ExtPrice          []int    `schema:"extprice"`
}

func insertCommodity(w http.ResponseWriter, r *http.Request) {
	logger := logs.MmanLogger
	defer logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &NewCommodity{}
	schema.FormParse(r, tables)
	fmt.Println(tables)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	staffdept, _ := strconv.Atoi(ss.HGet(r, "staff", "dept_id"))
	tables.Dept = staffdept
	tables.CommodityNo = redi.GetComNo()
	for i := 0; i < len(tables.ExtUnit); i++ {
		newcoms := &models.Commodity{}
		newcoms.Name = tables.Name
		newcoms.Intro = tables.Intro
		newcoms.Price = tables.ExtPrice[i]
		newcoms.Specification = tables.ExtSpecification[i]
		newcoms.ClassId = tables.ClassId
		newcoms.Unit = tables.ExtUnit[i]
		//默认值
		newcoms.IsMainUnit = tables.ExtUnitIsMainUnit[i]
		newcoms.Dept = staffdept
		newcoms.CommodityNo = tables.CommodityNo
		//	newcoms.CommodityType = 1
		//	newcoms.DiscountOn = 1
		newcoms.Coupon = 0
		//	newcoms.CouponOn = 2
		// 	newcoms.OnlineBuy = 1
		//	newcoms.GroupBuyPrice = tables.GroupBuyPrice
		//	newcoms.PreOrderPrice = tables.PreOrderPrice
		//	newcoms.StallPrice = tables.StallPrice

		affected, err := session.Insert(newcoms)
		if err != nil {
			session.Rollback()
			logger.Error(err)
			w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
			return
		}
		if affected != 1 {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
			return
		}
		if tables.ExtBarcode[i] != "-1" {
			tables.Id = newcoms.Id
			barcode := &models.Barcode{}
			barcode.Commodity = newcoms.Id
			barcode.Code = tables.ExtBarcode[i]
			affected1, err1 := session.InsertOne(barcode)
			if err1 != nil {
				session.Rollback()
				logger.Error(err)
				w.Write([]byte(`{"res":-1,"msg":"已存在该条形码"}`))
				return
			}
			if affected1 != 1 {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"新增商品失败，请检查信息"}`))
				return
			}

		}
	}
	err = session.Commit()
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		logger.Error(err)
		return
	}
	w.Write([]byte(`{"res":0,"msg":"新增商品成功"}`))
}

func getBarcode(w http.ResponseWriter, r *http.Request) {
	//
	var bcode []models.Barcode
	tables := &models.Barcode{}
	schema.FormParse(r, tables)
	_ = models.ExtQuery([]string{"id", "code", "commodity"}, &bcode, "commodity = ?", tables.Commodity)
	fs := `[%d,"%s"],`
	t := ""
	for _, u := range bcode {
		t += fmt.Sprintf(fs, u.Id, u.Code)
	}

	fs = `{"barcode":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, t)))
}

func deleteBarcode(w http.ResponseWriter, r *http.Request) {
	//
	logger := logs.MmanLogger
	defer logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &models.Barcode{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	affected, err := eng.Where("id = ?", tables.Id).Delete(tables)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"删除失败"}`))
		logger.Error(err)
		return
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"删除失败"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"删除成功"}`))

}

func commodity_intro_get(w http.ResponseWriter, r *http.Request) {
	logger := logs.MmanLogger
	defer logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	comm := &models.Commodity{}
	schema.FormParse(r, comm)
	eng := models.GetEngine()
	has, err := eng.Id(comm.Id).Get(comm)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"查找商品信息失败"}`))
		logger.Error(err)
		return
	}
	if !has {
		w.Write([]byte(`{"res":-1,"msg":"查找商品信息失败"}`))
		return
	}
	fs := `{"res":0,"intro":"%s","name":"%s"}`
	w.Write([]byte(fmt.Sprintf(fs, comm.Details, comm.Name)))
}

func file_images_token(w http.ResponseWriter, r *http.Request) {
	token := TokenByPicture()
	fs := `{"res":0,"token":"%s","url":"http://od35wia0b.bkt.clouddn.com/"}`
	w.Write([]byte(fmt.Sprintf(fs, token)))
}

func TokenByPicture() string {
	qnconf.SECRET_KEY = "vxPyyTLmoR92a1USvVG8DEbGgXpEKYtitwQioheF"
	qnconf.ACCESS_KEY = "3zmN1LFavqZCn1wm159MJfTwMa0gDasGLsrE8kD1"
	zone := 0                // 您空间(Bucket)所在的区域
	c := kodo.New(zone, nil) // 用默认配置创建 Client

	pp := kodo.PutPolicy{
		Scope:   "images",
		Expires: 3600 * 24 * 30,
	}
	fmt.Println(pp)
	return c.MakeUptoken(&pp)

}

type comIntro struct {
	Id    int    `schema:"id"`
	Intro string `schema:"intro"`
	Cdept int    `schema:"cdept"`
}

func commodity_intro_update(w http.ResponseWriter, r *http.Request) {
	logger := logs.MmanLogger
	defer logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	comm := &comIntro{}
	schema.FormParse(r, comm)

	if comm.Id < 1 || comm.Intro == "" {
		w.Write([]byte(`{"res":-1,"msg":"查找商品信息失败"}`))
		return
	}
	eng := models.GetEngine()

	affected, err := eng.Table(new(models.Commodity)).Id(comm.Id).Update(map[string]interface{}{
		"details": comm.Intro})
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		logger.Error(err)
		return
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"更新失败"}`))
		return
	}
	fs := `{"res":0,"id":%d}`
	w.Write([]byte(fmt.Sprintf(fs, comm.Id)))
}

func getAllCmbyCom(w http.ResponseWriter, r *http.Request) {
	comm := &models.Commodity{}
	schema.FormParse(r, comm)
	eng := models.GetEngine()
	has, err := eng.Where("id =?", comm.Id).Get(comm)
	if err != nil || !has {
		w.Write([]byte(`{"res":-1,"msg":"商品信息有误"}`))
		return
	}
	var coms []models.Commodity
	e := eng.Where("commodity_no = ?", comm.CommodityNo).And("is_main_unit > 0").Find(&coms)
	if e != nil || len(coms) < 1 {
		w.Write([]byte(`{"res":-1,"msg":"搜索其他单位失败"}`))
		return
	}
	fst := `[%d,"%s","%s","%s","%s",%d,"%s",%d],`
	t := ""
	allrelcoms := ""
	for _, u := range coms {
		t += fmt.Sprintf(fst, u.Id, u.Name, u.Specification, u.Unit, u.ClassId, u.Price, u.CommodityNo, u.IsMainUnit)
		var allcoms1 []ComRelMore1
		var allcoms2 []ComRelMore1
		sess := eng.AllCols()
		sess = sess.Join("INNER", "commodity", "commodity_rel.comm_b=commodity.id")
		sess = sess.Where("commodity_rel.comm_a = ?", u.Id).And("commodity.is_main_unit > 0").In("rel_type", 4, 5, 6, 7)
		e := sess.Find(&allcoms1)
		if e != nil {
			w.Write([]byte(`{"res":-1,"msg":"搜索关联商品失败"}`))
			return
		}
		for _, u1 := range allcoms1 {
			allrelcoms += fmt.Sprintf(fst, u1.Commodity.Id, u1.Commodity.Name, u1.Commodity.Specification, u1.Commodity.Unit, u1.Commodity.ClassId, u1.Commodity.Price, u1.Commodity.CommodityNo, u1.CommodityRel.RelType)
		}
		sess = sess.Join("INNER", "commodity", "commodity_rel.comm_a=commodity.id")
		sess = sess.Where("commodity_rel.comm_b = ?", u.Id).And("commodity.is_main_unit > 0").In("rel_type", 4, 5, 6, 7)
		e = sess.Find(&allcoms2)
		if e != nil {
			w.Write([]byte(`{"res":-1,"msg":"搜索关联商品失败"}`))
			return
		}
		for _, u1 := range allcoms2 {
			allrelcoms += fmt.Sprintf(fst, u1.Commodity.Id, u1.Commodity.Name, u1.Commodity.Specification, u1.Commodity.Unit, u1.Commodity.ClassId, u1.Commodity.Price, u1.Commodity.CommodityNo, u1.CommodityRel.RelType)
		}
	}
	fst = `{"commodityUnits":[%s],"otherrelcm":[%s]}`
	w.Write([]byte(fmt.Sprintf(fst, t, allrelcoms)))
}

func deleteAllCmbyCom(w http.ResponseWriter, r *http.Request) {
	logger := logs.MmanLogger
	defer logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	comm := &models.Commodity{}
	schema.FormParse(r, comm)
	eng := models.GetEngine()
	has, err := eng.Where("id =?", comm.Id).Get(comm)
	if err != nil || !has {
		w.Write([]byte(`{"res":-1,"msg":"商品信息有误"}`))
		return
	}
	var coms []models.Commodity
	e := eng.Where("commodity_no = ?", comm.CommodityNo).Find(&coms)
	if e != nil || len(coms) < 1 {
		w.Write([]byte(`{"res":-1,"msg":"搜索其他单位失败"}`))
		return
	}
	for _, u := range coms {
		u.IsMainUnit = -1
		affected, err := eng.Where("id = ?", u.Id).Update(u)
		if err != nil {
			w.Write([]byte(`{"res":-1,"msg":"删除失败"}`))
			logger.Error(err)
			return
		}
		if affected != 1 {
			w.Write([]byte(`{"res":-1,"msg":"已经被删除了"}`))
			return
		}
	}
	w.Write([]byte(`{"res":0,"msg":"删除成功"}`))

}

func addCommodityUnit(w http.ResponseWriter, r *http.Request) {
	logger := logs.MmanLogger
	defer logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &NewCommodity{}
	schema.FormParse(r, tables)
	fmt.Println(tables)
	eng := models.GetEngine()
	comm := &models.Commodity{}
	has, e := eng.Where("id = ?", tables.Id).Get(comm)
	if !has || e != nil {
		w.Write([]byte(`{"res":-1,"msg":"检索商品信息失败"}`))
		return
	}
	fmt.Println(comm)
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	for i := 0; i < len(tables.ExtUnit); i++ {
		newcoms := &models.Commodity{}
		newcoms.Name = comm.Name
		newcoms.Intro = comm.Intro
		newcoms.ClassId = comm.ClassId
		newcoms.Dept = comm.Dept
		newcoms.CommodityNo = comm.CommodityNo

		newcoms.Price = tables.ExtPrice[i]
		newcoms.Specification = tables.ExtSpecification[i]
		newcoms.Unit = tables.ExtUnit[i]
		newcoms.IsMainUnit = tables.ExtUnitIsMainUnit[i]

		affected, err := session.Insert(newcoms)
		if err != nil {
			session.Rollback()
			logger.Error(err)
			w.Write([]byte(`{"res":-1,"msg":"新增单位失败，请检查信息"}`))
			return
		}
		if affected != 1 {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"新增单位失败，请检查信息"}`))
			return
		}
		if tables.ExtBarcode[i] != "-1" {
			tables.Id = newcoms.Id
			barcode := &models.Barcode{}
			barcode.Commodity = newcoms.Id
			barcode.Code = tables.ExtBarcode[i]
			affected1, err1 := session.InsertOne(barcode)
			if err1 != nil {
				session.Rollback()
				logger.Error(err1)
				w.Write([]byte(`{"res":-1,"msg":"已存在该条形码"}`))
				return
			}
			if affected1 != 1 {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"绑定条形码，请检查信息"}`))
				return
			}

		}
		var cmfile []models.CommodityFile
		err = eng.Where("commodity = ?", comm.Id).Find(&cmfile)
		if err != nil {
			session.Rollback()
			logger.Error(err)
			w.Write([]byte(`{"res":-1,"msg":"同步图片信息失败"}`))
			return
		}
		for _, u := range cmfile {
			newcmfile := &models.CommodityFile{}
			newcmfile.Commodity = newcoms.Id
			newcmfile.FileKey = u.FileKey
			newcmfile.Seq = u.Seq
			newcmfile.Created = u.Created
			affected1, err1 := session.InsertOne(newcmfile)
			if affected1 != 1 || err1 != nil {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"同步图片信息失败"}`))
				logger.Error(err1)
				return
			}
		}
	}
	err = session.Commit()
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"新增单位成功"}`))
}

func deletebyComId(w http.ResponseWriter, r *http.Request) {
	logger := logs.MmanLogger
	defer logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	comm := &models.Commodity{}
	schema.FormParse(r, comm)
	eng := models.GetEngine()
	has, err := eng.Where("id =?", comm.Id).Get(comm)
	if err != nil || !has {
		w.Write([]byte(`{"res":-1,"msg":"商品信息有误"}`))
		return
	}
	comm.IsMainUnit = -1
	affected, err := eng.Where("id = ?", comm.Id).Update(comm)
	if err != nil || affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"删除失败"}`))
		logger.Error(err)
		return
	}

	w.Write([]byte(`{"res":0,"msg":"删除成功"}`))

}
