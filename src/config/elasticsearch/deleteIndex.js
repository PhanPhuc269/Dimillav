const elasticClient = require('./src/config/elasticsearch/elasticsearch');

async function deleteIndex() {
    try {
        const response = await elasticClient.indices.delete({ index: 'products' });
        console.log('Index "products" deleted:', response);
    } catch (error) {
        console.error('Error deleting index:', error);
    }
}

deleteIndex();
