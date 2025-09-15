///react custom hook file


import { useCallback, useState } from "react"
import {Alert} from "react-native"
const API_URL = "https://localhost:5008/api"

export const useTransactions = (userId)=>{
    const [transactions , setTransactions] = useState([])
    const [summary ,setSummary] = useState({
        balance:0,
        income:0,
        expenses:0
    })
    const [isLoading ,setIsLoading]  = useState(true)
    //useCallback function is used t o perfomr reasons, it will momoize the function
    const fetchTransactions = useCallback(
        async()=>{
        try {
            const res =await  fetch(`${API_URL}/transactions/${userId}`)
            const data = await res.json()
            setTransactions(data)
        } catch (error) {
            console.error("Error fetching transactions:",error)   
        }
    },[userId]
    )
    const fetchSummary = useCallback(async()=>{
        try {
            const res = await fetch(`${API_URL}/transactions/${userId}`)
            const data = await res.json()
            setSummary(data)
        } catch (error) {
            console.error("Error fetching summary:" , error)
            
        }
    } , [userId])

    const LoadData =useCallback(async()=>{
        if(!userId) return
        setIsLoading(true)
        //this function let the summary and the transactions work in parallel
        try {
            await Promise.all([fetchTransactions() , fetchSummary()])
        } catch (error) {
            console.error("Error loading data:",error)
        }finally{
            setIsLoading(false)
        }
    })
    const deleteTransactions = async(useId) =>{
        try {
            const res = await fetch(`${API_URL}/transactions/${userId}` , {method:"DELETE"})
            if(!res.ok) throw new Error("Failed to delete transaction")

                //refresh the page after deletion
                LoadData()
                Alert.alert("Success" ,"Transaction deleted successfullt")
        } catch (error) {
            console.error("Error deleting the transaction")
            Alert.alert("Error" ,error.message)
            
        }
    }
    return {transactions ,summary , isLoading , LoadData ,deleteTransactions}

}