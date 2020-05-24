import fs from 'fs'
import path from 'path'
import fse from 'fs-extra'
import { toHTML, User as SlackMarkDownUser, SlackMarkDownOptions } from 'slack-markdown'
import { User } from './models/postProcessed/user'
import { Message } from './models/postProcessed/message'
import { Channel } from './models/postProcessed/channel'
import { Message as MessagePreProcessed } from '~/models/preProcessed/message'

const DATA_DIRECTORY = path.resolve(__dirname, 'data')
const OUTPUT_DIRECTORY = path.resolve(__dirname, 'static/data')
const DIST_DIRECTORY = path.resolve(__dirname, 'dist/data')
const CHUNK_SIZE = 10
const users = require(`${DATA_DIRECTORY}/users.json`) as User[]
const channels = require(`${DATA_DIRECTORY}/channels.json`) as Channel[]

function chunk<T> (inputArray: T[], chunks: number): T[][] {
  const chunkedArray: T[][] = []
  let i = 0
  const n = inputArray.length

  while (i < n) {
    chunkedArray.push(inputArray.slice(i, (i += chunks)))
  }
  return chunkedArray
}

function normalize (text: string): string {
  const options: SlackMarkDownOptions = {
    slackCallbacks: {
      user: (slackUser: SlackMarkDownUser): string => {
        const user = users.find(u => u.id === slackUser.id)
        return user ? `@${user.name}` : ''
      }
    }
  }
  return toHTML(text, options)
}

fse.removeSync(OUTPUT_DIRECTORY)
fse.removeSync(DIST_DIRECTORY)

channels
  .forEach((channelDirectory) => {
    const files = fs.readdirSync(`${DATA_DIRECTORY}/${channelDirectory.name}`)

    let messagesPreProcessed:MessagePreProcessed[] = []
    files
      .forEach((f) => {
        const fullFilePath = `${DATA_DIRECTORY}/${channelDirectory.name}/${f}`
        const message = require(fullFilePath) as MessagePreProcessed[]
        messagesPreProcessed = messagesPreProcessed.concat(message)
      })

    const messages = messagesPreProcessed
      .filter(m => !m.parent_user_id)
      .map((message: MessagePreProcessed) => {
        const replies = message.replies?.map((r) => {
          const msg = messagesPreProcessed.find(m => m.ts === r.ts)
          if (msg) {
            return {
              text: normalize(msg?.text),
              user: users.find(u => u.id === msg?.user),
              date: new Date(msg.ts * 1000)
            } as Message
          }
        })

        return ({
          user: users.find(u => u.id === message.user),
          replies,
          text: normalize(message.text),
          date: new Date(message.ts * 1000)
        }) as Message
      })

    fs.mkdirSync(`${OUTPUT_DIRECTORY}/${channelDirectory.name}`, { recursive: true })

    const chunkedMessage = chunk<Message>(messages, CHUNK_SIZE)
    for (let index = 0; index < chunkedMessage.length; index++) {
      fs.writeFileSync(`${OUTPUT_DIRECTORY}/${channelDirectory.name}/${index}.json`, JSON.stringify(chunkedMessage[index]))
    }
    fs.copyFileSync(`${DATA_DIRECTORY}/channels.json`, `${OUTPUT_DIRECTORY}/channels.json`)

    if (!fs.existsSync(DIST_DIRECTORY)) {
      fs.mkdirSync(DIST_DIRECTORY, { recursive: true })
    }
    fse.copySync(OUTPUT_DIRECTORY, DIST_DIRECTORY)
  })
