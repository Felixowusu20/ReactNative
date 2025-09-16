import express from "express";
import { 
  createTransactions, 
  getTransactionsByuserId, 
  deleteTransaction, 
  summaryOfTransactions,
  getAllTransactions
} from "../controllers/transactionsControllers.js";

const router = express.Router();

// ✅ GET all transactions
router.get("/", getAllTransactions);

// ✅ GET transactions by userId
router.get("/:userId", getTransactionsByuserId);

// ✅ POST create a transaction
router.post("/", createTransactions);

// ✅ DELETE transaction by ID
router.delete("/:id", deleteTransaction);

// ✅ GET summary of income, expenses, and balance by userId
router.get("/summary/:userId", summaryOfTransactions);

export default router;
