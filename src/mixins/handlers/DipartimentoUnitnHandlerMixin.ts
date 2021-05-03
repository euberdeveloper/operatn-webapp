
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, DipartimentoUnitn, DipartimentiUnitnCreateBody, DipartimentiUnitnUpdateBody } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class DipartimentoUnitnHandlerMixin extends Vue {
  /* METHODS */

  async getDipartimentiUnitn(alertType = AlertType.ERROR_ALERT): Promise<DipartimentoUnitn[]> {
    try {
      return await this.$api.dipartimentiUnitn.getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i dipartimenti unitn`, alertType });
      }
      throw error;
    }
  }

  async createDipartimentoUnitn(body: DipartimentiUnitnCreateBody, alertType = AlertType.ERROR_ALERT): Promise<string> {
    try {
      const codice = await this.$api.dipartimentiUnitn.create(body, { alertType });
      return codice;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati del dipartimento unitn da creare non validi`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida`, alertType });
        } else {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore del server`, alertType });
        }
      }
      throw error;
    }
  }

  async updateDipartimentoUnitn(codice: string, body: DipartimentiUnitnUpdateBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.dipartimentiUnitn.update(codice, {
        codice: body.codice ?? codice,
        sigla: body.sigla,
        nome: body.nome,
        provincia: body.provincia,
        comune: body.comune,
        cap: body.cap,
        indirizzo: body.indirizzo,
        nCivico: body.nCivico,
        sitoWeb: body.sitoWeb
      }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id dipartimento unitn non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del dipartimento unitn non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dipartimento unitn non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteDipartimentoUnitn(codice: string, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.dipartimentiUnitn.delete(codice, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid dipartimento unitn non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dipartimento unitn non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getDipartimentiUnitnCodici(values: DipartimentoUnitn[], backupValue: DipartimentoUnitn | null): string[] {
    const tipi = values.map((t) => t.codice);
    return backupValue ? tipi.filter((value) => value !== backupValue.codice) : tipi;
  }

  getDipartimentiUnitnSigle(values: DipartimentoUnitn[], backupValue: DipartimentoUnitn | null): string[] {
    const tipi = values.map((t) => t.sigla);
    return backupValue ? tipi.filter((value) => value !== backupValue.sigla) : tipi;
  }

  getDipartimentiUnitnNomi(values: DipartimentoUnitn[], backupValue: DipartimentoUnitn | null): string[] {
    const tipi = values.map((t) => t.nome);
    return backupValue ? tipi.filter((value) => value !== backupValue.nome) : tipi;
  }
}