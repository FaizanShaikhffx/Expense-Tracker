"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { eq, getTableColumns, sql, desc, and } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_component/AddExpense";
import ExpenseListTable from "./../_component/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditBudget from "../_component/EditBudget";

export default function ExpensesScreen() {
  const params = useParams();
  const route = useRouter();
  const { user } = useUser();

  type BudgetInfoType = {
    totalSpend: number;
    totalItem: number;
    id: number;
    name: string;
    amount: number;
    icon: string;
    createdBy: string;
  };

  const [budgetInfo, setBudgetInfo] = useState<BudgetInfoType | null>(null);
  type ExpenseType = {
    id: number;
    name: string;
    amount: number;
    budgetId: number | null;
    createdAt: string;
  };

  const [expensesList, setExpensesList] = useState<ExpenseType[]>([]);

  const getExpenseList = useCallback(async () => {
    const budgetId = Number(params.id);
    if (isNaN(budgetId)) return;

    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, budgetId))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);
  }, [params.id]);

  const getBudgetInfo = useCallback(async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    const budgetId = Number(params.id);

    if (!email || isNaN(budgetId)) return;

    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(and(eq(Budgets.createdBy, email), eq(Budgets.id, budgetId)))
      .groupBy(
        Budgets.id,
        Budgets.name,
        Budgets.amount,
        Budgets.icon,
        Budgets.createdBy
      );

    setBudgetInfo(result[0] ? { ...result[0], icon: result[0].icon ?? '' } : null);
    getExpenseList();
  }, [user, params.id, getExpenseList]);

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user, getBudgetInfo]);

  const deleteBudget = async () => {
    const budgetId = Number(params.id);
    if (isNaN(budgetId)) return;
    const deleteExpenseResult = await db
      .delete(Expenses)
      .where(eq(Expenses.budgetId, budgetId))
      .returning();

    if (deleteExpenseResult) {
      await db
        .delete(Budgets)
        .where(eq(Budgets.id, budgetId))
        .returning();
    }
    toast("Budget Deleted !");
    route.replace("/dashboard/budgets");
  };

  return (
    <div className="p-10 ">
      <h2 className="text-2xl font-bold mb-7 flex justify-between items-center">
        My Expenses
        <div className="flex gap-2 items-center ">
        <EditBudget budgetInfo={budgetInfo} refreshData={()=>getBudgetInfo()} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex gap-2" variant={"destructive"}>
              <Trash />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                current budget along with expenses and remove your data from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteBudget()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </h2>
      <div className="grid grid-cols-1  md:grid-cols-2 gap-5 ">
        {budgetInfo ? (
          <BudgetItem budget={{ ...budgetInfo, icon: budgetInfo.icon ?? '' }} />
        ) : (
          <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>
        )}
        <AddExpense
          budgetId={params.id as string}
          refreshData={() => getBudgetInfo()}
        />
      </div>
      <div className="mt-4">
        
        <ExpenseListTable
          expenseList={expensesList}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
}
