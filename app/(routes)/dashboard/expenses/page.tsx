'use client'
import React from 'react';
import ExpenseListTable from './_component/ExpenseListTable';
import { db } from '@/utils/dbConfig';
import { Expenses, Budgets } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


interface Expense {
  id: number;
  name: string;
  amount: number;
  createdAt: string;
}

export default function ExpensesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [expensesList, setExpensesList] = React.useState<Expense[]>([]);

  React.useEffect(() => {
    if (!user) {
      router.replace('/dashboard');
      return;
    }
    getAllExpenses();
    // eslint-disable-next-line
  }, [user]);

  const getAllExpenses = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt,
    })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, email))
      .orderBy(desc(Expenses.id));
    setExpensesList(result as Expense[]);
  };

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl mb-7">All Expenses</h2>
      <ExpenseListTable expenseList={expensesList} refreshData={getAllExpenses} />
    </div>
  );
} 