
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, StanzeCreateBody, StanzeReplaceBody, StanzeIncludeParams, StanzeReturned, StanzeLibereParams } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class StanzaHandlerMixin extends Vue {

  /* METHODS */

  async getStanze(fid: number, params: StanzeIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<StanzeReturned[]> {
    try {
      return await this.$api.fabbricati.stanze(fid).getAll(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare le stanze`, alertType });
      }
      throw error;
    }
  }

  async getStanzeLibere(fid: number, params: StanzeLibereParams, alertType = AlertType.ERROR_ALERT): Promise<StanzeReturned[]> {
    try {
      return await this.$api.fabbricati.stanze(fid).getLibere(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare le stanze libere`, alertType });
      }
      throw error;
    }
  }

  async getStanza(fid: number, id: number, params: StanzeIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<StanzeReturned> {
    try {
      return await this.$api.fabbricati.stanze(fid).get(id, params, { alertType });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Stanza non trovata`, alertType });
      } else if (error instanceof BadRequestError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
      } else {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
      }
      throw error;
    }
  }

  async createStanza(fid: number, body: StanzeCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.fabbricati.stanze(fid).create({ ...body }, { alertType });
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

  async updateStanza(fid: number, id: number, body: StanzeReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.fabbricati.stanze(fid).replace(id, {
       unitaImmobiliare: body.unitaImmobiliare,
       numeroStanza: body.numeroStanza,
       piano: body.piano,
       bagno: body.bagno,
       centroDiCosto: body.centroDiCosto,
       gestioneDiretta: body.gestioneDiretta,
       handicap: body.handicap,
       note: body.note,
       idTipoStanza: body.idTipoStanza
      }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id stanza non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del stanza non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Stanza non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteStanza(fid: number, id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.fabbricati.stanze(fid).delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid stanza non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Stanza non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

}