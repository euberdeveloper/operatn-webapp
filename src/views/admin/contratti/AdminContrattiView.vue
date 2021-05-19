<template>
  <v-card>
    <!-- TOOLBAR -->
    <v-toolbar flat color="primary">
      <v-toolbar-title class="headline primary white--text">Contratti</v-toolbar-title>
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
export default class AdminContrattiView extends Vue {
  /* DATA */
  private activeTab = "";
  private tabs = [
    {
      path: "provvisori",
      icon: "mdi-tooltip-edit-outline",
      label: "Provvisori",
    },
    {
      path: "da-firmare",
      icon: "mdi-clipboard-edit",
      label: "Da firmare",
    },

    {
      path: "da-visionare",
      icon: "mdi-eye-check-outline",
      label: "Da visionare",
    },
    {
      path: "attivi",
      icon: "mdi-alarm-check",
      label: "Attivi",
    },
    {
      path: "terminati",
      icon: "mdi-archive",
      label: "Terminati",
    },
  ];
}
</script>

