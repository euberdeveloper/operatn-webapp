<template>
    <contratti-firmati />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContrattiFirmati from "@/components/pages/contratti/firmati/ContrattiFirmati.vue";

@Component({
  components: {
    ContrattiFirmati,
  },
})
export default class SportelloContrattiFirmatiView extends Vue {}
</script>