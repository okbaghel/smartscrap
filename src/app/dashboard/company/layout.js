"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CompanyLayout({ children }) {
    const { user } = useUser();
    const router = useRouter();
    const [role, setRole] = useState("");

    useEffect(() => {
        if (user) {
            const userRole = user?.publicMetadata?.role || "user";
            setRole(userRole);

            if (userRole !== "company") {
                router.push("/dashboard");
            }
        }
    }, [user, router]);

    return role === "company" ? <>{children}</> : <p>Redirecting...</p>;
}
