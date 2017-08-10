package basis

import (
	"mrten/logs"

	seelog "github.com/cihub/seelog"
)

// InitHandlers
// 本模块的handlers集合处理
var Logger seelog.LoggerInterface

func InitHandlers() {
	Logger = logs.MmanLogger
	StaffHandlers()
	GpsHandlers()
	UserHandlers()
	AddressHandlers()
	DepartmentHandlers()
	DistrictHandlers()
	WxOpenIDHandlers()
	SubdistrictHandlers()
	DeliveryTypeHandlers()
	ManageStaffRole()
	DeliveryTimeHandlers()
	MemberHandlers()
}
