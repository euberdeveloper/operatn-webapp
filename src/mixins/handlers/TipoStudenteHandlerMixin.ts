
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, TipoStudente, TipiStudenteCreateBody, TipiStudenteReplaceBody } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class TipoStudenteHandlerMixin extends Vue {

  /* METHODS */

  async getTipiStudente(alertType = AlertType.ERROR_ALERT): Promise<TipoStudente[]> {
    try {
      return await this.$api.tipiStudente.getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i tipi studente`, alertType });
      }
      throw error;
    }
  }

  async createTipoStudente(body: TipiStudenteCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.tipiStudente.create(body, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del tipo di studente da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateTipoStudente(id: number, body: TipiStudenteReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiStudente.replace(id, { tipoStudente: body.tipoStudente }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id tipo studente non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del tipo studente non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo studente non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteTipoStudente(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiStudente.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid tipo studente non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo studente non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getTipiStudenteValues(values: TipoStudente[], backupValue: TipoStudente | null): string[] {
    const tipi = values.map((t) => t.tipoStudente);
    return backupValue ? tipi.filter((value) => value !== backupValue.tipoStudente) : tipi;
  }
}