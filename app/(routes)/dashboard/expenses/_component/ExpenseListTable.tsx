import React from 'react'
import { Trash2 } from 'lucide-react';
import { Budgets, Expenses } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import { eq} from "drizzle-orm";
import { toast } from "sonner";

const ExpenseListTable = ({expenseList, refreshData}: {expenseList: any, refreshData: any}) => {

  const deleteExpense = async (expenses)=>{
    const result = await db.delete(Expenses)
    .where(eq(Expenses.id, expenses.id))
    .returning()

    if(result){
      toast("Expense Deleted!")
      refreshData()
    }

  }

  return (
    <div className='mt-3  '>
      <div className='grid grid-cols-4 bg-slate-200 p-2'>
        <h2 className='font-bold'>Name</h2>
        <h2 className='font-bold'>Amount</h2>
        <h2 className='font-bold'>Date</h2>
        <h2 className='font-bold'>Action</h2>
      </div>

      {expenseList.map((expenses, index)=>(
        <div key={index} className='grid grid-cols-4 bg-slate-50 p-2'>
        <h2>{expenses.name}</h2>
        <h2>{expenses.amount}</h2>
        <h2>{expenses.createdAt}</h2>
        <h2>
          <Trash2 
          className="text-red-600 cursor-pointer"
          onClick={()=>deleteExpense(expenses)}
          />
        </h2>
       
      </div>
      ))}

    </div>
  )
}

export default ExpenseListTable
