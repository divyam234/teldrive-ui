import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'

export const telegramClient = {
    connect: async (session = localStorage.getItem('tgSession') || '') => {
        const client = new TelegramClient(new StringSession(session),
            Number(process.env.NEXT_PUBLIC_TG_API_ID),
            process.env.NEXT_PUBLIC_TG_API_HASH, {
            connectionRetries: 10,
            useWSS: false,
            // baseLogger: new Logger(LogLevel.NONE)
        })
        if (!session) {
            await client.start({ botAuthToken: process.env.NEXT_PUBLIC_BOT_TOKEN });
            let newSession = client.session.save()
            localStorage.setItem('tgSession', newSession)
        }
        else await client.connect()
        return client
    }
}
