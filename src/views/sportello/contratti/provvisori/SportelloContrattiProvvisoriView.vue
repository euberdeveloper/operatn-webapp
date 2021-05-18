<template>
    <contratti-provvisori />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContrattiProvvisori from "@/components/pages/contratti/provvisori/ContrattiProvvisori.vue";

@Component({
  components: {
    ContrattiProvvisori,
  },
})
export default class SportelloContrattiProvvisoriView extends Vue {}
</script>