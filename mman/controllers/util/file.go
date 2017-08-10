package util

import (
	"fmt"
	ctrl "mman/controllers"
	"mrten/models"
	"mrten/utils"
	"net/http"
	"time"
	"web/schema"
)

func FileHandlers() {
	ctrl.HMAP["/qn/showimage"] = showimg                //显示图片
	ctrl.HMAP["/qn/delete"] = delimg                    //删除图片
	ctrl.HMAP["/qn/upload"] = upimg                     //上传图片
	ctrl.HMAP["/qn/commodityfile"] = insertComFile      //插入到comFile中关联表中
	ctrl.HMAP["/qn/upload/modulePic"] = upModulePic     //上传首页广告图片
	ctrl.HMAP["/qn/insertmanyfile"] = insertManyComFile //商品多个单位同步图片
	ctrl.HMAP["/qn/deletemany"] = qnDeleteMany
	ctrl.HMAP["/qn/commodityfile/update"] = updateCommodityFile
	// ctrl.HMAP["/qn/class/show"] = showClassImage
	// ctrl.HMAP["/qn/class/insert"] = insertClassImage

}
func upModulePic(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	modPath := "modulePic/"
	res := utils.QnUpload(r, modPath)
	if res == "1003" {
		w.Write([]byte(`{"res":-1,"msg":"数据库更新错误"}`))
		return
	}
	fmt.Println(res)
	w.Write([]byte(res))
}
func showimg(w http.ResponseWriter, r *http.Request) {
	res := utils.ShowImage(r)
	if res == "1004" {
		w.Write([]byte(`{"res":-1,"msg":"数据库查询错误"}`))

	}
	w.Write([]byte(res))
	return
}
func delimg(w http.ResponseWriter, r *http.Request) {
	res := utils.QnDelete(r)
	if res == "1002" {
		w.Write([]byte(`{"res":-1,"msg":"数据库删除错误"}`))
		return
	}
	if res == "1" {
		w.Write([]byte(`{"res":1,"msg":"删除完成"}`))
		return
	}
}
func upimg(w http.ResponseWriter, r *http.Request) {
	comPath := ""
	res := utils.QnUpload(r, comPath)
	if res == "1003" {
		w.Write([]byte(`{"res":-1,"msg":"数据库更新错误"}`))
		return
	}
	w.Write([]byte(res))
}
func insertComFile(w http.ResponseWriter, r *http.Request) {
	res := utils.Commodityfile(r)
	if res == "1001" {
		w.Write([]byte(`{"res":-1,"msg":"数据库插入错误"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"插入图片成功"}`))
	return
}

type manycommfile struct {
	Filekey     []string
	Commodityid int
}

func insertManyComFile(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Access-Control-Allow-Origin", "*")
	cf := &manycommfile{}
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	_ = session.Begin()
	schema.FormParse(r, cf)
	cm := &models.Commodity{}
	var coms []models.Commodity
	has, err := eng.Where("id = ?", cf.Commodityid).Get(cm)
	if !has || err != nil {
		w.Write([]byte(`{"res":-1,"msg":"同步其他商品时失败"}`))
		return
	}
	eng.Where("commodity_no = ?", cm.CommodityNo).Find(&coms)
	for _, u := range coms {
		l := len(cf.Filekey)
		for i := 0; i < l; i++ {
			commfile := &models.CommodityFile{}
			commfile.Commodity = u.Id
			commfile.FileKey = cf.Filekey[i]
			commfile.Created = time.Now().Unix()
			affected, err := session.InsertOne(commfile)
			if err != nil {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"图片插入失败"}`))
				fmt.Println(err.Error())
				return
			}
			if affected != 1 {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"图片插入失败"}`))
				return
			}
		}
	}
	err = session.Commit()
	if err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"图片插入成功"}`))
}

func qnDeleteMany(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Access-Control-Allow-Origin", "*")
	qn := &manycommfile{}
	schema.FormParse(r, qn)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	_ = session.Begin()
	cm := &models.Commodity{}
	var coms []models.Commodity
	has, err := session.Where("id = ?", qn.Commodityid).Get(cm)
	if !has || err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"同步其他商品时失败"}`))
		return
	}
	eng.Where("commodity_no = ?", cm.CommodityNo).Find(&coms)
	fmt.Println(coms)
	for _, u := range coms { //遍历同种商品
		l := len(qn.Filekey)
		for i := 0; i < l; i++ { //删除commodity_file
			comf := &models.CommodityFile{}
			comf.Commodity = u.Id
			comf.FileKey = qn.Filekey[i]
			_, err := session.Where("commodity = ?", u.Id).And("file_key = ?", qn.Filekey[i]).Delete(comf)
			if err != nil  {
				session.Rollback()
				w.Write([]byte(`{"res":-1,"msg":"同步其他商品图片删除失败"}`))
				return
			}
		}
	}
	for i := 0; i < len(qn.Filekey); i++ { //删除file 以及qiniu
		file := &models.File{}
		file.Key = qn.Filekey[i]
		affected2, err1 := session.Where("key=?", file.Key).Delete(file)
		if err1 != nil || affected2 != 1 {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"图片源文件删除失败"}`))
			return
		}
	}

	err = session.Commit()
	if err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"删除成功"}`))

}

type FileComms struct {
	FileKey []string `schema:"filekey"`
	Seq     []int    `schema:"seq"`
	Cdept   int      `schema:"cdept"`
}

func updateCommodityFile(w http.ResponseWriter, r *http.Request) {
	//

	tables := &FileComms{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	session := eng.NewSession()
	defer session.Close()
	_ = session.Begin()
	for i := 0; i < len(tables.FileKey); i++ {
		affected, err := eng.Table(new(models.CommodityFile)).Where("file_key = ?", tables.FileKey[i]).Update(map[string]interface{}{
			"seq": tables.Seq[i]})
		if err != nil {
			session.Rollback()
			fmt.Println(err.Error())
			w.Write([]byte(`{"res":-1,"msg":"数据库错误"}`))
			return
		}
		if affected < 1 {
			session.Rollback()
			w.Write([]byte(`{"res":-1,"msg":"修改顺序失败"}`))
			return
		}
	}
	err := session.Commit()
	if err != nil {
		session.Rollback()
		w.Write([]byte(`{"res":-1,"msg":"未知的错误"}`))
		return
	}
	w.Write([]byte(`{"res":0,"msg":"修改成功"}`))

}

/*  2016/9/2  种类图标，不需要
func showClassImage(w http.ResponseWriter, r *http.Request) {
	tables := &models.CommodityClass{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	has,err := eng.Where("id =?",tables.Id).Get(tables)
	if err != nil || !has{
		w.Write([]byte(`{"res":-1,"msg":"获取图片失败"}`))
		return
	}
	fs := `{"keys":[%d]}`
	w.Write([]byte(fmt.Sprintf(fs, tables.Image)))
}


type classFile struct {
	Filekey     string
	Id int
}
func insertClassImage(w http.ResponseWriter, r *http.Request) {
	tables := &classFile{}
	schema.FormParse(r, tables)
	eng := models.GetEngine()
	has,err := eng.Where("id =?",tables.Id).Get(tables)
	if err != nil || !has{
		w.Write([]byte(`{"res":-1,"msg":"获取图片失败"}`))
		return
	}
	fs := `{"keys":[%d]}`
	w.Write([]byte(fmt.Sprintf(fs, tables.Image)))
}
*/
