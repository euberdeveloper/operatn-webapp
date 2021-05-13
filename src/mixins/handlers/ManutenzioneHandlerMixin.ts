
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, Manutenzione, ManutenzioniIncludeParams, ManutenzioniReturned, UniqueConstraintError } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class ManutenzioneHandlerMixin extends Vue {

  /* METHODS */

  async getManutenzioni(fid: number, sid: number, params: ManutenzioniIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<Manutenzione[]> {
    try {
      return await this.$api.fabbricati.stanze(fid).manutenzioni(sid).getAll(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare le manutenzioni`, alertType });
      }
      throw error;
    }
  }

  async getManutenzione(fid: number, sid: number, id: number, params: ManutenzioniIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<ManutenzioniReturned> {
    try {
      return await this.$api.fabbricati.stanze(fid).manutenzioni(sid).get(id, params, { alertType });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Manutenzione non trovata`, alertType });
      } else if (error instanceof BadRequestError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
      } else {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
      }
      throw error;
    }
  }

  async createManutenzione(fid: number, sid: number, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.fabbricati.stanze(fid).manutenzioni(sid).create({ alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del fabbricato da creare non validi`, alertType });
        } else if (error instanceof UniqueConstraintError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `C'è già una manutenzione attiva per questa stanza`, alertType });
        }
        else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteManutenzione(fid: number, sid: number, id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.fabbricati.stanze(fid).manutenzioni(sid).delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid manutenzione non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Manutenzione non trovata o già eliminata`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

}