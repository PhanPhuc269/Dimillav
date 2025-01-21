const Product = require("../models/Product");
const Category = require("../models/Category");

class CategoryService {
    async getCategories() {
        try {
            return await Category.find();
        } catch (error) {
            throw new Error("Error fetching category list: " + error.message);
        }
    }

    // Hàm lấy tên subCategory từ slug
    async getSubCategoryName(slug) {
        try {
            const category = await Category.findOne({ "subCategories.slug": slug });
            if (!category) {
                return null;
            }
            const subCategory = category.subCategories.find(sub => sub.slug === slug);
            return subCategory.name;
        } catch (error) {
            throw new Error("Error fetching sub-category name: " + error.message);
        }
    }
    
   
}

module.exports = new CategoryService();
