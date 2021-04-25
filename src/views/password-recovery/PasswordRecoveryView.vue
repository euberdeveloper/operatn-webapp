<template>
  <ask-password-recovery />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AskPasswordRecovery from "@/components/pages/ask-password-recovery/AskPasswordRecovery.vue";

@Component({
  components: {
    AskPasswordRecovery,
  },
})
export default class PasswordRecoveryView extends Vue {}
</script>
