<template>
    <tariffe isRoot />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tariffe from "@/components/pages/tariffe/Tariffe.vue";

@Component({
  components: {
    Tariffe,
  },
})
export default class RootTariffeView extends Vue {}
</script>