


function User(id, name, socket){
    this.id = id;
    this.name = name;
    this.socket = socket;
    this.peer = null;
    this.sdpOffer = null;
};

User.prototype.sendMessage = function(_message){
    var message = JSON.stringify(_message);
    this.socket.emit('server-message',message);
};

module.exports = User;

