<template>
  <nav>
    <h1>Channels</h1>
    <ul>
      <li v-for="channel in channels" :key="channel.id" @click="$emit('change', channel)">
        {{ channel.name }}
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">

import Vue from 'vue'
import { Channel } from '~/models/channel'

export default Vue.extend({
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
</style>
