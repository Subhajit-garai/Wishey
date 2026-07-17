import { wish } from "../types";

export default function Wishlist() {
  let wishes:wish[] = [
    {
      id: "1",
      title: "Learn TypeScript",
      description: "Master TypeScript fundamentals",
      to: "subhajit",
      date: "2024-06-01",
      messages:[""]
    },
    {
      id: "2",
      title: "Build a Next.js App",
      description: "Create a full-stack application using Next.js",
      to: "subhajit",
      date: "2024-06-02",
       messages:[""]
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold">Wish List</h1>
      <ul className="space-y-2">
        {wishes.map((wish) => (
          <li key={wish.id} className="text-lg">
            {wish.title} - {wish.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
