import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Expenses } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import { toast } from "sonner";
import moment from "moment";
import { Loader } from "lucide-react";

interface AddExpenseProps {
  budgetId: number | string;
  user?: any;
  refreshData: () => void;
}

const AddExpense = ({ budgetId, refreshData }: AddExpenseProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function addNewExpense() {
    if (!name.trim() || !amount.trim() || isNaN(Number(amount))) {
      toast.error("Please enter a valid name and numeric amount");
      return;
    }

    setLoading(true);
    try {
      const budgetIdNumber =
        typeof budgetId === "string" ? Number(budgetId) : budgetId;
      if (isNaN(budgetIdNumber)) {
        toast.error("Invalid budget ID");
        setLoading(false);
        return;
      }

      const result = await db
        .insert(Expenses)
        .values({
          name: name.trim(),
          amount: Number(amount),
          budgetId: budgetIdNumber,
          createdAt: moment().toISOString(), // ISO format preferred for dates
        })
        .returning();

      console.log(result);

      setName("");
      setAmount("");
      toast.success("New Expense Added!");
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border p-5 rounded-lg w-full">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          value={name}
          placeholder="e.g. Bedroom Decor"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          value={amount}
          placeholder="e.g. ₹ 1000"
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount) || loading}
        className="mt-3 w-full"
        onClick={addNewExpense}
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
};

export default AddExpense;
