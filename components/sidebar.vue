<template>
  <nav>
    <h1>Channels</h1>
    <ul>
      <li v-for="channel in channels" :key="channel.id">
        <nuxt-link
        :to="{ name: 'channel-slug', params: { slug: channel.name }}"
      >{{ channel.name }}</nuxt-link>
      </li>
    </ul>
  </nav>
</template>



<script lang="ts">

import axios from "@nuxtjs/axios";
import Vue from 'vue'
import { Channel } from '~/models/channel'

export default Vue.extend({
  props: {
    channels: {
      type: Array as () => Array<Channel>,
      required: true
    },
  },  
})
</script>

<style lang="scss" scoped>
</style>
