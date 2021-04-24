import { RuoloUtente } from "operatn-api-client";

export function getRoleIcon(role?: RuoloUtente | null): string | null {
    switch (role) {
        case RuoloUtente.ROOT:
            return 'mdi-powershell';
        case RuoloUtente.ADMIN:
            return 'mdi-account-supervisor';
        case RuoloUtente.CONTROLLO_ALLOGGI:
            return 'mdi-home-search';
        case RuoloUtente.PORTINERIA:
            return 'mdi-script-text-key';
        case RuoloUtente.RAGIONERIA:
            return 'mdi-head-snowflake';
        case RuoloUtente.SPORTELLO:
            return 'mdi-desk';
        default:
            return null;
    }
}