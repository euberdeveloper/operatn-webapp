<template>
  <tipi-tariffa />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TipiTariffa from "@/components/pages/tipi-tariffa/TipiTariffa.vue";

@Component({
  components: {
    TipiTariffa,
  },
})
export default class RootTipiTariffaView extends Vue {}
</script>