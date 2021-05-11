<template>
  <conti-ricavi isRoot />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContiRicavi from "@/components/pages/conti-ricavi/ContiRicavi.vue";

@Component({
  components: {
    ContiRicavi,
  },
})
export default class RootContiRicaviView extends Vue {}
</script>