import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ContrattiReturned } from 'operatn-api-client';

import contrattoDefinition from './contrattoDefinition';

if (pdfMake.vfs === undefined) {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
}

export function pdfContratto(contratto: ContrattiReturned): pdfMake.TCreatedPdf {
    return pdfMake.createPdf(contrattoDefinition(contratto));
}

export function pdfGetBlob(pdf: pdfMake.TCreatedPdf): Promise<Blob> {
    return new Promise((resolve) => {
        pdf.getBlob(resolve)
    });
}