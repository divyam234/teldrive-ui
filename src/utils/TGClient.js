import { TelegramClient, Logger } from "telegram";
import { StringSession } from 'telegram/sessions'
import { apiCredentials } from './common'
import { LogLevel } from 'telegram/extensions/Logger'

export class TGClient {

    static client = null

    static init(session = '') {
        this.client = new TelegramClient(new StringSession(session),
            apiCredentials.apiId,
            apiCredentials.apiHash, {
            deviceModel: 'Desktop',
            systemVersion: 'Windows 10',
            appVersion: '4.8.1 x64',
            langCode: 'en-US',
            baseLogger: new Logger(LogLevel.NONE)
        })
    }

    static async connect() {
        if (this.client.connected) return this.client

        else {
            await this.client.connect()
            return this.client
        }
    }

    static async disconnect() {
        if (this.client?.connected) await this.client.destroy()
    }
}