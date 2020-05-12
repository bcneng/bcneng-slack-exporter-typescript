<template>
  <div>
    <article v-for="message in messages" :key="message.ts">
      <img class="article-avatar" :src="message.avatar" alt />
      <div class="article-content">
        <div class="article-metadata">
          <h3>Alex</h3>
          <h5>23.04.2010</h5>
        </div>
        <p>{{ message.text}}</p>
        <p v-if="message.replies">{{ message.replies }} Replies</p>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
interface Message {
  userId: string;
  text: string;
  replies?: number
  avatar: string;
  date: Date;
}

interface User {
  id: string;
  avatar: string;
}

import Vue from "vue";
export default Vue.extend({
  async asyncData({ params }) {
    const users = await import(`~/data/users.json`).then(res =>
      (res.default as Array<any>).map(u => <User>{ id: u.id, avatar: u.profile.image_24 })
    );
    const messages = await import(`~/data/random/2019-01-28.json`).then(res => 
       (res.default as Array<any>).map(
        m =>
          <Message>{
            userId: m.user,
            text: m.text,
            avatar: users.find(u => u.id == m.user)?.avatar,
            replies: m.reply_count,
            date: new Date()
          }
       )
    );
    console.log(users, messages)
    return { messages: messages };
  }
});
</script>

<style lang="scss" scoped>
article {
  display: grid;
  grid-template-columns: min-content 1fr;
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
