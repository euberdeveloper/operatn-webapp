
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, TipiBollettaCreateBody, TipiBollettaReplaceBody, TipiBollettaIncludeParams, TipiBollettaReturned } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class TipoBollettaHandlerMixin extends Vue {

  /* METHODS */

  async getTipiBolletta(includeParams: TipiBollettaIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<TipiBollettaReturned[]> {
    try {
      return await this.$api.tipiBolletta.getAll(includeParams, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i tipi bolletta`, alertType });
      }
      throw error;
    }
  }

  async createTipoBolletta(body: TipiBollettaCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.tipiBolletta.create({
        ...body,
        importoCanone: body.importoCanone !== null ? +body.importoCanone : null,
        importoConsumi: body.importoConsumi !== null ? +body.importoConsumi : null,
      }, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del tipo di bolletta da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateTipoBolletta(id: number, body: TipiBollettaReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiBolletta.replace(id, {
        tipoBolletta: body.tipoBolletta,
        siglaCausale: body.siglaCausale,
        importoCanone: body.importoCanone !== null ? +body.importoCanone : null,
        importoConsumi: body.importoConsumi !== null ? +body.importoConsumi : null,
        idContoRicaviCanoni: body.idContoRicaviCanoni,
        idContoRicaviConsumi: body.idContoRicaviConsumi,
        idQuietanziante: body.idQuietanziante
      }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id tipo bolletta non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del tipo bolletta non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo bolletta non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteTipoBolletta(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiBolletta.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid tipo bolletta non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo bolletta non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getTipiBollettaValues(values: TipiBollettaReturned[], backupValue: TipiBollettaReturned | null): string[] {
    const tipi = values.map((t) => t.tipoBolletta);
    return backupValue ? tipi.filter((value) => value !== backupValue.tipoBolletta) : tipi;
  }
}