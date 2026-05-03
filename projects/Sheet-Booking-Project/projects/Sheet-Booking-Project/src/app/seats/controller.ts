import type { Request, Response } from 'express'
import { Seat } from '../../models/Seat'
import { User } from '../../models/User'
import type { UserTokenPayload } from '../auth/utils/token'

class SeatsController {
    public async handleGetSeats(req: Request, res: Response) {
        try {
            const seats = await Seat.find().sort({ seatNumber: 1 })
            return res.json(seats.map(s => ({
                id: s.seatNumber,
                isbooked: s.isBooked,
                bookedBy: s.bookedBy,
                name: s.bookedByName || ''
            })))
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch seats' })
        }
    }

    public async handleBookSeat(req: Request, res: Response) {
        try {
            const { id: seatNumber } = req.params
            // @ts-ignore
            const { id: userId } = req.user! as UserTokenPayload

            const user = await User.findById(userId)
            if (!user) return res.status(404).json({ error: 'User not found' })

            const seat = await Seat.findOne({ seatNumber: parseInt(seatNumber as string) })

            if (!seat) return res.status(404).json({ error: 'Seat not found' })
            if (seat.isBooked) return res.status(400).json({ error: 'Seat already booked' })

            seat.isBooked = true
            seat.bookedBy = user._id as any
            seat.bookedByName = `${user.firstName} ${user.lastName || ''}`.trim()

            await seat.save()

            return res.json({ message: 'Booked successfully!', data: { seatNumber: seat.seatNumber } })
        } catch (error) {
            console.error('Booking error:', error)
            return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to book seat' })
        }
    }

    public async handleCancelBooking(req: Request, res: Response) {
        try {
            const { id: seatNumber } = req.params
            // @ts-ignore
            const { id: userId } = req.user! as UserTokenPayload

            const seat = await Seat.findOne({ seatNumber: parseInt(seatNumber as string) })

            if (!seat) return res.status(404).json({ error: 'Seat not found' })
            if (!seat.isBooked) return res.status(400).json({ error: 'Seat is not booked' })

            // Ensure only the person who booked it can cancel it
            if (seat.bookedBy?.toString() !== userId) {
                return res.status(403).json({ error: 'Forbidden', message: 'You can only cancel your own bookings' })
            }

            seat.isBooked = false
            seat.bookedBy = null
            seat.bookedByName = null

            await seat.save()

            return res.json({ message: 'Booking canceled successfully!', data: { seatNumber: seat.seatNumber } })
        } catch (error) {
            console.error('Cancellation error:', error)
            return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to cancel booking' })
        }
    }
}

export default SeatsController
