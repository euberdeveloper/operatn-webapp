
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, Tariffa, TariffeCreateBody, TariffeReplaceBody, TariffeIncludeParams } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class TariffaHandlerMixin extends Vue {

  /* METHODS */

  async getTariffe(params: TariffeIncludeParams = {}, alertType = AlertType.ERROR_ALERT): Promise<Tariffa[]> {
    try {
      return await this.$api.tariffe.getAll(params, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Impossibile caricare i tariffe`, alertType });
      }
      throw error;
    }
  }

  async createTariffa(body: TariffeCreateBody, alertType = AlertType.ERROR_ALERT): Promise<number> {
    try {
      const id = await this.$api.tariffe.create({ ...body, prezzoCanoni: +body.prezzoCanoni, prezzoConsumi: +body.prezzoConsumi }, { alertType });
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

  async updateTariffa(id: number, body: TariffeReplaceBody, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      console.log({
        idTipoFabbricato: body.idTipoFabbricato,
        idUtilizzoStanza: body.idUtilizzoStanza,
        idTipoOspite: body.idTipoOspite,
        idTipoTariffa: body.idTipoTariffa,
        prezzoCanoni: +body.prezzoCanoni,
        prezzoConsumi: +body.prezzoConsumi
      })
      await this.$api.tariffe.replace(id, {
        idTipoFabbricato: body.idTipoFabbricato,
        idUtilizzoStanza: body.idUtilizzoStanza,
        idTipoOspite: body.idTipoOspite,
        idTipoTariffa: body.idTipoTariffa,
        prezzoCanoni: +body.prezzoCanoni,
        prezzoConsumi: +body.prezzoConsumi
      }, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Id tariffa non valido`, alertType });
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Dati da aggiornare del tariffa non validi`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tariffa non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteTariffa(id: number, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.tariffe.delete(id, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Uid tariffa non valido`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Tariffa non trovato`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Richiesta non valida.`, alertType });
        }
      }
      throw error;
    }
  }
}