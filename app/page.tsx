import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4 w-40 p-4">
      <h2 className="text-xl text-indigo-500 font-bold">Discord</h2>
      <Button variant="devTest">Sign Up</Button>
    </div>
  );
}
