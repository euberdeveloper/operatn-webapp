import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, NotFoundError, ContrattiCreateBody, ContrattiReplaceBody, ContrattiIncludeParams, ContrattiReturned, ContrattiFilterParams, ContrattiChiusuraAnticipataBody, InvalidBodyError, InvalidPathParamError } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class ContrattoHandlerMixin extends Vue {

  /* METHODS */

  async getContratti(params: ContrattiIncludeParams & ContrattiFilterParams = {}, alertType = AlertType.ERROR_ALERT): Promise<ContrattiReturned[]> {
    try {
      return await this.$api.contratti.getAll(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i contratti`, alertType });
      }
      throw error;
    }
  }

  async getContrattiDaFirmare(params: ContrattiIncludeParams & ContrattiFilterParams = {}, alertType = AlertType.ERROR_ALERT): Promise<ContrattiReturned[]> {
    try {
      return await this.$api.contratti.getDaFirmare(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i contratti`, alertType });
      }
      throw error;
    }
  }

  async getContrattiDaVisionare(params: ContrattiIncludeParams & ContrattiFilterParams = {}, alertType = AlertType.ERROR_ALERT): Promise<ContrattiReturned[]> {
    try {
      return await this.$api.contratti.getDaVisionare(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i contratti`, alertType });
      }
      throw error;
    }
  }

  async getContrattiFirmati(params: ContrattiIncludeParams & ContrattiFilterParams = {}, alertType = AlertType.ERROR_ALERT): Promise<ContrattiReturned[]> {
    try {
      return await this.$api.contratti.getFirmati(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i contratti`, alertType });
      }
      throw error;
    }
  }

  async getContratto(id: number, params: ContrattiIncludeParams & ContrattiFilterParams = {}, alertType = AlertType.ERROR_ALERT): Promise<ContrattiReturned> {
    try {
      return await this.$api.contratti.get(id, params, { alertType });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Contratto non trovato`, alertType });
      } else if (error instanceof BadRequestError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
      } else {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
      }
      throw error;
    }
  }


  async getContrattoByToken(token: string, params: ContrattiIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<ContrattiReturned> {
    try {
      return await this.$api.contratti.getByToken(token, params, { alertType });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Contratto non trovato`, alertType });
      } else if (error instanceof BadRequestError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
      } else {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
      }
      throw error;
    }
  }

  async createContratto(body: ContrattiCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.contratti.create({ ...body }, { alertType });
      return id;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del contratto da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateContratto(id: number, body: ContrattiReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.contratti.replace(id, {
        dataInizio: body.dataInizio,
        dataFine: body.dataFine,
        checkout: body.checkout,
        cauzione: body.cauzione,
        tipoRata: body.tipoRata,
        idTariffa: body.idTariffa,
        idTipoContratto: body.idTipoContratto,
        idQuietanziante: body.idQuietanziante,
        ospiti: body.ospiti,
        note: body.note,
      }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id contratto non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del contratto non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Contratto non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async closeContrattoInAnticipo(id: number, body: ContrattiChiusuraAnticipataBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      return await this.$api.contratti.closeAnticipated(id, body, { alertType });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Contratto non trovato`, alertType });
      } else if (error instanceof BadRequestError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
      } else {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
      }
      throw error;
    }
  }

  async sendContrattoEmailFirma(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      return await this.$api.contratti.sendEmailFirma(id, { alertType });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Contratto non trovato`, alertType });
      } else if (error instanceof BadRequestError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
      } else {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
      }
      throw error;
    }
  }

  async uploadContrattoFirmaFromEmail(token: string, formData: FormData, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      return await this.$api.contratti.uploadFirmaFromEmail(token, formData, { alertType });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Contratto non trovato`, alertType });
      } else if (error instanceof BadRequestError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
      } else {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
      }
      throw error;
    }
  }

  async answerContrattoFirmaFromEmail(id: number, body: { accettato: boolean }, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      return await this.$api.contratti.answerFirmaFromEmail(id, body, { alertType });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Contratto non trovato`, alertType });
      } else if (error instanceof BadRequestError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
      } else {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
      }
      throw error;
    }
  }

  async deleteContratto(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.contratti.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id contratto non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Contratto non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }


}