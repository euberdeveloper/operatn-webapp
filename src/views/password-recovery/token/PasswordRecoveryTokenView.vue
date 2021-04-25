<template>
  <recover-password :token="token" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import RecoverPassword from "@/components/pages/recover-password/RecoverPassword.vue";

@Component({
  components: {
    RecoverPassword,
  },
})
export default class PasswordRecoveryTokenView extends Vue {
  /* PROPS */

  @Prop({ type: String, required: true })
  token!: string;
}
</script>
