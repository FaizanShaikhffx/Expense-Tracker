'use client'
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import React, {useState, useEffect} from "react";
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
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { toast } from "sonner";
import { eq} from "drizzle-orm";

const EditBudget = ({budgetInfo, refreshData}: {budgetInfo: any, refreshData: any}) => {

    const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState<string>('');
    const [amount, setAmount] = useState<number | undefined>();
    const { user } = useUser();

     useEffect(()=>{
      if(budgetInfo){
        setEmojiIcon(budgetInfo?.icon); 
        setAmount(budgetInfo.amount); 
        setName(budgetInfo.name); 
      }
    }, [budgetInfo])

    const onUpdateBudget = async() => {
      const result = await db.update(Budgets).set({
        name: name, 
        amount: amount, 
        icon: emojiIcon, 
      }).where(eq(Budgets.id, budgetInfo.id))
      .returning()

      if(result){
        toast('Budget Updated');
        refreshData(); 
      }

    }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex gap-2"><PenBox /> Edit </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <DialogDescription>
              Give a name, amount, and icon for your new budget.
            </DialogDescription>
          </DialogHeader>

          {/* Move the main form content here outside DialogDescription */}
          <div className="mt-5">
            <Button
              variant={"outline"}
              size={"lg"}
              className="text-lg"
              onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
            >
              {emojiIcon}
            </Button>
            {openEmojiPicker && (
              <div className="absolute z-20">
                <EmojiPicker
                  onEmojiClick={(e) => {
                    setEmojiIcon(e.emoji);
                    setOpenEmojiPicker(false);
                  }}
                />
              </div>
            )}
            <div className="mt-2">
              <h2 className="text-black font-medium my-1">Budget Name</h2>
              <Input
                placeholder="e.g. Home Decor"
                defaultValue={budgetInfo?.name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <h2 className="text-black font-medium my-1">Budget Amount</h2>
              <Input
                placeholder="e.g. 5000 ₹"
                type="number"
                defaultValue={budgetInfo?.amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                className="mt-5 w-full"
                onClick={() => onUpdateBudget()}
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
