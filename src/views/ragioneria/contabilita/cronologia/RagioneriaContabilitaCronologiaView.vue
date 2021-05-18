<template>
    <contabilita-cronologia />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContabilitaCronologia from "@/components/pages/contabilita/cronologia/ContabilitaCronologia.vue";

@Component({
  components: {
    ContabilitaCronologia,
  },
})
export default class RagioneriaContabilitaCronologiaView extends Vue {}
</script>