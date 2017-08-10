package file

import (
	ctrl "mman/controllers"
	conf "mrten/conf"
	"net/http"

	"github.com/qiniu/api.v7/kodo"
	qnconf "qiniupkg.com/api.v7/conf"
	//"web/cookie"
	//"web/session"
	//"web/util"
)

func init() {
	qnconf.ACCESS_KEY = conf.QnAK
	qnconf.SECRET_KEY = conf.QnSK

}
func Handler() {
	ctrl.HMAP["/qn/token"] = qnToken
}

func qnToken(w http.ResponseWriter, r *http.Request) {
	c := kodo.New(0, nil)

	//设置上传的策略
	policy := &kodo.PutPolicy{
		Scope: conf.QnPub,
		//设置Token过期时间
		Expires: 3600,
	}
	//生成一个上传token
	token := c.MakeUptoken(policy)
	w.Write([]byte(token))

}
