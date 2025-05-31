import React, {useState} from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Budgets, Expenses } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import { toast } from "sonner";
import moment from "moment";

const AddExpense = ({budgetId, user, refreshData} : {budgetId : any, user: any, refreshData: any}) => {

  const [name, setName] = useState(""); 
  const [amount, setAmount] = useState(""); 

  async function addNewExpense(){
    const result = await db.insert(Expenses).values({
      name: name, 
      amount: Number(amount), 
      budgetId: budgetId, 
      createdAt: moment().format('DD/MM/YYYY')
    }).returning({insertedId: Budgets.id});
    console.log(result);

    if(result){
      refreshData()
      toast("New Expense Added!")
    }
  }

  return (
    <div className='border p-5 rounded-lg w-full'>
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
              <h2 className="text-black font-medium my-1">Expense Name</h2>
              <Input
                placeholder="e.g. Bedroom Decor"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <h2 className="text-black font-medium my-1">Expense Amount</h2>
              <Input
                placeholder="e.g. ₹ 1000"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button 
            disabled={!(name&&amount)} 
            className='mt-3 w-full'
            onClick={()=>addNewExpense()}
            >Add New Expense</Button>
    </div>
  )
}

export default AddExpense
