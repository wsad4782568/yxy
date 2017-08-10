package main

// 管理mman 8081
import (
	"web/session"

	"mman/auth"
	ctrl "mman/controllers"
	bc "mman/controllers/basis" //
	sc "mman/controllers/sc"    //供应链
	"mman/controllers/util"
	"mrten/conf"
	"mrten/models"
	"net/http"
	//"strings"
)

/* 转发器  */
type dispatchHandler struct {
	handler http.Handler
}

func (a *dispatchHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	a.handler.ServeHTTP(w, r)
}

func dispatch(w http.ResponseWriter, r *http.Request) {

	if hf, exists := ctrl.HMAP[r.URL.Path]; exists {
		// 基本权限管理
		ok, msg := permit(w, r)
		if !ok {
			w.Write([]byte(`{"res":-1,"msg":"` + msg + `"}`))
			return
		} else {
			hf(w, r)
		}
	}

}

func main() {
	auth.Init()
	session.Cookey(conf.Cookey)
	session.Lapse(conf.SessionLapse)
	initHandlers()
	models.InitModels()

	ah := &dispatchHandler{http.HandlerFunc(dispatch)}
	println("Listening on port 8082")
	http.ListenAndServe(":8082", ah)
}

func initHandlers() {
	//	 控制器初始化
	bc.InitHandlers() //用户
	sc.InitHandlers() // 供应链
	util.InitHandlers()

}

func permit(w http.ResponseWriter, r *http.Request) (bool, string) {

	return auth.Check(r)

	//		ps := strings.Split(r.URL.Path, "/")
	//		s, _ := session.Get(r, "role")

	//		if len(s) == 0 && len(ps) > 1 && (ps[1] == "a") {
	//			return false
	//		}
	//		return true

}
