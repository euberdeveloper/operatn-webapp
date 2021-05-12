import { RuoloUtente } from "operatn-api-client"
import { UtentiReturned } from "operatn-api-client/api/controllers/index"

export interface State {
    token: string | null;
    user: UtentiReturned | null;
    showMenu: boolean;
    toast: { message: string, color: string } | null;
    errorsQueue: string[];
    errorDialogText: string | null;
    successDialogText: string | null;
    confirmDialog: { text: string; callback: (answer: boolean) => void | Promise<void> } | null;
    darkTheme: boolean;
    primaryColour: string | null;
    roles: RuoloUtente[];
}

export const state: State = {
    token: null,
    user: null,
    showMenu: true,
    toast: null,
    errorsQueue: [],
    errorDialogText: null,
    successDialogText: null,
    confirmDialog: null,
    darkTheme: false,
    primaryColour: null,
    roles: Object.values(RuoloUtente)
}
