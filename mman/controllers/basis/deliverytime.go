package basis

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"web/schema"
)

func DeliveryTimeHandlers() {
	ctrl.HMAP["/basis/deliverytime/get"] = getdeliverytime
	ctrl.HMAP["/basis/deliverytime/insert"] = insertdeliverytime
}

type deliverytimeextend struct {
	Dept     int   `schema:"dept"`
	Start    []int `schema:"start"`
	End      []int `schema:"end"`
	Step     []int `schema:"step"`     //间隔时间
	Restrict []int `schema:"restrict"` //限制时间
	Intime   []int `schema:"intime"`   //是否即时  1:是,2:否
}

func getdeliverytime(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	deliverytime := &models.DeliveryTime{}
	schema.FormParse(r, deliverytime)
	var tables []models.DeliveryTime
	sess := eng.AllCols()
	sess.Where("delivery_time.dept= ?", deliverytime.Dept).Find(&tables)
	fs := `[%d,%d,%d,%d,%d],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Start, u.End, u.Restrict, u.Step, u.Intime)
	}
	fs = `{'res':0,"deliverytime":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}

func insertdeliverytime(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	table := &deliverytimeextend{}
	schema.FormParse(r, table)
	fmt.Println(table)
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	_, err = session.Exec("delete from delivery_time where dept=?", table.Dept)
	if err != nil {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}
	length := len(table.Start)
	for i := 0; i < length; i++ {
		deliverytime := &models.DeliveryTime{}
		deliverytime.Start = table.Start[i]
		deliverytime.End = table.End[i]
		deliverytime.Restrict = table.Restrict[i]
		deliverytime.Step = table.Step[i]
		deliverytime.Intime = table.Intime[i]
		deliverytime.Dept = table.Dept
		affecteds, err := session.Insert(deliverytime)
		if err != nil || affecteds != 1 {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
			return
		}
	}
	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"插入成功"}`))
}
