<template>
  <tipi-contratto :isRoot="false" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TipiContratto from "@/components/pages/tipi-contratto/TipiContratto.vue";

@Component({
  components: {
    TipiContratto,
  },
})
export default class SportelloTipiContrattoView extends Vue {}
</script>