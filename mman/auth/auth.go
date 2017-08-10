package auth

import (
	"fmt"
	"mrten/models"
	"net/http"
	"strconv"
	"web/session"
)

var roleAction map[string][]int
var rolePage map[int][]string

// getPagesOfRole 传入role 获取对应的 page数组
func GetPagesOfRole(role int) string {
	//var page []string
	page := ""
	_, ok := rolePage[role]
	if !ok {
		fmt.Println("no role")
		return ""
	}
	for _, v := range rolePage[role] {
		page += fmt.Sprintf(`"%s",`, v)
	}
	return page
}
func Init() {
	roleAction = make(map[string][]int)
	rolePage = make(map[int][]string)
	actions := make([]models.Action, 0)
	rolepages := make([]models.RolePage, 0)
	eng := models.GetEngine()
	err := eng.Find(&actions)
	if err != nil {
		fmt.Println(err.Error())
	}
	count := len(actions)
	for i := 0; i < count; i++ {
		roleAction[actions[i].Url] = make([]int, 0)
		roleAction[actions[i].Url] = append(roleAction[actions[i].Url], -1)
		ra := make([]models.RoleAction, 0)
		err := eng.Where("action=?", actions[i].Id).Find(&ra)
		if err != nil {
			fmt.Println(err.Error())
		}
		if len(ra) > 0 {
			for j := 0; j < len(ra); j++ {
				roleAction[actions[i].Url] = append(roleAction[actions[i].Url], ra[j].Role)
			}
		}

	}
	err = eng.Find(&rolepages)
	if err != nil {
		fmt.Println(err.Error())
	}
	for i := 0; i < len(rolepages); i++ {
		rp := make([]models.Page, 0)
		err := eng.Id(rolepages[i].Page).Find(&rp)
		if err != nil {
			fmt.Println(err.Error())
		}
		for j := 0; j < len(rp); j++ {
			rolePage[rolepages[i].Role] = append(rolePage[rolepages[i].Role], rp[j].Url)
		}
	}
	fmt.Println("roleAction")
	fmt.Println(roleAction)
	fmt.Println("rolepage")
	fmt.Println(rolePage)
}

func Check(r *http.Request) (bool, string) {
	rolev, ok := roleAction[r.URL.Path]
	if !ok {
		return true, ""
	}
	stfrole, err := strconv.Atoi(session.HGet(r, "staff", "dept_role"))
	if stfrole == 1 {
		return true, ""
	}
	if err != nil {
		return false, "登录超时，请重新登录"
	}
	for _, vv := range rolev {
		if vv == stfrole {
			return true, ""
		}
	}
	return false, "鉴权失败"
}

// // 无限制

// stfrole, err := strconv.Atoi(session.HGet(r, "staff", "dept_role"))
// if err != nil {
// 	return false, "登录超时，请重新登录"
// }
// // 获取资源所载部门的id
// cdept, err := strconv.Atoi(r.URL.Query().Get("cdept"))
// if err != nil {
// 	return false, ""
// }
//
// mgdept := session.HGet(r, "staff", "manage_dept")
// ss1 := strings.Split(mgdept, ",")
// for _, ss2 := range ss1 {
// 	ss3 := strings.Split(ss2, "&")
// 	sdept, err := strconv.Atoi(ss3[0])
// 	if err != nil {
// 		continue
// 	}
// 	for _, vv := range rolev {
// 		if vv == stfrole && sdept == cdept {
// 			return true, ""
// 		}
// 	}
// }
//
// return false, "鉴权失败"
