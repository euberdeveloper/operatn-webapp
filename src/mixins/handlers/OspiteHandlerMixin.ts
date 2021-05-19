
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, OspitiReturned, OspitiCreateBody, OspitiIncludeParams, OspitiSearchParams, OspitiPageParams, OspitiFilterParams } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class OspiteHandlerMixin extends Vue {

  /* METHODS */

  async getOspiti(params: OspitiIncludeParams & OspitiSearchParams & OspitiPageParams & OspitiFilterParams = {}, alertType = AlertType.ERROR_ALERT): Promise<OspitiReturned[]> {
    try {
      return this.$api.ospiti.getAll(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare gli ospiti`, alertType });
      }
      throw error;
    }
  }

  async getOspite(id: number, params: OspitiIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<OspitiReturned> {
    try {
      return this.$api.ospiti.get(id, params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Ospite non trovato`, alertType });
      }
      throw error;
    }
  }

  async createOspite(body: OspitiCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.ospiti.create(body, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del tipo di tariffa da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteOspite(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.ospiti.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id ospite non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Ospite non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

}