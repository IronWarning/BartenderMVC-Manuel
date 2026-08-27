const Cocktail = require('../models/Cocktail');
const Order = require('../models/Order');

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

async function validateOrder(body) {
  const customerName = cleanText(body.customerName, 60);
  const notes = cleanText(body.notes, 250);
  const cocktailId = Number.parseInt(body.cocktailId, 10);
  const quantity = Number.parseInt(body.quantity, 10);
  const cocktail = Number.isInteger(cocktailId) ? await Cocktail.findById(cocktailId) : null;

  if (!customerName) return { error: 'Please enter a name for the order.' };
  if (!cocktail) return { error: 'Please choose an available cocktail.' };
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return { error: 'Quantity must be between 1 and 10.' };
  }
  return { value: { customerName, cocktailId, quantity, notes } };
}

exports.create = async (req, res, next) => {
  try {
    const validation = await validateOrder(req.body);
    if (validation.error) {
      const cocktails = await Cocktail.findAllAvailable();
      return res.status(400).render('menu', {
        title: 'Cocktail Menu', cocktails, success: false,
        error: validation.error, form: req.body
      });
    }
    await Order.create(validation.value);
    res.redirect('/menu?ordered=1');
  } catch (error) {
    next(error);
  }
};

exports.queue = async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    res.render('orders/queue', { title: 'Bartender Queue', orders });
  } catch (error) {
    next(error);
  }
};

exports.editForm = async (req, res, next) => {
  try {
    const [order, cocktails] = await Promise.all([
      Order.findById(req.params.id), Cocktail.findAllAvailable()
    ]);
    if (!order) return res.status(404).render('error', { title: 'Order not found', message: 'That order does not exist.' });
    res.render('orders/edit', { title: `Edit Order #${order.id}`, order, cocktails, error: null });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).render('error', { title: 'Order not found', message: 'That order does not exist.' });
    const validation = await validateOrder({ ...req.body, customerName: order.customer_name });
    if (validation.error) {
      const cocktails = await Cocktail.findAllAvailable();
      return res.status(400).render('orders/edit', {
        title: `Edit Order #${order.id}`,
        order: { ...order, cocktail_id: req.body.cocktailId, quantity: req.body.quantity, notes: req.body.notes },
        cocktails,
        error: validation.error
      });
    }
    await Order.update(order.id, validation.value);
    res.redirect('/orders');
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const allowedStatuses = ['queued', 'preparing', 'ready'];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).render('error', { title: 'Invalid status', message: 'That order status is not supported.' });
    }
    const result = await Order.updateStatus(req.params.id, req.body.status);
    if (result.changes === 0) return res.status(404).render('error', { title: 'Order not found', message: 'That order does not exist.' });
    res.redirect('/orders');
  } catch (error) {
    next(error);
  }
};
