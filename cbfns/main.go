package cbfns

import (
	"encoding/json"
	"net/http"
	"time"
	"fmt"
	"appengine"
	"appengine/datastore"
	"html/template"
)

type Comment struct {
	Name		string
	Date		time.Time
	Comment	string
}

type Page struct {
	PageId	string
}

type CommentFormatedHtml struct {
	Id			int64			`json:"id"`
	Name		string		`json:"name"`
	Date		string 		`json:"date"`
	Comment	string		`json:"comment"`
}

func init() {
	//コメント一覧取得用URL
	http.HandleFunc("/comments", comments)
	//投稿用URL
	http.HandleFunc("/post", postComment)
}

func comments(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" ||
		r.URL.Path != "/comments" ||
		r.FormValue("page_id") == ""{
		
		http.NotFound(w, r)
		return
	}
	
	pageid := r.FormValue("page_id")
	
	c := appengine.NewContext(r)
	pageKey := datastore.NewKey(c, "Page", pageid, 0, nil)
	
	q := datastore.NewQuery("Comment").
		Ancestor(pageKey).
		Order("Date")
	var cmmt []Comment
	cmmtKey, err := q.GetAll(c, &cmmt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	if r.FormValue("type") == "json"{
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, string(encodingJSON(formatHtml(cmmtKey,cmmt))))
		return
	}
	
	t, err := template.ParseFiles("cmmntwkey/cmmnt.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprint(w, pageid)
	
	if err := t.Execute(w, formatHtml(cmmtKey,cmmt)); err != nil {
		c.Errorf("%v", err)
	}
}

func formatHtml(key []*datastore.Key, c []Comment) []CommentFormatedHtml {
	var timeformat = "2006-01-02 15:04:05"
	var cfda = make([]CommentFormatedHtml, 0)
	for i, v := range c {
		cfd := new (CommentFormatedHtml)
		cfd.Id = key[i].IntID()
		cfd.Name = v.Name
		cfd.Date = v.Date.Format(timeformat)
		cfd.Comment = v.Comment
		cfda = append(cfda , *cfd)
	}
	return cfda
}

func encodingJSON(comments []CommentFormatedHtml) []byte {
	bdata, err := json.Marshal(comments)	
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return bdata
}

func postComment(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" || r.URL.Path != "/post" {
		http.NotFound(w, r)
		return
	}
	
	c := appengine.NewContext(r)
	
	if err := r.ParseForm(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	if r.FormValue("page_id") == "" {
		http.Error(w, "param", http.StatusInternalServerError)
		return
	}
	
	pg := &Page{
		PageId:		r.FormValue("page_id"),
	}
	pageKey := datastore.NewKey(c, "Page", r.FormValue("page_id"), 0, nil)
	datastore.Put(c, pageKey, pg)
	
	cmmt := &Comment{
		Name:			r.FormValue("name"),
		Date:			time.Now(),
		Comment:	r.FormValue("comment"),
	}
	
	datastore.Put(c, datastore.NewIncompleteKey(c, "Comment", pageKey), cmmt)
	
	http.Redirect(w, r, "/comments?page_id=" + r.FormValue("page_id"), http.StatusFound)
}