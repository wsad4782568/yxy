package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"web/schema"
)

func CouponHandlers() {
	ctrl.HMAP["/sc/coupon/insert"] = insertcoupon
	ctrl.HMAP["/sc/coupon/get"] = getcoupon
	ctrl.HMAP["/sc/coupon/getinfo"] = getcouponinfo
	ctrl.HMAP["/sc/coupon/alterstatus"] = alterstatus
}

type couponiteminfo struct {
	models.CouponCommodity `xorm:"extends"`
	models.Coupon          `xorm:"extends"`
	models.Commodity       `xorm:"extends"`
	models.CommodityClass  `xorm:"extends"`
	models.Department      `xorm:"extends"`
}

func (couponiteminfo) TableName() string {
	return "coupon_commodity"
}

type coupon struct {
	Pv             int    `schema:"pv"`      //面值
	Valid          int64  `schema:"valid"`   //生效时间
	Expired        int64  `schema:"expired"` //过期时间
	Intro          string `schema:"intro"`
	Amount         int    `schema:"amount"`
	Leavings       int    `schema:"leavings"` //发行量
	Coupon         int    `schema:"coupon"`   //修改的时候发
	Commodity      []int  `schema:"commodity"`
	Dept           []int  `schema:"dept"`
	Class          []int  `schema:"class"`
	ConditionMoney int    `schema:"conditionmoney"`
	Status         int    `schema:"status"`
	Name           string `schema:"name"`
	Flag           int    `schema:"flag"`
}

func insertcoupon(w http.ResponseWriter, r *http.Request) {
	couponinfo := &coupon{}
	schema.FormParse(r, couponinfo)
	fmt.Println(couponinfo)
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
	if couponinfo.Coupon != 0 {
		_, err = session.Exec("delete from coupon_commodity where coupon=? ", couponinfo.Coupon)
		if err != nil {
			session.Rollback()
			fmt.Println(err.Error())
			w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
			return
		}
		_, err = session.Exec("delete from coupon where id=? ", couponinfo.Coupon)
		if err != nil {
			session.Rollback()
			fmt.Println(err.Error())
			w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
			return
		}
	}
	coupon := &models.Coupon{}
	coupon.Amount = couponinfo.Amount
	coupon.Expired = couponinfo.Expired
	coupon.Intro = couponinfo.Intro
	coupon.Leavings = couponinfo.Leavings
	coupon.Pv = couponinfo.Pv
	coupon.Valid = couponinfo.Valid
	coupon.Status = couponinfo.Status
	coupon.Name = couponinfo.Name
	coupon.ConditionMoney = couponinfo.ConditionMoney
	coupon.Flag = couponinfo.Flag
	coupon.Dept = couponinfo.Dept[0]
	affected, err := session.Insert(coupon)
	if affected != 1 || err != nil {
		session.Rollback()
		fmt.Println(err.Error())
		w.Write([]byte(`{"res":-1,"msg":"设置失败"}`))
		return
	}
	for i := 0; i < len(couponinfo.Commodity); i++ {
		for j := 0; j < len(couponinfo.Dept); j++ {
			couponcommodity := &models.CouponCommodity{}
			couponcommodity.Commodity = couponinfo.Commodity[i]
			couponcommodity.Coupon = coupon.Id
			couponcommodity.Class = couponinfo.Class[i]
			affected, err = session.Insert(couponcommodity)
			if affected != 1 || err != nil {
				session.Rollback()
				fmt.Println(err.Error())
				w.Write([]byte(`{"res":-1,"msg":"设置失败"}`))
				return
			}
		}

	}
	err = session.Commit()
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		return
	}

	w.Write([]byte(`{"res":0,"msg":"设置成功"}`))
}

func getcoupon(w http.ResponseWriter, r *http.Request) {
	var table []models.Coupon
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	dept := strconv.Itoa(queryob.Cq_dept)
	tables := new(models.Coupon)
	eng := models.GetEngine()
	n := schema.ExtBasicQuery(eng, r, []string{"id", "amount", "expired", "intro", "leavings", "pv", "valid", "condition_money",
		"status", "name"}, &table, tables,
		[]string{"id>?", "dept=?"}, []string{"0", dept}, []string{"and"})
	fs := `[%d,%d,"%s","%s",%d,%d,"%s",%d,%d,"%s"],`
	t := ""
	for _, u := range table {
		expired := schema.IntToTimeStr(u.Expired)
		valid := schema.IntToTimeStr(u.Valid)
		t += fmt.Sprintf(fs, u.Id, u.Amount, expired, u.Intro, u.Leavings, u.Pv, valid, u.ConditionMoney, u.Status, u.Name)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, t)))
}

func getcouponinfo(w http.ResponseWriter, r *http.Request) {
	var tables []couponiteminfo
	table := &models.Coupon{}
	schema.FormParse(r, table)
	fmt.Println(table.Id)
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Join("INNER", "coupon", "coupon.id = coupon_commodity.coupon")
	sess.Join("LEFT ", "commodity", "coupon_commodity.commodity=commodity.id")
	sess.Join("LEFT ", "commodity_class", "coupon_commodity.class=commodity_class.id")
	sess.Join("INNER", "department", "coupon.dept=department.id")
	sess.Where("coupon.id = ?", table.Id).Find(&tables)
	fs := `[%d,"%s",%d,"%s","%s","%s",%d,%d,"%s"],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.CouponCommodity.Commodity, u.Commodity.Name, u.Coupon.Dept,
			u.Department.Name, u.Commodity.Unit, u.Commodity.Specification, u.Coupon.Status,
			u.CommodityClass.Id, u.CommodityClass.Name)
	}
	fs = `{"res":0,"coupon":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func alterstatus(w http.ResponseWriter, r *http.Request) {
	tables := &models.Coupon{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	_, err := eng.Exec("update coupon set status=2  where id=? ", tables.Id)
	if err == nil {
		w.Write([]byte(`{"res":0,"msg":"审核通过"}`))
	}
}
