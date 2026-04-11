import mongoose, { Schema, Document } from 'mongoose';

export interface ISeat extends Document {
    seatNumber: number;
    isBooked: boolean;
    bookedBy?: mongoose.Types.ObjectId | null;
    bookedByName?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const SeatSchema: Schema = new Schema({
    seatNumber: { type: Number, required: true, unique: true },
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    bookedByName: { type: String },
}, { timestamps: true });

export const Seat = mongoose.model<ISeat>('Seat', SeatSchema);
