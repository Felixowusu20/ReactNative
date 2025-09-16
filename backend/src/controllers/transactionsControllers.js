import { sql } from "../config/db.js";

// Get all transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await sql`SELECT * FROM transactions ORDER BY created_at DESC`;
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting all transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get transactions by userId
export const getTransactionsByuserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const transaction = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error getting the transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new transaction
export const createTransactions = async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !user_id || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *`;
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error creating the transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a transaction by ID
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const transaction_del = await sql`
      DELETE FROM transactions WHERE id = ${id}
      RETURNING *
    `;

    if (transaction_del.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting the transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Summary of transactions
export const summaryOfTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}
    `;
    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `;
    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.error("Error getting the summary of transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
