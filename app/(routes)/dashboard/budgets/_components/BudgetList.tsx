"use client";
import CreateBudget from "./CreateBudget";
import { eq, getTableColumns, sql, desc } from "drizzle-orm";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./BudgetItem";

type BudgetWithStats = {
  id: number;
  name: string;
  amount: number;
  icon: string;
  createdBy: string;
  totalSpend: number;
  totalItem: number;
};

export default function BudgetList() {
  const [budgetList, setBudgetList] = useState<BudgetWithStats[]>([]);
  const { user } = useUser();

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
  }, [user]);

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user, getBudgetList]);

  return (
    <div>
      <div className="items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateBudget refreshData={getBudgetList} />
        {budgetList.length > 0
          ? budgetList.map((budget) => (
              <BudgetItem key={budget.id} budget={budget} />
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full mt-5 bg-slate-200 rounded-lg h-[160px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}
