// src/routes/customer.routes.js
const express = require('express');
const router = express.Router();

const {
  getAll, getById, create, update, deactivate, updateCreditLimit, refreshRisk,
} = require('../controllers/customer.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validation.middleware');
const {
  createCustomerSchema, updateCustomerSchema, updateCreditLimitSchema,
} = require('../validators/customer.validator');

// All customer routes require authentication
router.use(authenticate);

router.get('/', getAll);
router.post('/', validate(createCustomerSchema), create);
router.get('/:id', getById);
router.put('/:id', validate(updateCustomerSchema), update);
router.delete('/:id', authorize('OWNER', 'ADMIN'), deactivate);
router.patch('/:id/credit-limit', authorize('OWNER', 'ADMIN'), validate(updateCreditLimitSchema), updateCreditLimit);
router.post('/:id/risk', refreshRisk);

module.exports = router;
