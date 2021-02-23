import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },

}, { timestamps: true });

UserSchema.pre('save', function (next) {
    let user = this as any;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, (error, salt) => {
        if (error) return next(error);
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) return next(error);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.checkPassword = function (attempt, callback) {
    let user = this as any;
    bcrypt.compare(attempt, user.password, (error, isMatch) => {
        if (error) return callback(error);
        callback(null, isMatch);
    });
};

export interface User extends mongoose.Document {
    _id: string;
    email: string;
    password: string;
}
