
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, ContoRicaviConsumi, ContiRicaviConsumiCreateBody, ContiRicaviConsumiReplaceBody } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class ContoRicaviConsumiHandlerMixin extends Vue {

  /* METHODS */

  async getContiRicaviConsumi(alertType = AlertType.ERROR_ALERT): Promise<ContoRicaviConsumi[]> {
    try {
      return await this.$api.contiRicaviConsumi.getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i conti ricavi consumi`, alertType });
      }
      throw error;
    }
  }

  async createContoRicaviConsumi(body: ContiRicaviConsumiCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.contiRicaviConsumi.create(body, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del conto ricavi consumi da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateContoRicaviConsumi(id: number, body: ContiRicaviConsumiReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.contiRicaviConsumi.replace(id, { contoRicaviConsumi: body.contoRicaviConsumi, codice: body.codice }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id conto ricavi consumi non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del conto ricavi consumi non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Conto ricavi consumi non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteContoRicaviConsumi(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.contiRicaviConsumi.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid conto ricavi consumi non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Conto ricavi consumi non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getContiRicaviConsumiCodici(values: ContoRicaviConsumi[], backupValue: ContoRicaviConsumi | null): string[] {
    const tipi = values.map((t) => t.codice);
    return backupValue ? tipi.filter((value) => value !== backupValue.codice) : tipi;
  }

  getContiRicaviConsumiValues(values: ContoRicaviConsumi[], backupValue: ContoRicaviConsumi | null): string[] {
    const tipi = values.map((t) => t.contoRicaviConsumi);
    return backupValue ? tipi.filter((value) => value !== backupValue.contoRicaviConsumi) : tipi;
  }
}