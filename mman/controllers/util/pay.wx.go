package util

// import (
// 	"bytes"
// 	"crypto/sha1"
// 	"encoding/json"
// 	"fmt"
// 	"io"
// 	"io/ioutil"
// 	"math/rand"
// 	ctrl "mman/controllers"
// 	"mrten/conf"
// 	"net/http"
// 	"sort"
// 	"strings"
// 	"time"
// 	"web/util"
//
// 	"github.com/pingplusplus/pingpp-go/pingpp"
// 	"github.com/pingplusplus/pingpp-go/pingpp/charge"
// 	"github.com/pingplusplus/pingpp-go/pingpp/utils"
// )
//
// func PayWxHandlers() {
// 	ctrl.HMAP["/pay/wx/test"] = Test
// 	ctrl.HMAP["/pay/wx/te"] = Te
// 	ctrl.HMAP["/pay/wx/check"] = checksign
// }
//
// const (
// 	//微信公众号
// 	wxAppId             = "wx15c6a124160fb8fb"               // 微信公众平台ID
// 	wxAppSecret         = "2ee0a6442aaeed348adb5ad4745923cc" //
// 	wx_token            = "xA7dYuYPk67e3yuud8KBEARSHOPTEN"
// 	accessTokenFetchUrl = "https://api.weixin.qq.com/sns/oauth2/access_token"
// 	wxCallbackUri       = "http://huz.shopten.cn/index.html"
// )
//
// type test_struct struct {
// 	Channel string
// 	Amount  uint64
// 	Code    string
// }
// type akResponse struct {
// 	Access_token  string
// 	Refresh_token string
// 	Openid        string
// 	Scope         string
// 	Unionid       string
// }
// type userinfoResponse struct {
// 	Openid     string
// 	Nickname   string
// 	Sex        int
// 	Province   string
// 	City       string
// 	Country    string
// 	Headimgurl string
// 	Unionid    string
// }
// type CheckSignatureInfo struct {
// 	Signature string `form:"signature"`
// 	Timestamp string `form:"timestamp"`
// 	Nonce     string `form:"nonce"`
// 	Echostr   string `form:"echostr"`
// }
//
// func Test(w http.ResponseWriter, r *http.Request) { //测试交易函数
// 	var t test_struct
// 	err := json.NewDecoder(r.Body).Decode(&t)
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	ips := strings.Split(r.RemoteAddr, ":")
// 	pingpp.AcceptLanguage = "zh-CN"
// 	pingpp.Key = conf.PingppKey
// 	privateKey, err := ioutil.ReadFile(conf.PingppPrivateKeyPath)
// 	if err != nil {
// 		fmt.Println(err.Error())
// 		return
// 	}
// 	pingpp.AccountPrivateKey = string(privateKey)
//
// 	requestLine_ak := strings.Join([]string{accessTokenFetchUrl,
// 		"?grant_type=authorization_code&appid=",
// 		wxAppId,
// 		"&secret=",
// 		wxAppSecret,
// 		"&code=",
// 		t.Code}, "")
//
// 	resp_ak, err := http.Get(requestLine_ak)
// 	if err != nil || resp_ak.StatusCode != http.StatusOK {
// 		w.Write([]byte(fmt.Sprintf(`{"res":"%s"}`, err.Error())))
// 		return
// 	}
//
// 	defer resp_ak.Body.Close()
//
// 	body_ak, err := ioutil.ReadAll(resp_ak.Body)
// 	if err != nil {
// 		w.Write([]byte(fmt.Sprintf(`{"res":"%s"}`, err.Error())))
// 		return
// 	}
//
// 	if bytes.Contains(body_ak, []byte("errcode")) {
// 		w.Write([]byte(`{"res":1}`))
// 		return
// 	}
//
// 	ak := akResponse{}
// 	err = json.Unmarshal(body_ak, &ak)
// 	if err != nil {
// 		w.Write([]byte(fmt.Sprintf(`{"res":"%s"}`, err.Error())))
// 		return
// 	}
// 	rand_number := rand.New(rand.NewSource(time.Now().UnixNano()))
// 	str := fmt.Sprintf("%d", (rand_number.Intn(99999999999)))
// 	params := &pingpp.ChargeParams{
// 		Order_no:  str,
// 		App:       pingpp.App{Id: conf.PingppAppId},
// 		Amount:    t.Amount,
// 		Channel:   t.Channel,
// 		Currency:  "cny",
// 		Client_ip: ips[0],
// 		Subject:   "pc2",
// 		Body:      "Test交易",
// 	}
// 	params.Extra = make(map[string]interface{})
// 	params.Extra["open_id"] = ak.Openid
// 	ch, err := charge.New(params)
// 	if err == nil {
// 		js1, _ := json.Marshal(ch)
// 		w.Write([]byte(string(js1)))
// 	} else {
// 		w.Write([]byte(`{"res":1}`))
// 	}
// }
//
// func b(data string) string { //sha1转换
// 	t := sha1.New()
// 	io.WriteString(t, data)
// 	return fmt.Sprintf("%x", t.Sum(nil))
// }
// func checksign(w http.ResponseWriter, r *http.Request) { //验证服务器,wx发来http
// 	checkSign := new(CheckSignatureInfo)
// 	util.FormParse(r, checkSign, 3)
// 	fmt.Println(checkSign)
// 	if checkSign.Signature == "" || checkSign.Timestamp == "" ||
// 		checkSign.Nonce == "" || checkSign.Echostr == "" {
// 		w.Write([]byte(`{"res":1000}`))
// 		return
// 	}
// 	tmps := []string{wx_token, checkSign.Timestamp, checkSign.Nonce}
// 	sort.Strings(tmps)
// 	tmpStr := tmps[0] + tmps[1] + tmps[2]
// 	tmp := b(tmpStr)
// 	fmt.Println(tmp)
// 	fmt.Println(checkSign.Signature)
// 	if tmp == checkSign.Signature {
// 		w.Write([]byte(fmt.Sprintf(`%s`, checkSign.Echostr)))
// 		return
// 	}
// 	w.Write([]byte(`"fail"`))
// 	return
// }
//
// func Te(w http.ResponseWriter, r *http.Request) { //获取用户Open_id 进行验证
// 	//
// 	code_url := utils.CreateOauthUrlForCode(wxAppId, wxCallbackUri, true)
// 	fmt.Println(code_url)
// 	w.Write([]byte(code_url))
// }
