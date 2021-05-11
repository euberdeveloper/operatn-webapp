<template>
  <tipi-ospite isRoot />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TipiOspite from "@/components/pages/tipi-ospite/TipiOspite.vue";

@Component({
  components: {
    TipiOspite,
  },
})
export default class RootTipiOspiteView extends Vue {}
</script>