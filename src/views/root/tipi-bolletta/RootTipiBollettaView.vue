<template>
  <tipi-bolletta isRoot />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TipiBolletta from "@/components/pages/tipi-bolletta/TipiBolletta.vue";

@Component({
  components: {
    TipiBolletta,
  },
})
export default class RootTipiBollettaView extends Vue {}
</script>