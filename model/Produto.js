const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Produto = new Schema({

    titulo: {
        type: String,
        required: true
    },
    subtitulo: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    },
    textocom: {
        type: String,
    },
    imagem:  {
      type: String,
    },
    video: {
        type: String,
    },
    audio: {
        type: String,
    }
});

mongoose.model("produto", Produto);
