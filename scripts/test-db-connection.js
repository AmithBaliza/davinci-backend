const { PrismaClient } = require("@prisma/client");

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    console.log("🔄 Testing database connection...");

    // Test basic connection
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Test a simple query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log("✅ Database query successful!");
    console.log("📊 PostgreSQL version:", result[0].version);

    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    console.log("📋 Tables in database:", tables.length);
    if (tables.length === 0) {
      console.log("⚠️  No tables found - you need to run migrations");
    } else {
      console.log(
        "✅ Tables found:",
        tables.map((t) => t.table_name).join(", "),
      );
    }
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error.message);

    if (error.message.includes("ENOTFOUND")) {
      console.log("💡 Check your host URL");
    } else if (error.message.includes("authentication")) {
      console.log("💡 Check your username/password");
    } else if (error.message.includes("timeout")) {
      console.log("💡 Check if your IP is in trusted sources");
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
