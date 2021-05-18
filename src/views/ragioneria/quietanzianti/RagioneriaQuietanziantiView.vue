<template>
    <quietanzianti :isRoot="false" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Quietanzianti from "@/components/pages/quietanzianti/Quietanzianti.vue";

@Component({
  components: {
    Quietanzianti,
  },
})
export default class RagioneriaQuietanziantiView extends Vue {}
</script>