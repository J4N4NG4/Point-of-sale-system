const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ MongoDB Connection Successful!");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
};

// Migration function
const migratePrices = async () => {
    try {
        console.log('🔄 Starting price migration...');
        
        // Get the Item model (we need to define it here since the model has changed)
        const itemSchema = new mongoose.Schema({
            itemName: String,
            itemCode: String,
            price: Number, // Old field
            buyPrice: Number, // New field
            sellPrice: Number, // New field
            image: String,
            quantity: Number,
            category: String
        }, { strict: false }); // Allow fields not in schema
        
        const Item = mongoose.model('Item', itemSchema);
        
        // Find all items that still have the old price field
        const itemsWithOldPrice = await Item.find({ price: { $exists: true } });
        
        console.log(`📊 Found ${itemsWithOldPrice.length} items with old price field`);
        
        if (itemsWithOldPrice.length === 0) {
            console.log('✅ No items need migration. All items already have buyPrice and sellPrice.');
            return;
        }
        
        // Update each item
        for (const item of itemsWithOldPrice) {
            const oldPrice = item.price;
            
            // Set buyPrice and sellPrice to the old price (you may want to adjust this logic)
            // For now, we'll set buyPrice to 80% of the old price and sellPrice to the old price
            const buyPrice = Math.round(oldPrice * 0.8 * 100) / 100; // 80% of old price, rounded to 2 decimals
            const sellPrice = oldPrice;
            
            await Item.findByIdAndUpdate(item._id, {
                $set: {
                    buyPrice: buyPrice,
                    sellPrice: sellPrice
                },
                $unset: {
                    price: 1
                }
            });
            
            console.log(`✅ Migrated item: ${item.itemName} - Old price: $${oldPrice}, New buyPrice: $${buyPrice}, New sellPrice: $${sellPrice}`);
        }
        
        console.log('🎉 Price migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
};

// Run migration
connectDB().then(() => {
    migratePrices();
});
