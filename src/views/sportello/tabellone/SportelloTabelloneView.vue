<template>
  <v-card>
    <!-- TOOLBAR -->
    <v-toolbar flat color="primary">
      <v-toolbar-title class="headline primary white--text">Tabellone</v-toolbar-title>
    </v-toolbar>

    <!-- TABS -->
    <v-tabs v-model="activeTab">
      <v-tab v-for="tab of tabs" :key="tab.path" :to="tab.path">
        <v-icon left>{{ tab.icon }}</v-icon>
        <span>{{ tab.label }}</span>
      </v-tab>

      <v-tabs-items v-model="activeTab">
        <v-tab-item v-for="tab of tabs" :key="tab.path" :value="tab.path">
          <router-view />
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SportelloTabelloneView extends Vue {
  /* DATA */
  private activeTab = "";
  private tabs = [
    {
      path: "esporta",
      icon: "mdi-table-arrow-down",
      label: "Esporta",
    },
    {
      path: "cronologia",
      icon: "mdi-table-sync",
      label: "Cronologia",
    },
  ];
}
</script>

