import { ModeToggle } from "@/components/mode.toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4 w-40 p-4">
      This is protected route
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  );
}
