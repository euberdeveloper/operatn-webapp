<template lang="pug">
v-app#inspire
  v-main
    v-container.fill-height(fluid='')
      v-row(align='center', justify='center')
        v-col(cols='12', sm='8', md='4')
          v-card.elevation-12
            v-toolbar(color='primary', dark='', flat='')
              v-toolbar-title 404
              v-spacer
            v-card-text
              | Il percorso che ha inserito non esiste!
            v-card-actions
              v-spacer
              v-btn(color='primary', @click='goHome') Torna all'home

</template>
<script>
export default {
  methods: {
    goHome() {
      this.$router.replace('/')
    }
  },
}
</script>