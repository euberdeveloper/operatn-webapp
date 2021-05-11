<template>
  <tipi-contratto isRoot />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TipiContratto from "@/components/pages/tipi-contratto/TipiContratto.vue";

@Component({
  components: {
    TipiContratto,
  },
})
export default class RootTipiContrattoView extends Vue {}
</script>