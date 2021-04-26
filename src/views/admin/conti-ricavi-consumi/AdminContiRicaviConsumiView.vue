<template>
  <conti-ricavi-consumi />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContiRicaviConsumi from "@/components/pages/conti-ricavi-consumi/ContiRicaviConsumi.vue";

@Component({
  components: {
    ContiRicaviConsumi,
  },
})
export default class AdminContiRicaviConsumiView extends Vue {}
</script>