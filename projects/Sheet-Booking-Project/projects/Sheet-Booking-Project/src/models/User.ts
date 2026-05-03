import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName?: string;
    email: string;
    password?: string;
    salt?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    salt: { type: String },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
