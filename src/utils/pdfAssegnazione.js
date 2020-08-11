import Vue from 'vue'

const documentDefinition = () => {
	return {
    content: [
      {
        layout: 'noBorders',
        table: {
          widths: [100, 50, '*'],
          body: [
            [
              {
                image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAFcAkADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKA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QL/zyF3Ls/8AQs/rXc6dptlpFhHY6daxWtrEMJFEgVR/ifc8mgDyLRPidqujfE7VvD3ja9jgs97LZzPCsaJhsoxIA+VlPUk4IHTNTfGX4geHm8EXmi2Oo2t/e3+xFS2kEgjUOGLMRkDpgDOeQegr0LxL4I8O+L0jGt6bHcvHkRyglJFHPAZSDjnODx7Vk6H8JvBvh+9jvbPSFkuozlJLmVpdh7EBjgEdjjI9aAMTwxDrngX4ExXFvZCXVbaFrv7LMCQFaQsQQMHIQk465FN8KeOvBfjLw/FqviVdAt9WhJFxHdrGCpB+UoZOSCuOhPPFeqHBGO1cBqXwZ8DanfNdyaP5Ls251tpnjRv+Ag4A+mKAPPIbuP4ofHTTrrSo2bRNDVGEpUqpEbFgQO25yAB3Vc4HNWvjBHP4W+JfhvxssLPZoyRT7BzuRiSCfVkYgf7pr2LQvDmkeGbAWOjWEVpbg5IjzljjGWY8sfck1a1LTLLV7Caw1C1jubWZdskUoyGH+I65HINAHIa18V/CeneFZNXtdZtLqVoi1vbRygyu5HCsn3l7ZyBiuT+Aekvo3g3VPEOo/uY7+QSB5OP3UQb5z7ZZ/wAq6SD4J+A4L0XI0dnwcrFJcSNGD9C3P0JIrtrnTbO60qbS5YF+wzQtbtChKDyyCpUbcYGOOMUAfMmseLbf4o+NRFrmtjRfDFsxaKNidzKDjIAyDIwzyeFGevf2TRfHvw18PaVBpmla1YW9pCMKiq/J7knbkk+p5NS/8KS+Hn/Qvf8Ak7cf/HKP+FJfDz/oXv8AyduP/jlAC/EL4jWvhPwXDq+nvHc3GoqP7P67WDLu3kf3QCD7kgd68k+Hh8HS358WeOfElvd6xLJ5kdtPubyyD99+MFuPlXoox7Y9w1b4eeFtd07TdP1LTDPaaZH5NpH9olXy0wq4yrAtwi8nJ4rJ/wCFJfDz/oXv/J24/wDjlAGxpXxC8J65qUOnaZrdtc3cufLiQNlsAscZHoDXj1zfx/D79oe81LWkdNP1AMyXBG4KsgHzDHZWBU9wAeDXq+i/C7wd4d1iDVdL0b7PewZ8uX7TM+0kFTwzkcgkdO9bPiDwzo3iiy+ya1p8V5CDld2QyH1Vhyp+hFAHK+NviR4VsPB+oPHrFhfS3NtJFBb20yytIzKVGQCcL6k+/fisj9n7R7vTvAU11co8aX10ZoVYYygVV3Y6jJB/AA9Dmtmw+C/gSwuxcroxndWDItxO7op91JwR7Nmu8REjRURVVVAUKowAOwx+FAEtFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/9k=',
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
                        text: 'VAL',
                        bold: true,
                        fontSize: 10,
                      },
                      ' Cognome',
                      {
                        text: 'VAL',
                        bold: true,
                        fontSize: 10,
                      },
                      ' Nome',
                      {
                        text: 'VAL',
                        bold: true,
                        fontSize: 10,
                      },
                    ],
                    [
                      'Verbale n.',
                      {
                        text: 'VAL',
                        bold: true,
                        fontSize: 10,
                      },
                      ' Codice',
                      {
                        text: 'VAL',
                        bold: true,
                        fontSize: 10,
                      }, '', ''
                    ],
                  ]
                },
              },{
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
                        text: 'VAL',
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
            widths:['*','*'],
            alignment: "center",
          body: [
            [
              ['L\'INCARICATO/A',' ',' ',' ','......................................'],
              ['IL/LA ASSEGNATARIO/A','NOME COGNOME',' ',' ','......................................'],
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
      {ul:[
          ' dati forniti saranno trattati nel rispetto dell’art.5 del Reg. UE ed esclusivamente con riferimento alla procedura connessa alla presente documentazione, attraverso supporto cartaceo e/o informatico;',
          'il conferimento dei dati richiesti è obbligatorio per dar corso alla procedura;',
          'il Titolare del trattamento è Opera Universitaria di Trento (via della Malpensada 82/A - 38123 Trento - 0461217411);',
          'in ogni momento Lei potrà esercitare i suoi diritti nei confronti del titolare del trattamento, secondo quanto stabilito dagli artt. 15-22 del Reg. UE 2016/679.',
          
      ]},
      'Per maggiori dettagli, è possibile consultare l’informativa completa al sito www.operauni.tn.it - sezione “privacy policy”.',
      ' ',
      "Preso atto dell'informativa di cui sopra il/la sottoscritto/a acconsente al trattamento dei dati personali ai sensi dell’articolo 13 del D. Lgs. 196/2003 e dell’articolo 13 del Regolamento UE 2016/679.",
      {
        layout: 'noBorders',
        table: {
            widths:['*','*'],
            alignment: "center",
          body: [
            [
              [],
              ['NOME COGNOME',' ','......................................'],
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

export default (contratto) => {
	let pdfMake = require("pdfmake/build/pdfmake.js");
	if (pdfMake.vfs == undefined) {
		let pdfFonts = require("pdfmake/build/vfs_fonts.js");
		pdfMake.vfs = pdfFonts.pdfMake.vfs;
	}
	let name = `${contratto.nome +
		"_" +
		contratto.cognome}-comunicazione-assegnazione-fabbricato.pdf`;

	Vue.prototype.$api.get(`/person/signer?date=${contratto.check_in}`).then((res) => {
		pdfMake
			.createPdf(
				documentDefinition(
					res.data[0],
					contratto
				)
			)
			.download(name);
	}, (err) => {
		console.log(err)
	})
}