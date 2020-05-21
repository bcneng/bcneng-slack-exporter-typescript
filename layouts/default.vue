<template>
  <div class="container">
    <header>
      <Header />
    </header>
    <aside class="sidebar">
      <Sidebar v-model="selectedChannel" :channels="channels" />
    </aside>
    <main>
      <Messages :messages="messages" @show-replies="fetchReplies($event)" />
      <Observer @intersect="fetchMessages" />
    </main>
    <aside class="comments">
      <Messages :messages="replies" />
    </aside>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Sidebar from '~/components/sidebar.vue'
import Header from '~/components/header.vue'
import Messages from '~/components/messages.vue'
import Observer from '~/components/observer.vue'
import { Channel } from '~/models/postProcessed/channel'
import { Message } from '~/models/postProcessed/message'

const isProd = process.env.NODE_ENV === 'production'

export default Vue.extend({
  components: {
    Sidebar,
    Header,
    Messages,
    Observer
  },
  data () {
    return {
      selectedChannel: {} as Channel,
      channels: [] as Channel[],
      messages: [] as Message[],
      messageIndex: 0,
      replies: [] as Message[] | undefined,
      observer: {} as IntersectionObserver
    }
  },
  watch: {
    async selectedChannel () {
      this.messageIndex = 0
      this.messages = []
      while (this.messages.length < 5) {
        await this.fetchMessages()
      }
    }
  },
  async mounted () {
    this.channels = await this.fetchChannels()
  },
  methods: {
    async fetchChannels (): Promise<Channel[]> {
      const channels = isProd
        ? await fetch('/api/channels')
          .then(res => res.json())
          .then(res => res as Channel[])
        : await import('~/static/data/channels.json')
          .then(res => res.default as any[] as Channel[])
      return channels
    },
    async fetchMessages (): Promise<void> {
      if (this.messageIndex < 0 || Object.keys(this.selectedChannel).length === 0) {
        return
      }

      const messages = isProd
        ? await fetch(`/api/${this.selectedChannel.name}/${this.messageIndex}`)
          .then(res => res.json())
          .then(res => res as Message[])
        : await import(`~/static/data/${this.selectedChannel.name}/${this.messageIndex}.json`)
          .then(res => res.default as Message[])

      this.messages = [...this.messages, ...messages]
      this.messageIndex += 1
    },
    fetchReplies (message: Message) {
      this.replies = message.replies
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
  height: 90vh;
  overflow-y: scroll;
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

</style>
