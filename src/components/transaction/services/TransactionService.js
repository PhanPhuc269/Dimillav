
const Transaction = require("@components/transaction/models/Transaction");
const Order = require("@components/order/models/Order");
const { checkPaid } = require("../../../utils/payment");

class TransactionService {
    // Lấy danh sách giao dịch của người dùng
    async getTransactionsByUser(userId) {
        try {
            return await Transaction.find({ userId }).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error retrieving transactions: ${error.message}`);
        }
    }

    // Lấy giao dịch theo ID
    async getTransactionById(transactionId) {
        try {
            return await Transaction.findById(transactionId);
        } catch (error) {
            throw new Error(`Error retrieving transaction by ID: ${error.message}`);
        }
    }

    // Tạo giao dịch mới
    async createTransaction(orderId, customerId) {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error("Order not found");
            }

            const amount = order.totalAmount;
            if (!amount || amount <= 0) {
                throw new Error("Invalid total amount in order");
            }

            const newTransaction = new Transaction({
                customerId,
                amount,
                paymentMethod: "bank",
                orderId,
                description: `Order Id ${orderId}`,
                status: "pending",
            });

            await newTransaction.save();
            return newTransaction;
        } catch (error) {
            throw new Error(`Error creating transaction: ${error.message}`);
        }
    }

    // Xử lý thanh toán
    
    async processPayment(transactionId) {
        try {
            let transaction = await Transaction.findById(transactionId);
            if (!transaction) {
                return {
                    success: false,
                    message: "Transaction not found",
                };
            }
    
            if (transaction.status === "completed") {
                return {
                    success: false,
                    message: "Transaction has already been completed.",
                };
            }
    
            if (transaction.status === "failed") {
                return {
                    success: false,
                    message: "Transaction has already failed.",
                };
            }
    
            // Nếu giao dịch bị hủy, chuyển lại trạng thái thành pending
            if (transaction.status === "canceled") {
                transaction.status = "pending";
                await transaction.save();
            }
    
            const timeout = 5 * 60 * 1000; // 5 phút
            const checkInterval = 3 * 1000; // Kiểm tra mỗi 3 giây
            let elapsed = 0;
    
            while (elapsed < timeout) {
                // Lấy trạng thái mới nhất từ cơ sở dữ liệu
            transaction = await Transaction.findById(transactionId);
            if (!transaction) {
                throw new Error("Transaction not found during processing.");
            }

            if (transaction.status === "canceled") {
                throw new Error("Transaction was canceled by the user.");
            }
                if (transaction.status === "canceled") {
                    return {
                        success: false,
                        message: "Transaction was canceled by the user.",
                    };
                }
    
                const isPaid = await checkPaid(transaction.amount, transaction.description);
                if (isPaid.success) {
                    transaction.status = "completed";
                    await transaction.save();
    
                    const order = await Order.findById(transaction.orderId);
                    if (order) {
                        order.status = "paid";
                        await order.save();
                    }
    
                    return {
                        success: true,
                        message: "Transaction completed successfully.",
                        transaction,
                    };
                }
    
                await new Promise((resolve) => setTimeout(resolve, checkInterval));
                elapsed += checkInterval;
            }
    
            transaction.status = "failed";
            await transaction.save();
            return {
                success: false,
                message: "Payment timeout exceeded.",
            };
        } catch (error) {
            console.error("Error processing payment:", error);
            return {
                success: false,
                message: `Error processing payment: ${error.message}`,
            };
        }
    }
    
    


    async getAllTransactions() {
        try {
            return await Transaction.find().sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error retrieving all transactions: ${error.message}`);
        }
    }

    
  
    async cancelPayment(transactionId) {
        try {
            const transaction = await Transaction.findById(transactionId);
            if (!transaction) {
                throw new Error("Transaction not found.");
            }
    
            // Chỉ cho phép hủy giao dịch nếu trạng thái đang là "pending"
            if (transaction.status !== "pending") {
                throw new Error("Transaction cannot be canceled because it is not pending.");
            }
    
            transaction.status = "canceled";
            await transaction.save();
            return { success: true, message: "Transaction canceled successfully." };
        } catch (error) {
            console.error("Error canceling transaction:", error);
            return { success: false, message: error.message };
        }
    }
    
    

}

module.exports = new TransactionService();