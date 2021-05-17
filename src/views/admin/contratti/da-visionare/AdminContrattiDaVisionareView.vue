<template>
    <contratti-da-visionare />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContrattiDaVisionare from "@/components/pages/contratti/da-visionare/ContrattiDaVisionare.vue";

@Component({
  components: {
    ContrattiDaVisionare,
  },
})
export default class AdminContrattiDaVisionareView extends Vue {}
</script>