package basis

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"web/schema"
)

func GpsHandlers() {
	ctrl.HMAP["/basis/gps/getsubinfo"] = Getsubinfo     //部门信息
	ctrl.HMAP["/basis/gps/updateSubGps"] = UpdateSubGps //更新部门范围
	ctrl.HMAP["/basis/gps/getSubGps"] = GetSubGps       //
}

type SubArea struct {
	Subname string   `schema:"subname"`
	Subid   int      `schema:"subid"`
	Lng     []string `schema:"lng"`
	Lat     []string `schema:"lat"`
	Cdept   int      `schema:"cdept"`
}

func Getsubinfo(w http.ResponseWriter, r *http.Request) {
	var subs []models.Subdistrict
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Find(&subs)
	dp := `[%d,"%s"],`
	d := ""
	for _, u := range subs {
		d += fmt.Sprintf(dp, u.Id, u.Name)
	}
	w.Write([]byte(fmt.Sprintf(`{"res":1,"subs":[%s]}`, d)))
}
func UpdateSubGps(w http.ResponseWriter, r *http.Request) {
	da := &SubArea{}
	schema.FormParse(r, da)
	eng := models.GetEngine()
	dg := &models.SubGps{SubName: da.Subname, Subdistrict: da.Subid}
	has, err := eng.Get(dg)
	if err != nil {
		w.Write([]byte(fmt.Sprintf(`{"res":-1}`)))
		return
	}
	lng := ""
	lat := ""
	for i := 0; i < len(da.Lng); i++ {
		lng += da.Lng[i] + ","
		lat += da.Lat[i] + ","
	}
	dg.Lng = lng
	dg.Lat = lat
	if !has {
		res, err := eng.InsertOne(dg)
		if err != nil || res < 1 {
			w.Write([]byte(fmt.Sprintf(`{"res":-1`)))
			return
		}
	} else {
		res, err := eng.AllCols().Id(dg.Id).Update(dg)
		if err != nil || res < 1 {
			w.Write([]byte(fmt.Sprintf(`{"res":-1`)))
			return
		}
	}
	w.Write([]byte(fmt.Sprintf(`{"res":1}`)))
}
func GetSubGps(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	subgs := make([]models.SubGps, 0)
	err := eng.Find(&subgs)
	if err != nil {
		w.Write([]byte(fmt.Sprintf(`{"res":-1}`)))
		return
	}
	sub := `{"subdistrict":%d,"subName":"%s","lng":"%s","lat":"%s"},`
	s := ""
	for _, dg := range subgs {
		s += fmt.Sprintf(sub, dg.Subdistrict, dg.SubName, dg.Lng, dg.Lat)
	}
	fmt.Println(s)
	w.Write([]byte(fmt.Sprintf(`{"res":1,"data":[%s]}`, s)))
}
