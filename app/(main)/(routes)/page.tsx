import { ModeToggle } from "@/components/mode.toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4 w-40 p-4 ">
      <h2 className="text-black dark:text-white">This is protected route</h2>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  );
}
