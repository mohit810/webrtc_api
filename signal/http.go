package signal

import (
	"encoding/json"
	"flag"
	"github.com/julienschmidt/httprouter"
	"github.com/pion/dtls/v2/examples/util"
	"net/http"
	"practice/webrtc_api/structs"
	"strconv"
)

// HTTPSDPServer starts a HTTP Server that consumes SDPs
func HTTPSDPServer() (offerOut chan string, answerIn chan string) {
	port := flag.Int("port", 8080, "http server port")
	flag.Parse()
	r := httprouter.New()
	offerOut = make(chan string)
	answerIn = make(chan string)
	r.POST("/sdp", func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		var offer structs.Offer
		err := json.NewDecoder(r.Body).Decode(&offer)
		util.Check(err)
		offerOut <- offer.Sdp
		answer := <-answerIn
		c := new(structs.Offer)
		c.Sdp = answer
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated) // 201
		err = json.NewEncoder(w).Encode(c)
		util.Check(err)
	})

	go func() {
		err := http.ListenAndServe(":"+strconv.Itoa(*port), r)
		if err != nil {
			panic(err)
		}
	}()

	return
}
