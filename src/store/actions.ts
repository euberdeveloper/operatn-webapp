import { ActionTree, ActionContext } from 'vuex'
import { AuthLoginBody } from 'operatn-api-client/api/controllers/auth/index'
import { ApiError, ClientError, InvalidCredentialsError, RequestError, UnknownApiError } from 'operatn-api-client';
import router from '@/router';
import api from '@/plugins/api';

import { State } from './state'
import { Mutations, MutationTypes } from './mutations'

export enum ActionTypes {
    ALERT = 'ALERT',
    SET_TOAST = 'SET_TOAST',
    ADD_ERROR_TO_QUEUE = 'ADD_ERROR_TO_QUEUE',
    SET_ERRORS_QUEUE = 'SET_ERRORS_QUEUE',
    HIDE_INFO = 'HIDE_INFO',
    SHOW_INFO = 'SHOW_INFO',
    SET_INFO_TEXT = 'SET_INFO_TEXT',
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
    [ActionTypes.SET_TOAST]({ commit }: AugmentedActionContext, payload: { message: string, color: string } | null): void;
    [ActionTypes.ALERT]({ dispatch }: AugmentedActionContext, payload: { message: string, alertType?: AlertType }): void;
    [ActionTypes.ADD_ERROR_TO_QUEUE]({ commit }: AugmentedActionContext, text: string): void;
    [ActionTypes.SET_ERRORS_QUEUE]({ commit }: AugmentedActionContext, queue: string[]): void;
    [ActionTypes.HIDE_INFO]({ commit }: AugmentedActionContext): void;
    [ActionTypes.SHOW_INFO]({ commit }: AugmentedActionContext): void;
    [ActionTypes.SET_INFO_TEXT]({ commit }: AugmentedActionContext, text: string | null): void;
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
    [ActionTypes.HANDLE_API_ERROR]({ commit }: AugmentedActionContext, error: { error: Error, config: any }): void;
    [ActionTypes.TOGGLE_DARK_THEME]({ commit }: AugmentedActionContext): void;
    [ActionTypes.CHANGE_PRIMARY_COLOUR]({ commit }: AugmentedActionContext, colour: string | null): void;
    [ActionTypes.RETRIEVE_DARK_THEME]({ commit }: AugmentedActionContext): void;
    [ActionTypes.RETRIEVE_PRIMARY_COLOUR]({ commit }: AugmentedActionContext, colour: string | null): void;
    [ActionTypes.STARTUP]({ commit }: AugmentedActionContext): Promise<void>;
}

export enum AlertType {
    NONE,
    ERROR_ALERT,
    ERRORS_QUEUE,
}

export const actions: ActionTree<State, State> & Actions = {
    [ActionTypes.SET_TOAST]({ commit }, payload) {
        commit(MutationTypes.SET_TOAST, payload);
    },
    [ActionTypes.ALERT]({ dispatch }, { message, alertType }) {
        switch (alertType) {
            case AlertType.ERROR_ALERT:
                dispatch(ActionTypes.SHOW_ERROR_DIALOG, message);
                break;
            case AlertType.ERRORS_QUEUE:
                dispatch(ActionTypes.ADD_ERROR_TO_QUEUE, message);
                break;
            default:
                break;
        }
    },
    [ActionTypes.ADD_ERROR_TO_QUEUE]({ commit }, text) {
        commit(MutationTypes.ADD_ERROR_TO_QUEUE, text);
    },
    [ActionTypes.SET_ERRORS_QUEUE]({ commit }, queue) {
        commit(MutationTypes.SET_ERRORS_QUEUE, queue);
    },
    [ActionTypes.HIDE_INFO]({ commit }) {
        commit(MutationTypes.SET_SHOW_INFO, false);
    },
    [ActionTypes.SHOW_INFO]({ commit }) {
        commit(MutationTypes.SET_SHOW_INFO, true);
    },
    [ActionTypes.SET_INFO_TEXT]({ commit }, text) {
        commit(MutationTypes.SET_INFO_DIALOG_TEXT, text);
    },
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
    [ActionTypes.HANDLE_API_ERROR]({ dispatch }, err) {
        const { error, config } = err;

        if (!config.noLog) {
            console.error(error);
        }

        if (!config.noHandle) {
            const alertType = config.alertType ?? AlertType.ERROR_ALERT;
            if (error instanceof ApiError) {
                if (error.code === 401 && !(error instanceof InvalidCredentialsError)) {
                    dispatch(ActionTypes.ALERT, { message: 'Utente non autenticato', alertType });
                    throw null;
                }
                else if (error.code === 403) {
                    dispatch(ActionTypes.ALERT, { message: `L'utente non ha i permessi per eseguire l'azione`, alertType });
                    throw null;
                }
                else if (error instanceof UnknownApiError) {
                    dispatch(ActionTypes.ALERT, { message: `Errore generico del server`, alertType });
                    throw null;
                }
                else {
                    throw error;
                }
            }
            else if (error instanceof RequestError) {
                dispatch(ActionTypes.ALERT, { message: `Il server non risponde, controllare di essere connessi al WI-FI`, alertType });
                throw null
            }
            else if (error instanceof ClientError) {
                dispatch(ActionTypes.ALERT, { message: `Errore generico del client`, alertType });
                throw null
            }
            else {
                throw error;
            }
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