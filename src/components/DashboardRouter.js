"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardRouter = () => {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [role, setRole] = useState("");

    useEffect(() => {
        if (isLoaded && user) {
            const userRole = user?.publicMetadata?.role || "user";
            setRole(userRole);

            // Redirect based on role
            switch (userRole) {
                case "user":
                    router.replace("/dashboard/user");
                    break;
                case "supervisor":
                    router.replace("/dashboard/supervisor");
                    break;
                case "company":
                    router.replace("/dashboard/company");
                    break;
                case "admin":
                    router.replace("/dashboard/admin");
                    break;
                default:
                    router.replace("/dashboard/user"); // Default case
            }
        }
    }, [user, isLoaded, router]);

    if (!isLoaded) return <p>Loading...</p>;

    return <p>Redirecting...</p>;
};

export default DashboardRouter;
