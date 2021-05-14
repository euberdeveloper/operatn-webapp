<template>
    <contabilita />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Contabilita from "@/components/pages/contabilita/Contabilita.vue";

@Component({
  components: {
    Contabilita,
  },
})
export default class AdminContabilitaView extends Vue {}
</script>