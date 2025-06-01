import React from 'react'
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer
} from 'recharts'

type BudgetItem = {
  name: string
  totalSpend: number
  amount: number
}

const BarChartDashboard = ({ budgetList }: { budgetList: BudgetItem[] }) => {
  return (
    <div className="w-full border rounded-lg p-9 h-[350px]">
      <h2 className='font-bold pb-3 text-lg'>Activity</h2>
      <ResponsiveContainer width="80%" height={300}>
        <BarChart
          data={budgetList}
          margin={{ top: 7, right: 5, left: 5, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSpend" stackId="a" fill="#4845d2" />
          <Bar dataKey="amount" stackId="a" fill="#C3C2FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartDashboard
