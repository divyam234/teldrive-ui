import { Hono } from 'hono'
import { handle } from 'hono/nextjs'

export const config = {
    runtime: 'edge',
}

const app = new Hono()

app.basePath('/api')

app.all('/*', async (c) => {
    const { method, headers, body, path } = c.req
    const address = `https://teldrive.bhunter.in${path}`;
    return await fetch(address, { method, headers, body })
})

export default handle(app)