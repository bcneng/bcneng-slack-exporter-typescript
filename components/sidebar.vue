<template>
  <Simplebar class="simplebar" data-simplebar data-simplebar-auto-hide="false">
    <nav>
      <h1>Channels</h1>
      <ul>
        <li v-for="channel in channels" :key="channel.id" @click="$emit('change', channel)">
          {{ channel.name }}
        </li>
      </ul>
    </nav>
  </Simplebar>
</template>

<script lang="ts">
import Simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'
import Vue from 'vue'
import { Channel } from '~/models/postProcessed/channel'

export default Vue.extend({
  components: {
    Simplebar
  },
  model: {
    prop: 'selectedChannel',
    event: 'change'
  },
  props: {
    channels: {
      type: Array as () => Array<Channel>,
      required: true
    },
    selectedChannel: {
      type: Object as () => Channel,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>

.simplebar {
  height: inherit;
}
</style>
