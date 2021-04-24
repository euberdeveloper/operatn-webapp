<template>
  <tipi-stanza />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TipiStanza from "@/components/pages/tipi-stanza/TipiStanza.vue";

@Component({
  components: {
    TipiStanza,
  },
})
export default class RootTipiStanzaView extends Vue {}
</script>