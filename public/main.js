let divSelectRoom = document.getElementById("selectRoom")
let divConsultingRoom = document.getElementById("consultingRoom")
let inputRoomNumber = document.getElementById("roomNumber")
let btnGoRoom = document.getElementById("goRoom")
let localVideo = document.getElementById("localVideo")
let remoteVideo = document.getElementById("remoteVideo")

let roomNumber, localStream, remoteStream, rtcPeerConnection, isCaller

const iceServers = {
    'iceServer': [
        {'urls': 'stun:stun.services.mozilla.com'},
        {'urls': 'stun:stun.l.googlr.com.19302'}
    ]
}

const streamConstraints = {
    audio: true,
    video: true
}

const socket = io()

btnGoRoom.onclick = () => {
    if(inputRoomNumber.value === '') {
        alert("please enter a room name.")
    }else{
        roomNumber = inputRoomNumber.value
        socket.emit("createConnection", roomNumber)
        divSelectRoom.style = "display: none"
        divConsultingRoom.style = "display: block"
    }
}

socket.on('created', room => {
    console.log("console log from created socket:",room)
    navigator.mediaDevices.getUserMedia(streamConstraints)
        .then(stream => {
            localStream = stream
            localVideo.srcObject =stream
            isCaller = true
            socket.emit("ready", roomNumber)
        })
        .catch( err =>{
            console.log("user didn't allow media sharing.")
        })
})

socket.on('ready' + roomNumber, () =>{
    //if(isCaller){
        rtcPeerConnection = new RTCPeerConnection(iceServers)
        rtcPeerConnection.onicecandidate = onIcecandidate
        rtcPeerConnection.ontrack = onAddStream
        rtcPeerConnection.addTrack(localStream.getTracks()[0],localStream)
        rtcPeerConnection.addTrack(localStream.getTracks()[1],localStream)
        rtcPeerConnection.createOffer()
            .then(sessionDescription =>{
                console.log("sending the offer:", sessionDescription)
                rtcPeerConnection.setLocalDescription(sessionDescription)
                var obj = JSON.parse(JSON.stringify({
                    "roomNumber": roomNumber,
                    "sdp": btoa(JSON.stringify(sessionDescription))
                }))
                socket.emit("offer",obj)
            })
            .catch( err =>{
                console.log(err)
            })
   // }
})

socket.on('answer', (event) =>{
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
})