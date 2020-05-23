<template>
  <Simplebar class="simplebar" data-simplebar data-simplebar-auto-hide="false">
    <article v-for="message in messages" :key="message.ts">
      <img class="article-avatar" :src="message.user ? message.user.profile.image_72 : ''" alt>
      <div class="article-content">
        <div class="article-metadata">
          <h3>{{ message.user ? message.user.name: "User no longer exist" }}</h3>
          <small>{{ message.date }}</small>
        </div>
        <p v-html="parse(message.text)" />
        <p v-if="message.replies">
          <button @click="$emit('show-replies', message)">
            {{ message.replies.length }} Replies
          </button>
        </p>
      </div>
    </article>
  </Simplebar>
</template>

<script lang="ts">
import Vue from 'vue'
import { toHTML } from 'slack-markdown'
import Simplebar from 'simplebar-vue'
import { Message } from '~/models/postProcessed/message'
import 'simplebar/dist/simplebar.min.css'

export default Vue.extend({
  components: {
    Simplebar
  },
  props: {
    messages: {
      type: Array as () => Array<Message>,
      required: true
    }
  },
  methods: {
    parse (text: string): string {
      return toHTML(text)
    }
  }
})
</script>

<style lang="scss" scoped>
.simplebar {
  height: inherit;
}

article {
  display: grid;
  grid-template-areas:
    "avatar content"
    ". content";
  grid-gap: 10px;
  grid-template-columns: auto 1fr;
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
