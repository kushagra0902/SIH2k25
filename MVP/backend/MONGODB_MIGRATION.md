# MongoDB Migration Summary

## What Changed

Your backend has been successfully migrated from LowDB (JSON file database) to MongoDB. Here are the key changes:

### 1. Dependencies

- **Added**: `mongoose` (MongoDB ODM)
- **Removed**: `lowdb` (you can run `npm uninstall lowdb` to clean up)

### 2. Configuration

- **Updated `.env`**: Changed `DB_FILE` to `MONGODB_URI=mongodb://localhost:27017/sih2025-mvp`
- **Updated `config.js`**: Replaced `dbFile` with `mongoUri`

### 3. Database Connection (`src/db/db.js`)

- Completely replaced LowDB connection with MongoDB/Mongoose connection
- Added connection event handling
- Maintains backward compatibility with `initDB()` and `getDB()` functions

### 4. Models

All models now use Mongoose schemas:

#### Farmer Model (`src/models/farmer.model.js`)

- Uses custom `_id` with nanoid(10)
- Virtual `id` field for backward compatibility
- Added `getFarmerById()` function

#### Batch Model (`src/models/batch.model.js`)

- Uses custom `_id` with nanoid(12)
- Proper schema validation for status enum
- Added `listBatches()` and `getBatchesByFarmer()` functions

#### Chain Model (`src/models/chain.model.js`)

- New model for blockchain simulation
- Proper indexing and block relationship management
- Functions for block retrieval and chain operations

### 5. Services

- **Chain Service**: Updated to use MongoDB models instead of direct DB access
- Maintains the same API interface for backward compatibility

### 6. Routes

- **Auth Routes**: No changes needed (already used model functions)
- **Batch Routes**: No changes needed (already used model functions)
- **Chain Routes**: Updated to use `getAllBlocks()` from the model

### 7. Server Startup

- **Index.js**: Replaced `initDB()` with `connectDB()`
- Added proper error handling for database connection

## Before Running

### Install MongoDB

Make sure MongoDB is running on your system:

**Windows:**

1. Install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Start MongoDB service: `net start MongoDB`
3. Or run manually: `mongod --dbpath C:\data\db`

**Alternative - MongoDB Atlas (Cloud):**
Update your `.env` file with a MongoDB Atlas connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sih2025-mvp
```

### Clean Up

Run this command to remove the old LowDB dependency:

```bash
npm uninstall lowdb
```

### Test the Migration

1. Start MongoDB service
2. Run your backend: `npm run dev`
3. Test the endpoints:
   - `GET /api/auth/` - List farmers
   - `POST /api/auth/register` - Create farmer
   - `POST /api/batches/create` - Create batch
   - `GET /api/chain/` - View blockchain

## Data Migration

Your existing `db.json` data won't automatically migrate. If you need to preserve existing data:

1. **Export from db.json**: Parse the JSON file and extract farmers, batches, and chain data
2. **Import to MongoDB**: Use the model functions to recreate the data in MongoDB

Would you like me to create a migration script to transfer your existing data from `db.json` to MongoDB?

## Benefits of MongoDB Migration

1. **Scalability**: Better performance with large datasets
2. **Data Integrity**: Schema validation and proper relationships
3. **Indexing**: Faster queries with proper indexing
4. **Backup/Restore**: Professional database backup solutions
5. **No More File Persistence Issues**: The original problem of data reappearing is solved
6. **Query Flexibility**: Rich querying capabilities with MongoDB aggregation pipeline

## API Compatibility

All your existing API endpoints remain the same - the migration is backward compatible with your frontend code.
