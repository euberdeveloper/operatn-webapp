<template>
    <dipartimenti-unitn />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DipartimentiUnitn from "@/components/pages/dipartimenti-unitn/DipartimentiUnitn.vue";

@Component({
  components: {
    DipartimentiUnitn,
  },
})
export default class RootDipartimentiUnitnView extends Vue {}
</script>