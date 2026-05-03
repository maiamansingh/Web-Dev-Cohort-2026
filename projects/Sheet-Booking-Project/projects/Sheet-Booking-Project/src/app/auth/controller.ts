import type { Request, Response } from 'express'
import { randomBytes, createHmac } from 'node:crypto'
import { signinPayloadModel, signupPayloadModel } from './models'
import { User } from '../../models/User'
import { createUserToken } from './utils/token'
import type { UserTokenPayload } from './utils/token'

class AuthenticationController {
    public async handleSignup(req: Request, res: Response) {
        const validationResult = await signupPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })

        const { firstName, lastName, email, password } = validationResult.data

        const existingUser = await User.findOne({ email })

        if (existingUser) return res.status(400).json({ error: 'duplicate entry', message: `user with email ${email} already exists` })

        const salt = randomBytes(32).toString('hex')
        const hash = createHmac('sha256', salt).update(password).digest('hex')

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hash,
            salt
        })

        await newUser.save()

        return res.status(201).json({ message: 'user has been created successfully', data: { id: newUser._id } })
    }

    public async handleSignin(req: Request, res: Response) {
        const validationResult = await signinPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })

        const { email, password } = validationResult.data

        const user = await User.findOne({ email })

        if (!user) return res.status(404).json({ message: `user with email ${email} does not exists` })

        const salt = user.salt!
        const hash = createHmac('sha256', salt).update(password).digest('hex')

        if (user.password !== hash) return res.status(400).json({ message: `email or password is incorrect` })

        const token = createUserToken({ id: (user._id as any).toString() })

        return res.json({ message: 'Signin Success', data: { token } })
    }

    public async handleMe(req: Request, res: Response) {
        // @ts-ignore
        const { id } = req.user! as UserTokenPayload

        const user = await User.findById(id)

        if (!user) return res.status(404).json({ message: 'User not found' })

        return res.json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        })
    }
}

export default AuthenticationController