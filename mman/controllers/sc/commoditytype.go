package sc

import (
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"web/schema"
		ss "web/session"
)

func CommodityTypeHandlers() {
	ctrl.HMAP["/sc/commoditytype/bindbehalf"] = bindBehalf
	ctrl.HMAP["/sc/commoditytype/bindpreorder"] = bindPreOrder
	ctrl.HMAP["/sc/commoditytype/reback"] = reBack
}

func bindBehalf(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	stk := &models.Stock{}
	schema.FormParse(r, stk)
	has, err := eng.Where("id = ?", stk.Id).Get(stk)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"商品信息有误"}`))
		return
	}
	stk.CommodityType = 8
	affected, err := eng.Id(stk.Id).Update(stk)
	if err != nil || affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"指定预购方式失败"}`))
		Logger.Error(err)
		return
	}
	w.Write([]byte(`{"res":0,"msg":"成功"}`))
}

func bindPreOrder(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	cp := &compre{}
	schema.FormParse(r, cp)
	stk := &models.Stock{}
	has, err := eng.Where("id = ?", cp.Stk).Get(stk)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"商品信息有误"}`))
		return
	}
	stk.PreOrder = cp.Pre
	stk.PreOrderPrice = cp.PreOrderPrice
	stk.CommodityType = 7
	affected, err := eng.Id(cp.Stk).Update(stk)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"指定预购方式失败"}`))
		Logger.Error(err)
		return
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"指定预购方式失败"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"成功"}`))
}

func reBack(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	stk := &models.Stock{}
	schema.FormParse(r, stk)
	has, err := eng.Where("id = ?", stk.Id).Get(stk)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"商品信息有误"}`))
		return
	}
	stk.CommodityType = 1
	affected, err := eng.Id(stk.Id).Update(stk)
	if err != nil || affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"撤销失败"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"撤销成功"}`))
}
