package util

import (
	"fmt"
	"mman/auth"
	ctrl "mman/controllers"
	"mrten/utils"
	"net/http"
	"strconv"
)

//form WXHandlers()  处理微信接口
func WXHandlers() {
	ctrl.HMAP["/staff/pc_staff_login"] = pc_staff
	ctrl.HMAP["/staff/getstaffinfo"] = get_staff_info
}

//员工登录
func pc_staff(w http.ResponseWriter, r *http.Request) {
	//
	res := utils.StaffLogin(w, r)
	if res == "1004" {
		w.Write([]byte(`{"res":-1,"msg":"数据库查询失败"}`))
		return
	}
	if res == "1005" {
		w.Write([]byte(`{"res":-1,"msg":"login failed 用户名或密码错误"}`))
		return
	}
	if res == "10041" {
		w.Write([]byte(`{"res":-1,"msg":"数据库内联查询失败"}`))
		return
	}
	if res == "10040" {
		w.Write([]byte(fmt.Sprintf(`{"res":-1,"msg":"数据库sql查询失败"}`)))
		return
	}
	if res == "2005" {
		w.Write([]byte(`{"res":-1,"msg":"login failed 用户名或密码为空"}`))
		return
	}
	if res == "3002" {
		w.Write([]byte(`{"res":-1,"msg":" 插入redis出现错误"}`))
		return
	}
	role, _ := strconv.Atoi(res)
	rolepage := auth.GetPagesOfRole(role)
	rootuser := ""
	if role == 1 {
		rootuser = "超级用户"
	} else {
		rootuser = "非超级用户"
	}
	fs := `{"res":0,"msg":"登录成功","rootuser":"%s","rolepage":[%s]}`
	w.Write([]byte(fmt.Sprintf(fs, rootuser, rolepage)))
	return

}
func get_staff_info(w http.ResponseWriter, r *http.Request) {
	//
	res := utils.GetStaffInfo(r)
	if res == "3001" {
		w.Write([]byte(`{"res":-1,"msg":"长时间未操作，请重新登录"}`))
		return
	}
	if res == "10041" {
		w.Write([]byte(fmt.Sprintf(`{"res":-1,"msg":"数据库查询失败"}`)))
		return
	}
	w.Write([]byte(res))
	return
}
