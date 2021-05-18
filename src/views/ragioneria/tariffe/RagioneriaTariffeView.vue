<template>
    <tariffe :isRoot="false" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tariffe from "@/components/pages/tariffe/Tariffe.vue";

@Component({
  components: {
    Tariffe,
  },
})
export default class RagioneriaTariffeView extends Vue {}
</script>