const { MAX } = require('uuid');
const { mutipleMongooseToObject } = require('../../../utils/mongoose');
const { mongooseToObject } = require('../../../utils/mongoose');
const ReviewController = require('../../review/controllers/ReviewController');
const ProductService = require("../services/ProductService");
const ElasticsearchService = require("../services/ElasticsearchService");
const elasticClient=require("../../../config/elasticsearch/elasticsearch");
const CategoryService = require('../../product/services/CategoryService');
class ProductController {

    ViewOrderConfirmation(req, res, next) {
        res.render('confirmation');
    }

    
    // Lọc sản phẩm
    async getFilteredProducts(req, res, next) {
        try {
            const {
                type: productType,
                brand: productBrand,
                color: productColor,
                minPrice,
                maxPrice,
                page = 1,
                limit = 12,
                keyword,
                sort,
            } = req.query;
    
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const filters = {};
    
            // Lọc theo từ khóa
            if (keyword) filters.name = { $regex: keyword, $options: 'i' };
    
            // Lọc theo loại sản phẩm
            if (productType) filters.type = { $in: productType.split(',') };
    
            // Lọc theo thương hiệu
            if (productBrand) filters.brand = { $in: productBrand.split(',') };
    
            // Lọc theo màu trong stock.color
            if (productColor) {
                const colorArray = productColor.split(',');
                filters['stock.color'] = { $in: colorArray }; // Lọc các màu bên trong mảng stock.color
            }
    
            // Lọc theo giá
            if (minPrice || maxPrice) {
                filters.salePrice = {
                    ...(minPrice && { $gte: parseFloat(minPrice) }),
                    ...(maxPrice && { $lte: parseFloat(maxPrice) }),
                };
            }
    
            // Sắp xếp
            let sortCriteria = {};
            switch (sort) {
                case 'price_asc': sortCriteria = { salePrice: 1 }; break;
                case 'price_desc': sortCriteria = { salePrice: -1 }; break;
                case 'creation_time_desc': sortCriteria = { createdAt: -1 }; break;
                case 'rate_desc': sortCriteria = { rate: -1 }; break;
                default: sortCriteria = {};
            }
            //Đổi type sang category với tên để lọc theo category
            //Thêm thuộc tính category vào filters
            if(filters.type){
                filters.category = await CategoryService.getSubCategoryName(productType);
                //Loại bỏ các thuộc tính không cần thiết
                delete filters.type;
            }

            
    
            // Lấy tổng sản phẩm và danh sách sản phẩm theo bộ lọc
            const total = await ProductService.countProducts(filters);
            const products = await ProductService.getProductList(filters, sortCriteria, skip, limit);
            const dealProducts = await ProductService.getProducts();
            const colors = await ProductService.getProductsByCondition({}, 'stock.color');
            const brands = await ProductService.getProductsByCondition({}, 'brand');
    
            if (req.xhr) {
                return res.json({
                    products: mutipleMongooseToObject(products),
                    total,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                });
            }

                //Lấy danh mục
            const categories = await CategoryService.getCategories();
                console.log('cc',categories)
            //Tổng sản phẩm cho danh mục All
            const totalAll = categories.reduce((total, category) => total + category.productCount, 0);
        

            // Render view
            res.render('category', {
                products: mutipleMongooseToObject(products),
                total,
                totalAll,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                dealProducts: mutipleMongooseToObject(dealProducts),
                brands,
                colors,
                categories: mutipleMongooseToObject(categories),
            });
        } catch (error) {
            console.error('Error filtering products:', error);
            next(error);
        }
    }


    async ViewProductListings(req, res, next) {
        try {
            const keyword = req.query.keyword?.trim() || '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const skip = (page - 1) * limit;
            const sort = req.query.sort || 'default';
            const selectedColors = req.query.colors ? req.query.colors.split(',') : [];
    
            const filters = {};
    
            // Lọc theo từ khóa
            if (keyword) filters.name = { $regex: keyword, $options: 'i' };
    
            // Lọc theo màu sắc
            if (selectedColors.length > 0) {
                filters['stock.color'] = { $in: selectedColors };
            }
    
            // Sắp xếp
            let sortCriteria = {};
            switch (sort) {
                case 'price_asc': sortCriteria = { salePrice: 1 }; break;
                case 'price_desc': sortCriteria = { salePrice: -1 }; break;
                case 'creation_time_desc': sortCriteria = { updatedAt: -1 }; break;
                case 'rate_desc': sortCriteria = { rate: -1 }; break;
                default: sortCriteria = {};
            }
    
            // Tìm tổng sản phẩm và danh sách sản phẩm
            const total = await ProductService.countProducts(filters);
            const products = await ProductService.getProductList(filters, sortCriteria, skip, limit);
    
            // Lấy danh sách màu sắc và nhãn hiệu duy nhất
            const colors = await ProductService.getProductsByCondition({}, 'stock.color');
            const brands = await ProductService.getProductsByCondition({}, 'brand');
            const dealProducts = await ProductService.getProducts();
            const categories = await CategoryService.getCategories();
          //  console.log('cc',categories)
            const totalAll = categories.reduce((total, category) => total + category.productCount, 0);
           
            res.render('category', {
                products: mutipleMongooseToObject(products),
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                keyword,
                sort,
                brands,
                colors,
                selectedColors,
                dealProducts: mutipleMongooseToObject(dealProducts),
                categories: mutipleMongooseToObject(categories),
                totalAll:totalAll,
            });
        } catch (error) {
            next(error);
        }
    }
    
    

    async ViewProductDetails(req, res, next) {
        try {
            const product = await ProductService.getProductBySlug(req.params.slug);
            if (!product) return res.status(404).send('Product not found');

            const relevantProducts = await ProductService.getRelevantProductsByBrand(product.brand, 9,req.params.slug);

            const page = parseInt(req.query.reviewPage) || 1;
            const limit = 5;

            const { reviews, totalReviews, totalPages, currentPage } = await ReviewController.getReviewsByProductId(
                product._id,
                page,
                limit
            );

            const overallRating = await ReviewController.getOverallRating(product._id);
            product.rate = overallRating;
            await product.save();

            const ratingBreakdown = await ReviewController.getRatingBreakdown(product._id);

            res.render('product-details', {
                product: mongooseToObject(product),
                relevantProducts: mutipleMongooseToObject(relevantProducts),
                reviews: mutipleMongooseToObject(reviews),
                overallRating,
                totalReviews,
                ratingBreakdown,
                user: req.user,
                reviewPagination: { totalPages, currentPage },
            });
        } catch (error) {
            next(error);
        }
    }

   
    

    async SearchProduct(req, res, next) {
        try {
            const {
                type: productType,
                brand: productBrand,
                color: productColor,
                minPrice,
                maxPrice,
                page = 1,
                limit = 12,
                keyword,
                sort,
            } = req.query;
    
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const filters = {};
    
            // Lọc theo từ khóa
            if (keyword) filters.name = { $regex: keyword, $options: 'i' };
    
            // Lọc theo loại sản phẩm
            if (productType) filters.type = { $in: productType.split(',') };
    
            // Lọc theo thương hiệu
            if (productBrand) filters.brand = { $in: productBrand.split(',') };
    
            // Lọc theo màu trong stock.color
            if (productColor) {
                const colorArray = productColor.split(',');
                filters['stock.color'] = { $in: colorArray }; // Lọc các màu bên trong mảng stock.color
            }
    
            // Lọc theo giá
            if (minPrice || maxPrice) {
                filters.salePrice = {
                    ...(minPrice && { $gte: parseFloat(minPrice) }),
                    ...(maxPrice && { $lte: parseFloat(maxPrice) }),
                };
            }
    
            // Sắp xếp
            let sortCriteria = {};
            switch (sort) {
                case 'price_asc': sortCriteria = { salePrice: 1 }; break;
                case 'price_desc': sortCriteria = { salePrice: -1 }; break;
                case 'creation_time_desc': sortCriteria = { createdAt: -1 }; break;
                case 'rate_desc': sortCriteria = { rate: -1 }; break;
                default: sortCriteria = {};
            }
    
            // Lấy tổng sản phẩm và danh sách sản phẩm theo bộ lọc
            const total = await ProductService.countProducts(filters);
            const products = await ProductService.getProductList(filters, sortCriteria, skip, limit);
            const dealProducts = await ProductService.getProducts();
            const colors = await ProductService.getProductsByCondition({}, 'stock.color');
            const brands = await ProductService.getProductsByCondition({}, 'brand');
    
            if (req.xhr) {
                return res.json({
                    products: mutipleMongooseToObject(products),
                    total,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                });
            }
             //Lấy danh mục
        const categories = await CategoryService.getCategories();
          //  console.log('cc',categories)
        //Tổng sản phẩm cho danh mục All
        const totalAll = categories.reduce((total, category) => total + category.productCount, 0);
      
            // Render view
            res.render('category', {
                products: mutipleMongooseToObject(products),
                total,
                totalAll,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                dealProducts: mutipleMongooseToObject(dealProducts),
                brands,
                colors,
                categories: mutipleMongooseToObject(categories),
            });
        } catch (error) {
            console.error('Error filtering products:', error);
            next(error);
        }
    }
    
    async getStockInfo(req, res) {
        try {
            const { slug, size, color } = req.query;
            if (!slug || !size || !color) {
                return res.status(400).json({ error: 'Missing parameters' });
            }

            const quantity = await ProductService.getStockInfo(slug, size, color);

            if (quantity === null) {
                return res.status(404).json({ error: 'Product not found or out of stock' });
            }

            res.json({ quantity });
        } catch (error) {
            console.error('Error fetching stock info:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
 

}

module.exports = new ProductController();
