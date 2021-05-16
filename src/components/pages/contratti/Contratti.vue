<template>
  <v-card>
    <v-card-title class="headline primary white--text">Contratti</v-card-title>
    <v-card-text>
      <operatn-contratto-form v-model="shit" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import OperatnContrattoForm from "@/components/gears/forms/contratto/OperatnContrattoForm.vue";

@Component({
  components: {
    OperatnContrattoForm,
  },
})
export default class UserInfo extends Mixins() {
  private shit = null;
}
</script>