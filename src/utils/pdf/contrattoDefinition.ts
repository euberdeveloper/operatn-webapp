import { ContrattiReturned } from 'operatn-api-client'
import { TDocumentDefinitions } from 'pdfmake/interfaces'
import logoOpera from './logoOpera'

export default function contrattoDefinition(contratto: ContrattiReturned): TDocumentDefinitions {
    return {
        content: [
            {
                layout: 'noBorders',
                table: {
                    widths: [100, 50, '*'],
                    body: [
                        [
                            {
                                image: logoOpera,
                                width: 150,
                            },
                            {},
                            [{
                                layout: 'noBorders',
                                table: {
                                    body: [
                                        [
                                            'Id',
                                            {
                                                text: contratto.id,
                                                bold: true,
                                                fontSize: 10,
                                            },
                                            ' Cognome',
                                            {
                                                text: contratto.contrattiSuOspite?.[0].ospite?.persona?.cognome ?? '',
                                                bold: true,
                                                fontSize: 10,
                                            },
                                            ' Nome',
                                            {
                                                text: contratto.contrattiSuOspite?.[0].ospite?.persona?.nome ?? '',
                                                bold: true,
                                                fontSize: 10,
                                            },
                                        ],
                                        [
                                            'Verbale n.',
                                            {
                                                text: 'XXXXXXXXX',
                                                bold: true,
                                                fontSize: 10,
                                            },
                                            ' Codice',
                                            {
                                                text: 'XXXXXXXXX',
                                                bold: true,
                                                fontSize: 10,
                                            }, '', ''
                                        ],
                                    ]
                                },
                            }, {
                                layout: 'noBorders',
                                table: {
                                    body: [
                                        [
                                            'Tipo Assegnazione',
                                            {
                                                text: 'VAL',
                                                bold: true,
                                                fontSize: 10,
                                            }
                                        ],
                                        [
                                            'Tipo Utente:',
                                            {
                                                text: contratto.tariffa?.tipoOspite?.tipoOspite ?? '',
                                                bold: true,
                                                fontSize: 10,
                                            }
                                        ],
                                    ],
                                },
                            }],
                        ],
                    ],
                },
            },
            {
                layout: 'noBorders',
                table: {
                    widths: ['*'],
                    body: [
                        ['Verbale di assegnazione del posto alloggio\nASSEGNATO AI SENSI DELLA L.P. N. 9 DEL 24/05/1991 ANNO accademico VAL'],
                    ],
                },
                alignment: "center",
                margin: [0, 5, 0, 5]
            },
            `Il VAL_GIORNO presso gli uffici dell'Opera Universitaria di Trento, alla presenza dell’incaricato dell’Ente, si è presentato/a il/la signor/a VAL_NOME, in qualità di "assegnatario/a" di posto alloggio per procedere agli adempimenti inerenti all’assegnazione del posto letto per l'anno accademico VAL_ANNO`,
            ` `,
            `A tal fine l'assegnatario/a:`,
            ` `,
            `Ha preso in visione ed accetta in maniera incondizionata le “ Disposizioni per la fruizione dei servizi abitativi dell'Opera Universitaria”,  approvate con Delibera n. 10 di data 27 maggio 2016 e pubblicate sul sito dell'Opera Universitaria e se assegnatario/a presso le Case Convenzionate anche il relativo Regolamento;`,
            ` `,
            `L’accesso al posto alloggio, in riferimento alle diverse regole di accesso, è subordinato al versamento del Deposito Cauzionale infruttifero;`,
            ` `,
            `La tariffa mensile come Tipo Utente  “BENEFICIARIO DI POSTO ALLOGGIO“ per la stanza “Doppia” è la seguente:
      importo canone € 120, importo consumi € 60, Totale € 180; è a carico di CAMPOS SANTOS DIEGO;`,
            ` `,
            `Le modalità di pagamento delle rette alloggio e del deposito cauzionale sono indicate sul sito dell’Opera Universitaria www.operauni.tn.it.`,
            ` `,
            `L’assegnatario/a prende atto che il posto alloggio è privo di servizi accessori quali portierato notturno, sorveglianza notturna, presidio antincendio notturno, in quanto non richiesti per legge, ad esclusione dello Studentato di S. Bartolameo e delle strutture in convenzione;`,
            ` `,
            `Preso atto della richiesta si procede all’assegnazione del posto alloggio sito nella Struttura a gestione  “Diretta” :`,
            ` `,
            {
                text: `V/MALPENSADA 90-S.BARTOLAMEO interno    piano SECONDO PIANO  
      stanza Doppia numero FB3C52`,
                bold: true,
                fontSize: 10,
            },
            ` `,
            `Il periodo di assegnazione per l’ a. a. VAL_ANNO è:`,
            ` `,
            {
                text: 'VAL',
                bold: true,
                fontSize: 10,
            },
            ` `,
            `Di quanto sopra eseguito e verbalizzato i signori sottoscritti attestano la veridicità e completezza.
          Il presente verbale è redatto in due originali, dei quali uno viene consegnato all'assegnatario/a.`,
            {//Firme
                layout: 'noBorders',
                table: {
                    widths: ['*', '*'],
                    // alignment: "center",
                    body: [
                        [
                            ['L\'INCARICATO/A', ' ', ' ', ' ', '......................................'],
                            ['IL/LA ASSEGNATARIO/A', 'NOME COGNOME', ' ', ' ', '......................................'],
                        ]
                    ]
                },
                margin: [0, 10, 0, 5]
            },
            {
                text: 'Ai sensi dell’art. 13 del D.Lgs. 196/2003 e dell’art. 13 del Reg. UE 2016/679 “Regolamento in materia di trattamento dei dati personali”,\nsi informa che:',
                bold: true,
                fontSize: 10,
            },
            ' ',
            {
                ul: [
                    ' dati forniti saranno trattati nel rispetto dell’art.5 del Reg. UE ed esclusivamente con riferimento alla procedura connessa alla presente documentazione, attraverso supporto cartaceo e/o informatico;',
                    'il conferimento dei dati richiesti è obbligatorio per dar corso alla procedura;',
                    'il Titolare del trattamento è Opera Universitaria di Trento (via della Malpensada 82/A - 38123 Trento - 0461217411);',
                    'in ogni momento Lei potrà esercitare i suoi diritti nei confronti del titolare del trattamento, secondo quanto stabilito dagli artt. 15-22 del Reg. UE 2016/679.',

                ]
            },
            'Per maggiori dettagli, è possibile consultare l’informativa completa al sito www.operauni.tn.it - sezione “privacy policy”.',
            ' ',
            "Preso atto dell'informativa di cui sopra il/la sottoscritto/a acconsente al trattamento dei dati personali ai sensi dell’articolo 13 del D. Lgs. 196/2003 e dell’articolo 13 del Regolamento UE 2016/679.",
            {
                layout: 'noBorders',
                table: {
                    widths: ['*', '*'],
                    // alignment: "center",
                    body: [
                        [
                            [],
                            ['NOME COGNOME', ' ', '......................................'],
                        ]
                    ]
                },
                margin: [0, 10, 0, 5]
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                margin: [0, 5, 0, 0]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
        defaultStyle: {
            font: 'Roboto',
            fontSize: 9
        }
    }
}
