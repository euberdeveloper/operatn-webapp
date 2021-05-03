
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, ContoRicaviCanoni, ContiRicaviCanoniCreateBody, ContiRicaviCanoniReplaceBody } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class ContoRicaviCanoniHandlerMixin extends Vue {

  /* METHODS */

  async getContiRicaviCanoni(alertType = AlertType.ERROR_ALERT): Promise<ContoRicaviCanoni[]> {
    try {
      return await this.$api.contiRicaviCanoni.getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i conti ricavi canoni`, alertType });
      }
      throw error;
    }
  }

  async createContoRicaviCanoni(body: ContiRicaviCanoniCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.contiRicaviCanoni.create(body, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del conto ricavi canoni da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateContoRicaviCanoni(id: number, body: ContiRicaviCanoniReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.contiRicaviCanoni.replace(id, { contoRicaviCanoni: body.contoRicaviCanoni, codice: body.codice }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id conto ricavi canoni non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del conto ricavi canoni non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Conto ricavi canoni non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteContoRicaviCanoni(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.contiRicaviCanoni.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid conto ricavi canoni non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Conto ricavi canoni non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getContiRicaviCanoniCodici(values: ContoRicaviCanoni[], backupValue: ContoRicaviCanoni | null): string[] {
    const tipi = values.map((t) => t.codice);
    return backupValue ? tipi.filter((value) => value !== backupValue.codice) : tipi;
  }

  getContiRicaviCanoniValues(values: ContoRicaviCanoni[], backupValue: ContoRicaviCanoni | null): string[] {
    const tipi = values.map((t) => t.contoRicaviCanoni);
    return backupValue ? tipi.filter((value) => value !== backupValue.contoRicaviCanoni) : tipi;
  }
}