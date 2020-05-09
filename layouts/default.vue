<template>
  <div class="container">
    <header>
      <Header />
    </header>
    <aside class="sidebar">
      <Sidebar :channels="channels" />
    </aside>
    <main>
      <nuxt />
    </main>
    <aside class="comments" style="border: 1px solid black;"></aside>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Sidebar from "~/components/sidebar.vue";
import Header from "~/components/header.vue"
import {Channel} from "~/models/channel"

const getChannels = () => import("~/data/channels.json").then(m => m.default || m)

export default Vue.extend({
  components: {
    Sidebar,
    Header
  },
  async fetch() {
    this.channels = await getChannels()
  },
  data() {
    return {
      channels: new Array<Channel>()
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
