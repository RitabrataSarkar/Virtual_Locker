import mongoose from 'mongoose';

const mongoUri = "mongodb+srv://admin:admin123@cluster0.4eexsyv.mongodb.net/file-manager?retryWrites=true&w=majority&appName=Cluster0";

console.log('Connecting to MongoDB...');
mongoose.connect(mongoUri).then(async () => {
    console.log('Connected!');
    console.log('Database:', mongoose.connection.db?.databaseName);

    const collections = await mongoose.connection.db?.listCollections().toArray();
    console.log('\nCollections:');

    if (collections) {
        for (const coll of collections) {
            const count = await mongoose.connection.db?.collection(coll.name).countDocuments();
            console.log(`- ${coll.name}: ${count} documents`);
        }
    }

    await mongoose.connection.close();
    console.log('\nDone!');
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
