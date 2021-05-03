<template>
    <user-info :isRoot="false" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UserInfo from "@/components/pages/user-info/UserInfo.vue";

@Component({
  components: {
    UserInfo,
  },
})
export default class AdminUserInfoView extends Vue {}
</script>