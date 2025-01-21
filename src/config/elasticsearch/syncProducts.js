const Product = require('./src/components/product/models/Product');
const elasticClient = require('./src/config/elasticsearch/elasticsearch');
 
//nodemon --inspect src/index.js
const db = require('./src/config/db');
db.connect();
async function indexProduct(product) {
    db.connect();
    await elasticClient.index({
        index: 'products',
        id: product._id.toString(),
        body: {
            name: product.name,
            description: product.description,
            material: product.material,
            style: product.style,
            gender: product.gender,
            originalPrice: product.originalPrice,
            salePrice: product.salePrice,
            saleDuration: product.saleDuration,
            totalPurchased: product.totalPurchased,
            images: product.images,
            category: product.category,
            availability: product.availability,
            brand: product.brand,
            type: product.type,
            rate: product.rate,
            warranty: product.warranty,
            slug: product.slug,
            tags: product.tags,
            stock: product.stock.map(stockItem => ({
                size: stockItem.size,
                color: stockItem.color,
                quantity: stockItem.quantity,
            })),
            createdAt: product.createdAt || new Date(), // Đảm bảo ngày tạo luôn được thiết lập
        },
    });
    console.log(`Product indexed: ${product.name}`);
}


async function syncAllProducts() {
    try {
        const products = await Product.find({}); // Lấy tất cả sản phẩm từ MongoDB
        for (const product of products) {
            await indexProduct(product); // Lưu từng sản phẩm vào Elasticsearch
        }
        console.log('All products indexed successfully');
    } catch (error) {
        console.error('Error while syncing products:', error);
    }
}

// Chạy hàm đồng bộ
syncAllProducts().catch(console.error);
