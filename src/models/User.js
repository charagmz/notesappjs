const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    date: { type: Date, default: Date.now}
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

//no se utiliza la funcion flecha sino function para que el ambito de las variables permita acceder al objeto instanciado, por eso se usa this.
UserSchema.methods.matchPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (e) {
        console.log(e);
    }
    return false;
};

module.exports = mongoose.model('User', UserSchema);