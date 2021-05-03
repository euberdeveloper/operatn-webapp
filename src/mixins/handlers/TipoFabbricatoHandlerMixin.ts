
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, TipoFabbricato, TipiFabbricatoCreateBody, TipiFabbricatoReplaceBody } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class TipoFabbricatoHandlerMixin extends Vue {

  /* METHODS */

  async getTipiFabbricato(alertType = AlertType.ERROR_ALERT): Promise<TipoFabbricato[]> {
    try {
      return await this.$api.tipiFabbricato.getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i tipi fabbricato`, alertType });
      }
      throw error;
    }
  }

  async createTipoFabbricato(body: TipiFabbricatoCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.tipiFabbricato.create(body, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del tipo di fabbricato da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateTipoFabbricato(id: number, body: TipiFabbricatoReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiFabbricato.replace(id, { tipoFabbricato: body.tipoFabbricato }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id tipo fabbricato non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del tipo fabbricato non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo fabbricato non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteTipoFabbricato(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiFabbricato.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid tipo fabbricato non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo fabbricato non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getTipiFabbricatoValues(values: TipoFabbricato[], backupValue: TipoFabbricato | null): string[] {
    const tipi = values.map((t) => t.tipoFabbricato);
    return backupValue ? tipi.filter((value) => value !== backupValue.tipoFabbricato) : tipi;
  }
}