<template>
    <quietanzianti />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Quietanzianti from "@/components/pages/quietanzianti/Quietanzianti.vue";

@Component({
  components: {
    Quietanzianti,
  },
})
export default class RootQuietanziantiView extends Vue {}
</script>