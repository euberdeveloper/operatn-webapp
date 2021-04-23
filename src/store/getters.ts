import { getRoleIcon } from '@/utils';
import { RuoloUtente } from 'operatn-api-client';
import { GetterTree } from 'vuex'
import { State } from './state'

export type Getters = {
  role(state: State): RuoloUtente | null;
  roleIcon(state: State): string | null;
}

export const getters: GetterTree<State, State> & Getters = {
  role: (state) => {
    return state.user?.ruolo ?? null;
  },
  roleIcon: (state) => {
    return getRoleIcon(state.user?.ruolo);
  }
}