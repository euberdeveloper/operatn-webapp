<template>
  <menu-ragioneria />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import MenuRagioneria from "@/components/menus/ragioneria/MenuRagioneria.vue";

@Component({
  components: {
    MenuRagioneria,
  },
})
export default class RagioneriaMenuView extends Vue {

}
</script>