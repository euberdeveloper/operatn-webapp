
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, TipoStanza, TipiStanzaCreateBody, TipiStanzaReplaceBody } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class TipoStanzaHandlerMixin extends Vue {

  /* METHODS */

  async getTipiStanza(alertType = AlertType.ERROR_ALERT): Promise<TipoStanza[]> {
    try {
      return await this.$api.tipiStanza.getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i tipi stanza`, alertType });
      }
      throw error;
    }
  }

  async createTipoStanza(body: TipiStanzaCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.tipiStanza.create(body, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del tipo di stanza da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateTipoStanza(id: number, body: TipiStanzaReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiStanza.replace(id, { tipoStanza: body.tipoStanza }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id tipo stanza non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del tipo stanza non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo stanza non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteTipoStanza(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiStanza.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid tipo stanza non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo stanza non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getTipiStanzaValues(values: TipoStanza[], backupValue: TipoStanza | null): string[] {
    const tipi = values.map((t) => t.tipoStanza);
    return backupValue ? tipi.filter((value) => value !== backupValue.tipoStanza) : tipi;
  }
}