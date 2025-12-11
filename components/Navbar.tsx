import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import NavClient from "./NavClient";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return <NavClient user={session?.user} />;
}
