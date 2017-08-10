package sc

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"net/http"
	"strconv"
	"time"
	"web/schema"
	"web/session"
)

func ComStockHandlers() {
	ctrl.HMAP["/sc/comstock/add"] = addcomstock       // 增加组合商品
	ctrl.HMAP["/sc/comstock/reduce"] = reducecomstock // 增加组合商品

}

type comstock struct {
	CommodityMainid int       `schema:"commoditymainid"` // 礼包ID
	Commodityid     []int     `schema:"commodityid"`     // 商品id
	Amountbycom     []float64 `schema:"amountbycom"`     //每个商品对应的数量
	Amount          float64   `schema:"amount"`          //增加或减少的组合商品的数量
	Cdept           int       `xorm:"-" schema:"cdept"`
}

func addcomstock(w http.ResponseWriter, r *http.Request) {
	table := &comstock{}
	schema.FormParse(r, table)
	staffid, _ := strconv.Atoi(session.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	if err != nil {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"增加失败，请检查信息"}`))
		return
	}
	stockmain := &models.Stock{}
	stockmain.Commodity = table.CommodityMainid
	stockmain.Dept = table.Cdept
	ok, err := session.Get(stockmain)
	if err != nil || !ok {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"增加失败，请检查信息"}`))
		return
	}
	affected, err := session.Exec("update stock set amount=amount+? where id=?", table.Amount, stockmain.Id)
	row, _ := affected.RowsAffected()
	if err != nil || row != 1 {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"增加失败，请检查信息"}`))
		return
	}
	length := len(table.Commodityid)
	for i := 0; i < length; i++ {
		stock := &models.Stock{}
		stock.Commodity = table.Commodityid[i]
		stock.Dept = table.Cdept
		ok, err = session.Get(stock)
		if err != nil || !ok {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"增加失败，请检查信息"}`))
			return
		}
		if stock.Amount >= table.Amountbycom[i]*table.Amount {
			affected, err = session.Exec("update stock set amount=? where id=?", stock.Amount-table.Amountbycom[i]*table.Amount, stock.Id)
			row, _ = affected.RowsAffected()
			if err != nil || row != 1 {
				fmt.Println(err.Error())
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"增加失败，请检查信息"}`))
				return
			}
		} else {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"库存不足，请少量选择商品"}`))
			return
		}
		change := &models.StockChange{}
		change.Amount = table.Amount * table.Amountbycom[i]
		change.ChangeType = 5
		change.Created = time.Now().Unix()
		change.Operator = staffid
		change.Stock = stock.Id
		affecteds, err := session.Insert(change)
		if err != nil || affecteds != 1 {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"增加失败，请检查信息"}`))
			return
		}

	}

	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"增加成功"}`))
}

func reducecomstock(w http.ResponseWriter, r *http.Request) {
	table := &comstock{}
	schema.FormParse(r, table)
	fmt.Println(table)
	staffid, _ := strconv.Atoi(session.HGet(r, "staff", "staff_id"))
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	err := session.Begin()
	if err != nil {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"增加失败，请检查信息"}`))
		return
	}
	stockmain := &models.Stock{}
	stockmain.Commodity = table.CommodityMainid
	stockmain.Dept = table.Cdept
	ok, err := session.Get(stockmain)
	if err != nil || !ok {
		fmt.Println(err.Error())
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"增加失败，请检查信息"}`))
		return
	}
	if stockmain.Amount >= table.Amount {
		fmt.Println("nihao")
		affected, err := session.Exec("update stock set amount=amount-? where id=?", table.Amount, stockmain.Id)
		row, _ := affected.RowsAffected()
		if err != nil || row != 1 {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"增加失败，请检查信息"}`))
			return
		}
	} else {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"库存不足，不够拆分这么多商品"}`))
		fmt.Println("库存不足，不够拆分这么多商品")
		return
	}

	length := len(table.Commodityid)
	for i := 0; i < length; i++ {
		stock := &models.Stock{}
		stock.Commodity = table.Commodityid[i]
		stock.Dept = table.Cdept
		ok, err = session.Get(stock)
		if err != nil || !ok {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"增加失败，请检查信息"}`))
			return
		}
		affected, err := session.Exec("update stock set amount=? where id=?", stock.Amount+table.Amountbycom[i]*table.Amount, stock.Id)
		row, _ := affected.RowsAffected()
		if err != nil || row != 1 {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"增加失败，请检查信息"}`))
			return
		}
		change := &models.StockChange{}
		change.Amount = table.Amount * table.Amountbycom[i]
		change.ChangeType = 5
		change.Created = time.Now().Unix()
		change.Operator = staffid
		change.Stock = stock.Id
		affecteds, err := session.Insert(change)
		if err != nil || affecteds != 1 {
			fmt.Println(err.Error())
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"增加失败，请检查信息"}`))
			return
		}

	}
	err = session.Commit()
	if err != nil {
		return
	}
	w.Write([]byte(`{"res":0,"msg":"减少成功"}`))
}
