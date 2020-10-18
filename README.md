# Signalling Pion Webrtc server via `POST` Request

I have build  this small signalling upgradation for anyone intrested in building the thier own server to establish 1:N Broadcasting connection with the users as described `broadcast is a Pion WebRTC application that demonstrates how to broadcast a video to many peers, while only requiring the broadcaster to upload once.` in the [Pion/webrtc/example/broadcast/](https://github.com/pion/webrtc/tree/master/examples/broadcast).

Before using this solution you should set-up have pion/webrtc/v3 ([Go Modules](https://blog.golang.org/using-go-modules) are mandatory for using Pion WebRTC. So make sure you set export GO111MODULE=on, and explicitly specify /v3 when importing.).

### Open broadcast example page
[jsfiddle.net](https://jsfiddle.net/d2mt13y6/) You should see two buttons 'Publish a Broadcast' and 'Join a Broadcast'

### Run Application
#### Linux/macOS/windows
Run `main.go` 

### Start a publisher

* Click `Publish a Broadcast`
* For Communicating with server you have to request the server via `POST` method (Postman Screenshot is given below) and paste the sdp obtained from the browser. The `application` will respond with an offer as a response to the `POST`, paste this into the second input field. Then press `Start Session`.

![](https://github.com/mohit810/webrtc_api/blob/master/Postman.png)


### Join the broadcast
* Click `Join a Broadcast`
* Send a `POST` request on the same url, having the same parameters as described in the `Start a publisher` Section and paste the sdp obtained from the browser . The `application` will respond with an offer, paste this into the second input field. Then press `Start Session`.


## Big Thanks to the following 

* [Sean Der](https://github.com/Sean-Der) at [Poin/webrtc](https://github.com/pion/webrtc)
* [julienschmidt/httprouter](https://github.com/julienschmidt/httprouter)
