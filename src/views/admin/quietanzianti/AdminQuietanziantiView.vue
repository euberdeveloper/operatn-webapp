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
export default class AdminQuietanziantiView extends Vue {}
</script>