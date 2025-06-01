import React, {useEffect, useState, useCallback} from 'react'
import {PiggyBank, ReceiptText, Wallet } from 'lucide-react';


type BudgetWithStats = {
  id: number;
  name: string;
  amount: number;
  icon: string;
  createdBy: string;
  totalSpend: number;
  totalItem: number;
};

const CardInfo = ({ budgetList }: { budgetList: BudgetWithStats[] }) => {


  const [totalBudget, setTotalBudget] = useState(0); 
  const [totalSpend, setTotalSpend] = useState(0); 

  const calculateCardInfo = useCallback(() => {
    console.log(budgetList); 
    let totalBudget_ = 0; 
    let totalSpend_ = 0; 

    budgetList.forEach(element => {
      totalBudget_ = totalBudget_ + Number(element.amount); 
      totalSpend_ = totalSpend_ + element.totalSpend
    });

    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_)
    console.log(totalBudget_, totalSpend_); 

}, [budgetList]);

  useEffect(()=>{
    calculateCardInfo(); 
  }, [budgetList, calculateCardInfo])

  return (
     <div>    
      {budgetList?.length > 0  ? <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
          <h2 className='text-sm'>Total Budget</h2>
          <h2 className="font-bold text-2xl">₹ {totalBudget}</h2>
        </div>
        <PiggyBank className='bg-indigo-600 p-3 w-12 rounded-full h-12 text-white'  />
      </div>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
          <h2 className='text-sm'>Total Spend</h2>
          <h2 className="font-bold text-2xl">₹ {totalSpend}</h2>
        </div>
        <ReceiptText className='bg-indigo-600 p-3 w-12 rounded-full h-12 text-white'  />
      </div>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
          <h2 className='text-sm'>No. Of Budget</h2>
          <h2 className="font-bold text-2xl"> {budgetList?.length}</h2>
        </div>
        <Wallet className='bg-indigo-600 p-3 w-12 rounded-full h-12 text-white'  />
      </div>
    </div> : <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
       {[1, 2, 3].map((item, index)=>(
          <div key={index} className='h-[110px] w-full bg-slate-200 animate-pulse  rounded-sm'></div>
        ) )}
      </div>}
    </div> 

  )
}

export default CardInfo;
