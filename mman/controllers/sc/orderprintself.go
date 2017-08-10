package sc

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	ctrl "mman/controllers"
	"mrten/models"
	"msale/controllers/util/common"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"
	"web/redi"
)

func OrderPrintHandlers() {
	ctrl.HMAP["/sc/order/printself"] = orderprintself
}

type Print_status struct {
	ResponseCode int
	Msg          string
	Orderindex   string
}
type UrlResponse struct {
	Errcode   int
	Errmsg    string
	Short_url string
}

func FilterEmoji(content string) string {
	new_content := ""
	for _, value := range content {
		_, size := utf8.DecodeRuneInString(string(value))
		if size <= 3 {
			new_content += string(value)
		}
	}
	return new_content
}
func Longurl2short(longurl string) (string, error, string) {
	var ak = redi.Get("access_token")
	if ak == "" {
		common.MakeToken()
		ak = redi.Get("access_token")
	}
	if ak == "" {
		return longurl, nil, "token is null"
	}

	requestLine_url := fmt.Sprintf(`{"action":"long2short","long_url":"%s"}`, longurl)
	resp_url, err := http.Post("https://api.weixin.qq.com/cgi-bin/shorturl?access_token="+ak,
		"application/json",
		strings.NewReader(requestLine_url))

	if err != nil || resp_url.StatusCode != http.StatusOK {
		fmt.Println(err.Error())
		return longurl, err, "http post error"
	}

	defer resp_url.Body.Close()

	body_url, err := ioutil.ReadAll(resp_url.Body)
	if err != nil {
		fmt.Println(err.Error())
		return longurl, err, "return data error"
	}
	url := UrlResponse{}
	err = json.Unmarshal(body_url, &url)
	if err != nil {
		fmt.Println(err.Error())
		return longurl, err, ""
	}
	if url.Errcode != 0 {
		common.MakeToken()
		return longurl, err, "long2short error"
	}

	return url.Short_url, nil, ""
}
func orderprintself(w http.ResponseWriter, r *http.Request) {
	defer Logger.Flush()
	r.ParseForm()
	orders := r.Form.Get("orderid")
	department := r.Form.Get("department")
	if orders == "" && department == "" {
		fmt.Println("参数为空")
		w.Write([]byte(`{"res":-1,"msg":"参数错误"}`))
		return
	}
	db := models.GetEngine()
	delivery := new(models.Delivery)
	rb, err := db.Where("orders=?", orders).Get(delivery)
	if err != nil || !rb {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	if delivery.Status > 0 {
		w.Write([]byte(`{"res":-1,"msg":"此单已经打印过"}`))
		return
	}
	print_ := new(models.Printer)
	rb, err = db.Where("department=?", department).Get(print_)
	if err != nil || !rb {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	dept := new(models.Department)
	rrb, err := db.Id(delivery.Department).Get(dept)
	if err != nil || !rrb {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	var (
		//PRINTER_SN：打印机编号9位,查看打印机机身贴纸
		//KEY：网站上添加打印机，即可自动生成KEY
		PRINTER_SN = print_.Sn  //915501136
		KEY        = print_.Key //2rq7AYIb
		//IP和端口不需要更改
		IP       = print_.Ip //http://dzp.feieyun.com:80
		HOSTNAME = "/FeieServer"
	)

	//标签说明："<BR>"为换行符,"<CB></CB>"为居中放大,"<B></B>"为放大,"<C></C>"为居中,"<L></L>"为字体变高
	//"<QR></QR>"为二维码,"<CODE>"为条形码,后面接12个数字
	content := ""
	if delivery.OrderType == 2 {
		content += "<CB><LOGO>预订</CB><BR>"
	} else {
		content += "<CB><LOGO></CB><BR>"
	}
	content += "--------------------------------<BR>"
	content += "订单流水号：" + delivery.Code + "<BR>"
	content += "店铺名称： " + dept.Name + "<BR>"
	content += "店铺地址： " + dept.Address + "<BR>"
	content += "店铺电话： " + dept.Phone + "<BR>"
	content += "================================<BR>"
	content += "商品名　　　　　        规格    数量        单价        金额<BR>"
	orderds := make([]models.OrdersDetail, 0)
	err = db.Table("orders_detail").
		Join("INNER", "commodity", "orders_detail.commodity=commodity.id").
		Where("orders_detail.orders=?", orders).Find(&orderds)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	total := 0
	for _, or := range orderds {
		total += or.PriceOnsale
		s := strconv.FormatFloat(float64(or.Amount), 'f', -1, 64) + "           " +
			strconv.FormatFloat(float64(or.PriceOnsale)/float64(or.Amount*100), 'f', -1, 64) + "元        " +
			strconv.FormatFloat(float64(or.PriceOnsale)/100, 'f', -1, 64) + "元" + "<BR>"
		content += or.CommodityName + "   " + "(" + or.Specification + ")<BR>"
		content += s + "<BR>"
	}
	content += "--------------------------------<BR>"
	content += "支付方式：网上支付<BR>"
	content += "外送费：" + strconv.FormatFloat(float64(delivery.DeliveryFee)/100, 'f', -1, 64) + "元<BR>"
	content += "消费金额：" + strconv.FormatFloat(float64(total)/100, 'f', -1, 64) + "元<BR>"
	content += "应付金额：" + strconv.FormatFloat(float64(total+delivery.DeliveryFee)/100, 'f', -1, 64) + "元<BR>"
	content += "--------------------------------<BR>"
	tm__ := time.Unix(delivery.ServiceTime, 0)
	name := FilterEmoji(delivery.Name)
	content += "收货人　：" + name + "<BR>"
	content += "送货地址：" + delivery.Address + "<BR>"
	content += "联系电话：" + delivery.Phone + "<BR>"
	content += "下单时间：" + tm__.Format("2006年01月02 15:04:05") + "<BR>"
	content += "出单时间：" + time.Now().Format("2006-01-02 15:04:05") + "<BR>"
	if delivery.DeliveryTime != delivery.ServiceTime {
		tm___ := time.Unix(delivery.DeliveryTime, 0)
		content += "配送时间：" + tm___.Format("2006年01月02 15:04:05") + "<BR>"
	} else {
		content += "配送时间：即时<BR>"
	}
	content += "--------------------------------<BR>"
	content += "留言:" + delivery.Memo

	longurl := "http://www.newfan.net.cn/sales/order/handle?ordercode=" + delivery.Code
	return_url, err, errmsg := Longurl2short(longurl)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	if errmsg != "" {
		fmt.Println(errmsg)
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	content += "<QR>" + return_url + "</QR>"

	client := http.Client{}
	postValues := url.Values{}
	postValues.Add("sn", PRINTER_SN)
	postValues.Add("key", KEY)
	postValues.Add("printContent", content) //打印内容
	postValues.Add("times", "1")            //打印次数

	url := IP + HOSTNAME + "/printOrderAction"

	res, _ := client.PostForm(url, postValues)
	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	defer res.Body.Close()
	//res.Body.Close()
	//{"responseCode":0,"msg":"服务器接收订单成功","orderindex":"xxxxxxxxxxxxxxxxxx"}
	str := string(data)
	ps := new(Print_status)
	err = json.Unmarshal([]byte(str), ps)
	if err != nil {
		w.Write([]byte(`{"res":-1,"msg":"飞鹅云数据错误"}`))
		return
	}
	if ps.ResponseCode != 0 {
		w.Write([]byte(`{"res":-1,"msg":"此订单已打印"}`))
		return
	}
	printerirnfo := &models.PrinterInfo{}
	printerirnfo.OrderIndex = ps.Orderindex
	printerirnfo.Code = delivery.Code
	printerirnfo.Orderdate = time.Now().Format("2006-01-02")
	affected, err := db.InsertOne(printerirnfo)
	if err != nil || affected != 1 {
		w.Write([]byte(`{"res":-1,"msg":"飞鹅云数据错误"}`))
		return
	}
	delivery.Status = 1 //已打印
	session := db.NewSession()
	defer session.Close()
	if err := session.Begin(); err != nil {
		w.Write([]byte(`{"res":-1,"msg":"xorm错误"}`))
		return
	}
	affected, err = session.Id(delivery.Id).Cols("status").Update(&delivery)
	if err != nil || affected != 1 {
		session.Rollback()
		Logger.Debug("手动打印订单更新失败")
	}
	err = session.Commit()
	if err != nil {
		Logger.Error("手动打印订单更新失败")
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
		return
	}
	w.Write([]byte(`{"res":1,"msg":"打印成功"}`))
}
