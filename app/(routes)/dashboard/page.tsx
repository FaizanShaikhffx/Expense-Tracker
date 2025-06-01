'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from "@clerk/nextjs";
import CardInfo from './_components/CardInfo';
import { Budgets, Expenses } from '@/utils/schema';
import { eq, getTableColumns, sql, desc } from "drizzle-orm";
import { db } from '@/utils/dbConfig';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from "../dashboard/budgets/_components/BudgetItem";
import ExpenseListTable from './expenses/_component/ExpenseListTable';

type BudgetWithStats = {
  id: number;
  name: string;
  amount: number;
  icon: string;
  createdBy: string;
  totalSpend: number;
  totalItem: number;
};

type ExpenseType = {
  id: number;
  name: string;
  amount: number;
  budgetId: number | null;   
  createdAt: string;
};

export default function Dashboard() {
  const { user } = useUser();

  const [budgetList, setBudgetList] = useState<BudgetWithStats[]>([]);
  const [expensesList, setExpensesList] = useState<ExpenseType[]>([]);

  const getBudgetList = useCallback(async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;

    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, email))
      .groupBy(
        Budgets.id,
        Budgets.name,
        Budgets.amount,
        Budgets.icon,
        Budgets.createdBy
      )
      .orderBy(desc(Budgets.id));

    setBudgetList(result as BudgetWithStats[]);
    getAllExpenses(email); 
  }, [user]);

  const getAllExpenses = async (email: string) => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        budgetId: Expenses.budgetId, 
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, email))
      .orderBy(desc(Expenses.id));

    setExpensesList(result as ExpenseType[]);
  };

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user, getBudgetList]);

  return (
    <div className="p-8">
      <h2 className="font-bold text-3xl">
        Hi, {user?.fullName} ✌️
      </h2>
      <p className="text-gray-500">
        Here&apos;s what&apos;s happening with your money. Let&apos;s manage your expenses.
      </p>
      <CardInfo budgetList={budgetList} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
        <div className="md:col-span-2">
          <BarChartDashboard budgetList={budgetList} />
          <ExpenseListTable expenseList={expensesList} refreshData={() => getBudgetList()} />
        </div>
        <div className="grid gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {budgetList.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
