<template>
  <menu-sportello />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import MenuSportello from "@/components/menus/sportello/MenuSportello.vue";

@Component({
  components: {
    MenuSportello,
  },
})
export default class SportelloMenuView extends Vue {

}
</script>