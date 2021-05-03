
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, UtentiReturned, UtentiCreateBody, UtentiUpdateBody, UtentiUpdatePasswordBody, UtentiUpdateRuoloBody, UniqueRootError } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

export type UtentiHandlerUpdateBody = UtentiUpdateBody & UtentiUpdateRuoloBody & UtentiUpdatePasswordBody & { uid?: string };

@Component
export default class UtenteHandlerMixin extends Vue {

  /* METHODS */

  async getUtenti(alertType = AlertType.ERROR_ALERT): Promise<UtentiReturned[]> {
    try {
      return await this.$api.utenti.getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare gli utenti`, alertType });
      }
      throw error;
    }
  }

  async createUtente(body: UtentiCreateBody, alertType = AlertType.ERROR_ALERT): Promise<string> {
    try {
      const uid = await this.$api.utenti.create(body, { alertType });
      return uid;
    } catch (error) {
      if (error) {
        if (error instanceof UniqueRootError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Ci può essere un solo utente root`, alertType });
        }
        else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati dell'utente da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateUtente(uid: string, body: UtentiHandlerUpdateBody, updateRuolo: boolean, updatePassword: boolean, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.utenti.update(uid, { nomeUtente: body.nomeUtente, email: body.email }, { alertType });

      if (updateRuolo) {
        await this.$api.utenti.changeRuolo(uid, { ruolo: body.ruolo });
      }

      if (updatePassword) {
        await this.$api.utenti.changePassword(uid, { password: body.password });
      }
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid utente non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del utente non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo tariffa non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteUtente(uid: string, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.utenti.delete(uid, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid utente non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo tariffa non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getUtentiNomiUtente(values: UtentiReturned[], backupValue: UtentiReturned | null): string[] {
    const tipi = values.map((t) => t.nomeUtente);
    return backupValue ? tipi.filter((value) => value !== backupValue.nomeUtente) : tipi;
  }
}