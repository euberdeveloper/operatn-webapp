<template>
  <conti-ricavi-consumi isRoot />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContiRicaviConsumi from "@/components/pages/conti-ricavi-consumi/ContiRicaviConsumi.vue";

@Component({
  components: {
    ContiRicaviConsumi,
  },
})
export default class RootContiRicaviConsumiView extends Vue {}
</script>