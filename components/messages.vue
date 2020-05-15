<template>
  <div>
    <article v-for="message in messages" :key="message.ts">
      <img class="article-avatar" :src="message.avatar" alt>
      <div class="article-content">
        <div class="article-metadata">
          <h3>Alex</h3>
          <h5>{{ message.date }}</h5>
        </div>
        <p>{{ message.text }}</p>
        <p v-if="message.replies">
          {{ message.replies }} Replies
        </p>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Message } from '~/models/message'

export default Vue.extend({
  props: {
    messages: {
      type: Array as () => Array<Message>,
      required: true
    }
  }
})
</script>
