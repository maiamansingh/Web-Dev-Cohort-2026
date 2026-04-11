import express from 'express'
import type { Router } from 'express'
import SeatsController from './controller'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware'

const seatsController = new SeatsController()

export const seatsRouter: Router = express.Router()

seatsRouter.get('/', seatsController.handleGetSeats.bind(seatsController))
seatsRouter.put('/:id/book', restrictToAuthenticatedUser(), seatsController.handleBookSeat.bind(seatsController))
seatsRouter.put('/:id/cancel', restrictToAuthenticatedUser(), seatsController.handleCancelBooking.bind(seatsController))

export default seatsRouter
