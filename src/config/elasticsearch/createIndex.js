const elasticClient = require('./elasticsearch');
const Product = require('../../components/product/models/Product');
const ProductService = require('../../components/product/services/ProductService');

async function createIndex() {
    try {
        console.log('Starting to create index...'); // Log kiểm tra
        // Kiểm tra xem chỉ mục đã tồn tại chưa
        const indexExists = await elasticClient.indices.exists({ index: 'products' });

        if (!indexExists) {
            // Tạo chỉ mục nếu chưa tồn tại
            await elasticClient.indices.create({
                index: 'products',
                body: {
                    mappings: {
                        properties: {
                            name: { type: 'text', analyzer: 'standard' },
                            description: { type: 'text', analyzer: 'standard' },
                            material: { type: 'text', analyzer: 'standard' },
                            style: { type: 'text', analyzer: 'standard' },
                            gender: { type: 'keyword' }, // Men, Women, Unisex
                            originalPrice: { type: 'float' },
                            salePrice: { type: 'float' },
                            saleDuration: { type: 'integer' }, // Thời gian giảm giá
                            totalPurchased: { type: 'integer' },
                            images: { type: 'keyword' },
                            category: { type: 'keyword' },
                            availability: { type: 'keyword' }, // Sửa chính tả
                            brand: { type: 'keyword' },
                            type: { type: 'keyword' },
                            rate: { type: 'float' },
                            warranty: { type: 'text' },
                            slug: { type: 'text', analyzer: 'standard' },
                            tags: { type: 'text', analyzer: 'standard' },
                            stock: {
                                type: 'nested',
                                properties: {
                                    size: { type: 'integer' },
                                    color: { type: 'keyword' },
                                    quantity: { type: 'integer' },
                                },
                            },
                            createdAt: { type: 'date' },
                        },
                    },
                },
            });
            console.log('Index "products" created successfully!');
        } else {
            console.log('Index "products" already exists.');
        }
    } catch (error) {
        console.error('Error creating index "products":', error);
    }
}

async function indexProduct(product) {
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
            createdAt: product.createdAt || new Date(),
        },
    });
    console.log(`Product indexed: ${product.name}`);
}

async function syncAllProducts() {
    try {
        const products = await ProductService.getProducts({}); // Lấy tất cả sản phẩm từ MongoDB
        for (const product of products) {
            await indexProduct(product); // Lưu từng sản phẩm vào Elasticsearch
        }
        console.log('All products indexed successfully');
    } catch (error) {
        console.error('Error while syncing products:', error);
    }
}

module.exports = {
    createIndex,
    syncAllProducts,
};
