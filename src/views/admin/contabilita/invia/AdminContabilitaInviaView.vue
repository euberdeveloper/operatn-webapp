<template>
    <contabilita-invia />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContabilitaInvia from "@/components/pages/contabilita/invia/ContabilitaInvia.vue";

@Component({
  components: {
    ContabilitaInvia,
  },
})
export default class AdminContabilitaInviaView extends Vue {}
</script>