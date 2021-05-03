
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, TipoTariffa, TipiTariffaCreateBody, TipiTariffaReplaceBody } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class TipoTariffaHandlerMixin extends Vue {

  /* METHODS */

  async getTipiTariffa(alertType = AlertType.ERROR_ALERT): Promise<TipoTariffa[]> {
    try {
      return await this.$api.tipiTariffa.getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i tipi tariffa`, alertType });
      }
      throw error;
    }
  }

  async createTipoTariffa(body: TipiTariffaCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.tipiTariffa.create(body, { alertType });
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

  async updateTipoTariffa(id: number, body: TipiTariffaReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiTariffa.replace(id, { tipoTariffa: body.tipoTariffa }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id tipo tariffa non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del tipo tariffa non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo tariffa non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteTipoTariffa(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tipiTariffa.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid tipo tariffa non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tipo tariffa non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  getTipiTariffaValues(values: TipoTariffa[], backupValue: TipoTariffa | null): string[] {
    const tipi = values.map((t) => t.tipoTariffa);
    return backupValue ? tipi.filter((value) => value !== backupValue.tipoTariffa) : tipi;
  }
}