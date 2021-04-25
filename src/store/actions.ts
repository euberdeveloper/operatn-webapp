import { ActionTree, ActionContext } from 'vuex'
import { AuthLoginBody } from 'operatn-api-client/api/controllers/auth/index'
import { ApiError, ClientError, InvalidCredentialsError, RequestError, UnknownApiError } from 'operatn-api-client';
import router from '@/router';
import api from '@/plugins/api';

import { State } from './state'
import { Mutations, MutationTypes } from './mutations'

export enum ActionTypes {
    HIDE_ERROR_DIALOG = 'HIDE_ERROR_DIALOG',
    SHOW_ERROR_DIALOG = 'SHOW_ERROR_DIALOG',
    HIDE_SUCCESS_DIALOG = 'HIDE_SUCCESS_DIALOG',
    SHOW_SUCCESS_DIALOG = 'SHOW_SUCCESS_DIALOG',
    HIDE_CONFIRM_DIALOG = 'HIDE_CONFIRM_DIALOG',
    SHOW_CONFIRM_DIALOG = 'SHOW_CONFIRM_DIALOG',
    SET_TOKEN = 'SET_TOKEN',
    FIRST_LOGIN = 'FIRST_LOGIN',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    TOGGLE_MENU = 'TOGGLE_MENU',
    HANDLE_API_ERROR = 'HANDLE_API_ERROR',
    TOGGLE_DARK_THEME = 'TOGGLE_DARK_THEME',
    CHANGE_PRIMARY_COLOUR = 'CHANGE_PRIMARY_COLOUR',
    RETRIEVE_DARK_THEME = 'RETRIEVE_DARK_THEME',
    RETRIEVE_PRIMARY_COLOUR = 'RETRIEVE_PRIMARY_COLOUR',
    STARTUP = 'STARTUP',
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>

export interface Actions {
    [ActionTypes.HIDE_ERROR_DIALOG]({ commit }: AugmentedActionContext): void;
    [ActionTypes.SHOW_ERROR_DIALOG]({ commit }: AugmentedActionContext, text: string): void;
    [ActionTypes.HIDE_SUCCESS_DIALOG]({ commit }: AugmentedActionContext): void;
    [ActionTypes.SHOW_SUCCESS_DIALOG]({ commit }: AugmentedActionContext, text: string): void;
    [ActionTypes.HIDE_CONFIRM_DIALOG]({ commit }: AugmentedActionContext): void;
    [ActionTypes.SHOW_CONFIRM_DIALOG]({ commit }: AugmentedActionContext, value: { text: string; callback: (answer: boolean) => void | Promise<void> } | null): void;
    [ActionTypes.SET_TOKEN]({ commit }: AugmentedActionContext, token: string | null): void;
    [ActionTypes.FIRST_LOGIN]({ commit }: AugmentedActionContext): Promise<void>;
    [ActionTypes.LOGIN]({ commit }: AugmentedActionContext, body: AuthLoginBody): Promise<void>;
    [ActionTypes.LOGOUT]({ commit }: AugmentedActionContext): void;
    [ActionTypes.TOGGLE_MENU]({ commit }: AugmentedActionContext): void;
    [ActionTypes.HANDLE_API_ERROR]({ commit }: AugmentedActionContext, error: Error): void;
    [ActionTypes.TOGGLE_DARK_THEME]({ commit }: AugmentedActionContext): void;
    [ActionTypes.CHANGE_PRIMARY_COLOUR]({ commit }: AugmentedActionContext, colour: string | null): void;
    [ActionTypes.RETRIEVE_DARK_THEME]({ commit }: AugmentedActionContext): void;
    [ActionTypes.RETRIEVE_PRIMARY_COLOUR]({ commit }: AugmentedActionContext, colour: string | null): void;
    [ActionTypes.STARTUP]({ commit }: AugmentedActionContext): Promise<void>;
}

export const actions: ActionTree<State, State> & Actions = {
    [ActionTypes.HIDE_ERROR_DIALOG]({ commit }) {
        commit(MutationTypes.SET_ERROR_DIALOG_TEXT, null);
    },
    [ActionTypes.SHOW_ERROR_DIALOG]({ commit }, text) {
        commit(MutationTypes.SET_ERROR_DIALOG_TEXT, text);
    },
    [ActionTypes.HIDE_SUCCESS_DIALOG]({ commit }) {
        commit(MutationTypes.SET_SUCCESS_DIALOG_TEXT, null);
    },
    [ActionTypes.SHOW_SUCCESS_DIALOG]({ commit }, text) {
        commit(MutationTypes.SET_SUCCESS_DIALOG_TEXT, text);
    },
    [ActionTypes.HIDE_CONFIRM_DIALOG]({ commit }) {
        commit(MutationTypes.SET_CONFIRM_DIALOG, null);
    },
    [ActionTypes.SHOW_CONFIRM_DIALOG]({ commit }, value) {
        commit(MutationTypes.SET_CONFIRM_DIALOG, value);
    },
    [ActionTypes.SET_TOKEN]({ commit }, token) {
        commit(MutationTypes.SET_TOKEN, token);
        api.token = token;

        if (token) {
            localStorage.setItem('apiToken', token);
        }
        else {
            localStorage.removeItem('apiToken');
        }
    },
    async [ActionTypes.FIRST_LOGIN]({ commit, dispatch }) {
        const token = localStorage.getItem('apiToken');
        if (token) {
            try {
                dispatch(ActionTypes.SET_TOKEN, token);
                const utente = await api.utenti.getMe();
                commit(MutationTypes.SET_USER, utente);
            }
            catch (error) {
                dispatch(ActionTypes.SET_TOKEN, null);
                console.warn('Get user me failed', error);
            }
        }
    },
    async [ActionTypes.LOGIN]({ commit, dispatch }, body) {
        const { token, user } = await api.auth.login(body);
        dispatch(ActionTypes.SET_TOKEN, token);
        commit(MutationTypes.SET_USER, user);
    },
    [ActionTypes.LOGOUT]({ commit, dispatch }) {
        dispatch(ActionTypes.SET_TOKEN, null);
        commit(MutationTypes.SET_USER, null);
        router.push('/');
    },
    [ActionTypes.TOGGLE_MENU]({ commit, state }) {
        commit(MutationTypes.SET_SHOW_MENU, !state.showMenu);
    },
    [ActionTypes.HANDLE_API_ERROR]({ dispatch }, error) {
        console.error(error);
        if (error instanceof ApiError) {
            if (error.code === 401 && !(error instanceof InvalidCredentialsError)) {
                dispatch(ActionTypes.SHOW_ERROR_DIALOG, 'Utente non autenticato');
                throw null;
            }
            else if (error.code === 403) {
                dispatch(ActionTypes.SHOW_ERROR_DIALOG, `L'utente non ha i permessi per eseguire l'azione`);
                throw null;
            }
            else if (error instanceof UnknownApiError) {
                dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Errore generico del server`);
                throw null;
            }
            else {
                throw error;
            }
        }
        else if (error instanceof RequestError) {
            dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Il server non risponde, controllare di essere connessi al WI-FI`);
            throw null
        }
        else if (error instanceof ClientError) {
            dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Errore generico del client`);
            throw null
        }
        else {
            throw error;
        }
    },
    [ActionTypes.TOGGLE_DARK_THEME]({ commit, state }) {
        if (state.darkTheme) {
            localStorage.removeItem('isDarkTheme');
        }
        else {
            localStorage.setItem('isDarkTheme', 'true');
        }

        commit(MutationTypes.SET_DARK_THEME, !state.darkTheme);
    },
    [ActionTypes.CHANGE_PRIMARY_COLOUR]({ commit }, colour) {
        commit(MutationTypes.SET_PRIMARY_COLOUR, colour);

        if (colour) {
            localStorage.setItem('primaryColour', colour);
        }
        else {
            localStorage.removeItem('primaryColour');
        }
    },
    [ActionTypes.RETRIEVE_DARK_THEME]({ commit }) {
        const isDarkTheme = localStorage.getItem('isDarkTheme') !== null;
        commit(MutationTypes.SET_DARK_THEME, isDarkTheme);
    },
    [ActionTypes.RETRIEVE_PRIMARY_COLOUR]({ commit }) {
        const primaryColour = localStorage.getItem('primaryColour');
        commit(MutationTypes.SET_PRIMARY_COLOUR, primaryColour);
    },
    async [ActionTypes.STARTUP]({ dispatch }) {
        await dispatch(ActionTypes.FIRST_LOGIN);
        dispatch(ActionTypes.RETRIEVE_DARK_THEME);
        dispatch(ActionTypes.RETRIEVE_PRIMARY_COLOUR);
    }
}