import { RuoloUtente } from "operatn-api-client";

export * as pdf from './pdf';

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

export function downloadBlob(blob: Blob, name: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
}