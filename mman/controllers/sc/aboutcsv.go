package sc

import (
	"fmt"
	ctrl "mman/controllers"
	//	"time"
	//	"mrten/models"
	"net/http"
	//	"strconv"
	"web/schema"
	//	"web/session"
	"encoding/csv"
	"os"
)

func Aboutcsv() {
	ctrl.HMAP["/sc/aboutcsv/purchase"] = purchasecsv   //销售统计
	ctrl.HMAP["/sc/aboutcsv/supplier"] = suppliercsv   //供应商统计
	ctrl.HMAP["/sc/aboutcsv/stockplan"] = stockplancsv //进货统计

}

type purchase struct {
	Data []string `schema:"data"`
}

func purchasecsv(w http.ResponseWriter, r *http.Request) {
	table := &purchase{}
	schema.FormParse(r, table)
	f, err := os.Create("/home/newfan/go/src/mman/static/files/销售单.csv")
	if err != nil {
		fmt.Println(err.Error())
	}
	defer f.Close()

	f.WriteString("\xEF\xBB\xBF") // 写入UTF-8 BOM

	wr := csv.NewWriter(f)
	for j := 0; j < len(table.Data)/14; j++ {
		row := j * 14
		wr.Write([]string{table.Data[row], table.Data[row+1], table.Data[row+2], table.Data[row+3],
			table.Data[row+4], table.Data[row+5], table.Data[row+6], table.Data[row+7],
			table.Data[row+8], table.Data[row+9], table.Data[row+10], table.Data[row+11],
			table.Data[row+12], table.Data[row+13]})
	}

	wr.Flush()

	fs := `{"res":0,"msg":"导出成功","url":"%s"}`
	w.Write([]byte(fmt.Sprintf(fs, "http://mman.newfan.net/files/销售单.csv")))
}

func stockplancsv(w http.ResponseWriter, r *http.Request) {
	table := &purchase{}
	schema.FormParse(r, table)
	f, err := os.Create("/home/wwww/mrten_new/mman/static/files/采购单.csv")
	if err != nil {
		fmt.Println(err.Error())
	}
	defer f.Close()

	f.WriteString("\xEF\xBB\xBF") // 写入UTF-8 BOM

	wr := csv.NewWriter(f)
	for j := 0; j < len(table.Data)/10; j++ {
		row := j * 10
		wr.Write([]string{table.Data[row], table.Data[row+1], table.Data[row+2], table.Data[row+3],
			table.Data[row+4], table.Data[row+5], table.Data[row+6], table.Data[row+7],
			table.Data[row+8], table.Data[row+9]})
	}
	wr.Flush()

	fs := `{"res":0,"msg":"导出成功","url":"%s"}`
	w.Write([]byte(fmt.Sprintf(fs, "http://mman.newfan.net/files/采购单.csv")))
}

func suppliercsv(w http.ResponseWriter, r *http.Request) {
	table := &purchase{}
	schema.FormParse(r, table)
	f, err := os.Create("/home/newfan/go/src/mman/static/files/供应商.csv")
	if err != nil {
		fmt.Println(err.Error())
	}
	defer f.Close()

	f.WriteString("\xEF\xBB\xBF") // 写入UTF-8 BOM

	wr := csv.NewWriter(f)
	for j := 0; j < len(table.Data)/6; j++ {
		row := j * 6
		wr.Write([]string{table.Data[row], table.Data[row+1], table.Data[row+2], table.Data[row+3],
			table.Data[row+4], table.Data[row+5]})
	}
	wr.Flush()

	fs := `{"res":0,"msg":"导出成功","url":"%s"}`
	w.Write([]byte(fmt.Sprintf(fs, "http://mman.newfan.net/files/供应商.csv")))
}
