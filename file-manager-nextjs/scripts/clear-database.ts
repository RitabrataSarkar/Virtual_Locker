/**
 * Database Cleanup Script
 * This script will delete ALL data from MongoDB collections
 * USE WITH CAUTION - This action cannot be undone!
 */

import mongoose from 'mongoose';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}

async function clearDatabase() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            console.error('❌ Error: MONGODB_URI not found in environment variables');
            console.error('💡 Make sure your .env.local file exists with MONGODB_URI');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Check if db is available
        if (!mongoose.connection.db) {
            throw new Error('Database connection not established');
        }

        // Get all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        console.log('\n📋 Found collections:', collectionNames.join(', '));

        // Ask for confirmation
        console.log('\n⚠️  WARNING: This will delete ALL data from the following collections:');
        collectionNames.forEach(name => console.log(`   - ${name}`));
        console.log('\n❗ This action CANNOT be undone!\n');

        const answer = await question('Are you absolutely sure you want to proceed? (type "DELETE ALL" to confirm): ');

        if (answer !== 'DELETE ALL') {
            console.log('\n❌ Operation cancelled. No data was deleted.');
            rl.close();
            await mongoose.connection.close();
            return;
        }

        console.log('\n🗑️  Starting deletion process...\n');

        // Delete all documents from each collection
        let totalDeleted = 0;
        for (const collectionName of collectionNames) {
            if (!mongoose.connection.db) {
                throw new Error('Database connection lost');
            }

            const collection = mongoose.connection.db.collection(collectionName);
            const result = await collection.deleteMany({});
            console.log(`   ✅ Deleted ${result.deletedCount} documents from "${collectionName}"`);
            totalDeleted += result.deletedCount;
        }

        console.log(`\n✅ Successfully deleted ${totalDeleted} total documents from ${collectionNames.length} collections`);
        console.log('🎉 Database is now clean and ready for fresh data!');

        rl.close();
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');

    } catch (error) {
        console.error('\n❌ Error:', error);
        rl.close();
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
}

// Run the script
console.log('🧹 MongoDB Database Cleanup Utility\n');
console.log('═'.repeat(50));
clearDatabase();
