import React from 'react';
import { Trash2 } from 'lucide-react';
import { Expenses } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

interface ExpenseType {
  id: number;
  name: string;
  amount: number;
  budgetId: number | null;
  createdAt: string;
}

interface ExpenseListTableProps {
  expenseList: ExpenseType[];
  refreshData: () => void;
}

const ExpenseListTable = ({ expenseList, refreshData }: ExpenseListTableProps) => {

  const deleteExpense = async (expense: ExpenseType) => {
    try {
      const result = await db
        .delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result) {
        toast.success("Expense Deleted!");
        refreshData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense");
    }
  };

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Expenses</h2>

      <div className="grid grid-cols-4 bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>

      {expenseList.length > 0 ? (
        expenseList.map((expense) => (
          <div key={expense.id} className="grid grid-cols-4 bg-slate-50 p-2">
            <h2>{expense.name}</h2>
            <h2>{expense.amount}</h2>
            <h2>{expense.createdAt}</h2>
            <h2>
              <Trash2
                className="text-red-600 cursor-pointer"
                onClick={() => deleteExpense(expense)}
              />
            </h2>
          </div>
        ))
      ) : (
        <p className="p-2">No expenses found.</p>
      )}
    </div>
  );
};

export default ExpenseListTable;
