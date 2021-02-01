//carregando modulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require("connect-flash");

require("./model/Categoria");
const Categoria = mongoose.model("categorias");

require("./model/PontoColeta");
const PontoColeta = mongoose.model("pontocoleta");

require("./model/Noticias");
const Noticias = mongoose.model("noticias");

require("./model/Tutorial");
const Tutorial = mongoose.model("Tutorial");

require("./model/Produto");//produto
const Produto = mongoose.model("produto");//produto

const Sobre = require("./views/sobre");

// //configuracoes
// app.use(fileUpload());

//sessao
app.use(session({
   secret: "sustentabilidade",
   resave: true,
   saveUninitialized: true
}));
app.use(flash());

//middleware
app.use((req, res, next) => {
   res.locals.success_msg = req.flash("success_msg");
   res.locals.error_msg = req.flash("error_msg");
   next();
});

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//mongoose
//mongodb+srv://pantanal:123doze@cluster0-neoqm.mongodb.net/test?retryWrites=true&w=majority
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/pantaneiroecologico', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).then(() => {
   console.log("conectado ao mongo");
}).catch((err) => {
   console.log("erro ao se conectar" + err);
});

// mongoose.connect('mongodb://localhost:27017/pantaneiroecologico', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).then(() => {
//    console.log("conectado ao mongo");
// }).catch((err) => {
//    console.log("erro ao se conectar" + err);
// });

//public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + '/public'));

app.get("/categorias", (req, res) => {
   Categoria.find().then((categorias) => {
      res.render("categorias/index", { categorias: categorias });
   }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno ao listar as categorias");
      res.redirect("/");
   });
});

// esse eh do ponto de coleta
app.get("/categorias/:slug", (req, res) => {
   Categoria.findOne({ slug: req.params.slug }).then((categoria) => {
      if (categoria) {
         PontoColeta.find({ categoria: categoria._id }).then((pontocoleta) => {
            res.render("categorias/pontocoleta", { pontocoleta: pontocoleta, categoria: categoria });
         }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar os posts");
            res.redirect("/");
         });
      } else {
         req.flash("error_msg", "Esta categoria nao existe");
         res.redirect("/");
      }
   }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno ao carregar a pagina desta categoria");
      res.redirect("/");
   });
});

app.get("/", (req, res) => {
   //lista as categorias
   Noticias.find().sort({ date: 'desc' }).then((noticias) => {
      res.render("index", { noticias: noticias });
   }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as categorias");
      res.redirect("/");
   });
});

app.get("/tutorial", (req, res) => {
   //lista as categorias
   Tutorial.find().sort({ date: 'desc' }).then((tutorial) => {
      res.render("tutoriais/index", { tutorial: tutorial });
   }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as categorias");
      res.redirect("/");
   });
});
app.get("/pontocoletas", (req, res) => {
   //lista as categorias
   PontoColeta.find().sort({ date: 'desc' }).then((pontocoleta) => {

      Categoria.find().then((categorias) => {

         res.render("pontocoleta/index", { categorias: categorias, pontocoleta: pontocoleta });
      }).catch((err) => {
         req.flash("error_msg", "Houve um erro ao listar as categorias");
         res.redirect("/admin/pontocoleta");
      });
   }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar um formulario de edicao");
      res.redirect("/admin/pontocoleta");
   });
});

app.get("/404", (req, res) => {
   res.send("erro 404!");
});


// ***********************  Produtos ********************************//

app.get("/produto", (req, res) => {
   //lista dos produto
   Produto.find().sort({ date: 'desc' }).then((produto) => {
      res.render("produto/index", { produto: produto });
   }).catch((err) => {
      req.flash("error_msg", "Houve Erro");
      res.redirect("/admin");
   });
});
// *******************************************************//

app.get("/sobre", (req, res) => {
   res.render("sobre/index");
});

app.get("/404", (req, res) => {
   res.send("erro 404!");
});

app.get("/noticias", (req, res) => {
   //lista as noticias /noticias
   Noticias.find().sort({ date: 'desc' }).then((noticias) => {
      res.render("noticias/index", { noticias: noticias });
   }).catch((err) => {
      req.flash("error_msg", "Houve");
      res.redirect("/admin");
   });
});

app.get("/noticias", (req, res) => {
   //lista as noticias /noticias
   Noticias.find().sort({ date: 'asc' }).then((noticias) => {
      res.render("admin/noticias", { noticias: noticias });
   }).catch((err) => {
      req.flash("error_msg", "Houve");
      res.redirect("/admin");
   });
});

app.get("/homeNoticias/:id", (req, res) => {
   Noticias.findOne({ _id: req.params.id }).then((noticias) => {
      if (noticias) {
         res.render("noticias/homeNoticias", { noticias: noticias })
      } else {
         req.flash("error_msg", "N existe");
         res.redirect("/");
      }
   }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/");
   });
});

app.get("/homeTutorial/:id", (req, res) => {
   //metodo responsavel por buscar o id na collection e extrair os dados e rendenerizar no moemnto de editar
   Tutorial.findOne({ _id: req.params.id }).then((tutorial) => {
      //rendeneriza os dados na página de edicao
      res.render("tutoriais/homeTutorial", { tutorial: tutorial });
      //caso der merda
   }).catch((err) => {
      //mesangem de erro caso der ruim
      req.flash("error_msg", "O tutorial Nao Existe");
      //redirecionamento para area de gerenciamento
      res.redirect("/");
   });
});

// *********************** Slug Produtos ********************************//

app.get("/homeProduto/:id", (req, res) => {
   Produto.findOne({ _id: req.params.id }).then((produto) => {
      if (produto) {
         res.render("produto/homeProduto", { produto: produto })
      } else {
         req.flash("error_msg", "Não existe");
         res.redirect("/");
      }
   }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/");
   });
});
app.get("/homeProduto/:id", (req, res) => {
   //metodo responsavel por buscar o id na collection e extrair os dados e renderizar no momento de editar
   Produto.findOne({ _id: req.params.id }).then((produto) => {
      //renderiza os dados na página de edicao
      res.render("produto/homeProduto", { produto: produto });
      //caso der merda
   }).catch((err) => {
      //mesangem de erro caso der ruim
      req.flash("error_msg", "O Produto Não Existe");
      //redirecionamento para area de gerenciamento
      res.redirect("/");
   });
});

// ******************************************************//

app.use('/admin', admin);
//outros
const porta = process.env.Port || 8089;
//em formato de arrow function
app.listen(porta, () => {

   console.log("servidor rodando!");

});