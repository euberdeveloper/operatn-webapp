<template>
    <tabellone-cronologia />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TabelloneCronologia from "@/components/pages/tabellone/cronologia/TabelloneCronologia.vue";

@Component({
  components: {
    TabelloneCronologia,
  },
})
export default class SportelloTabelloneCronologiaView extends Vue {}
</script>