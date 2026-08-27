const path = require('path');
const express = require('express');
const { initializeDatabase } = require('./config/database');
const homeRoutes = require('./routes/homeRoutes');
const cocktailRoutes = require('./routes/cocktailRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoutes);
app.use('/menu', cocktailRoutes);
app.use('/orders', orderRoutes);

app.use((req, res) => res.status(404).render('error', {
  title: 'Page not found',
  message: 'The page you requested does not exist.'
}));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render('error', {
    title: 'Something went wrong',
    message: 'The request could not be completed. Please try again.'
  });
});

const port = Number(process.env.PORT) || 3000;

if (require.main === module) {
  initializeDatabase()
    .then(() => app.listen(port, () => {
      console.log(`Bartender MVC is running at http://localhost:${port}`);
    }))
    .catch((error) => {
      console.error('Could not initialize the database:', error);
      process.exit(1);
    });
}

module.exports = app;
