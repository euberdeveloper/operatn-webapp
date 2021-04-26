<template>
  <conti-ricavi-canoni />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContiRicaviCanoni from "@/components/pages/conti-ricavi-canoni/ContiRicaviCanoni.vue";

@Component({
  components: {
    ContiRicaviCanoni,
  },
})
export default class RootContiRicaviCanoniView extends Vue {}
</script>