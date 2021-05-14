import { Piano, RuoloUtente } from "operatn-api-client"
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
    piani: { piano: Piano, label: string }[];
    sigleCausali: string[];
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
    roles: Object.values(RuoloUtente),
    piani: [
        {
            piano: Piano.MANSARDA,
            label: 'MANSARDA'
        },
        {
            piano: Piano.PIANO_RIALZATO,
            label: 'PIANO RIALZATO'
        },
        {
            piano: Piano.PRIMO_PIANO,
            label: 'PRIMO PIANO'
        },
        {
            piano: Piano.SECONDO_PIANO,
            label: 'SECONDO PIANO'
        },
        {
            piano: Piano.TERZO_PIANO,
            label: 'TERZO PIANO'
        },
        {
            piano: Piano.QUARTO_PIANO,
            label: 'QUARTO PIANO'
        },
        {
            piano: Piano.QUINTO_PIANO,
            label: 'QUINTO PIANO'
        },
        {
            piano: Piano.SESTO_PIANO,
            label: 'SESTO PIANO'
        },
        {
            piano: Piano.SETTIMO_PIANO,
            label: 'SETTIMO PIANO'
        }
    ],
    sigleCausali: [
        'B',
        'C',
        'F',
        'P'
    ]
}
