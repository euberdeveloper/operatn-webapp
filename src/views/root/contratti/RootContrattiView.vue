<template>
    <contratti />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Contratti from "@/components/pages/contratti/Contratti.vue";

@Component({
  components: {
    Contratti,
  },
})
export default class RootContrattiView extends Vue {}
</script>