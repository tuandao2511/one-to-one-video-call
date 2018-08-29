
var videoInput;
var videoOutput;
var socket = io.connect('http://localhost:3000/');
var webRtcPeer;





window.onload = function(){
    console.log('Page loaded ...');
    videoInput = document.getElementById('videoInput');
    videoOutput = document.getElementById('videoOutput');
    var draggable = $('#videoSmall').draggabilly();
   
}

socket.on('server-message',function(message){

    console.log('message ' + message);
    var parsedMessage = JSON.parse(message);
    
    switch(parsedMessage.id){
        case 'registerResponse':
            registerResponse(parsedMessage);
            break;
        case 'incommingCall':
            incommingCall(parsedMessage);
            break;
        case 'startCommunicate':
            startCommunicate(parsedMessage);    
            break;
        case 'callResponse':
            callResponse(parsedMessage);
            break;
        case 'serverCandidate':
            console.log('addIceCandidate ' +parsedMessage.candidate);
            webRtcPeer.addIceCandidate(parsedMessage.candidate);
            break;
        case 'stopCommunication':
            console.log('stop');
            stop(message);
        case 'error':
            console.log('error ' +parsedMessage.message);
            break;    
        default:
            console.log('error ' +parsedMessage.id);

    }
});


function register(){
    var user = $('#user').val();
    console.log('user ' +user);
    var message = {
        id : 'register',
        user : user
    };
    sendMessage(message);
}

function sendMessage(message) {
    var stringMessage = JSON.stringify(message);
    console.log(message);
    socket.emit('message',stringMessage);
}

function call(){

    var options = {
        localVideo : videoInput,
        remoteVideo : videoOutput,
        onicecandidate: onIceCandidate
    }

    webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,function(error){
        if(error) {
            console.error(error);
        }

        this.generateOffer(function(error,sdpOffer){
            if(error) {
                console.error(error);
            }
            console.log('sdpOffer call ' +sdpOffer);
            var from = $('#user').val();
            var to = $('#peer').val();
            console.log('from ' +from + ' to ' +to);
            var message = {
                id : 'call',
                from : from,
                to : to,
                sdpOffer : sdpOffer
            };

            sendMessage(message);
        });
    })

} 

function onIceCandidate(candidate){
    console.log('local ice candidate');

    var message = {
        id : 'clientIceCandidate',
        candidate : candidate
    };
    sendMessage(message);
}

function registerResponse(parsedMessage){
    if(parsedMessage.response!=='accept'){
        alert('register fail')
    }else{
        alert('register successful')
    }
    
}

function incommingCall(_message) {
    console.log('incomming call ' +_message);
    var options = {
        localVideo : videoInput,
        remoteVideo : videoOutput,
        onicecandidate: onIceCandidate
    }

    webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,function(error){
        if(error) {
            console.error(error);
        }

        this.generateOffer(function(error,offerSdp){

            console.log('sdpOffer incom ' +offerSdp);

            var message = {
                id : 'incommingCallResponse',
                from : _message.from,
                sdpOffer :offerSdp
            };

            sendMessage(message);
        });

    });
}

function callResponse(message){
    if(message.response != 'accepted'){
        var error = message.to +' deny communicate';
        console.log(error);
    }else{
        webRtcPeer.processAnswer(message.sdpAnswer);
    }
}

function startCommunicate(message) {
    console.log('start communication ' +message.sdpAnswer);
    webRtcPeer.processAnswer(message.sdpAnswer);
}

function stop(message){
    if(webRtcPeer){
        webRtcPeer.dispose();
        webRtcPeer = null;
    }
}