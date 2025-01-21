const authRouter=require('../components/auth/auth');
const productRouter=require('../components/product/productRoutes');
const blogRouter=require('../components/blog/blogRoute');
const pagesRouter=require('../components/pages/pagesRoute');
const contactRouter=require('../components/contact/contactRoute');
const aboutRouter=require('../components/about/aboutRoute');
const cartRouter=require('../components/cart/cartRoute');
const homeRouter=require('../components/home/homeRoute');
const orderRouter=require('../components/order/orderRoute');
const settingRouter=require('../components/setting/settingRoute');
const reviewRoutes = require('../components/review/reviewRoutes');
const transactionRouter=require('../components/transaction/transactionRoute');
const notifyRouter=require('../components/notify/notifyRoute');

function router(app)
{
   app.use('/', authRouter);
   app.use('/product', productRouter);
   app.use('/blog', blogRouter);
   app.use('/pages', pagesRouter);
   app.use('/contact', contactRouter);
   app.use('/about', aboutRouter);
   app.use('/cart', cartRouter);
   app.use('/home', homeRouter);
   app.use('/order', orderRouter);
   app.use('/setting', settingRouter);
   app.use('/reviews', reviewRoutes);
   app.use('/transaction', transactionRouter);
   app.use('/notify', notifyRouter);

}

module.exports = router