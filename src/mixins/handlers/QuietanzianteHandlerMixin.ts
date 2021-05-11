
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, Quietanziante, QuietanziantiCreateBody, QuietanziantiReplaceBody } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class QuietanzianteHandlerMixin extends Vue {

  /* METHODS */

  async getQuietanzianti(alertType = AlertType.ERROR_ALERT): Promise<Quietanziante[]> {
    try {
      return await this.$api.quietanzianti.getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i quietanzianti`, alertType });
      }
      throw error;
    }
  }

  async createQuietanziante(body: QuietanziantiCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.quietanzianti.create(body, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del tipo di tariffa da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateQuietanziante(id: number, body: QuietanziantiReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.quietanzianti.replace(id, {
        quietanziante: body.quietanziante,
        denominazione: body.denominazione,
        sesso: body.sesso,
        dataNascita: body.dataNascita,
        comuneNascita: body.comuneNascita,
        indirizzo: body.indirizzo,
        cap: body.cap,
        citta: body.citta,
        siglaProvincia: body.siglaProvincia,
        codiceFiscale: body.codiceFiscale,
        numeroTelefono: body.numeroTelefono,
        email: body.email
      }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id quietanziante non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del quietanziante non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Quietanziante non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteQuietanziante(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.quietanzianti.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid quietanziante non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Quietanziante non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getQuietanziantiValues(values: Quietanziante[], backupValue: Quietanziante | null): string[] {
    const tipi = values.map((t) => t.quietanziante);
    return backupValue ? tipi.filter((value) => value !== backupValue.quietanziante) : tipi;
  }
}