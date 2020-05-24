<template>
  <div class="container">
    <header>
      <Header />
    </header>
    <aside class="sidebar">
      <Sidebar v-model="selectedChannel" :channels="channels" />
    </aside>
    <main>
      <Messages :messages="messages" @show-replies="fetchReplies($event)" @scroll-y-reach-end="fetchMessages" />
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
import { Channel } from '~/models/postProcessed/channel'
import { Message } from '~/models/postProcessed/message'

export default Vue.extend({
  components: {
    Sidebar,
    Header,
    Messages
  },
  fetch () {
    this.fetchChannels().then((data:Channel[]) => {
      this.channels = data
    })
  },
  data () {
    return {
      selectedChannel: {} as Channel,
      channels: [] as Channel[],
      messages: [] as Message[],
      messageIndex: 0,
      replies: [] as Message[] | undefined,
      observer: {} as IntersectionObserver,
      reachLimit: false
    }
  },
  watch: {
    async selectedChannel () {
      this.messageIndex = 0
      this.messages = []
      this.reachLimit = false
      while (this.reachLimit === false && this.messages.length < 10) {
        console.log('hh')
        await this.fetchMessages()
      }
    }
  },
  methods: {
    async fetchChannels (): Promise<Channel[]> {
      const channels = await this.$axios.$get('/data/channels.json')
      return channels
    },
    fetchMessages (): Promise<void> {
      if (this.messageIndex < 0 || Object.keys(this.selectedChannel).length === 0 || this.reachLimit) {
        return Promise.resolve()
      }

      return this.$axios.$get(`/data/${this.selectedChannel.name}/${this.messageIndex}.json`)
        .then((data: Message[]) => {
          this.messages = [...this.messages, ...data]
          this.messageIndex += 1
        })
        .catch((_) => { this.reachLimit = true })
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
  grid-template-rows: 2rem calc(100vh - 4rem);
  grid-template-areas:
    "header header header header"
    "sidebar main main comments"
    "sidebar main main comments"
    "sidebar main main comments";
  grid-gap: 10px;
  height: 100vh;
}

.sidebar {
  grid-area: sidebar;
  height: calc(100vh - 4rem);
}

main {
  grid-area: main;
  height: calc(100vh - 4rem);
}
header {
  grid-area: header;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.comments {
  grid-area: comments;
  height: calc(100vh - 4rem);
}

</style>
