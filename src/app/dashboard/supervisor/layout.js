"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SupervisorLayout({ children }) {
    const { user } = useUser();
    const router = useRouter();
    const [role, setRole] = useState("");

    useEffect(() => {
        if (user) {
            const userRole = user?.publicMetadata?.role || "user";
            setRole(userRole);

            if (userRole !== "supervisor") {
                router.push("/dashboard");
            }
        }
    }, [user, router]);

    return role === "supervisor" ? <>{children}</> : <p>Redirecting...</p>;
}
