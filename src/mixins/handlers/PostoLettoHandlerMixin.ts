
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, PostiLettoCreateBody, PostiLettoReplaceBody, PostiLettoIncludeParams, PostiLettoReturned } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class PostoLettoHandlerMixin extends Vue {

  /* METHODS */

  async getPostiLetto(fid: number, sid: number, params: PostiLettoIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<PostiLettoReturned[]> {
    try {
      return await this.$api.fabbricati.stanze(fid).postiLetto(sid).getAll(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i posti letto`, alertType });
      }
      throw error;
    }
  }

  async getPostoLetto(fid: number, sid: number, id: number, params: PostiLettoIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<PostiLettoReturned> {
    try {
      return await this.$api.fabbricati.stanze(fid).postiLetto(sid).get(id, params, { alertType });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `PostoLetto non trovata`, alertType });
      } else if (error instanceof BadRequestError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
      } else {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
      }
      throw error;
    }
  }

  async getPostoLettoGeneral(id: number, params: PostiLettoIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<PostiLettoReturned> {
    try {
      return await this.$api.postiLetto.get(id, params, { alertType });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `PostoLetto non trovata`, alertType });
      } else if (error instanceof BadRequestError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
      } else {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
      }
      throw error;
    }
  }

  async createPostoLetto(fid: number, sid: number, body: PostiLettoCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.fabbricati.stanze(fid).postiLetto(sid).create({ ...body }, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del posto letto da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updatePostoLetto(fid: number, sid: number, id: number, body: PostiLettoReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.fabbricati.stanze(fid).postiLetto(sid).replace(id, {
        postoLetto: body.postoLetto
      }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id posto letto non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del posto letto non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `PostoLetto non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deletePostoLetto(fid: number, sid: number, id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.fabbricati.stanze(fid).postiLetto(sid).delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id posto letto non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `PostoLetto non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getPostiLettoValues(values: PostiLettoReturned[], backupValue: PostiLettoReturned | null): string[] {
    const tipi = values.map((t) => t.postoLetto);
    return backupValue ? tipi.filter((value) => value !== backupValue.postoLetto) : tipi;
  }

}