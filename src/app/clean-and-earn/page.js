"use client";
import { useRouter } from "next/navigation";

export default function CleanAndEarn() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Clean & Earn</h1>
      <p className="text-muted-foreground">
        Help clean your surroundings and earn rewards for your efforts.
      </p>

      <div className="mt-6">
        <button
          className="btn"
          onClick={() => alert("Task started. Go clean your area!")}
        >
          Start Cleaning
        </button>
      </div>
    </div>
  );
}
