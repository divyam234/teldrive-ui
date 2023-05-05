import { Hono } from 'hono'
import { handle } from 'hono/nextjs'

export const config = {
    runtime: 'edge',
}

const app = new Hono()

app.basePath('/api')

app.all('/*', async (c) => {
    const address = `https://teldrive.bhunter.in${c.req.path}`;
    return await fetch(address, { headers: c.req.headers, body: c.req.body })
})

export default handle(app)