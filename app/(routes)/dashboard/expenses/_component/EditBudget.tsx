'use client'
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { toast } from "sonner";
import { eq } from "drizzle-orm";

interface BudgetInfoType {
  id: number;
  icon: string | null;
  name: string;
  amount: number;
  // add other fields if needed
}

interface EditBudgetProps {
  budgetInfo: BudgetInfoType | null;
  refreshData: () => void;
}

const EditBudget = ({ budgetInfo, refreshData }: EditBudgetProps) => {
  const [emojiIcon, setEmojiIcon] = useState<string | null>(budgetInfo?.icon ?? null);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState<string>(budgetInfo?.name ?? "");
  const [amount, setAmount] = useState<number | undefined>(budgetInfo?.amount);

  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo.icon);
      setAmount(budgetInfo.amount);
      setName(budgetInfo.name);
    }
  }, [budgetInfo]);

  const onUpdateBudget = async () => {
    if (!budgetInfo) return;

    try {
      const result = await db
        .update(Budgets)
        .set({
          name,
          amount: amount ?? 0,
          icon: emojiIcon,
        })
        .where(eq(Budgets.id, budgetInfo.id))
        .returning();

      if (result) {
        toast.success("Budget Updated");
        refreshData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update budget");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex gap-2">
            <PenBox /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <DialogDescription>
              Give a name, amount, and icon for your new budget.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 relative">
            <Button
              variant={"outline"}
              size={"lg"}
              className="text-lg"
              onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
            >
              {emojiIcon ?? "Select Icon"}
            </Button>
            {openEmojiPicker && (
              <div className="absolute z-20">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setEmojiIcon(emojiData.emoji);
                    setOpenEmojiPicker(false);
                  }}
                />
              </div>
            )}
            <div className="mt-2">
              <h2 className="text-black font-medium my-1">Budget Name</h2>
              <Input
                placeholder="e.g. Home Decor"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <h2 className="text-black font-medium my-1">Budget Amount</h2>
              <Input
                placeholder="e.g. 5000 ₹"
                type="number"
                value={amount ?? ""}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!name || !amount}
                className="mt-5 w-full"
                onClick={onUpdateBudget}
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditBudget;
