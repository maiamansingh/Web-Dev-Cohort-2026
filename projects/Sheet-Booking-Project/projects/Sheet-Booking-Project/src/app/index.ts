import express from 'express'
import type { Express } from 'express'
import path from 'path'

import { authRouter } from './auth/routes'
import { seatsRouter } from './seats/routes'
import { authenticationMiddleware } from './middleware/auth-middleware'

export function createApplication(): Express {
    const app = express()

    // Middlewares
    app.use(express.json())
    
    // Request Logger
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });

    app.use(authenticationMiddleware())

    // Routes
    app.use('/auth', authRouter)
    app.use('/seats', seatsRouter)

    // Serve Static Files
    app.use(express.static(path.join(process.cwd(), 'src')))
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(process.cwd(), 'src', 'index.html'))
    })

    app.get('/ping', (req, res) => {
        res.send('pong')
    })

    return app
}