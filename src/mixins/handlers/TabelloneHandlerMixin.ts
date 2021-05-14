
import { Component, Vue } from "vue-property-decorator";
import { FilesInfo, Tabellone, TabelloneQueryParams } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class TabelloneHandlerMixin extends Vue {

  /* METHODS */

  async getTabellone(params: TabelloneQueryParams, alertType = AlertType.ERROR_ALERT): Promise<Tabellone[]> {
    try {
      return await this.$api.tabellone.get(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore nel creare tabellone`, alertType });
      }
      throw error;
    }
  }

  async getTabelloneCronology(alertType = AlertType.ERROR_ALERT): Promise<FilesInfo[]> {
    try {
      return await this.$api.tabellone.getCronology({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore nel caricare la cronologia dei tabelloni`, alertType });
      }
      throw error;
    }
  }

  async getTabelloneTsv(params: TabelloneQueryParams, alertType = AlertType.ERROR_ALERT): Promise<Blob> {
    try {
      return await this.$api.tabellone.getTsv(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore nel creare tabellone`, alertType });
      }
      throw error;
    }
  }

  async getTabelloneXlsx(params: TabelloneQueryParams, alertType = AlertType.ERROR_ALERT): Promise<Blob> {
    try {
      return await this.$api.tabellone.getXlsx(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore nel creare tabellone`, alertType });
      }
      throw error;
    }
  }

}