// src/routes/credit.routes.js
const express = require('express');
const router = express.Router();

const {
  getLedger, getAccountSummary, createCredit, voidTransaction, updateCreditLimit,
} = require('../controllers/credit.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { createCreditSchema, voidTransactionSchema } = require('../validators/credit.validator');

router.use(authenticate);

router.post('/', validate(createCreditSchema), createCredit);
router.get('/:customerId/ledger', getLedger);
router.get('/:customerId/summary', getAccountSummary);
router.patch('/:transactionId/void', authorize('OWNER', 'ADMIN'), validate(voidTransactionSchema), voidTransaction);
router.patch('/:customerId/limit', authorize('OWNER', 'ADMIN'), updateCreditLimit);

module.exports = router;
