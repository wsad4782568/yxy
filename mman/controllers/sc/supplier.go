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

func SupplierHandlers() {
	ctrl.HMAP["/sc/supplier/get"] = getSuppliers
	ctrl.HMAP["/sc/supplier/update"] = updateSupplier
	ctrl.HMAP["/sc/supplier/insert"] = insertSupplier
	ctrl.HMAP["/sc/supplier/bindcode"] = bindCodeSupplier
	ctrl.HMAP["/sc/supplier/showcode"] = showCodeBySupplier
	ctrl.HMAP["/sc/supplier/showsupplier"] = showSupplierByCode
}

type SupplierBarcodeMore struct {
	models.SupplierBarcode `xorm:"extends"`
	models.Barcode         `xorm:"extends"`
	models.Commodity       `xorm:"extends"`
}

func (SupplierBarcodeMore) TableName() string {
	return "supplier_barcode"
}

type BindSupplierBarcode struct {
	Code     string `schema:"code"`
	Supplier int    `schema:"supplier"`
	Cdept    int    `schema:"cdept"`
}

type SupplierMore struct {
	models.SupplierBarcode `xorm:"extends"`
	models.Supplier        `xorm:"extends"`
}

func (SupplierMore) TableName() string {
	return "supplier_barcode"
}

type BarcodeMore struct {
	models.Barcode   `xorm:"extends"`
	models.Commodity `xorm:"extends"`
}

func (BarcodeMore) TableName() string {
	return "barcode"
}

func getSuppliers(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	var coms []models.Supplier
	com := new(models.Supplier)
	n := schema.BasicQuery(eng, r, []string{"id", "class", "name", "contact_info", "address", "phone",
		"fax", "email", "bank", "account", "tax_memo", "checkout_memo", "corporation", "memo"},
		&coms, com)
	fs := `[%d,%d,"%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s"],`
	s := ""
	for _, u := range coms {
		s += fmt.Sprintf(fs, u.Id, u.Class, u.Name, u.ContactInfo, u.Address, u.Phone, u.Fax,
			u.Email, u.Bank, u.Account, u.TaxMemo, u.CheckoutMemo, u.Corporation, u.Memo)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func updateSupplier(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &models.Supplier{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	affected, err := eng.Id(tables.Id).Update(tables)
	if err != nil {
		Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"修改失败,请检查信息"}`))
		return
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"修改失败,请检查信息"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))

}

func insertSupplier(w http.ResponseWriter, r *http.Request) {
	//
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &models.Supplier{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	affected, err := eng.InsertOne(tables)
	if err != nil {
		Logger.Error(err)
		w.Write([]byte(`{"res":-1,"msg":"插入失败,请检查信息"}`))
		return
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"插入失败,请检查信息"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"插入成功"}`))

}

func bindCodeSupplier(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	tables := &BindSupplierBarcode{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	bc := &models.Barcode{}
	has, err := eng.Where("code = ?", tables.Code).Get(bc)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"检索条形码失败,请确认条码是否存在"}`))
		return
	}
	supcode := &models.SupplierBarcode{}
	supcode.Barcode = bc.Id
	supcode.Supplier = tables.Supplier
	affected, err := eng.InsertOne(supcode)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"该供应商下已有该条形码"}`))
		Logger.Error(err)
		return
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"绑定失败,请检查信息"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"绑定成功"}`))
}

func showCodeBySupplier(w http.ResponseWriter, r *http.Request) {
	tables := &models.SupplierBarcode{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	var codecoms []SupplierBarcodeMore

	staffdept := ss.HGet(r, "staff", "dept_id")
	dept := &models.Department{}
	eng.Where("id = ?", staffdept).Get(dept)
	if dept.Supervisor == -1 {
		dept.Supervisor = dept.Id
	}
	spvs := strconv.Itoa(dept.Supervisor)
	sess := eng.AllCols()
	sess = sess.Join("INNER", "barcode", "supplier_barcode.barcode=barcode.id")
	sess = sess.Join("INNER", "commodity", "commodity.id=barcode.commodity")
	sess = sess.Where("supplier_barcode.supplier = ?", tables.Supplier).And("commodity.dept = ?", spvs)
	err := sess.Find(&codecoms)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"发生了其他问题"}`))
		fmt.Println(err.Error())
		return
	}
	if len(codecoms) < 1 {
		w.Write([]byte(`{"res":-1,"msg":"没有条形码记录"}`))
		return
	}
	fs := `["%s",%d,"%s","%s","%s",%d,"%s",%d,%d,"%s"],`
	s := ""
	for _, u := range codecoms {
		s += fmt.Sprintf(fs, u.Commodity.Name, u.Commodity.Id, u.Commodity.ClassId, u.Commodity.Specification, u.Commodity.Unit, u.Commodity.Price,
			u.Commodity.CommodityNo, u.Commodity.CommodityType, u.Commodity.IsMainUnit, u.Barcode.Code)
	}
	fs = `{"codecm":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func showSupplierByCode(w http.ResponseWriter, r *http.Request) {
	tables := &BindSupplierBarcode{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()

	bc := &models.Barcode{}
	has, err := eng.Where("code = ?", tables.Code).Get(bc)
	if err != nil || !has {
		w.Write([]byte(`{"res":-1,"msg":"条形码信息有误"}`))
		return
	}
	//	staffdept := ss.HGet(r, "staff", "dept_id")
	//	dept := &models.Department{}
	//	eng.Where("id = ?", staffdept).Get(dept)
	//	if dept.Supervisor == -1 {
	//		dept.Supervisor = dept.Id
	//	}
	//	spvs := strconv.Itoa(dept.Supervisor)

	sess := eng.AllCols()
	//		var codecoms &BarcodeMore{}
	//		sess = sess.Join("INNER", "commodity", "commodity.barcode=commodity.id")
	//	sess = sess.Where("barcode.code = ?", tables.Code).And("commodity.dept = ?", spvs)
	//	has,err := sess.get(codecoms)
	//	if err!=nil || !has{
	//		w.Write([]byte(`{"res":-1,"msg":"条形码信息有误"}`))
	//		return
	//	}

	var codespl []SupplierMore
	sess = sess.Join("INNER", "supplier", "supplier_barcode.supplier=supplier.id")
	sess = sess.Where("supplier_barcode.barcode = ?", bc.Id)
	err = sess.Find(&codespl)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"发生了其他问题"}`))
		fmt.Println(err.Error())
		return
	}
	if len(codespl) < 1 {
		w.Write([]byte(`{"res":-1,"msg":"没有供应商记录"}`))
		return
	}
	fs := `[%d,"%s","%s","%s","%s","%s"],`
	s := ""
	for _, u := range codespl {
		s += fmt.Sprintf(fs, u.Supplier.Id, u.Supplier.Name, u.Supplier.ContactInfo, u.Supplier.Address, u.Supplier.Phone, u.Supplier.Email)
	}
	fs = `{"splist":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}
