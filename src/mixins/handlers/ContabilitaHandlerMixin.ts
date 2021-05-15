
import { Component, Vue } from "vue-property-decorator";
import { ContabilitaBollettaInfo, ContabilitaDirsInfo, ContabilitaPageParams, ContabilitaQueryParams } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class ContabilitaHandlerMixin extends Vue {

  /* METHODS */

  async getContabilitaBollette(params: ContabilitaQueryParams & ContabilitaPageParams, alertType = AlertType.ERROR_ALERT): Promise<ContabilitaBollettaInfo[]> {
    try {
      return await this.$api.contabilita.getBollette(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore nel caricare bollette`, alertType });
      }
      throw error;
    }
  }

  async getContabilitaBolletteCount(params: ContabilitaQueryParams, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      return await this.$api.contabilita.countBollette(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore nel contare bollette`, alertType });
      }
      throw error;
    }
  }

  async getContabilitaCronology(alertType = AlertType.ERROR_ALERT): Promise<ContabilitaDirsInfo[]> {
    try {
      return await this.$api.contabilita.getCronology({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore nel caricare cronologia contabilità`, alertType });
      }
      throw error;
    }
  }

  async sendContabilitaBollette(params: ContabilitaQueryParams, alertType = AlertType.ERROR_ALERT): Promise<number[]> {
    try {
      return await this.$api.contabilita.sendBollette(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore nell'inviare bollette`, alertType });
      }
      throw error;
    }
  }

  

}