package basis

import (
	"fmt"
	"mman/auth"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"web/schema"
	ss "web/session"
)

type RoleAtPage struct {
	Roleid   int   `schema:"roleid"`
	Actionid []int `schema:"actionid"`
	Pageid   []int `schema:"pageid"`
}
type StaffRole struct {
	Staffid []int `schema:"staffid"`
	Roleid  int   `schema:"roleid"`
}

func ManageStaffRole() {
	//	ctrl.HMAP["/basis/manageStaffRole/showStfRole"] = showStfRole           //获取role 员工staff相关信息
	ctrl.HMAP["/basis/manageStaffRole/showRole"] = showRole //获取role,attion,page相关信息
	ctrl.HMAP["/basis/manageStaffRole/passRoleGetAtPage"] = passRoleGetAtPage
	ctrl.HMAP["/basis/manageStaffRole/updateRoleAtPage"] = updateRoleAtPage //添加和更新role对应的action 和page
}
func showRole(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	roles := make([]models.Role, 0)
	err := eng.Find(&roles)
	if err != nil {
		fmt.Println(err.Error())
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
	}
	fs1 := `{"id":%d,"name":"%s"},`
	t1 := ""
	for _, ro := range roles {
		t1 += fmt.Sprintf(fs1, ro.Id, ro.Name)
	}
	fs := `{"res":1,"role":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, t1)))
	return
}

func passRoleGetAtPage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(200000000)
	roleid := r.Form.Get("roleid")
	// strconv.Atoi(s)
	eng := models.GetEngine()
	roleAction := make([]models.RoleAction, 0)
	rolePage := make([]models.RolePage, 0)
	actions := make([]models.Action, 0)
	pages := make([]models.Page, 0)
	err := eng.Asc("id").Find(&actions)
	if err != nil {
		fmt.Println("manageStaffRole.passRoleGetAtPage:")
		fmt.Println(err.Error())
	}
	err = eng.Asc("id").Find(&pages)
	if err != nil {
		fmt.Println("manageStaffRole.passRoleGetAtPage:")
		fmt.Println(err.Error())
	}
	err = eng.Where("role =?", roleid).Asc("action").Find(&roleAction)
	if err != nil {
		fmt.Println("manageStaffRole.passRoleGetAtPage:")
		fmt.Println(err.Error())
	}
	fs1 := `{"id":%d,"url":"%s","descripiton":"%s","flag":%d},`
	t1 := ""
	j := 0
	for _, ac := range actions {
		if j < len(roleAction) && roleAction[j].Action == ac.Id {
			t1 += fmt.Sprintf(fs1, ac.Id, ac.Url, ac.Description, 1)
			j++
		} else {
			t1 += fmt.Sprintf(fs1, ac.Id, ac.Url, ac.Description, 0)
		}
	}
	// fs2 := `{"id":%d,"url":"%s","descripiton":"%s","seq":%d},`
	// t3 := ""
	// for _, ro := range roleAction {
	// 	action := &models.Action{}
	// 	action.Id = ro.Action
	// 	_, err := eng.Id(action.Id).Get(action)
	// 	if err != nil {
	// 		panic(err)
	// 	}
	// 	t3 += fmt.Sprintf(fs2, action.Id, action.Url, action.Description, action.Seq)
	// }
	t2 := ""
	err = eng.Where("role=?", roleid).Asc("page").Find(&rolePage)
	if err != nil {
		fmt.Println("manageStaffRole.passRoleGetAtPage:")
		fmt.Println(err.Error())
	}
	j = 0
	for _, pg := range pages {
		if j < len(rolePage) && rolePage[j].Page == pg.Id {
			t2 += fmt.Sprintf(fs1, pg.Id, pg.Url, pg.Description, 1)
			j++
		} else {
			t2 += fmt.Sprintf(fs1, pg.Id, pg.Url, pg.Description, 0)
		}
	}
	fs := `{"res":1,"role":%s,"Action":[%s],"Page":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, roleid, t1, t2)))
}
func updateRoleAtPage(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	RAtPage := &RoleAtPage{}
	roleAction := make([]models.RoleAction, 0)
	rolePage := make([]models.RolePage, 0)
	var roleAc []models.RoleAction
	var rolePa []models.RolePage
	var roac models.RoleAction
	var ropa models.RolePage
	schema.FormParse(r, RAtPage)
	eng := models.GetEngine()
	err := eng.Where("role=?", RAtPage.Roleid).Find(&roleAction)
	if err != nil {
		fmt.Println("manageStaffRole.updateRoleAtPage:")
		Logger.Error(err)
	}
	if len(roleAction) != 0 {
		sql := "DELETE from `role_action` where role=?"
		_, err := eng.Exec(sql, RAtPage.Roleid)
		if err != nil {
			fmt.Println("manageStaffRole.updateRoleAtPage:")
			Logger.Error(err)
		}
	}
	err = eng.Where("role=?", RAtPage.Roleid).Find(&rolePage)
	if err != nil {
		fmt.Println("manageStaffRole.updateRoleAtPage:")
		Logger.Error(err)
	}

	if len(rolePage) != 0 {
		sql := "DELETE from `role_page` where role=?"
		_, err := eng.Exec(sql, RAtPage.Roleid)
		if err != nil {
			fmt.Println("manageStaffRole.updateRoleAtPage:")
			Logger.Error(err)
		}
	}
	count1 := len(RAtPage.Actionid)
	for i := 0; i < count1; i++ {
		roac.Role = RAtPage.Roleid
		roac.Action = RAtPage.Actionid[i]
		roleAc = append(roleAc, roac)
	}
	count2 := len(RAtPage.Pageid)
	for i := 0; i < count2; i++ {
		ropa.Role = RAtPage.Roleid
		ropa.Page = RAtPage.Pageid[i]
		rolePa = append(rolePa, ropa)
	}
	_, err1 := eng.Insert(roleAc)
	if err1 != nil {
		fmt.Println("manageStaffRole.updateRoleAtPage:")
		Logger.Error(err)
	}
	_, err2 := eng.Insert(rolePa)
	if err2 != nil {
		fmt.Println("manageStaffRole.updateRoleAtPage:")
		Logger.Error(err)
	}
	auth.Init()
	w.Write([]byte(`{"res":1}`))
}

// func updateStaffRole(w http.ResponseWriter, r *http.Request) {
// 	//	w.Header().Set("Access-Control-Allow-Origin", "*")
// 	stfRole := &StaffRole{}
// 	schema.FormParse(r, stfRole)
// 	fmt.Println(stfRole)
// 	eng := models.GetEngine()
// 	deptstaff := &models.DeptStaff{}
// 	count := len(stfRole.Staffid)
// 	for i := 0; i < count; i++ {
// 		deptstaff.StaffId = stfRole.Staffid[i]
// 		deptstaff.Role = stfRole.Roleid
// 		affected, err := eng.Where("staff_id=?", deptstaff.StaffId).Cols("role").Update(deptstaff)
// 		if err != nil {
// 			panic(err)
// 		}
// 		if affected != 1 {
// 			fmt.Println("affected")
// 			fmt.Println(affected)
// 		}
// 	}
// 	auth.Init()
// 	w.Write([]byte(`{"res":1}`))
// }

// func showStfRole(w http.ResponseWriter, r *http.Request) {
// 	//w.Header().Set("Access-Control-Allow-Origin", "*")
// 	eng := models.GetEngine()
// 	roles := make([]models.Role, 0)
// 	err := eng.Find(&roles)
// 	if err != nil {
// 		panic(err)
// 	}
// 	fs1 := `{"id":%d,"name":"%s"},`
// 	t1 := ""
// 	for _, ro := range roles {
// 		t1 += fmt.Sprintf(fs1, ro.Id, ro.Name)
// 	}
// 	stfs := make([]models.Staff, 0)
// 	err = eng.Find(&stfs)
// 	if err != nil {
// 		panic(err)
// 	}
// 	fs2 := `{"staffid":%d,"username":"%s"},`
// 	t2 := ""
// 	for _, sf := range stfs {
// 		t2 += fmt.Sprintf(fs2, sf.Id, sf.Username)
// 	}
// 	fs := `{"res":1,"role":[%s],"staff":[%s]}`
// 	w.Write([]byte(fmt.Sprintf(fs, t1, t2)))
// }

// func showRoleatpaget(w http.ResponseWriter, r *http.Request) {
// 	//	w.Header().Set("Access-Control-Allow-Origin", "*")
// 	eng := models.GetEngine()
// 	roles := make([]models.Role, 0)
// 	actions := make([]models.Action, 0)
// 	pages := make([]models.Page, 0)
// 	err := eng.Find(&roles)
// 	if err != nil {
// 		panic(err)
// 	}
// 	err = eng.Find(&actions)
// 	if err != nil {
// 		panic(err)
// 	}
// 	err = eng.Find(&pages)
// 	if err != nil {
// 		panic(err)
// 	}
//
// 	fs1 := `{"id":%d,"name":"%s"},`
// 	t1 := ""
// 	for _, ro := range roles {
// 		t1 += fmt.Sprintf(fs1, ro.Id, ro.Name)
// 	}
// 	fs2 := `{"id":%d,"url":"%s","descripiton":"%s","seq":%d},`
// 	t2 := ""
// 	for _, ac := range actions {
// 		t2 += fmt.Sprintf(fs2, ac.Id, ac.Url, ac.Description, ac.Seq)
// 	}
// 	t3 := ""
// 	for _, pg := range pages {
// 		t3 += fmt.Sprintf(fs2, pg.Id, pg.Url, pg.Description, pg.Seq)
// 	}
// 	fs := `{"res":1,"role":[%s],"action":[%s],"page":[%s]}`
// 	w.Write([]byte(fmt.Sprintf(fs, t1, t2, t3)))
// 	return
// }
