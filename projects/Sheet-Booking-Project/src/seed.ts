import mongoose from 'mongoose';
import { Seat } from './models/Seat';
import { connectDB } from './db/connection';

async function seedSeats() {
    await connectDB();

    const count = await Seat.countDocuments();
    if (count > 0) {
        console.log('Seats already seeded, skipping...');
        mongoose.connection.close();
        return;
    }

    const seats = [];
    for (let i = 1; i <= 40; i++) {
        seats.push({
            seatNumber: i,
            isBooked: false
        });
    }

    await Seat.insertMany(seats);
    console.log('Successfully seeded 40 seats');
    mongoose.connection.close();
}

seedSeats().catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
});
