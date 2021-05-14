
import { Component, Vue } from "vue-property-decorator";
import { FilesInfo } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class TabelloneHandlerMixin extends Vue {

  /* METHODS */

  async getTabelloneCronology(alertType = AlertType.ERROR_ALERT): Promise<FilesInfo[]> {
    try {
      return await this.$api.tabellone.getCronology({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare la cronologia dei tabelloni`, alertType });
      }
      throw error;
    }
  }


}