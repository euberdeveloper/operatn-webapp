<template>
  <v-snackbars :messages.sync="intenalMessages" color="red" top right>
    <template v-slot:action="{ close }">
      <v-btn text @click="close()">CHIUDI</v-btn>
    </template>
  </v-snackbars>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import VSnackbars from "v-snackbars";

@Component({
  components: {
    VSnackbars,
  },
  model: {
    prop: "messages",
    event: "messages-updated",
  },
})
export default class OperatnErrorsQueue extends Vue {
  /* PROPS */

  @Prop({ type: Array, default: () => [] })
  messages!: string[];

  /* GETTERS AND SETTERS */

  get intenalMessages(): string[] {
    return this.messages;
  }
  set intenalMessages(value: string[]) {
    this.$emit("messages-updated", value);
  }
}
</script>