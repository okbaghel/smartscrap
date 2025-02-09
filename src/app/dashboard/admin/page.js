"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Users, ListChecks } from "lucide-react";

export default function AdminDashboard() {
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        setPendingApprovals([
            { id: 1, name: "John Doe", role: "Supervisor", status: "Pending" },
            { id: 2, name: "GreenTech Inc.", role: "Company", status: "Pending" },
        ]);

        setRecords([
            { id: "001", user: "Alice", action: "Uploaded Waste", date: "2025-02-08" },
            { id: "002", user: "Bob", action: "Completed Cleanup", date: "2025-02-07" },
        ]);
    }, []);

    const handleApprove = (id) => {
        setPendingApprovals(pendingApprovals.filter(user => user.id !== id));
    };

    const handleReject = (id) => {
        setPendingApprovals(pendingApprovals.filter(user => user.id !== id));
    };

    return (
        <div className="p-6 space-y-6 container mx-auto max-w-7xl">
            {/* Header */}
            <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Approval Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-6 h-6" /> Pending Approvals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingApprovals.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{user.status}</Badge>
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button onClick={() => handleApprove(user.id)} variant="outline" className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> Approve
                                            </Button>
                                            <Button onClick={() => handleReject(user.id)} variant="destructive" className="flex items-center gap-2">
                                                <XCircle className="w-4 h-4" /> Reject
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Activity Records */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ListChecks className="w-6 h-6" /> Activity Records
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.id}</TableCell>
                                        <TableCell>{record.user}</TableCell>
                                        <TableCell>{record.action}</TableCell>
                                        <TableCell>{record.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
