<template>
  <conti-ricavi :isRoot="false" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContiRicavi from "@/components/pages/conti-ricavi/ContiRicavi.vue";

@Component({
  components: {
    ContiRicavi,
  },
})
export default class RagioneriaContiRicaviView extends Vue {}
</script>