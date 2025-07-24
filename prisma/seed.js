import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data untuk seeding
const sampleTransactions = [
  {
    order_id: 'DON-2024-001',
    gross_amount: 50000,
    customer_name: 'Ahmad Rizki',
    customer_email: 'ahmad.rizki@email.com',
    method: 'bank_transfer',
    transaction_status: 'SUCCESS',
    midtrans_status: 'settlement'
  },
  {
    order_id: 'DON-2024-002',
    gross_amount: 100000,
    customer_name: 'Siti Nurhaliza',
    customer_email: 'siti.nurhaliza@email.com',
    method: 'credit_card',
    transaction_status: 'SUCCESS',
    midtrans_status: 'capture'
  },
  {
    order_id: 'DON-2024-003',
    gross_amount: 25000,
    customer_name: 'Budi Santoso',
    customer_email: 'budi.santoso@email.com',
    method: 'e_wallet',
    transaction_status: 'PENDING',
    midtrans_status: 'pending'
  },
  {
    order_id: 'DON-2024-004',
    gross_amount: 250000,
    customer_name: 'Dewi Lestari',
    customer_email: 'dewi.lestari@email.com',
    method: 'bank_transfer',
    transaction_status: 'SUCCESS',
    midtrans_status: 'settlement'
  },
  {
    order_id: 'DON-2024-005',
    gross_amount: 75000,
    customer_name: 'Hamba Allah',
    customer_email: 'anonymous@email.com',
    method: 'credit_card',
    transaction_status: 'FAILED',
    midtrans_status: 'deny'
  },
  {
    order_id: 'DON-2024-006',
    gross_amount: 500000,
    customer_name: 'Andi Wijaya',
    customer_email: 'andi.wijaya@email.com',
    method: 'bank_transfer',
    transaction_status: 'SUCCESS',
    midtrans_status: 'settlement'
  },
  {
    order_id: 'DON-2024-007',
    gross_amount: 150000,
    customer_name: 'Maya Sari',
    customer_email: 'maya.sari@email.com',
    method: 'e_wallet',
    transaction_status: 'SUCCESS',
    midtrans_status: 'capture'
  },
  {
    order_id: 'DON-2024-008',
    gross_amount: 30000,
    customer_name: 'Rudi Hermawan',
    customer_email: 'rudi.hermawan@email.com',
    method: 'credit_card',
    transaction_status: 'PENDING',
    midtrans_status: 'pending'
  },
  {
    order_id: 'DON-2024-009',
    gross_amount: 1000000,
    customer_name: 'Indira Putri',
    customer_email: 'indira.putri@email.com',
    method: 'bank_transfer',
    transaction_status: 'SUCCESS',
    midtrans_status: 'settlement'
  },
  {
    order_id: 'DON-2024-010',
    gross_amount: 45000,
    customer_name: 'Fajar Nugroho',
    customer_email: 'fajar.nugroho@email.com',
    method: 'e_wallet',
    transaction_status: 'FAILED',
    midtrans_status: 'expire'
  },
  {
    order_id: 'DON-2024-011',
    gross_amount: 200000,
    customer_name: 'Lina Marlina',
    customer_email: 'lina.marlina@email.com',
    method: 'credit_card',
    transaction_status: 'SUCCESS',
    midtrans_status: 'capture'
  },
  {
    order_id: 'DON-2024-012',
    gross_amount: 80000,
    customer_name: 'Hamba Allah',
    customer_email: 'donor12@email.com',
    method: 'bank_transfer',
    transaction_status: 'PENDING',
    midtrans_status: 'pending'
  },
  {
    order_id: 'DON-2024-013',
    gross_amount: 350000,
    customer_name: 'Dian Sastro',
    customer_email: 'dian.sastro@email.com',
    method: 'e_wallet',
    transaction_status: 'SUCCESS',
    midtrans_status: 'settlement'
  },
  {
    order_id: 'DON-2024-014',
    gross_amount: 60000,
    customer_name: 'Agus Salim',
    customer_email: 'agus.salim@email.com',
    method: 'credit_card',
    transaction_status: 'FAILED',
    midtrans_status: 'failure'
  },
  {
    order_id: 'DON-2024-015',
    gross_amount: 120000,
    customer_name: 'Rina Susanti',
    customer_email: 'rina.susanti@email.com',
    method: 'bank_transfer',
    transaction_status: 'SUCCESS',
    midtrans_status: 'settlement'
  },
  {
    order_id: 'DON-2024-016',
    gross_amount: 90000,
    customer_name: 'Hamba Allah',
    customer_email: 'anonymous16@email.com',
    method: 'e_wallet',
    transaction_status: 'PENDING',
    midtrans_status: 'pending'
  },
  {
    order_id: 'DON-2024-017',
    gross_amount: 750000,
    customer_name: 'Bambang Sutrisno',
    customer_email: 'bambang.sutrisno@email.com',
    method: 'bank_transfer',
    transaction_status: 'SUCCESS',
    midtrans_status: 'settlement'
  },
  {
    order_id: 'DON-2024-018',
    gross_amount: 40000,
    customer_name: 'Sari Dewi',
    customer_email: 'sari.dewi@email.com',
    method: 'credit_card',
    transaction_status: 'FAILED',
    midtrans_status: 'cancel'
  },
  {
    order_id: 'DON-2024-019',
    gross_amount: 180000,
    customer_name: 'Joko Widodo',
    customer_email: 'joko.widodo@email.com',
    method: 'e_wallet',
    transaction_status: 'SUCCESS',
    midtrans_status: 'capture'
  },
  {
    order_id: 'DON-2024-020',
    gross_amount: 65000,
    customer_name: 'Mega Wati',
    customer_email: 'mega.wati@email.com',
    method: 'bank_transfer',
    transaction_status: 'PENDING',
    midtrans_status: 'pending'
  },
  {
    order_id: 'DON-2024-021',
    gross_amount: 300000,
    customer_name: 'Hamba Allah',
    customer_email: 'donor21@email.com',
    method: 'credit_card',
    transaction_status: 'SUCCESS',
    midtrans_status: 'settlement'
  },
  {
    order_id: 'DON-2024-022',
    gross_amount: 55000,
    customer_name: 'Tono Suratno',
    customer_email: 'tono.suratno@email.com',
    method: 'e_wallet',
    transaction_status: 'FAILED',
    midtrans_status: 'expire'
  },
  {
    order_id: 'DON-2024-023',
    gross_amount: 450000,
    customer_name: 'Ratna Sari',
    customer_email: 'ratna.sari@email.com',
    method: 'bank_transfer',
    transaction_status: 'SUCCESS',
    midtrans_status: 'settlement'
  },
  {
    order_id: 'DON-2024-024',
    gross_amount: 85000,
    customer_name: 'Hendra Gunawan',
    customer_email: 'hendra.gunawan@email.com',
    method: 'credit_card',
    transaction_status: 'PENDING',
    midtrans_status: 'pending'
  },
  {
    order_id: 'DON-2024-025',
    gross_amount: 220000,
    customer_name: 'Fitri Handayani',
    customer_email: 'fitri.handayani@email.com',
    method: 'e_wallet',
    transaction_status: 'SUCCESS',
    midtrans_status: 'capture'
  },
  {
    order_id: 'DON-2024-026',
    gross_amount: 70000,
    customer_name: 'Hamba Allah',
    customer_email: 'anonymous26@email.com',
    method: 'bank_transfer',
    transaction_status: 'FAILED',
    midtrans_status: 'deny'
  },
  {
    order_id: 'DON-2024-027',
    gross_amount: 600000,
    customer_name: 'Wahyu Hidayat',
    customer_email: 'wahyu.hidayat@email.com',
    method: 'credit_card',
    transaction_status: 'SUCCESS',
    midtrans_status: 'settlement'
  },
  {
    order_id: 'DON-2024-028',
    gross_amount: 95000,
    customer_name: 'Novi Amelia',
    customer_email: 'novi.amelia@email.com',
    method: 'e_wallet',
    transaction_status: 'PENDING',
    midtrans_status: 'pending'
  },
  {
    order_id: 'DON-2024-029',
    gross_amount: 380000,
    customer_name: 'Rizal Ramli',
    customer_email: 'rizal.ramli@email.com',
    method: 'bank_transfer',
    transaction_status: 'SUCCESS',
    midtrans_status: 'settlement'
  },
  {
    order_id: 'DON-2024-030',
    gross_amount: 110000,
    customer_name: 'Hamba Allah',
    customer_email: 'donor30@email.com',
    method: 'credit_card',
    transaction_status: 'FAILED',
    midtrans_status: 'failure'
  }
];

async function main() {
  console.log('🌱 Mulai seeding database...');

  try {
    // Hapus semua data existing (opsional)
    console.log('🗑️  Menghapus data existing...');
    await prisma.transaction.deleteMany();

    // Insert data baru
    console.log('📝 Menambahkan data transaksi...');

    for (const transaction of sampleTransactions) {
      await prisma.transaction.create({
        data: {
          ...transaction
        }
      });
    }

    console.log(`✅ Berhasil menambahkan ${sampleTransactions.length} transaksi`);
  } catch (error) {
    console.error('❌ Error saat seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\n🔌 Database connection ditutup');
  });
