
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, TipiOspiteCreateBody, TipiOspiteReplaceBody, TipiOspiteIncludeParams, TipiOspiteReturned } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class TipoOspiteHandlerMixin extends Vue {

  /* METHODS */

  async getTipiOspite(includeParams: TipiOspiteIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<TipiOspiteReturned[]> {
    try {
      return await this.$api.tipiOspite.getAll(includeParams, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i tipi ospite`, alertType });
      }
      throw error;
    }
  }

  async createTipoOspite(body: TipiOspiteCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.tipiOspite.create(body, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del tipo di ospite da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateTipoOspite(id: number, body: TipiOspiteReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiOspite.replace(id, {
        tipoOspite: body.tipoOspite,
        sigla: body.sigla,
        idContoRicaviCanoni: body.idContoRicaviCanoni,
        idContoRicaviConsumi: body.idContoRicaviConsumi,
      }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id tipo ospite non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del tipo ospite non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo ospite non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteTipoOspite(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiOspite.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid tipo ospite non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo ospite non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getTipiOspiteValues(values: TipiOspiteReturned[], backupValue: TipiOspiteReturned | null): string[] {
    const tipi = values.map((t) => t.tipoOspite);
    return backupValue ? tipi.filter((value) => value !== backupValue.tipoOspite) : tipi;
  }

  getTipiOspiteSigle(values: TipiOspiteReturned[], backupValue: TipiOspiteReturned | null): string[] {
    const tipi = values.map((t) => t.sigla);
    return backupValue ? tipi.filter((value) => value !== backupValue.sigla) : tipi;
  }
}