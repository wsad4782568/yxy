package sc

import (
	"mrten/logs"

	seelog "github.com/cihub/seelog"
)

var Logger seelog.LoggerInterface

func InitHandlers() {
	Logger = logs.MmanLogger
	OrderPrintHandlers()
	EnterStockingHandlers()
	CommodityHandlers()
	CommodityRelHandlers()
	StockHandlers()
	StockingPlanHandlers()
	CheckStockingHandlers()
	StockTransferHandlers()
	ExpressstockHandlers()
	LowerPriceHandlers()
	FreeGiftHandlers()
	ComPackageHandlers()
	StocklossHandlers()
	Statisticstrue()
	PreOrderHandlers()
	ComStockHandlers()
	Module()
	WarnStockHandlers()
	CommodityTypeHandlers()
	PromotionHandlers()
	GroupOrderManage()
	CouponHandlers()
	SupplierHandlers()
	GroupOrderManage()
	Aboutcsv()
}
