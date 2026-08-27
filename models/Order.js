const database = require('../config/database');

class Order {
  static create({ customerName, cocktailId, quantity, notes }) {
    return database.run(
      `INSERT INTO orders (customer_name, cocktail_id, quantity, notes)
       VALUES (?, ?, ?, ?)`,
      [customerName, cocktailId, quantity, notes]
    );
  }

  static findAll() {
    return database.all(`
      SELECT orders.id, orders.customer_name, orders.quantity, orders.notes,
             orders.status, orders.created_at, cocktails.name AS cocktail_name,
             cocktails.price, cocktails.price * orders.quantity AS total
      FROM orders
      JOIN cocktails ON cocktails.id = orders.cocktail_id
      ORDER BY CASE orders.status
        WHEN 'queued' THEN 1 WHEN 'preparing' THEN 2 ELSE 3 END,
        orders.created_at ASC
    `);
  }

  static findById(id) {
    return database.get('SELECT * FROM orders WHERE id = ?', [id]);
  }

  static update(id, { cocktailId, quantity, notes }) {
    return database.run(
      `UPDATE orders SET cocktail_id = ?, quantity = ?, notes = ?
       WHERE id = ? AND status != 'ready'`,
      [cocktailId, quantity, notes, id]
    );
  }

  static updateStatus(id, status) {
    return database.run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  }
}

module.exports = Order;
