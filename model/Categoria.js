const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Categoria = new Schema({

nome:{
    type: String,
    required:true
},

slug: {

type:String,
required:true

},

date: {

type:Date,
default: Date.now()

}


});

// categorias vai ser o nome da tabela no banco de dados
mongoose.model("categorias",Categoria);