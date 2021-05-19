<template>
  <v-dialog v-model="internalShow" :width="width" scrollable>
    <v-card>
      <v-card-title :class="['title', 'headline', 'white--text', 'text--darken-5', color, colorModificator]">
        <v-spacer />
        <span>{{ title }}</span>
        <v-spacer />
      </v-card-title>

      <v-card-text class="info-text">
        <slot>
          <vue-markdown class="content">{{ text }}</vue-markdown>
        </slot>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="success" outlined @click="internalShow = false">CHIUDI</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import VueMarkdown from "vue-markdown";

@Component({
  model: {
    prop: "show",
    event: "show-updated",
  },
  components: {
    VueMarkdown,
  },
})
export default class OperatnInfoDialog extends Vue {
  /* PROPS */

  @Prop({ type: String, default: "primary" })
  color!: string;

  @Prop({ type: String, default: "lighten-1" })
  colorModificator!: string;

  @Prop({ type: String, default: "Informazioni" })
  title!: string;

  @Prop({ type: Boolean })
  show!: boolean;

  @Prop({ type: String })
  text!: string;

  @Prop({ type: String, default: "600" })
  width!: string;


  /* GETTERS AND SETTERS */

  get internalShow(): boolean {
    return this.show;
  }
  set internalShow(value: boolean) {
    this.$emit("show-updated", value);
  }
}
</script>

<style lang="scss" scoped>
.info-text {
  text-align: justify;
  font-size: 16px;
  margin: 30px 0;

  .content {
    overflow-y: auto;
    overflow-x: auto;
  }
}
</style>