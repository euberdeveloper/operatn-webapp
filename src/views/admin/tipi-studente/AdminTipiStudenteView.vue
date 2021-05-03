<template>
  <tipi-studente :isRoot="false" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TipiStudente from "@/components/pages/tipi-studente/TipiStudente.vue";

@Component({
  components: {
    TipiStudente,
  },
})
export default class AdminTipiStudenteView extends Vue {}
</script>