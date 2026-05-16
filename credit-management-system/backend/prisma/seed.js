// prisma/seed.js
// Seeds the database with realistic sample data for development/testing

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data (order matters for FK constraints)
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.creditAccount.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleaned existing data');

  // ─── Create Owner User ────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('password123', 10);

  const owner = await prisma.user.create({
    data: {
      name: 'Abebe Bikila',
      phone: '0911223344',
      email: 'abebe.bikila@example.com',
      password: hashedPassword,
      role: 'OWNER',
    },
  });

  console.log(`✅ Created owner: ${owner.name}`);

  // ─── Create Shop ──────────────────────────────────────────────────────────
  const shop = await prisma.shop.create({
    data: {
      name: "Abebe's Mini Mart",
      address: 'Bole Road, Addis Ababa, Ethiopia',
      phone: '0911223344',
      ownerId: owner.id,
    },
  });

  console.log(`✅ Created shop: ${shop.name}`);

  // ─── Create Customers ─────────────────────────────────────────────────────
  const customersData = [
    {
      fullName: 'Abena Owusu',
      nickname: 'Nana',
      phone: '0911333001',
      address: 'Bole, Addis Ababa',
      trustScore: 8.5,
      riskLevel: 'LOW',
      shopId: shop.id,
    },
    {
      fullName: 'Kofi Asante',
      nickname: 'Big K',
      phone: '0911333002',
      address: 'Piazza, Addis Ababa',
      trustScore: 6.0,
      riskLevel: 'MEDIUM',
      shopId: shop.id,
    },
    {
      fullName: 'Ama Boateng',
      nickname: 'Mama Ama',
      phone: '0911333003',
      address: 'Mercato, Addis Ababa',
      trustScore: 4.5,
      riskLevel: 'HIGH',
      shopId: shop.id,
    },
    {
      fullName: 'Kwame Darko',
      nickname: 'K-Dubs',
      phone: '0911333004',
      address: 'Casanchis, Addis Ababa',
      trustScore: 9.0,
      riskLevel: 'LOW',
      shopId: shop.id,
    },
    {
      fullName: 'Akosua Frimpong',
      nickname: 'Serwaa',
      phone: '0911333005',
      address: 'Old Airport, Addis Ababa',
      trustScore: 3.0,
      riskLevel: 'CRITICAL',
      shopId: shop.id,
    },
  ];

  const customers = [];
  for (const data of customersData) {
    const customer = await prisma.customer.create({ data });
    customers.push(customer);
  }

  console.log(`✅ Created ${customers.length} customers`);

  // ─── Create Credit Accounts ───────────────────────────────────────────────
  const creditLimits = [3000, 2000, 1500, 5000, 1000];

  const creditAccounts = [];
  for (let i = 0; i < customers.length; i++) {
    const account = await prisma.creditAccount.create({
      data: {
        customerId: customers[i].id,
        creditLimit: creditLimits[i],
        currentBalance: 0,
        totalPaid: 0,
        totalCredited: 0,
      },
    });
    creditAccounts.push(account);
  }

  console.log(`✅ Created ${creditAccounts.length} credit accounts`);

  // ─── Create Sample Transactions & Payments ────────────────────────────────
  const now = new Date();

  // Customer 0 (Abena) - Low risk, good repayer
  const tx1 = await prisma.transaction.create({
    data: {
      creditAccountId: creditAccounts[0].id,
      type: 'CREDIT',
      amount: 450.0,
      description: 'Rice 25kg, Cooking oil 5L, Sugar 2kg',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: 'PARTIAL',
    },
  });

  await prisma.payment.create({
    data: {
      transactionId: tx1.id,
      amount: 200.0,
      method: 'MOBILE_MONEY',
      notes: 'Partial payment via MTN MoMo',
    },
  });

  await prisma.creditAccount.update({
    where: { id: creditAccounts[0].id },
    data: {
      currentBalance: 250.0, // 450 - 200
      totalCredited: 450.0,
      totalPaid: 200.0,
    },
  });

  // Customer 1 (Kofi) - Medium risk, sometimes late
  const tx2 = await prisma.transaction.create({
    data: {
      creditAccountId: creditAccounts[1].id,
      type: 'CREDIT',
      amount: 800.0,
      description: 'Assorted groceries, beverages',
      dueDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (overdue)
      status: 'OVERDUE',
    },
  });

  await prisma.creditAccount.update({
    where: { id: creditAccounts[1].id },
    data: { currentBalance: 800.0, totalCredited: 800.0 },
  });

  // Customer 2 (Ama) - High risk, poor repayer
  const tx3 = await prisma.transaction.create({
    data: {
      creditAccountId: creditAccounts[2].id,
      type: 'CREDIT',
      amount: 1200.0,
      description: 'Monthly household supplies',
      dueDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days overdue
      status: 'OVERDUE',
    },
  });

  await prisma.creditAccount.update({
    where: { id: creditAccounts[2].id },
    data: { currentBalance: 1200.0, totalCredited: 1200.0 },
  });

  // Customer 3 (Kwame) - Low risk, quick payer
  const tx4 = await prisma.transaction.create({
    data: {
      creditAccountId: creditAccounts[3].id,
      type: 'CREDIT',
      amount: 600.0,
      description: 'Electronics parts + food items',
      dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      status: 'PAID',
    },
  });

  await prisma.payment.create({
    data: {
      transactionId: tx4.id,
      amount: 600.0,
      method: 'CASH',
      notes: 'Full payment received',
    },
  });

  await prisma.creditAccount.update({
    where: { id: creditAccounts[3].id },
    data: { currentBalance: 0, totalCredited: 600.0, totalPaid: 600.0 },
  });

  console.log('✅ Created transactions and payments');

  // ─── Create Sample Notifications ──────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        type: 'OVERDUE_ALERT',
        title: 'Overdue Payment Alert',
        message: `Kofi Asante has an overdue balance of GHS 800. Due 3 days ago.`,
        userId: owner.id,
        customerId: customers[1].id,
        status: 'UNREAD',
      },
      {
        type: 'OVERDUE_ALERT',
        title: 'Critical Overdue Alert',
        message: `Ama Boateng's debt of GHS 1,200 is 14 days overdue. Action required.`,
        userId: owner.id,
        customerId: customers[2].id,
        status: 'UNREAD',
      },
      {
        type: 'PAYMENT_RECEIVED',
        title: 'Payment Received',
        message: `Kwame Darko has fully paid GHS 600. Balance is now GHS 0.`,
        userId: owner.id,
        customerId: customers[3].id,
        status: 'READ',
      },
    ],
  });

  console.log('✅ Created notifications');

  // ─── Create Audit Logs ────────────────────────────────────────────────────
  await prisma.auditLog.createMany({
    data: [
      {
        action: 'CREATE_CUSTOMER',
        entity: 'Customer',
        entityId: customers[0].id,
        newValues: { name: customers[0].fullName },
        userId: owner.id,
      },
      {
        action: 'RECORD_CREDIT',
        entity: 'Transaction',
        entityId: tx1.id,
        newValues: { amount: 450.0 },
        userId: owner.id,
      },
      {
        action: 'RECORD_PAYMENT',
        entity: 'Payment',
        entityId: null,
        newValues: { amount: 200.0 },
        userId: owner.id,
      },
    ],
  });

  console.log('✅ Created audit logs');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   Owner: ${owner.name} (${owner.phone})`);
  console.log(`   Shop: ${shop.name}`);
  console.log(`   Customers: ${customers.length}`);
  console.log(`   Login: phone=${owner.phone} password=password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
