import mongoose from 'mongoose';

const mongoUri = "mongodb+srv://admin:admin123@cluster0.4eexsyv.mongodb.net/file-manager?retryWrites=true&w=majority&appName=Cluster0";

console.log('🗑️  DELETING ALL DATA FROM DATABASE...\n');
mongoose.connect(mongoUri).then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.db?.databaseName);

    const collections = await mongoose.connection.db?.listCollections().toArray();

    if (collections && collections.length > 0) {
        console.log(`\n📋 Found ${collections.length} collections. Deleting all data...\n`);

        let totalDeleted = 0;
        for (const coll of collections) {
            const result = await mongoose.connection.db?.collection(coll.name).deleteMany({});
            console.log(`   ✅ Deleted ${result?.deletedCount} documents from "${coll.name}"`);
            totalDeleted += result?.deletedCount || 0;
        }

        console.log(`\n🎉 Successfully deleted ${totalDeleted} total documents!`);
    } else {
        console.log('\nℹ️  Database is already empty');
    }

    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB\n');
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
