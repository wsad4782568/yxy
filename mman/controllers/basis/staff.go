package basis

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"web/schema"
	ss "web/session"
)

func StaffHandlers() {
	ctrl.HMAP["/basis/staff/get"] = getStaff
	ctrl.HMAP["/basis/staff/update"] = updateStaff
	ctrl.HMAP["/basis/staff/delete"] = deleteStaff
	ctrl.HMAP["/basis/staff/changedept"] = changedept
	ctrl.HMAP["/basis/staff/insert"] = insertStaff
	ctrl.HMAP["/basis/staff/getstaffinfo"] = getstaffinfo
	ctrl.HMAP["/basis/staff/getControllersDept"] = getControllersDept
}

type StaffUser struct {
	models.Staff     `xorm:"extends"`
	models.DeptStaff `xorm:"extends"`
}

func (StaffUser) TableName() string {
	return "staff"
}

type staffinfo struct {
	models.Staff      `xorm:"extends"`
	models.DeptStaff  `xorm:"extends"`
	models.Department `xorm:"extends"`
}

func (staffinfo) TableName() string {
	return "staff"
}
func getstaffinfo(w http.ResponseWriter, r *http.Request) {
	staffid := ss.HGet(r, "staff", "staff_id")
	var tables []staffinfo
	eng := models.GetEngine()
	sess := eng.AllCols()
	sess.Join("INNER", "dept_staff", "staff.id = dept_staff.staff_id ")
	sess.Join("INNER", "department", "dept_staff.department=department.id ")
	sess.Where("staff.id=?", staffid).Find(&tables)
	fs := `["%s","%s"],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Staff.Username, u.Department.Name)
	}
	fs = `{'res':0,"stockinfo":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}
func getStaff(w http.ResponseWriter, r *http.Request) {
	queryob := &schema.QueryOb{}
	schema.FormParse(r, queryob)
	fmt.Println(queryob)
	eng := models.GetEngine()
	c_deptid := fmt.Sprintf("%d", queryob.Cq_dept)
	fmt.Println(c_deptid)
	var tables []StaffUser
	table := new(StaffUser)
	n := schema.ExtJoindQuery(eng, r, []string{"staff.id", "staff.username", "staff.title", "staff.pwd", "staff.phone", "staff.corp", "dept_staff.role"}, &tables, table,
		[][]string{{"INNER", "dept_staff", "staff.id = dept_staff.staff_id"}},
		[]string{"dept_staff.department = ?"},
		[]string{c_deptid}, []string{})
	fs := `[%d,"%s","%s","%s","%s",%d,%d],`
	s := ""
	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Staff.Id, u.Staff.Username, u.Staff.Title, u.Staff.Pwd, u.Staff.Phone, u.Staff.Corp, u.DeptStaff.Role)
	}
	fs = `{"count":%d,"rows":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, n, s)))
}

func updateStaff(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	Logger.Info(ss.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	tables := &models.Staff{}
	schema.FormParse(r, tables)
	h := md5.New()
	h.Write([]byte(tables.Pwd)) // 需要加密的字符串为
	pwd := hex.EncodeToString(h.Sum(nil))
	tables.Pwd = pwd
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	deptstaff := &models.DeptStaff{}
	has, err := session.Where("staff_id = ?", tables.Id).Get(deptstaff)
	if !has || err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"获取员工与部门的关系错误"}`))
		return
	}
	deptstaff.Role = tables.Role
	affected, err := session.Id(tables.Id).Update(tables)
	if err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"更新失败，请检查信息"}`))
		Logger.Error(err)
		return
	}
	if affected == 0 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"更新失败，请检查信息"}`))
		return
	}

	affected, err = eng.Where("staff_id = ?", tables.Id).Update(deptstaff)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"更新失败，请检查信息"}`))
		Logger.Error(err)
		return
	}
	if affected == 0 {
		w.Write([]byte(`{"res":-1,"msg":"更新失败，请检查信息"}`))
		return
	}

	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))

}

func insertStaff(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	c_deptid, _ := strconv.Atoi(r.URL.Query().Get("cdept"))
	tables := &models.Staff{}
	schema.FormParse(r, tables)
	fmt.Println(tables)
	h := md5.New()
	h.Write([]byte(tables.Pwd)) // 需要加密的字符串为
	pwd := hex.EncodeToString(h.Sum(nil))
	tables.Pwd = pwd
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	affected, err := session.InsertOne(tables)
	if err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"用户电话重复了，或其他信息有误"}`))
		fmt.Println(err.Error())
		return
	}
	if affected == 0 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"新增员工信息失败"}`))
		return
	}
	deptstaff := &models.DeptStaff{}
	deptstaff.Department = c_deptid
	deptstaff.Role = tables.Role
	deptstaff.StaffId = tables.Id
	affected, err = session.InsertOne(deptstaff)
	if err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	if affected == 0 {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"为部门添加员工失败失败"}`))
		return
	}
	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"新增员工成功"}`))

}

func deleteStaff(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	tables := &models.Staff{}
	schema.FormParse(r, tables)
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	_, err = session.Exec("delete from staff where id = ?", tables.Id)
	if err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"删除员工信息失败"}`))
		return
	}
	_, err = session.Exec("delete from dept_staff where staff_id = ?", tables.Id)
	if err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"删除员工与部门间的关系失败"}`))
		return
	}

	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"删除成功"}`))

}

func changedept(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	tables := &models.DeptStaff{}
	schema.FormParse(r, tables)
	affected, err := eng.Where("staff_id = ?", tables.StaffId).Update(tables)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"调动失败"}`))
		fmt.Println(err.Error())
		return
	}
	if affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"调动失败"}`))
		return
	}

	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))

}

func getControllersDept(w http.ResponseWriter, r *http.Request) {
	eng := models.GetEngine()
	staffdept := ss.HGet(r, "staff", "dept_id")
	dept := &models.Department{}
	eng.Where("id = ?", staffdept).Get(dept)
	fs := `[%d,"%s"],`
	s := ""
	if dept.Supervisor == -1 {
		dept.Supervisor = dept.Id
		s += fmt.Sprintf(fs, dept.Id, dept.Name)
	}
	var tables []models.Department
	eng.Where("supervisor = ?", dept.Supervisor).Find(&tables)

	for _, u := range tables {
		s += fmt.Sprintf(fs, u.Id, u.Name)
	}
	fs = `{"deptall":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, s)))
}
