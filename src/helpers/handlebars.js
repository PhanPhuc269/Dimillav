const Handlebars = require('handlebars');
const User = require('@components/auth/models/User');
const { mutipleMongooseToObject } = require('../utils/mongoose');
const { mongooseToObject } = require('../utils/mongoose');



module.exports={
    sum: (a, b) => a + b,
    sortable: (field, sort) => {
      const sortType = field === sort.column ? sort.type : 'default';

      const icons = {
        default: 'fa-solid fa-sort',
        asc: 'fa-solid fa-arrow-down-short-wide',
        desc: 'fa-solid fa-arrow-down-wide-short',
      };

      const types = {
        default: 'desc',
        asc: 'desc',
        desc: 'asc',
      };

      const icon = icons[sortType];
      const type = types[sortType];

      const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`);

      const output = `<a href="?_sort&column=${field}&type=${type}">
        <i class="${icon}"></i>
      </a>`;
        return new Handlebars.SafeString(output);
    },

    eq: (a, b) => a === b,
    formatDuration:(seconds) => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            return `${hours}h ${minutes}m ${remainingSeconds}s`;
        },
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
    lte: (a, b) => a <= b,
    multiply: (a, b) => a * b,
    add: (a, b) => a + b,
    sub: (a, b) => a - b,
    ifEquals: (a, b, options) => (a === b ? options.fn(this) : options.inverse(this)),
    createPagination: (currentPage, totalPages) => {
      let pages = [];
      for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
      }
      return pages;
    },   
    formatDate: function (date) {
      const d = new Date(date);
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      return `${d.getFullYear()}-${month}-${day}`;
    },
    range: (start, end) => {
      let rangeArray = [];
      for (let i = start; i <= end; i++) {
        rangeArray.push(i);
      }
      return rangeArray;
    },     
    ternary: (condition, trueValue, falseValue) => {
      return condition ? trueValue : falseValue;
    },
    toNumber: (value) => {
     return Number(value);
    },
    not : (value) => {
      return !value;
    },
    // Helper mới: getFirstImage
    getFirstImage: (images) => {
      return images && images.length > 0 ? images[0] : '/path/to/default-image.jpg';
    },

    // Helper mới: uniqueColors
    uniqueColors: function (stock) {
      const unique = [];
      if (stock && Array.isArray(stock)) {
          stock.forEach(item => {
              if (!unique.includes(item.color)) {
                  unique.push(item.color);
              }
          });
      }
      return unique;
    },

    // Helper mới: uniqueSizes
    uniqueSizes: function (stock) {
      const unique = [];
      if (stock && Array.isArray(stock)) {
          stock.forEach(item => {
              if (!unique.includes(item.size)) {
                  unique.push(item.size);
              }
          });
      }
      return unique;
    },

     // Helper mới: formatCurrency
     formatCurrency: function (amount) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    },

    // Helper mới: calculateDiscountPercentage
    calculateDiscountPercentage: function (originalPrice, salePrice) {
      if (originalPrice > salePrice) {
          const discount = Math.round((1 - (salePrice / originalPrice)) * 100);
          return discount;
      } else {
          return 0; // Hoặc trả về giá trị phù hợp nếu không giảm giá
      }
    },

    // Helper mới: json
    json: function (context) {
      return JSON.stringify(context);
    },

    // Helper mới: include
    includes: function (templatePath, options) {
      try {
          const filePath = path.join(__dirname, '..', 'views', `${templatePath}.hbs`);
          const templateContent = fs.readFileSync(filePath, 'utf-8');
          const compiledTemplate = Handlebars.compile(templateContent);
          return compiledTemplate(options.hash);
      } catch (err) {
          console.error(`Error including template: ${templatePath}`, err);
          return '';
      }

    },

    //Định dạng tiền Việt Nam
    formatPrice: function (price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },

    // Helper mới: formatCurrencyVND
    formatCurrencyVND: function (value) {
     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    },
  

   // Helper mới: formatCurrencyVND
   formatCurrencyVND: function (value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    },



}