package controllers

import (
	"net/http"
	"mrten/logs"
)

type HandlerFuncMap map[string]func(http.ResponseWriter, *http.Request)

var HMAP HandlerFuncMap

func init() {
	HMAP = make(HandlerFuncMap)
	HMAP["/"] = func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/m/index.html", 302)
	}
	logs.SetMmanLogConf()
}
