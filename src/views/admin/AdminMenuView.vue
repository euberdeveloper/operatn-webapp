<template>
  <menu-admin />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import MenuAdmin from "@/components/menus/admin/MenuAdmin.vue";

@Component({
  components: {
    MenuAdmin,
  },
})
export default class AdminMenuView extends Vue {

}
</script>