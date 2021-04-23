import { MutationTree } from 'vuex'
import { UtentiReturned } from 'operatn-api-client/api/controllers/index';

import { State } from './state'

export enum MutationTypes {
    SET_ERROR_DIALOG_TEXT = 'SET_ERROR_DIALOG_TEXT',
    SET_CONFIRM_DIALOG = 'SET_CONFIRM_DIALOG',
    SET_USER = 'SET_USER',
    SET_TOKEN = 'SET_TOKEN',
    SET_SHOW_MENU = 'SET_SHOW_MENU',
    SET_DARK_THEME = 'SET_DARK_THEME',
    SET_PRIMARY_COLOUR = 'SET_PRIMARY_COLOUR',
}

export interface Mutations<S = State> {
    [MutationTypes.SET_ERROR_DIALOG_TEXT](state: S, text: string | null): void;
    [MutationTypes.SET_CONFIRM_DIALOG](state: S, value: { text: string; callback: (answer: boolean) => void | Promise<void> } | null): void;
    [MutationTypes.SET_USER](state: S, user: UtentiReturned | null): void;
    [MutationTypes.SET_TOKEN](state: S, token: string | null): void;
    [MutationTypes.SET_SHOW_MENU](state: S, show: boolean): void;
    [MutationTypes.SET_DARK_THEME](state: S, token: boolean): void;
    [MutationTypes.SET_PRIMARY_COLOUR](state: S, token: string | null): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_ERROR_DIALOG_TEXT](state, text) {
        state.errorDialogText = text;
    },
    [MutationTypes.SET_CONFIRM_DIALOG](state, value) {
        state.confirmDialog = value;
    },
    [MutationTypes.SET_USER](state, user) {
        state.user = user;
    },
    [MutationTypes.SET_TOKEN](state, token) {
        state.token = token;
    },
    [MutationTypes.SET_SHOW_MENU](state, show) {
        state.showMenu = show;
    },
    [MutationTypes.SET_DARK_THEME](state, isDark) {
        state.darkTheme = isDark;
    },
    [MutationTypes.SET_PRIMARY_COLOUR](state, colour) {
        state.primaryColour = colour;
    }
}