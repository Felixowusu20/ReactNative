import express from "express"
import {createTransactions, getTransactionsByuserId,deleteTransaction, summaryOfTransactions} from "./controllers/transactionsControllers.js"

const router = express.Router()
// endpoint for retrieving the data
router.get("/:userId" ,getTransactionsByuserId)
// endpoint for creating transactions
router.post("/", createTransactions)


// enppoint for deleting item by id
router.delete("/:userId" ,deleteTransaction)

// endpoint for getting the summary of the all the income , expenses and the balance

router.get("/summary/:userId",summaryOfTransactions)

export default router