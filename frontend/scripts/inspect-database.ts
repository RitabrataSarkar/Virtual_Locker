/**
 * Database Inspection Script
 * This script checks what's currently in the database
 */

import mongoose from 'mongoose';

async function inspectDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            console.error('❌ Error: MONGODB_URI not found in environment variables');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        console.log('URI:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        if (!mongoose.connection.db) {
            throw new Error('Database connection not established');
        }

        // Get database name
        const dbName = mongoose.connection.db.databaseName;
        console.log('📊 Database Name:', dbName);
        console.log('═'.repeat(50));

        // Get all collections
        const collections = await mongoose.connection.db.listCollections().toArray();

        if (collections.length === 0) {
            console.log('\n✅ Database is empty - no collections found');
        } else {
            console.log(`\n📋 Found ${collections.length} collection(s):\n`);

            // Count documents in each collection
            for (const coll of collections) {
                const collection = mongoose.connection.db.collection(coll.name);
                const count = await collection.countDocuments();
                console.log(`   📦 ${coll.name}: ${count} document(s)`);

                // If there are documents, show a sample
                if (count > 0 && count <= 5) {
                    const docs = await collection.find({}).limit(5).toArray();
                    docs.forEach((doc, idx) => {
                        console.log(`      ${idx + 1}. ${JSON.stringify(doc, null, 2).substring(0, 100)}...`);
                    });
                }
            }
        }

        console.log('\n' + '═'.repeat(50));
        await mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB');

    } catch (error) {
        console.error('\n❌ Error:', error);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
}

console.log('🔍 MongoDB Database Inspector\n');
inspectDatabase();
