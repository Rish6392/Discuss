import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signIn } from "./actions/sign-in";
import { signOut } from "./actions/sign-out";

export default function Home() {
  return (
   <div>
    <h1>Home Page</h1>
    <form action={signIn}>
      <Button type="submit">signIn</Button>
    </form>
    <form action={signOut}>
      <Button type="submit">signOut</Button>
    </form>
    
    </div>
  );
}
