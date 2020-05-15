<template>
  <div class="container">
    <header>
      <Header />
    </header>
    <aside class="sidebar">
      <Sidebar v-model="selectedChannel" :channels="channels" />
    </aside>
    <main>
      <Messages :messages="messages" @scroll-to-end="loadMoreMessages" />
    </main>
    <aside class="comments" style="border: 1px solid black;">
      <Messages :messages="replies" />
    </aside>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Sidebar from '~/components/sidebar.vue'
import Header from '~/components/header.vue'
import Messages from '~/components/messages.vue'
import { Channel } from '~/models/channel'
import { Message } from '~/models/message'
import { User } from '~/models/user'

const isProd = process.env.NODE_ENV === 'production'

export default Vue.extend({
  components: {
    Sidebar,
    Header,
    Messages
  },
  data () {
    return {
      selectedChannel: {} as Channel,
      channels: [] as Channel[],
      users: [] as User[],
      messages: [] as Message[],
      indexPage: 0,
      pages: [] as String[],
      replies: [] as Message[]
    }
  },
  watch: {
    async selectedChannel (newValue: Channel) {
      this.pages = await this.fetchIndex(newValue)
      this.indexPage = 0
      this.messages = []
      while (this.messages.length < 100 && this.indexPage < this.pages.length) {
        const messages = await this.fetchMessages(this.selectedChannel, this.pages[this.indexPage])
        this.messages = [...this.messages, ...messages]
        this.indexPage += 1
      }
    }
  },
  async mounted () {
    this.channels = await this.fetchChannels()
    this.users = await this.fetchUsers()
  },
  methods: {
    async fetchChannels (): Promise<Channel[]> {
      const channels = isProd
        ? await fetch('/api/channels').then(res => res.json()).then(res => res as Channel[])
        : await import('~/data/channels.json').then(res => res.default as any[] as Channel[])
      return channels
    },
    async fetchUsers (): Promise<User[]> {
      const users = isProd
        ? await fetch('/api/users').then(res => res.json()).then(res => res as User[])
        : await import('~/data/users.json').then(res => res.default as any[] as User[])
      return users
    },
    async fetchMessages (channel: Channel, index: String): Promise<Message[]> {
      const messages = isProd
        ? await fetch(`/api/${channel.name}/${index}`).then(
          res => res.json()).then(res => res as any[])
        : await import(`~/data/${channel.name}/${index}.json`).then(
          res => res.default as any[]
        )
      return messages.map(
        (m: any) => {
          const message: Message = {
            userId: m.user,
            text: m.text,
            avatar: this.users.find(u => u.id === m.user)?.avatar,
            replies: m.reply_count,
            date: new Date(m.ts * 1000)
          }
          return message
        }
      )
    },
    async fetchIndex (channel: Channel): Promise<String[]> {
      return isProd
        ? await fetch(`/api/${channel.name}/index`)
          .then(res => res.json())
          .then(res => res as string[])
        : await import(`~/data/${channel.name}/index.json`)
          .then(res => res.default as string[])
    },
    async loadMoreMessages () {
      while (this.indexPage < this.pages.length) {
        const messages = await this.fetchMessages(this.selectedChannel, this.pages[this.indexPage])
        this.messages = [...this.messages, ...messages]
        this.indexPage += 1
      }
    }
  }
})

</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: 200px 1fr 1fr 1fr;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "header header header header"
    "sidebar main main comments"
    "sidebar main main comments"
    "sidebar main main comments";
  grid-gap: 10px;
}

.sidebar {
  grid-area: sidebar;
}

main {
  grid-area: main;
}

header {
  grid-area: header;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.comments {
  grid-area: comments;
}

article {
  display: grid;
  grid-template-areas:
    "avatar content"
    ". content";
  grid-gap: 10px;
}
article .article-avatar {
  grid-area: avatar;
  border-radius: 3px;
  width: 50px;
  height: 50px;
}

article .article-content {
  grid-area: content;
}
article .article-metadata {
  display: flex;
  flex-direction: row;
  align-items: center;
}

article > p,
h5,
h3 {
  margin: 0;
}
</style>
