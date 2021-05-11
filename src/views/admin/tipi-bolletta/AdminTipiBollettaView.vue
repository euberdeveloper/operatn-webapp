<template>
  <tipi-bolletta :isRoot="false" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TipiBolletta from "@/components/pages/tipi-bolletta/TipiBolletta.vue";

@Component({
  components: {
    TipiBolletta,
  },
})
export default class AdminTipiBollettaView extends Vue {}
</script>