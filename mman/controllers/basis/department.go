package basis

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"time"
	"web/schema"
	"web/util"
	ss "web/session"
)

func DepartmentHandlers() {
	ctrl.HMAP["/basis/department/getext"] = getDeptExtend // 部门 与 员工信息
	ctrl.HMAP["/basis/department/get"] = getDept          // 部门
	ctrl.HMAP["/basis/department/update"] = updateDept    // 部门
	ctrl.HMAP["/basis/department/insert"] = insertDept    // 部门insertDept
	ctrl.HMAP["/basis/department/getdept"] = getdeptinfo  // 部门Dept
}

type DepartmentStaff struct {
	models.Department `xorm:"extends"`
	models.Staff      `xorm:"extends"`
}

func (DepartmentStaff) TableName() string {
	return "department"
}

type DeptStaff struct {
	Id        int    `form:"id" `
	Name      string `form:"name"`
	IsAllied  int8   `form:"isallied"`
	Intro     string `form:"intro"`
	Active    int8   `form:"active"`
	Created   string `form:"created"`
	DeptType  int8   `form:"depttype"`
	Status    int8   `form:"status"`
	Username  string `form:"username"`
	OpenEnd   int64  `form:"openend"`
	OpenStart int64  `form:"openstart"`
	DeptAdmin int    `form:"deptadmin"`
}

func getdeptinfo(w http.ResponseWriter, r *http.Request) {
	var dept []models.Department
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Where("dept_type=?", 1).Or("dept_type = ?", 3).Or("dept_type=?", 8).Find(&dept)
	dp := `[%d,"%s",%d],`
	d := ""
	for _, u := range dept {
		d += fmt.Sprintf(dp, u.Id, u.Name, u.DeptType)
	}
	w.Write([]byte(fmt.Sprintf(`{"dept":[%s]}`, d)))
}

func getDeptExtend(w http.ResponseWriter, r *http.Request) {
	var sub []models.Department
	var stf []models.Staff
	_ = models.ExtQuery([]string{"id", "name"}, &sub, "dept_type = ?", 7)
	fs := `[%d,"%s"],`
	t := ""
	for _, u := range sub {
		t += fmt.Sprintf(fs, u.Id, u.Name)
	}
	_ = models.ExtQuery([]string{"id", "username"}, &stf, "id > ?", -1)
	s := ""
	for _, u := range stf {
		s += fmt.Sprintf(fs, u.Id, u.Username)
	}
	fs = `{"dept":[%s],"staff":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, t, s)))
}

func getDept(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	var tables []models.Department
	table := new(models.Department)
	n := schema.BasicQuery(eng, r, []string{"id", "name", "is_allied", "intro", "active", "created",
		"dept_type", "status", "supervisor", "open_end", "open_start", "dept_admin", "phone", "address"}, &tables, table)
	fs := `[%d,"%s",%d,"%s",%d,"%s",%d,%d,%d,%d,%d,%d,"%s","%s"],`
	s := ""
	for _, u := range tables {
		created := schema.IntToTimeStr(u.Created)
		//open_start := schema.IntToTimeStr(u.Department.OpenStart)
		s += fmt.Sprintf(fs, u.Id, u.Name, u.IsAllied, u.Intro, u.Active, created,
			u.DeptType, u.Status, u.Supervisor, u.OpenEnd, u.OpenStart, u.DeptAdmin, u.Phone, u.Address)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}
func updateDept(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.Department{}
	util.FormParse(r, tables, 2)
	affected, err := eng.Table(new(models.Department)).Id(tables.Id).Update(map[string]interface{}{
		"name": tables.Name, "is_allied": tables.IsAllied, "intro": tables.Intro, "active": tables.Active, "dept_type": tables.DeptType, "status": tables.Status,
		"supervisor": tables.Supervisor, "open_end": tables.OpenEnd, "open_start": tables.OpenStart, "dept_admin": tables.DeptAdmin,
		"phone": tables.Phone, "address": tables.Address})
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		Logger.Error(err)
		return
	}
	if affected == 0 {
		w.Write([]byte(`{"res":-1,"msg":"找不到这条数据"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))

}

func insertDept(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.Department{}
	util.FormParse(r, tables, 2)
	tables.Created = time.Now().Unix()
	affected, err := eng.Insert(tables)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		Logger.Error(err)
		return
	}
	if affected == 0 {
		w.Write([]byte(`{"res":-1,"msg":"插入失败，请检查信息"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"插入成功"}`))

}
