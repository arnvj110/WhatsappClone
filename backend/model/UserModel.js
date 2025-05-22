import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    iss: {
        type: String,
    },
    nbf: {
        type: Number,
    },
    sub: {
        type: String,
        required: true,
    },
    aud: {
        type: String,
    },
    email: {
        type: String,
        
    },
    email_verified: {
        type: Boolean,
    },
    azp: {
        type: String,
    },
    picture: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true, 
    },
    given_name: {
        type: String,
    },
    family_name: {
        type: String,
    },
    iat: {
        type: Number,
    },
    exp: {
        type: Number,
    },
    jti: {
        type: String,
    }

});

const User = mongoose.model('users', UserSchema);
export default User;