package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"web/schema"
ss "web/session"
	//"strconv"
)

func GroupOrderManage() {
	ctrl.HMAP["/sc/groupOrder/addGroupCom"] = addGroupCom
	ctrl.HMAP["/sc/groupOrder/showGroupCom"] = showGroupCom
	ctrl.HMAP["/sc/groupOrder/deletGroupCom"] = deleteGroupCom
}

type AddGroupOrderCom struct {
	GroupNameInfo string `schema:"groupNameInfo"`
	Number        int    `schema:"number"`
	Duration      int64  `schema:"duration"`
	StockId       int    `schema:"stockid"`
	GroupBuy      int    `schema:"groupbuy"`
	GroupPrice    int    `schema:"groupprice"`
	BiggestAmount int    `schema:"biggestAmount"`
	Cdept         int    ` schema:"cdept"`
}
type GetGroupCom struct {
	models.GroupOrderCommodity `xorm:"extends"`
	models.GroupBuy            `xorm:"extends"`
}

func (GetGroupCom) TableName() string {
	return "group_order_commodity"
}

func deleteGroupCom(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	grbcm := &models.GroupOrderCommodity{}
	schema.FormParse(r, grbcm)
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()

	groupBuy := &models.GroupBuy{}
	affected, err := eng.Where("id = ?", grbcm.GroupBuy).Delete(groupBuy)
	if err != nil || affected != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		Logger.Error(err)
		return
	}
	affected, err = eng.Where("group_buy=?", grbcm.GroupBuy).Delete(grbcm)
	if err != nil || affected != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		Logger.Error(err)
		return
	}
	err = session.Commit()
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		Logger.Error(err)
		return
	}
	w.Write([]byte(`{"res":0,"msg":"删除成功"}`))
	return
}
func showGroupCom(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	var tables []GetGroupCom
	table := new(GetGroupCom)
	n := schema.JoindQuery(eng, r, []string{"group_order_commodity.stock", "group_buy.number", "group_buy.duration",
		"group_buy.group_price", "group_buy.group_name_info", "group_order_commodity.group_buy", "group_buy.biggest_amount"}, &tables, table,
		[][]string{{"INNER", "group_buy", "group_order_commodity.group_buy = group_buy.id"}})
	fs := `[%d,%d,%d,%d,"%s",%d,%d],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.GroupOrderCommodity.Stock, u.GroupBuy.Number,
			u.GroupBuy.Duration, u.GroupBuy.GroupPrice, u.GroupBuy.GroupNameInfo, u.GroupOrderCommodity.GroupBuy, u.GroupBuy.BiggestAmount)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))

}
func addGroupCom(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	addGroup := &AddGroupOrderCom{}
	schema.FormParse(r, addGroup)
	groupBuy := &models.GroupBuy{}
	groupBuy.GroupNameInfo = addGroup.GroupNameInfo
	groupBuy.Number = addGroup.Number
	groupBuy.GroupPrice = addGroup.GroupPrice
	groupBuy.Duration = addGroup.Duration
	groupBuy.BiggestAmount = addGroup.BiggestAmount
	if addGroup.GroupBuy > 0 {
		groupBuy.Id = addGroup.GroupBuy
		affected, err := eng.Id(addGroup.GroupBuy).Update(groupBuy)
		if affected != 1 || err != nil {
			w.Write([]byte(`{"res":-1,"msg":"更新团购信息失败"}`))
			Logger.Error(err)
			return
		}
		w.Write([]byte(`{"res":0,"msg":"更新成功"}`))
		return
	}
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	affected, err := eng.Table(new(models.Stock)).Id(addGroup.StockId).Update(map[string]interface{}{"commodity_type": 2})
	if err != nil || affected != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"指定团购方式失败"}`))
		Logger.Error(err)
		return
	}
	affected2, err2 := session.InsertOne(groupBuy)
	if err2 != nil || affected2 != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败,请检查填写信息"}`))
		Logger.Error(err2)
		return
	}
	groupCom := &models.GroupOrderCommodity{}
	groupCom.GroupBuy = groupBuy.Id
	groupCom.Stock = addGroup.StockId
	affected, err = session.InsertOne(groupCom)
	if err != nil || affected != 1 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败,请检查填写信息"}`))
		Logger.Error(err)
		return
	}
	err = session.Commit()
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		Logger.Error(err)
		return
	}
	w.Write([]byte(`{"res":0,"msg":"绑定团购商品成功"}`))
	return
}

//func GroupOrderManage() {
//	ctrl.HMAP["/sc/groupOrder/addGroupCom"] = addGroupCom
//	ctrl.HMAP["/sc/groupOrder/deletGroupCom"] = deleteGroupCom
//	ctrl.HMAP["/sc/groupOrder/getbystock"] = getGroupByStock
//}

//type AddGroupOrderCom struct {
//	GroupNameInfo string `schema:"groupNameInfo"`
//	Number        int    `schema:"number"`
//	Duration      int64  `schema:"duration"`
//	StockId       int    `schema:"stockid"`
//	GroupBuy      int    `schema:"groupbuy"`
//	Cdept         int    ` schema:"cdept"`
//}
//type GetGroupCom struct {
//	models.GroupOrderCommodity `xorm:"extends"`
//	models.GroupBuy            `xorm:"extends"`
//	models.Commodity           `xorm:"extends"`
//	models.Stock               `xorm:"extends"`
//}

//func (GetGroupCom) TableName() string {
//	return "group_order_commodity"
//}

//func deleteGroupCom(w http.ResponseWriter, r *http.Request) {
//	w.Header().Set("Access-Control-Allow-Origin", "*")
//	deletGroup := &AddGroupOrderCom{}
//	eng := models.GetEngine()
//	schema.FormParse(r, deletGroup)
//	session := eng.NewSession()
//	defer session.Close()
//	err := session.Begin()
//	affected, err := eng.Table(new(models.Stock)).Id(deletGroup.StockId).Update(map[string]interface{}{"commodity_type": 1})
//	if err != nil || affected != 1 {
//		session.Rollback()
//		w.Write([]byte(`{"res":-1,"msg":"移除商品团购属性失败"}`))
//		return
//	}
//	_, err1 := eng.Exec("delete from group_order_commodity where stock = ?", deletGroup.StockId)
//	if err1 != nil {
//		session.Rollback()
//		w.Write([]byte(`{"res":-1,"msg":"删除失败"}`))
//		return
//	}
//	groupBuy := &models.GroupBuy{}
//	affected, err = eng.Id(deletGroup.GroupBuy).Delete(groupBuy)
//	if err != nil || affected != 1 {
//		session.Rollback()
//		w.Write([]byte(`{"res":-1,"msg":"删除失败"}`))
//		return
//	}
//	err = session.Commit()
//	if err != nil {
//		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
//		return
//	}
//	w.Write([]byte(`{"res":0,"msg":"删除成功"}`))
//	return
//}

//func getGroupByStock(w http.ResponseWriter, r *http.Request) {
//	grpcm := &models.GroupOrderCommodity{}
//	schema.FormParse(r, grpcm)
//	eng := models.GetEngine()
//	has, err := eng.Where("stock = ?", grpcm.Stock).Get(grpcm)
//	if err != nil {
//		w.Write([]byte(`{"res":-1,"msg":"加载信息有误"}`))
//		return
//	}
//	if !has {
//		w.Write([]byte(`{"res":0,"groupbuy":[]}`))
//		return
//	}
//	grp := &models.GroupBuy{}
//	has1, err1 := eng.Where("id = ?", grpcm.GroupBuy).Get(grp)
//	if err1 != nil || !has1 {
//		w.Write([]byte(`{"res":-1,"msg":"加载信息有误"}`))
//		return
//	}
//	fs := `[%d,"%s",%d,%d],`
//	s := fmt.Sprintf(fs, grp.Id, grp.GroupNameInfo, grp.Number, grp.Duration)
//	fs = `{"res":0,"groupbuy":[%s]}`
//	w.Write([]byte(fmt.Sprintf(fs, s)))
//}

//func addGroupCom(w http.ResponseWriter, r *http.Request) {

//	eng := models.GetEngine()
//	addGroup := &AddGroupOrderCom{}
//	schema.FormParse(r, addGroup)
//	fmt.Println(addGroup)
//	groupBuy := &models.GroupBuy{}
//	groupBuy.GroupNameInfo = addGroup.GroupNameInfo
//	groupBuy.Number = addGroup.Number
//	groupBuy.Duration = addGroup.Duration
//	if addGroup.GroupBuy > 0 {
//		groupBuy.Id = addGroup.GroupBuy
//		affected, err := eng.Id(addGroup.GroupBuy).Update(groupBuy)
//		if affected != 1 || err != nil {
//			w.Write([]byte(`{"res":-1,"msg":"更新团购信息失败"}`))
//			return
//		}
//		w.Write([]byte(`{"res":0,"msg":"更新成功"}`))
//		return
//	}
//	session := eng.NewSession()
//	defer session.Close()
//	err := session.Begin()
//	affected, err := eng.Table(new(models.Stock)).Id(addGroup.StockId).Update(map[string]interface{}{"commodity_type": 2})
//	if err != nil || affected != 1 {
//		session.Rollback()
//		w.Write([]byte(`{"res":-1,"msg":"指定团购方式失败"}`))
//		return
//	}

//	count, _ := eng.Where("stock = ?", addGroup.StockId).Count(&models.GroupOrderCommodity{})
//	if count > 0 {
//		session.Rollback()
//		w.Write([]byte(`{"res":-1,"msg":"已有团购信息,新增失败"}`))
//		return
//	}
//	affected2, err2 := session.InsertOne(groupBuy)
//	if err2 != nil || affected2 != 1 {
//		session.Rollback()
//		w.Write([]byte(`{"res":-1,"msg":"插入失败,请检查填写信息"}`))
//		return
//	}
//	groupCom := &models.GroupOrderCommodity{}
//	groupCom.GroupBuy = groupBuy.Id
//	groupCom.Stock = addGroup.StockId
//	affected, err = session.InsertOne(groupCom)
//	if err != nil || affected != 1 {
//		session.Rollback()
//		w.Write([]byte(`{"res":-1,"msg":"插入失败,请检查填写信息"}`))
//		return
//	}
//	err = session.Commit()
//	if err != nil {
//		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
//		return
//	}
//	w.Write([]byte(`{"res":0,"msg":"绑定团购商品成功"}`))
//	return
//}
