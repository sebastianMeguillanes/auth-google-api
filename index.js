const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');

const app = express();
const ROOT_URL = 'https://authgoogle.dev.404.codes'; // Cambia la URL según tus necesidades

app.use(cors());

// Configuración de express-session
app.use(session({
  secret: '123',
  resave: true,
  saveUninitialized: true
}));

// Configuración de passport
passport.use(new GoogleStrategy({
    clientID: '218110402944-5vn5r7e4nlcko1j39u6ncjb8s55mbojq.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'https://authgoogleapi.dev.404.codes/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Puedes realizar acciones adicionales aquí, como guardar el perfil en la base de datos
    return done(null, profile);
  }
));

// Funciones de serialización y deserialización de usuario
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Inicializar passport y sesión
app.use(passport.initialize());
app.use(passport.session());

// Rutas de autenticación
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
        console.error("Error al cerrar la sesión:", err);
    } else {
        // Cerrar sesión exitoso
        console.log("Sesión cerrada correctamente");
        // Redirecciona a la página de inicio o realiza otras acciones necesarias
    }
  });
  res.redirect(`${ROOT_URL}/login`);
});

// Ruta protegida (ejemplo)
app.get('/profile', ensureAuthenticated, (req, res) => {
  res.json(req.user);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`${ROOT_URL}/login`);
}

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${ROOT_URL}/login`}),
  function(req, res) {
    // Redirección exitosa
    res.redirect('`${ROOT_URL}/main`');
  }
);


// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en localhost:${PORT}`);
});
