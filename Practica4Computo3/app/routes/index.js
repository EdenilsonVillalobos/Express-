var express = require('express');
var router = express.Router();
const users = require("../usersData");
var methods = require('../methods');

/* GET home page. */
const registerPage = "../views/users/resgister";
const loginPage = "../views/users/login";

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//registro de rutas
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/home', function(req, res) {
  res.render('home');
});
router.get('/login', (req, res) => {
  res.render(loginPage);
});
router.get('/resgister', (req, res) => {
  res.render(registerPage);
});


router.post('/register', (req, res)=>{
  const { fullName, email, password, confirmPassword } = rep.body
  //validar contraseña
  if (password === confirmPassword) {
     //validar correro
    if (users.data.find(u => u.email === email)) {
      res.render(registerPage, {
        message: "",
        messgeClass: ""
      });
    }
    //encriptar el password
    const pHash = methods.getHashedPassword(password);
    //almacear losdatos
    users.datapush({
      fullName,
      email,
      password: pHash
    })
    res.render(longinPage,{
      message:"Registro exitoso. Inicio sesion",
      messgeClass: "alert-success"
    });
  }else {
    res.render(registerPage, {
      message: "Las contraseñas no coinciden",
      messgeClass: "alert-danger"
    })
  }
});
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = methods.getHashedPassword(password);
  
  //validar que los datos coincidan
  const dataUser = users.data.find(u => {
    return u.email === email && hashedPassword === u.password;
  });

  if(dataUser) {
    const authToken = methods.generateToken();
    //almacenar token de autenticacion
    methods.authTokens[authToken] = dataUser;
    res.cookie('AuthToken', authToken);
    res.redirect('/home');
  } else {
    res.render(loginPage, {
      message: "El usuario o clave no coinciden",
      messageClass: "alert-danger"
    });
  }
});
module.exports = router;