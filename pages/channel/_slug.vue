<template>
  <div>
    {{ files }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  asyncData({ params, error, payload })
  {
    return {
      files: payload
    }
  }
})

</script>

<style lang="scss" scoped>

</style>
