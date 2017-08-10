package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	//	"time"
	"web/schema"
	"web/session"
)

func BannerImage() {
	ctrl.HMAP["/sc/bannerimg/getcommodity"] = getcommodity //得到已经上架的商品
}

func getcommodity(w http.ResponseWriter, r *http.Request) {
	staffdept := session.HGet(r, "staff", "dept_id")
	dept := &models.Department{}
	eng := models.GetEngine()
	eng.Where("id = ?", staffdept).Get(dept)
	if dept.Supervisor == -1 {
		dept.Supervisor = dept.Id
	}
	var c_type string
	if dept.DeptType == 1 {
		c_type = "2"
	} else if dept.DeptType == 3 {
		c_type = "1"
	}
	spvs := strconv.Itoa(dept.Supervisor)
	var coms []models.Commodity
	com := new(models.Commodity)
	n := schema.ExtBasicQuery(eng, r, []string{"id", "name", "class_code", "intro", "price", "group_buy_price", "online_buy", "specification",
		"supplier", "commodity_type", "dept", "unit", "class_id", "recommended", "discount_on", "coupon_on", "coupon"},
		&coms, com, []string{"dept = ?", "is_main_unit = ? ", "online_buy=?"}, []string{spvs, c_type, "1"}, []string{"", "and", "and"})
	fs := `[%d,"%s","%s","%s",%d,%d,%d,"%s",%d,%d,%d,"%s","%s",%d,%d,%d,%d],`
	s := ""
	for _, u := range coms {
		s += fmt.Sprintf(fs, u.Id, u.Name, u.ClassCode, u.Intro, u.Price, u.GroupBuyPrice, u.OnlineBuy,
			u.Specification, u.Supplier, u.CommodityType, u.Dept, u.Unit, u.ClassId, u.Recommended, u.DiscountOn, u.CouponOn, u.Coupon)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}
