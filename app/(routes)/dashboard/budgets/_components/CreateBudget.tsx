"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function CreateBudget() {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);

  const { user } = useUser();

  async function onCreateBudget() {
    const result = await db
      .insert(Budgets)
      .values({
        name: name,
        amount: amount,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        icon: emojiIcon,
      })
      .returning({ insertedId: Budgets.id });

    if (result) {
      toast("New Budget Created!");
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <div className=" mt-7 bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md ">
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
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
              <div className="absolute z-10">
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
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <h2 className="text-black font-medium my-1">Budget Amount</h2>
              <Input
                placeholder="e.g. 5000 ₹"
                type="number"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                className="mt-5 w-full"
                onClick={() => onCreateBudget()}
              >
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
