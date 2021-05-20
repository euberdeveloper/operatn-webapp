<template>
    <contratti-terminati />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContrattiTerminati from "@/components/pages/contratti/terminati/ContrattiTerminati.vue";

@Component({
  components: {
    ContrattiTerminati,
  },
})
export default class RootContrattiTerminatiView extends Vue {}
</script>