



function UserRegister(){
     this.UserIdRegister = {};
     this.UserNameRegister = {};
};


UserRegister.prototype.register = function(user){
    this.UserIdRegister[user.id] = user;
    this.UserNameRegister[user.name] = user;
};

UserRegister.prototype.getUserById = function(id){
    return this.UserIdRegister[id];
};
UserRegister.prototype.getUserByName = function(name) {
    return this.UserNameRegister[name];
};


UserRegister.prototype.unregister = function(id) {
    var user = this.getUserById(id);
    if (user) delete this.UserIdRegister[id]
    if (user && this.getByName(user.name)) delete this.UserNameRegister[user.name];
}

module.exports = UserRegister;

