<template>
    <tabellone-esporta />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TabelloneEsporta from "@/components/pages/tabellone/esporta/TabelloneEsporta.vue";

@Component({
  components: {
    TabelloneEsporta,
  },
})
export default class SportelloTabelloneEsportaView extends Vue {}
</script>