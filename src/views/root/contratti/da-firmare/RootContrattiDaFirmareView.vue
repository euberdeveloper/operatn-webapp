<template>
    <contratti-da-firmare />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContrattiDaFirmare from "@/components/pages/contratti/da-firmare/ContrattiDaFirmare.vue";

@Component({
  components: {
    ContrattiDaFirmare,
  },
})
export default class RootContrattiDaFirmareView extends Vue {}
</script>