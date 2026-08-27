const Cocktail = require('../models/Cocktail');

exports.showMenu = async (req, res, next) => {
  try {
    const cocktails = await Cocktail.findAllAvailable();
    res.render('menu', {
      title: 'Cocktail Menu',
      cocktails,
      success: req.query.ordered === '1',
      error: null,
      form: {}
    });
  } catch (error) {
    next(error);
  }
};
