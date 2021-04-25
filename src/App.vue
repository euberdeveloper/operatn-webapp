<template>
  <v-app id="app">
    <router-view name="bar" />
    <router-view name="menu" />
    <router-view />
    <operatn-error-dialog v-model="showErrorDialog" :text="errorDialogText" />
    <operatn-success-dialog v-model="showSuccessDialog" :text="successDialogText" />
    <operatn-confirm-dialog v-if="showConfirmDialog" v-model="showConfirmDialog" :text="confirmDialog.text" :callback="confirmDialog.callback" />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import OperatnErrorDialog from "@/components/gears/dialogs/OperatnErrorDialog.vue";
import OperatnSuccessDialog from "@/components/gears/dialogs/OperatnSuccessDialog.vue";
import OperatnConfirmDialog from "@/components/gears/dialogs/OperatnConfirmDialog.vue";

import { ActionTypes } from "@/store";

@Component({
  components: {
    OperatnErrorDialog,
    OperatnSuccessDialog,
    OperatnConfirmDialog,
  },
})
export default class App extends Vue {
  /* COMPUTED */

  get errorDialogText(): string | null {
    return this.$store.state.errorDialogText;
  }
  get successDialogText(): string | null {
    return this.$store.state.successDialogText;
  }
  get confirmDialog() {
    return this.$store.state.confirmDialog;
  }

  get showErrorDialog(): boolean {
    return this.errorDialogText !== null;
  }
  set showErrorDialog(value: boolean) {
    if (!value) {
      this.$store.dispatch(ActionTypes.HIDE_ERROR_DIALOG);
    }
  }

  get showSuccessDialog(): boolean {
    return this.successDialogText !== null;
  }
  set showSuccessDialog(value: boolean) {
    if (!value) {
      this.$store.dispatch(ActionTypes.HIDE_SUCCESS_DIALOG);
    }
  }

  get showConfirmDialog(): boolean {
    return this.confirmDialog !== null;
  }
  set showConfirmDialog(value: boolean) {
    if (!value) {
      this.$store.dispatch(ActionTypes.HIDE_CONFIRM_DIALOG);
    }
  }

  get isDarkTheme(): boolean {
    return this.$store.state.darkTheme;
  }

  get primaryColour(): string | null {
    return this.$store.state.primaryColour;
  }

  /* WATCH */

  @Watch("isDarkTheme")
  watchDarkTheme() {
    this.$vuetify.theme.dark = this.isDarkTheme;
  }

  @Watch("primaryColour")
  watchPrimaryColour() {
    if (this.primaryColour) {
      this.$vuetify.theme.themes.light.primary = this.primaryColour;
      this.$vuetify.theme.themes.dark.primary = this.primaryColour;
    } else {
      this.$vuetify.theme.themes.light.primary = "#1976D2";
      this.$vuetify.theme.themes.dark.primary = "#1976D2";
    }
  }

  /* LIFE CYCLE */

  mounted() {
    this.$vuetify.theme.dark = this.isDarkTheme;
    if (this.primaryColour) {
      this.$vuetify.theme.themes.light.primary = this.primaryColour;
      this.$vuetify.theme.themes.dark.primary = this.primaryColour;
    }
  }
}
</script>

<style lang="scss">
html {
  overflow-y: auto;
}
</style>
