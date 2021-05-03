<template>
  <tipi-fabbricato :isRoot="false" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TipiFabbricato from "@/components/pages/tipi-fabbricato/TipiFabbricato.vue";

@Component({
  components: {
    TipiFabbricato,
  },
})
export default class AdminTipiFabbricatoView extends Vue {}
</script>