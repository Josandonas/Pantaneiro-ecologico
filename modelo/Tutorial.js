const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tutorial = new Schema({
    titulo: {
        type: String,
        required: true
    },
    subtitulo: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    },
    texto: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    imagem: {
        type: String,
    },
    video: {
        type: String,
    },
    audio: {
        type: String,
    }        
});

mongoose.model("Tutorial", tutorial);