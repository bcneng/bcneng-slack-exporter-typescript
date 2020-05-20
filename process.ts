import fs from 'fs'
import path from 'path'
import fse from 'fs-extra'
import { User } from './models/postProcessed/user'
import { Message } from './models/postProcessed/message'
import { Message as MessagePreProcessed } from '~/models/preProcessed/message'

const DATA_DIRECTORY = path.resolve(__dirname, 'data')
const OUTPUT_DIRECTORY = path.resolve(__dirname, 'static/data')
const DIST_DIRECTORY = path.resolve(__dirname, 'dist/data')

fse.removeSync(OUTPUT_DIRECTORY)
fse.removeSync(DIST_DIRECTORY)

const files = fs.readdirSync(DATA_DIRECTORY, { withFileTypes: true })
const channelDirectories = files.filter((f: fs.Dirent) => f.isDirectory())
const users = require(`${DATA_DIRECTORY}/users.json`) as User[]

const CHUNK_SIZE = 10

function chunk<T> (inputArray: T[], chunks: number): T[][] {
  const chunkedArray: T[][] = []
  let i = 0
  const n = inputArray.length

  while (i < n) {
    chunkedArray.push(inputArray.slice(i, (i += chunks)))
  }

  return chunkedArray
}

channelDirectories.forEach((channelDirectory) => {
  const files = fs.readdirSync(`${DATA_DIRECTORY}/${channelDirectory.name}`)
  console.table(files)
  const messagesPreProcessed = files
    .filter(f => !f.includes('index'))
    .map((f) => {
      const fullFilePath = `${DATA_DIRECTORY}/${channelDirectory.name}/${f}`
      return require(fullFilePath) as MessagePreProcessed[]
    })
    .flat()

  const messages = messagesPreProcessed
    .filter(m => !m.parent_user_id)
    .map((message: MessagePreProcessed) => {
      return ({
        user: users.find(u => u.id === message.user),
        replies: message.replies?.map((r) => {
          const msg = messagesPreProcessed.find(m => m.ts === r.ts)
          return {
            text: msg?.text,
            user: users.find(u => u.id === msg?.user)
          } as Message
        }),
        text: message.text
      }) as Message
    })

  fs.mkdirSync(`${OUTPUT_DIRECTORY}/${channelDirectory.name}`, { recursive: true })

  const chunkedMessage = chunk<Message>(messages, CHUNK_SIZE)
  for (let index = 0; index < chunkedMessage.length; index++) {
    fs.writeFileSync(`${OUTPUT_DIRECTORY}/${channelDirectory.name}/${index}.json`, JSON.stringify(messages))
  }
  fs.copyFileSync(`${DATA_DIRECTORY}/channels.json`, `${OUTPUT_DIRECTORY}/channels.json`)

  if (!fs.existsSync(DIST_DIRECTORY)) {
    fs.mkdirSync(DIST_DIRECTORY, { recursive: true })
  }
  fse.copySync(OUTPUT_DIRECTORY, DIST_DIRECTORY)
})
