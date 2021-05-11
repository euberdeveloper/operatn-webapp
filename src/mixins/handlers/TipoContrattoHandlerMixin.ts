
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, TipiContrattoCreateBody, TipiContrattoReplaceBody, TipiContrattoIncludeParams, TipiContrattoReturned } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class TipoContrattoHandlerMixin extends Vue {

  /* METHODS */

  async getTipiContratto(includeParams: TipiContrattoIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<TipiContrattoReturned[]> {
    try {
      return await this.$api.tipiContratto.getAll(includeParams, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i tipi contratto`, alertType });
      }
      throw error;
    }
  }

  async createTipoContratto(body: TipiContrattoCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.tipiContratto.create(body, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del tipo di contratto da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateTipoContratto(id: number, body: TipiContrattoReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiContratto.replace(id, {
        nome: body.nome,
        sigla: body.sigla,
        idTipoStudente: body.idTipoStudente
      }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id tipo contratto non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del tipo contratto non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo contratto non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteTipoContratto(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiContratto.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid tipo contratto non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo contratto non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getTipiContrattoValues(values: TipiContrattoReturned[], backupValue: TipiContrattoReturned | null): string[] {
    const tipi = values.map((t) => t.nome);
    return backupValue ? tipi.filter((value) => value !== backupValue.nome) : tipi;
  }

  getTipiContrattoSigle(values: TipiContrattoReturned[], backupValue: TipiContrattoReturned | null): string[] {
    const tipi = values.map((t) => t.sigla);
    return backupValue ? tipi.filter((value) => value !== backupValue.sigla) : tipi;
  }
}