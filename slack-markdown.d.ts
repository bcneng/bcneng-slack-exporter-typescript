declare module 'slack-markdown' {

    export interface User {
        id: string;
        name: string;
    }
    export interface Channel {

    }

    export interface SlackCallbacksOptions {
        user: (user: User) => string
        channel?: (channel: Channel) => string
    }

    export interface SlackMarkDownOptions {
        slackCallbacks: SlackCallbacksOptions
    }
    export function toHTML(text: string, options?: SlackMarkDownOptions): string
}
