
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
const fileUpload = require("express-fileupload");

require("./modelo/Postagem");
const Postagem = mongoose.model("postagens");

require("./modelo/Categoria");
const Categoria = mongoose.model("categorias");

require("./modelo/PontoColeta");
const PontoColeta = mongoose.model("pontocoleta");

require("./modelo/Noticias");
const Noticias = mongoose.model("noticias");

require("./modelo/Tutorial");
const Tutorial = mongoose.model("Tutorial");

require("./modelo/Produto");//produto
const Produto = mongoose.model("produto");//produto
const Sobre = require("./views/sobre");

//configuracoes
app.use(fileUpload());

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
//'mongodb+srv://Javeiro:Javeiro1996@cluster0-gdgsj.mongodb.net/pantaneiroecologico?retryWrites=true&w=majority',{useNewUrlParser:true}
//"mongodb://localhost/pantaneiroecologico"
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/pantaneiroecologico', { useNewUrlParser: true }).then(() => {
   console.log("conectado ao mongo");
}).catch((err) => {
   console.log("erro ao se conectar" + err);
});


//public
app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(__dirname + '/public'));


app.get("/postagem/:slug", (req, res) => {

   Postagem.findOne({ slug: req.params.slug }).then((postagem) => {
      if (postagem) {
         res.render("postagem/index", { postagem: postagem });

      } else {

         req.flash("error_msg", "Esta postagem nao existe");
         res.redirect("/");

      }


   }).catch((err) => {

      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/");

   });

});


app.get("/categorias", (req, res) => {
    

   Categoria.find().then((categorias) => {

      res.render("categorias/index", { categorias: categorias });


   }).catch((err) => {

      req.flash("error_msg", "Houve um erro interno ao listar as categorias");
      res.redirect("/");


   });

    

});

/*
app.get("/categorias/:slug", (req, res) => {

   Categoria.findOne({ slug: req.params.slug }).then((categoria) => {

      if (categoria) {

         Postagem.find({ categoria: categoria._id }).then((postagens) => {

            res.render("categorias/postagens", { postagens: postagens, categoria: categoria })

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


});*/


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
       
      res.render("pontocoleta/index", {categorias: categorias, pontocoleta: pontocoleta });
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
      res.render("admin/produto", { produto : produto });
   }).catch((err) => {
      req.flash("error_msg", "Houve Erro");
      res.redirect("/admin");
   });
});

app.get("/produtos", (req, res) => {
   //lista dos produto /produto
   Produto.find().sort({ date: 'desc' }).then((produto) => {
      res.render("admin/produto", { produto : produto });
   }).catch((err) => {
      req.flash("error_msg", "Houve Erro");
      res.redirect("/admin");
   });
});

app.post('/produto/nova', (req, res) => {
   // Pega entrada de imagem e video e audio
   const { imagem, video, audio } = req.files;
   //  pasta raiz
   const pastaDestino = 'public/uploadProduto';
   // Verifica erro
   let err = false;
   // Copia a imagem
   if (!imagem) {
      console.log('recebeu nada');
      video.mv(path.resolve(__dirname, `${pastaDestino}/video`, video.name), (verror) => {
         if (verror) {
            err = true;
            return;
         }
         //copia o aduio para a pasta  
         audio.mv(path.resolve(__dirname, `${pastaDestino}/audio`, audio.name), (auerror) => {
            if (auerror) {
               err = true;
               return;
            }
            //cria a collections com os novos dados, e adiciona no campo de acordo com o tipo
            Produto.create({
               ...req.body,
               imagem: null,
               video: `/video/${video.name}`,
               audio: `/audio/${audio.name}`
            }, (error, Noticias) => {
               err = true;
            });
         })
      });
   } else if (!video) {
      imagem.mv(path.resolve(__dirname, `${pastaDestino}/imagens`, imagem.name), (ierror) => {
         if (ierror) {
            err = true;
            return;
         }
         audio.mv(path.resolve(__dirname, `${pastaDestino}/audio`, audio.name), (auerror) => {
            if (auerror) {
               err = true;
               return;
            }
            //cria a collections com os novos dados, e adiciona no campo de acordo com o tipo
            Produto.create({
               ...req.body,
               imagem: `/imagens/${imagem.name}`,
               video: null,
               audio: `/audio/${audio.name}`
            }, (error, Noticias) => {
               err = true;
            });
         });
      });
   } else if (!audio) {
      imagem.mv(path.resolve(__dirname, `${pastaDestino}/imagens`, imagem.name), (ierror) => {
         if (ierror) {
            err = true;
            return;
         }
         video.mv(path.resolve(__dirname, `${pastaDestino}/video`, video.name), (verror) => {
            if (verror) {
               err = true;
               return;
            }
            Produto.create({
               ...req.body,
               imagem: `/imagens/${imagem.name}`,
               video: `/video/${video.name}`,
               audio: null
            }, (error, Noticias) => {
               err = true;
            });

         });
      });
   } else if (!audio && !video || !video && !audio) {
      imagem.mv(path.resolve(__dirname, `${pastaDestino}/imagens`, imagem.name), (ierror) => {
         if (ierror) {
            err = true;
            return;
         }
         Produto.create({
            ...req.body,
            imagem: `/imagens/${imagem.name}`,
            video: null,
            audio: null
         }, (error, Noticias) => {
            err = true;
         });
      });
   } else if (!audio && !imagem || !imagem && !audio) {
         video.mv(path.resolve(__dirname, `${pastaDestino}/video`, video.name), (verror) => {
            if (verror) {
               err = true;
               return;
            }
            Produto.create({
               ...req.body,
               imagem: null,
               video: `/video/${video.name}`,
               audio: null
            }, (error, Noticias) => {
               err = true;
            });

         });
   } else if (!imagem && !video || !video && !imagem) {
      audio.mv(path.resolve(__dirname, `${pastaDestino}/audio`, audio.name), (auerror) => {
         if (auerror) {
            err = true;
            return;
         }
            Produto.create({
               ...req.body,
               imagem: null,
               video: null,
               audio: `audio/${audio.name}`
            }, (error, Noticias) => {
               err = true;
            });
      });
   } else if (!imagem && !video && !audio) {
      Produto.create({
         ...req.body,
         imagem: null,
         video: null,
         audio: null
      }, (error, Noticias) => {
         err = true;
      });
   }
   if (err) {
      res.redirect('admin/noticias');
      return;
   } else {
      res.redirect('/noticias');
   }

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
      res.render("admin/noticias", { noticias: noticias });
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


app.post('/noticias/nova', (req, res) => {
   // Pega entrada de imagem e video e audio
   const { imagem, video, audio } = req.files;
   //  pasta raiz
   const pastaDestino = 'public/upload';
   // Verifica erro
   let err = false;
   // Copia a imagem
   
   if (!imagem) {
      console.log('recebeu nada');
      video.mv(path.resolve(__dirname, `${pastaDestino}/video`, video.name), (verror) => {
         if (verror) {
            err = true;
            return;
         }
         //copia o aduio para a pasta  
         audio.mv(path.resolve(__dirname, `${pastaDestino}/audio`, audio.name), (auerror) => {
            if (auerror) {
               err = true;
               return;
            }
            //cria a collections com os novos dados, e adiciona no campo de acordo com o tipo
            Noticias.create({
               ...req.body,
               imagem: null,
               video: `/video/${video.name}`,
               audio: `/audio/${audio.name}`
            }, (error, Noticias) => {
               err = true;
            });
         })
      });
   } else if (!video) {
      imagem.mv(path.resolve(__dirname, `${pastaDestino}/imagens`, imagem.name), (ierror) => {
         if (ierror) {
            err = true;
            return;
         }
         audio.mv(path.resolve(__dirname, `${pastaDestino}/audio`, audio.name), (auerror) => {
            if (auerror) {
               err = true;
               return;
            }
            //cria a collections com os novos dados, e adiciona no campo de acordo com o tipo
            Noticias.create({
               ...req.body,
               imagem: `/imagens/${imagem.name}`,
               video: null,
               audio: `/audio/${audio.name}`
            }, (error, Noticias) => {
               err = true;
            });
         });
      });
   } else if (!audio) {
      imagem.mv(path.resolve(__dirname, `${pastaDestino}/imagens`, imagem.name), (ierror) => {
         if (ierror) {
            err = true;
            return;
         }
         video.mv(path.resolve(__dirname, `${pastaDestino}/video`, video.name), (verror) => {
            if (verror) {
               err = true;
               return;
            }
            Noticias.create({
               ...req.body,
               imagem: `/imagens/${imagem.name}`,
               video: `/video/${video.name}`,
               audio: null
            }, (error, Noticias) => {
               err = true;
            });

         });
      });
   } else if (!audio && !video || !video && !audio) {
      imagem.mv(path.resolve(__dirname, `${pastaDestino}/imagens`, imagem.name), (ierror) => {
         if (ierror) {
            err = true;
            return;
         }
         Noticias.create({
            ...req.body,
            imagem: `/imagens/${imagem.name}`,
            video: null,
            audio: null
         }, (error, Noticias) => {
            err = true;
         });
      });
   } else if (!audio && !imagem || !imagem && !audio) {
      video.mv(path.resolve(__dirname, `${pastaDestino}/video`, video.name), (verror) => {
         if (verror) {
            err = true;
            return;
         }
         Noticias.create({
            ...req.body,
            imagem: null,
            video: `/video/${video.name}`,
            audio: null
         }, (error, Noticias) => {
            err = true;
         });

      });
   } else if (!imagem && !video || !video && !imagem) {
      audio.mv(path.resolve(__dirname, `${pastaDestino}/audio`, audio.name), (auerror) => {
         if (auerror) {
            err = true;
            return;
         }
         Noticias.create({
            ...req.body,
            imagem: null,
            video: null,
            audio: `audio/${audio.name}`
         }, (error, Noticias) => {
            err = true;
         });
      });
   } else if (!imagem && !video && !audio) {
      Noticias.create({
         ...req.body,
         imagem: null,
         video: null,
         audio: null
      }, (error, Noticias) => {
         err = true;
      });
   }
   if (err) {
      res.redirect('admin/noticias');
      return;
   } else {
      res.redirect('/noticias');
   }
});


app.post('/tutoriais/nova', (req, res) => {
   // Pega entrada de imagem e video e audio
   const { imagem, video, audio } = req.files;
   //  pasta raiz
   const pastaDestino = 'public/uploadTutorial';
   // Verifica erro
   let err = false;

   if (!imagem) {
      console.log('recebeu nada');
      video.mv(path.resolve(__dirname, `${pastaDestino}/video`, video.name), (verror) => {
         if (verror) {
            err = true;
            return;
         }
         //copia o aduio para a pasta  
         audio.mv(path.resolve(__dirname, `${pastaDestino}/audio`, audio.name), (auerror) => {
            if (auerror) {
               err = true;
               return;
            }
            //cria a collections com os novos dados, e adiciona no campo de acordo com o tipo
            Tutorial.create({
               ...req.body,
               imagem: null,
               video: `/video/${video.name}`,
               audio: `/audio/${audio.name}`
            }, (error, Noticias) => {
               err = true;
            });
         })
      });
   } else if (!video) {
      imagem.mv(path.resolve(__dirname, `${pastaDestino}/imagens`, imagem.name), (ierror) => {
         if (ierror) {
            err = true;
            return;
         }
         audio.mv(path.resolve(__dirname, `${pastaDestino}/audio`, audio.name), (auerror) => {
            if (auerror) {
               err = true;
               return;
            }
            //cria a collections com os novos dados, e adiciona no campo de acordo com o tipo
            Tutorial.create({
               ...req.body,
               imagem: `/imagens/${imagem.name}`,
               video: null,
               audio: `/audio/${audio.name}`
            }, (error, Noticias) => {
               err = true;
            });
         });
      });
   } else if (!audio) {
      imagem.mv(path.resolve(__dirname, `${pastaDestino}/imagens`, imagem.name), (ierror) => {
         if (ierror) {
            err = true;
            return;
         }
         video.mv(path.resolve(__dirname, `${pastaDestino}/video`, video.name), (verror) => {
            if (verror) {
               err = true;
               return;
            }
            Tutorial.create({
               ...req.body,
               imagem: `/imagens/${imagem.name}`,
               video: `/video/${video.name}`,
               audio: null
            }, (error, Noticias) => {
               err = true;
            });

         });
      });
   } else if (!audio && !video || !video && !audio) {
      imagem.mv(path.resolve(__dirname, `${pastaDestino}/imagens`, imagem.name), (ierror) => {
         if (ierror) {
            err = true;
            return;
         }
         Tutorial.create({
            ...req.body,
            imagem: `/imagens/${imagem.name}`,
            video: null,
            audio: null
         }, (error, Noticias) => {
            err = true;
         });
      });
   } else if (!audio && !imagem || !imagem && !audio) {
      video.mv(path.resolve(__dirname, `${pastaDestino}/video`, video.name), (verror) => {
         if (verror) {
            err = true;
            return;
         }
         Tutorial.create({
            ...req.body,
            imagem: null,
            video: `/video/${video.name}`,
            audio: null
         }, (error, Noticias) => {
            err = true;
         });

      });
   } else if (!imagem && !video || !video && !imagem) {
      audio.mv(path.resolve(__dirname, `${pastaDestino}/audio`, audio.name), (auerror) => {
         if (auerror) {
            err = true;
            return;
         }
         Tutorial.create({
            ...req.body,
            imagem: null,
            video: null,
            audio: `audio/${audio.name}`
         }, (error, Noticias) => {
            err = true;
         });
      });
   } else if (!imagem && !video && !audio) {
      Tutorial.create({
         ...req.body,
         imagem: null,
         video: null,
         audio: null
      }, (error, Noticias) => {
         err = true;
      });
   }
   if (err) {
      res.redirect('admin/noticias');
      return;
   } else {
      res.redirect('/noticias');
   }
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
const porta = 8089;

//em formato de arrow function
app.listen(porta, () => {

 console.log("servidor rodando!");

});
