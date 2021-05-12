<template>
    <fabbricati isRoot />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Fabbricati from "@/components/pages/fabbricati/Fabbricati.vue";

@Component({
  components: {
    Fabbricati,
  },
})
export default class RootFabbricatiView extends Vue {}
</script>