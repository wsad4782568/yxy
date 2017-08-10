package controllers
import (
	"net/http"
    "log"
    "encoding/json"
)

//InitTest 
func InitTest(){
    HMAP["/test/ajax_json"] = ajax_json
    
}
type MyUser struct {
    Name string
}
func ajax_json(w http.ResponseWriter, r *http.Request) {
   decoder := json.NewDecoder(r.Body)
   var t MyUser
   err := decoder.Decode(&t)

	if err != nil {
		panic(err)
	}

	log.Println(t.Name)
   
    
	w.Write([]byte("{test}"))
}