"use client";
import { Card } from "@/designs/card";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <div className=" p-4 flex flex-col items-center justify-center min-h-screen py-2 gap-4">
        <Card className="w-40 p-4" onClick={() => router.push("/wish/create")}>
          Create a Wish
        </Card>
        <Card className="w-40 p-4" onClick={() => router.push("/wish/list")}>
          Manage Wishes
        </Card>
      </div>
    </>
  );
}
