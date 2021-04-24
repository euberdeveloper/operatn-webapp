<template>
  <menu-root />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import MenuRoot from "@/components/menus/root/MenuRoot.vue";

@Component({
  components: {
    MenuRoot,
  },
})
export default class RootMenuView extends Vue {

}
</script>