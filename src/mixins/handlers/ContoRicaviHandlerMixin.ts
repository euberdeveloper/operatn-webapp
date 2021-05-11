
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, ContoRicavi, ContiRicaviCreateBody, ContiRicaviReplaceBody } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class ContoRicaviHandlerMixin extends Vue {

  /* METHODS */

  async getContiRicavi(alertType = AlertType.ERROR_ALERT): Promise<ContoRicavi[]> {
    try {
      return await this.$api.contiRicavi.getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i conti ricavi`, alertType });
      }
      throw error;
    }
  }

  async createContoRicavi(body: ContiRicaviCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.contiRicavi.create(body, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del conto ricavi da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateContoRicavi(id: number, body: ContiRicaviReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.contiRicavi.replace(id, { codice: body.codice, prg: body.prg, conto: body.conto, descrizione: body.descrizione }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id conto ricavi non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del conto ricavi non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Conto ricavi non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteContoRicavi(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.contiRicavi.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid conto ricavi non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Conto ricavi non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getContiRicaviCodici(values: ContoRicavi[], backupValue: ContoRicavi | null): string[] {
    const tipi = values.map((t) => t.codice);
    return backupValue ? tipi.filter((value) => value !== backupValue.codice) : tipi;
  }

  getContiRicaviValues(values: ContoRicavi[], backupValue: ContoRicavi | null): string[] {
    const tipi = values.map((t) => t.conto);
    return backupValue ? tipi.filter((value) => value !== backupValue.conto) : tipi;
  }
}