<template>
  <tipi-studente />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TipiStudente from "@/components/pages/tipi-studente/TipiStudente.vue";

@Component({
  components: {
    TipiStudente,
  },
})
export default class RootTipiStudenteView extends Vue {}
</script>