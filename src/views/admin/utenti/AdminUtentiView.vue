<template>
    <utenti />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Utenti from "@/components/pages/utenti/Utenti.vue";

@Component({
  components: {
    Utenti,
  },
})
export default class AdminUtentiView extends Vue {}
</script>