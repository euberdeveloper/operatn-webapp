<template>
  <v-fade-transition hide-on-leave>
    <v-main :key="$route.fullPath">
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10">
            <router-view class="elevation-8" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-fade-transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class RootView extends Vue {}
</script>

<style scoped>
.content {
  background: #868686;
}
</style>