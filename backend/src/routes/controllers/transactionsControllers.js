export  const getTransactionsByuserId = async()=>{
    
        try {
            const{userId} = res.params
            // Testing it on the console or the terminal
            // console.log(userId)
            const transaction = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
            `
            res.status(201).json(transaction)
        } catch (error) {
            console.log("error getting the transaction" , error)
            res.status(500).json({message:"Internal server error"})
            
        }
    }


export const createTransactions = async ()=>{
        // creating data(transaction) into the database ,title ,amount and catogory
        try{
            const {title ,amount,category,user_id} = req.body
            if(!title || !user_id || amount === undefined){
                return res.status(400).json({message:"All fields are required"})
            }
           const transaction =  await sql`
            INSERT INTO transactions(user_id , title , amount ,category)
            VALUES (${user_id} , ${title} , ${amount} ,${category})
            RETURNING *
            `
            console.log(transaction)
            res.status(201).json(transaction[0])
    
        }catch{
            console.log("Error creating the transactions" , error)
            res.status(500).json({message:"Internal Error"})
    
    
        }
    }
export const deleteTransaction = async()=>{
        try {
            const{userId} = res.params
            // fixing the strings error when type in str instead of integer
            if(isNaN(parseInt(userId ))){
                return res.status(400).json({message:"invalid id"})
            }
            const transaction_del = await sql`
            DELETE FROM transactions WHERE userId = ${userId}
            RETURNING *
            `
            if(transaction_del.length === 0){
                res.status(404).json({message:"Transaction not found"})
            }
            res.status(201).json({message:"Transaction deleted successuflly"})
            
        } catch (error) {
            console.log("Error deleting the transaction")
            res.status(500).json({message:"Internal server error"})
            
        }
    }

export const summaryOfTransactions = async()=>{
    try {
        const{userId} = res.params
        // getting the three parameters income balance and expenses
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}
        `
         const incomeResult =await sql`
            SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `
         const expensesResult =await sql`
            SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0 
        `
        res.status(200).json({
            balance:balanceResult[0].balance,
            income:incomeResult[0].income,
            expenses:expensesResult[0].expenses
        })
        
    } catch (error) {
        console.log("Error getting the summary of  the transaction")
        res.status(500).json({message:"Internal server error"})   
        
    }
}
