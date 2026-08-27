const database = require('../config/database');

class Cocktail {
  static findAllAvailable() {
    return database.all(
      'SELECT id, name, description, ingredients, price FROM cocktails WHERE is_available = 1 ORDER BY name'
    );
  }

  static findById(id) {
    return database.get(
      'SELECT id, name, description, ingredients, price FROM cocktails WHERE id = ? AND is_available = 1',
      [id]
    );
  }
}

module.exports = Cocktail;
