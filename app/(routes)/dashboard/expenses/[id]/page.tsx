"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { eq, getTableColumns, sql, desc, and } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_component/AddExpense";
import ExpenseListTable from './../_component/ExpenseListTable';

export default function ExpensesScreen() {
  const params = useParams();

  const { user } = useUser();
  type BudgetInfoType = {
  totalSpend: number;
  totalItem: number;
  id: number;
  name: string;
  amount: number;
  icon: string | null;
  createdBy: string;
};

const [budgetInfo, setBudgetInfo] = useState<BudgetInfoType | undefined>();
const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    user && getBudgetInfo();
    
  }, [user]);

  const getBudgetInfo = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    const budgetId = params.id as string;

    if (!email || !budgetId) return;

    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(
        and(eq(Budgets.createdBy, email), eq(Budgets.id, Number(budgetId)))
      )
      .groupBy(
        Budgets.id,
        Budgets.name,
        Budgets.amount,
        Budgets.icon,
        Budgets.createdBy
      );
    setBudgetInfo(result[0]);
    getExpenseList()
  };

  const getExpenseList = async() => {
    const result = await db.select().from(Expenses)
    .where(eq(Expenses.budgetId, params.id ))
    .orderBy(desc(Expenses.id)); 
    setExpensesList(result); 
    console.log(result)
  }


  return (
    <div className="p-10 ">
      <h2 className="text-2xl font-bold mb-7">My Expenses</h2>
      <div className="grid grid-cols-1  md:grid-cols-2 gap-5 ">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>
        )}
        <AddExpense
          budgetId={params.id}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>
      <div className="mt-4">
        <h2 className="font-bold text-lg ">Latest Expenses</h2>
        <ExpenseListTable expenseList={expensesList} refreshData={()=>getBudgetInfo()} />
      </div>
    </div>
  );
}
