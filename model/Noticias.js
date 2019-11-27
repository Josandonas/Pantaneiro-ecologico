
// function dataAtualFormatada() {
//     var data = new Date(),
//         dia = data.getDate().toString(),
//         diaF = (dia.length == 1) ? '0' + dia : dia,
//         mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
//         mesF = (mes.length == 1) ? '0' + mes : mes,
//         anoF = data.getFullYear();
//     return diaF + "/" + mesF + "/" + anoF;
// }
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Noticias = new Schema({

    titulo: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    imagem:  {
      type: String,
    },

    video: {
        type: String,
    },
    audio: {
        type: String,  
    },
    data: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("noticias", Noticias);
