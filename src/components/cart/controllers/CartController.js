const CartService = require("@components/cart/services/CartService");
const ProductService = require("@components/product/services/ProductService");

class CartController {
    ViewShoppingCart(req, res, next) {
        res.render("cart");
    }
 
    // async syncCart(req, res) {
    //     try {
    //         const { items } = req.body; // Nhận giỏ hàng từ local storage
    //         const userId = req.user._id; // Lấy userId từ thông tin đăng nhập
    
    //         if (!items || !Array.isArray(items) || items.length === 0) {
    //             return res.status(400).json({ message: "Giỏ hàng trống hoặc không hợp lệ" });
    //         }
    
    //         // Lấy giỏ hàng hiện tại của người dùng từ server
    //         let serverCart = await CartService.findCartByUserId(userId);
    //         const serverItems = serverCart ? serverCart.items : [];
    
    //         console.log('Giỏ hàng từ server:', serverItems);
    
    //         // So sánh local và server để kiểm tra sự khác biệt
    //         const isCartIdentical = () => {
    //             if (items.length !== serverItems.length) return false;
    
    //             // So sánh từng sản phẩm trong giỏ hàng
    //             return items.every((localItem) => {
    //                 const matchingServerItem = serverItems.find(
    //                     (serverItem) =>
    //                         serverItem.productId === localItem.productId &&
    //                         serverItem.size === localItem.size &&
    //                         serverItem.color === localItem.color &&
    //                         serverItem.quantity === localItem.quantity
    //                 );
    //                 return !!matchingServerItem;
    //             });
    //         };
    
    //         if (isCartIdentical()) {
    //             console.log("Giỏ hàng từ local và server giống nhau, không cần hợp nhất.");
    //             return res.status(200).json({
    //                 message: "Giỏ hàng đã đồng bộ.",
    //                 cart: serverItems,
    //             });
    //         }
    
    //         console.log("Giỏ hàng khác nhau, tiến hành hợp nhất.");
    
    //         // Tạo bản đồ để hợp nhất các sản phẩm (key: `slug|size|color`)
    //         const mergedCartMap = new Map();
    
    //         // Thêm các sản phẩm từ giỏ hàng trên server vào bản đồ
    //         for (const item of serverItems) {
    //             const product = await ProductService.getProductById(item.productId); // Lấy thêm thông tin sản phẩm từ productId
    //             mergedCartMap.set(`${item.productId}|${item.size}|${item.color}`, {
    //                 productId: item.productId,
    //                 slug: product.slug,
    //                 name: product.name,
    //                 size: item.size,
    //                 color: item.color,
    //                 quantity: item.quantity,
    //                 price: item.price,
    //                 image: product.images[0] || "", // Lấy ảnh đầu tiên (hoặc để trống nếu không có ảnh)
    //             });
    //         }
    
    //         // Hợp nhất giỏ hàng từ local storage
    //         for (const item of items) {
    //             const product = await ProductService.getProductBySlug(item.slug);
    
    //             if (!product) {
    //                 return res
    //                     .status(400)
    //                     .json({ message: `Không tìm thấy sản phẩm: ${item.slug}` });
    //             }
    
    //             // Kiểm tra tồn tại của size và color
    //             const stockItem = product.stock.find(
    //                 (stock) => stock.size === Number(item.size) && stock.color === item.color
    //             );
    
    //             if (!stockItem) {
    //                 return res
    //                     .status(400)
    //                     .json({
    //                         message: `Sản phẩm "${product.name}" không có size "${item.size}" và màu "${item.color}"`,
    //                     });
    //             }
    
    //             // Kiểm tra số lượng tồn kho
    //             if (stockItem.quantity < Number(item.quantity)) {
    //                 return res
    //                     .status(400)
    //                     .json({
    //                         message: `Sản phẩm "${product.name}" (Size: ${item.size}, Color: ${item.color}) chỉ còn ${stockItem.quantity} sản phẩm trong kho`,
    //                     });
    //             }
    
    //             // Tạo key hợp nhất cho sản phẩm
    //             const key = `${product._id}|${item.size}|${item.color}`;
    //             if (mergedCartMap.has(key)) {
    //                 // Nếu sản phẩm đã tồn tại, cộng dồn số lượng
    //                 mergedCartMap.get(key).quantity += item.quantity;
    //             } else {
    //                 // Nếu chưa có, thêm sản phẩm mới
    //                 mergedCartMap.set(key, {
    //                     productId: product._id,
    //                     slug: product.slug,
    //                     name: product.name,
    //                     size: item.size,
    //                     color: item.color,
    //                     quantity: item.quantity,
    //                     price: product.salePrice,
    //                     image: product.images[0] || "", // Lấy ảnh đầu tiên (hoặc để trống nếu không có ảnh)
    //                 });
    //             }
    //         }
    
    //         // Chuyển bản đồ thành mảng
    //         const mergedCartItems = Array.from(mergedCartMap.values());
    
    //         // Cập nhật giỏ hàng trên server
    //         const cart = await CartService.updateCart(userId, mergedCartItems);
    
    //         console.log('CART MERGED:', mergedCartItems);
    
    //         // Đồng bộ lại giỏ hàng vào local storage
    //         res.status(200).json({
    //             message: "Đồng bộ giỏ hàng thành công",
    //             cart: mergedCartItems,
    //         });
    //     } catch (error) {
    //         console.error("Lỗi đồng bộ giỏ hàng:", error);
    //         res.status(500).json({ message: "Lỗi khi đồng bộ giỏ hàng", error: error.message });
    //     }
    // }
    
    async syncCart(req, res) {
        try {
            const { items } = req.body; // Nhận giỏ hàng từ local storage
            const userId = req.user._id; // Lấy userId từ thông tin đăng nhập
    
            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ message: "Giỏ hàng trống hoặc không hợp lệ." });
            }
    
            // Lấy thông tin đầy đủ cho từng sản phẩm trong giỏ hàng
            const enrichedItems = await Promise.all(
                items.map(async (item) => {
                    const product = await ProductService.getProductBySlug(item.slug);
    
                    if (!product) {
                        return {
                            success: false,
                            error: `Không tìm thấy sản phẩm: ${item.slug}`,
                        };
                    }
    
                    const stockItem = product.stock.find(
                        (stock) => stock.size === Number(item.size) && stock.color === item.color
                    );
    
                    if (!stockItem) {
                        return {
                            success: false,
                            error: `Sản phẩm "${product.name}" không có size "${item.size}" và màu "${item.color}".`,
                        };
                    }
    
                    // Kiểm tra số lượng tồn kho
                    if (stockItem.quantity < item.quantity) {
                        return {
                            success: false,
                            error: `Sản phẩm "${product.name}" (Size: ${item.size}, Color: ${item.color}) chỉ còn ${stockItem.quantity} sản phẩm trong kho.`,
                        };
                    }
    
                    return {
                        success: true,
                        data: {
                            productId: product._id,
                            slug: product.slug,
                            name: product.name,
                            size: item.size,
                            color: item.color,
                            quantity: item.quantity,
                            price: product.salePrice,
                            image: product.images[0] || "", // Lấy ảnh đầu tiên (hoặc để trống nếu không có ảnh)
                        },
                    };
                })
            );
    
            // Kiểm tra nếu có bất kỳ sản phẩm nào gặp lỗi
            const errors = enrichedItems.filter((item) => !item.success).map((item) => item.error);
    
            if (errors.length > 0) {
                return res.status(400).json({
                    message: "Một số sản phẩm trong giỏ hàng không hợp lệ.",
                    errors,
                });
            }
    
            // Lấy danh sách các sản phẩm hợp lệ
            const validItems = enrichedItems.filter((item) => item.success).map((item) => item.data);
    
            // Ghi đè giỏ hàng từ local lên server
            console.log("Người dùng đã login, ghi đè giỏ hàng từ local lên server.");
            const updatedCart = await CartService.updateCart(userId, validItems);
    
            return res.status(200).json({
                message: "Ghi đè giỏ hàng thành công.",
                cart: updatedCart.items,
            });
        } catch (error) {
            console.error("Lỗi đồng bộ giỏ hàng:", error.message);
            res.status(500).json({ message: `Lỗi khi đồng bộ giỏ hàng: ${error.message}` });
        }
    }
    
    



    async updateCartBatch(req, res) {
        const userId = req.user._id; // Giả định có userId từ middleware xác thực
        const updates = req.body.updates; // Danh sách thay đổi từ client

        if (!Array.isArray(updates)) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
        }

        try {
            const dbCart = await CartService.findCartByUserId(userId);
            if (!dbCart) {
                return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
            }

            const updatedItems = dbCart.items.map((item) => {
                const update = updates.find((u) => u.slug === item.slug);
                if (update) {
                    return {
                        ...item,
                        quantity: update.quantity || item.quantity,
                        price: update.price || item.price,
                    };
                }
                return item;
            });

            // Thêm sản phẩm mới nếu chưa có
            updates.forEach((update) => {
                if (!dbCart.items.find((item) => item.slug === update.slug) && update.quantity > 0) {
                    updatedItems.push(update);
                }
            });

            // Loại bỏ sản phẩm có số lượng = 0
            const finalItems = updatedItems.filter((item) => item.quantity > 0);

            const cart = await CartService.updateCart(userId, finalItems);
            res.status(200).json({ message: "Cập nhật giỏ hàng thành công", cart });
        } catch (error) {
            console.error("Lỗi cập nhật giỏ hàng:", error);
            res.status(500).json({ message: "Lỗi cập nhật giỏ hàng" });
        }
    }
}

module.exports = new CartController();
