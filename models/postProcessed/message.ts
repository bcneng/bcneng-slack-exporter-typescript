import { User } from './user'

export interface Message {
    user?: User,
    text: string,
    replies?: Message[]
    date: Date
}
