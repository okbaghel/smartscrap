"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
    const { user } = useUser();
    const router = useRouter();
    const [role, setRole] = useState("");

    useEffect(() => {
        if (user) {
            const userRole = user?.publicMetadata?.role || "user";
            setRole(userRole);

            if (userRole !== "admin") {
                router.push("/dashboard");
            }
        }
    }, [user, router]);

    return role === "admin" ? <>{children}</> : <p>Redirecting...</p>;
}
