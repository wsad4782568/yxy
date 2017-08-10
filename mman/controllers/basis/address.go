package basis

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"web/schema"
)

func AddressHandlers() {
	ctrl.HMAP["/basis/address/get"] = GetAddress // 送货地址
}

type AddressSubdistrict struct {
	models.Address     `xorm:"extends"`
	models.UserInfo    `xorm:"extends"`
	models.Subdistrict `xorm:"extends"`
	models.District    `xorm:"extends"`
}

func (AddressSubdistrict) TableName() string {
	return "address"
}

func GetAddress(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	var tables []AddressSubdistrict
	table := new(AddressSubdistrict)
	n := schema.JoindQuery(eng, r, []string{"address.id", "address.title", "user_info.name", "address.room", "address.phone", "address.flag", "subdistrict.name"}, &tables, table,
		[][]string{{"INNER", "user_info", "address.user_id = user_info.id"}, {"INNER", "subdistrict", "address.subdistrict_id = subdistrict.id"},
			{"INNER", "district", "subdistrict.district = district.id"}}) //内联条件，记得按照结构体定义的顺序来 不然相同的字段名会混乱出错)
	fs := `[%d,"%s","%s","%s","%s",%d,"%s"],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Address.Id, u.Address.Title, u.UserInfo.Name, u.Address.Room, u.Address.Phone, u.Address.Flag, u.District.Province+u.District.City+u.District.District+u.Subdistrict.Name)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}
