import React from 'react'
import Link from 'next/link'

type Budget = {
  id: number
  icon: string
  name: string
  totalItem?: number
  totalSpend: number
  amount: number
}

const BudgetItem = ({ budget }: { budget: Budget }) => {
  const calculateProgressPercentage = () => {
    const perc = (budget.totalSpend / budget.amount) * 100
    return perc.toFixed(2)
  }

  return (
    <Link href={`/dashboard/expenses/${budget.id}`}>
      <div className="p-5 border rounded-lg hover:shadow-md cursor-pointer h-[160px]">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">{budget.icon}</h2>
            <div>
              <h2 className="font-bold">{budget.name}</h2>
              <h2 className="text-sm text-gray-500">
                {budget.totalItem ?? 0} Item
              </h2>
            </div>
          </div>
          <h2 className="font-bold text-indigo-600 text-lg">₹ {budget.amount}</h2>
        </div>
        <div className="mt-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs text-slate-400">₹ {budget.totalSpend ?? 0} Spend</h2>
            <h2 className="text-xs text-slate-400">
              ₹ {budget.amount - (budget.totalSpend ?? 0)} Remaining
            </h2>
          </div>
          <div className="w-full bg-slate-300 h-2 rounded-full">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${calculateProgressPercentage()}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BudgetItem
