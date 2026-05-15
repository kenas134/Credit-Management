// src/routes/payment.routes.js
const express = require('express');
const router = express.Router();

const { recordPayment, bulkPayment, getHistory } = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { recordPaymentSchema, bulkPaymentSchema } = require('../validators/payment.validator');

router.use(authenticate);

router.post('/', validate(recordPaymentSchema), recordPayment);
router.post('/bulk', validate(bulkPaymentSchema), bulkPayment);
router.get('/customer/:customerId', getHistory);

module.exports = router;
