const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PontoColeta = new Schema({

    nome: {
        type: String,
        required: true


    },
    bairro: {
        type: String,
        required: true

    },
    rua: {
        type: String,
        required: true

    },
    numero: {
        type: Number,
        required: true

    },
    horarioAtendimento :{
     type: String   
        
    },
    itens: [String],
    
    categoria: {

        type: Schema.Types.ObjectId,
        ref: "categorias",
        required:true

    },

    data: {

        type: Date,
        default: Date.now()

    }

});

mongoose.model("pontocoleta", PontoColeta);