<template>
  <v-card>
    <v-toolbar flat color="primary">
      <v-toolbar-title class="headline primary white--text">Contabilità</v-toolbar-title>
    </v-toolbar>
    <v-card-subtitle>Qui puoi contabilizzare le bollette</v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import TabelloneHandlerMixin from "@/mixins/handlers/TabelloneHandlerMixin";
import OperatnBaseTable, { Actions, Column } from "@/components/gears/bases/OperatnBaseTable.vue";

@Component({
  components: {
    OperatnBaseTable,
  },
})
export default class Contabilita extends Mixins(TabelloneHandlerMixin) {
  
}
</script>

