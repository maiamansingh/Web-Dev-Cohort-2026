import { createServer } from 'node:http'
import { createApplication } from './app'
import { connectDB } from './db/connection'

async function main() {
    try {
        await connectDB()
        const server = createServer(createApplication())
        const PORT: number = 8080

        server.listen(PORT, () => {
            console.log(`Http server is running on PORT ${PORT}`)
        })
    } catch (error) {
        console.log(`Error starting http server`)
        throw error
    }
}

main()