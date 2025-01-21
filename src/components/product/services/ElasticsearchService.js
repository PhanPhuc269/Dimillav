const { MAX } = require('uuid');
const { mutipleMongooseToObject } = require('../../../utils/mongoose');
const { mongooseToObject } = require('../../../utils/mongoose');
const ReviewController = require('../../review/controllers/ReviewController');
const Product = require("../models/Product");
const ProductService = require("../services/ProductService");
const elasticClient=require("../../../config/elasticsearch/elasticsearch");
class ElasticsearchService {

    async  searchProducts(keyword, filters = {}, page = 1, limit = 12) {
        const query = {
            bool: {
                must: [
                    { 
                        multi_match: { 
                            query: keyword, 
                            fields: ['name', 'description','tags', ,
                                
                               
                               
                                'material',
                                'style',
                                'gender',
                               
                               
                                
                                'category',
                                'availability',
                                'brand',
                                'type'], 
                            fuzziness: 'AUTO' 
                        } 
                    }
                ],
                filter: [],
            },
        };
    
        // Áp dụng bộ lọc cho các thuộc tính như loại, thương hiệu, giá, và màu
        if (filters.type) query.bool.filter.push({ term: { type: filters.type } });
        if (filters.brand) query.bool.filter.push({ term: { brand: filters.brand } });
        if (filters.color) query.bool.filter.push({ term: { color: filters.color } });
        if (filters.minPrice || filters.maxPrice) {
            query.bool.filter.push({
                range: { salePrice: { gte: filters.minPrice || 0, lte: filters.maxPrice || Infinity } },
            });
        }
    
        const response = await elasticClient.search({
            index: 'products',
            from: (page - 1) * limit, // Tính toán trang bắt đầu
            size: limit, // Giới hạn số lượng sản phẩm trả về
            body: { query },
        });
    
        return response.hits.hits.map(hit => hit._source);
    }
    
    async countProducts(filters){
            return ProductService.countProducts(filters);
   }
   async  searchProducts(filters, sortCriteria, skip, limit){
            return ProductService.getProductList(filters, sortCriteria, skip, limit);
    }
}    

module.exports = new ElasticsearchService();
