<template>
    <contratti-attivi />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContrattiAttivi from "@/components/pages/contratti/attivi/ContrattiAttivi.vue";

@Component({
  components: {
    ContrattiAttivi,
  },
})
export default class AdminContrattiAttiviView extends Vue {}
</script>