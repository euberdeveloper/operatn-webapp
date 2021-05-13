
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, Fabbricato, FabbricatiCreateBody, FabbricatiReplaceBody, FabbricatiIncludeParams, FabbricatiReturned } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class FabbricatoHandlerMixin extends Vue {

  /* METHODS */

  async getFabbricati(params: FabbricatiIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<Fabbricato[]> {
    try {
      return await this.$api.fabbricati.getAll(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i fabbricati`, alertType });
      }
      throw error;
    }
  }

  async getFabbricato(id: number, params: FabbricatiIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<FabbricatiReturned> {
    try {
      return await this.$api.fabbricati.get(id, params, { alertType });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Fabbricato non trovato`, alertType });
      } else if (error instanceof BadRequestError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
      } else {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
      }
      throw error;
    }
  }

  async createFabbricato(body: FabbricatiCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.fabbricati.create({ ...body }, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del fabbricato da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateFabbricato(id: number, body: FabbricatiReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.fabbricati.replace(id, {
        codice: body.codice,
        nome: body.nome,
        idTipoFabbricato: body.idTipoFabbricato,
        provincia: body.provincia,
        comune: body.comune,
        cap: body.cap,
        indirizzo: body.indirizzo,
        nCivico: body.nCivico
      }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id fabbricato non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del fabbricato non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Fabbricato non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteFabbricato(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.fabbricati.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid fabbricato non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Fabbricato non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getFabbricatiCodici(values: Fabbricato[], backupValue: Fabbricato | null): string[] {
    const tipi = values.map((t) => t.codice);
    return backupValue ? tipi.filter((value) => value !== backupValue.codice) : tipi;
  }

  getFabbricatiNomi(values: Fabbricato[], backupValue: Fabbricato | null): string[] {
    const tipi = values.map((t) => t.nome);
    return backupValue ? tipi.filter((value) => value !== backupValue.nome) : tipi;
  }
}