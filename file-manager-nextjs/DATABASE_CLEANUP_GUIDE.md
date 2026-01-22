# Database Cleanup Instructions

## ⚠️ WARNING
This script will **DELETE ALL DATA** from your MongoDB database. This action **CANNOT BE UNDONE**!

## What Gets Deleted
- All user accounts
- All uploaded files (metadata in database)
- All folders
- All sessions
- **Everything in all collections**

## Physical Files
⚠️ **Note**: This script only deletes database records. Physical uploaded files in `public/uploads/` will remain on your disk. You may want to manually delete them too:

```bash
# On Windows (PowerShell)
Remove-Item -Recurse -Force "public\uploads\*"

# On Unix/Mac
rm -rf public/uploads/*
```

## How to Use

### Step 1: Make sure your .env.local file exists
Ensure you have a `.env.local` file in the project root with your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
```

### Step 2: Stop the development server
Press `Ctrl+C` in the terminal running `npm run dev`

### Step 3: Run the cleanup script
```bash
npm run clear-db
```

### Step 4: Confirm the action
When prompted, you must type exactly:
```
DELETE ALL
```

Any other input will cancel the operation.

### Step 5: Review the output
The script will show:
- Collections found
- Number of documents deleted from each collection
- Total documents deleted

## Example Output

```
🧹 MongoDB Database Cleanup Utility

══════════════════════════════════════════════════
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

📋 Found collections: users, files

⚠️  WARNING: This will delete ALL data from the following collections:
   - users
   - files

❗ This action CANNOT be undone!

Are you absolutely sure you want to proceed? (type "DELETE ALL" to confirm): DELETE ALL

🗑️  Starting deletion process...

   ✅ Deleted 5 documents from "users"
   ✅ Deleted 23 documents from "files"

✅ Successfully deleted 28 total documents from 2 collections
🎉 Database is now clean and ready for fresh data!

🔌 Disconnected from MongoDB
```

## What to Do After Cleanup

1. **Restart the development server**:
   ```bash
   npm run dev
   ```

2. **Create a new account**:
   - Go to http://localhost:3000/signup
   - Register with a new email and password

3. **Start fresh**:
   - All new uploads will use the new schema with the `extension` field
   - No more compatibility issues with old data

## Troubleshooting

### Error: "MONGODB_URI not found"
- Make sure your `.env.local` file exists
- Check that `MONGODB_URI` is set correctly

### Error: "Cannot connect to MongoDB"
- Verify your MongoDB connection string is correct
- Make sure MongoDB is running (if local)
- Check your internet connection (if using MongoDB Atlas)

### Script doesn't run
- Make sure you have `tsx` installed globally or use `npx`:
  ```bash
  npx tsx scripts/clear-database.ts
  ```

## Safety Features

✅ **Requires exact confirmation**: Must type "DELETE ALL" to proceed  
✅ **Shows what will be deleted**: Lists all collections first  
✅ **No accidental runs**: Won't delete without confirmation  
✅ **Clear feedback**: Shows exactly what was deleted  

## Alternative: Selective Deletion

If you don't want to delete everything, you can use MongoDB Compass or the MongoDB shell to selectively delete:

### Delete only users:
```javascript
db.users.deleteMany({})
```

### Delete only files:
```javascript
db.files.deleteMany({})
```

### Delete only files without extension field:
```javascript
db.files.deleteMany({ extension: { $exists: false } })
```

## Re-running After Cleanup

You can run this script as many times as needed. Each time it will:
1. Connect to MongoDB
2. Show current collections
3. Ask for confirmation
4. Delete everything if confirmed
