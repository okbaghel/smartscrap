"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Users, ListChecks, TrendingUp, UserCheck, Clock, Activity } from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 container mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-3xl -z-10"></div>
                    <div className="text-center space-y-2 py-6">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-2">
                            <Activity className="w-4 h-4" />
                            <span>Admin Panel</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 dark:from-slate-100 dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
                            Manage user approvals and monitor platform activity
                        </p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <StatsCard
                        icon={<Users className="w-6 h-6" />}
                        title="Pending Approvals"
                        value={pendingApprovals.length}
                        gradient="from-blue-500 to-cyan-500"
                        trend="+2 new"
                    />
                    <StatsCard
                        icon={<UserCheck className="w-6 h-6" />}
                        title="Active Users"
                        value="248"
                        gradient="from-emerald-500 to-teal-500"
                        trend="+12%"
                    />
                    <StatsCard
                        icon={<Activity className="w-6 h-6" />}
                        title="Total Activities"
                        value={records.length}
                        gradient="from-purple-500 to-pink-500"
                        trend="Today"
                    />
                    <StatsCard
                        icon={<TrendingUp className="w-6 h-6" />}
                        title="Approval Rate"
                        value="94%"
                        gradient="from-amber-500 to-orange-500"
                        trend="+5%"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                    {/* Pending Approvals Section */}
                    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardHeader className="relative z-10 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">Pending Approvals</div>
                                    <div className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                                        Review and approve new registrations
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 p-0">
                            {pendingApprovals.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-4">
                                    <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                                        <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium">All caught up!</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-500">No pending approvals at the moment</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Name</TableHead>
                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Role</TableHead>
                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pendingApprovals.map((user) => (
                                                <TableRow 
                                                    key={user.id}
                                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <TableCell className="font-medium text-slate-900 dark:text-white">
                                                        {user.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant="outline" 
                                                            className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30"
                                                        >
                                                            {user.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant="secondary" 
                                                            className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-0 gap-1.5"
                                                        >
                                                            <Clock className="w-3 h-3" />
                                                            {user.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                                                            <Button 
                                                                onClick={() => handleApprove(user.id)} 
                                                                size="sm"
                                                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-1.5" /> 
                                                                Approve
                                                            </Button>
                                                            <Button 
                                                                onClick={() => handleReject(user.id)} 
                                                                size="sm"
                                                                variant="destructive" 
                                                                className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                                                            >
                                                                <XCircle className="w-4 h-4 mr-1.5" /> 
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Activity Records Section */}
                    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardHeader className="relative z-10 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                                    <ListChecks className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">Activity Records</div>
                                    <div className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                                        Recent platform activities
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">ID</TableHead>
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">User</TableHead>
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Action</TableHead>
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {records.map((record) => (
                                            <TableRow 
                                                key={record.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <TableCell>
                                                    <Badge 
                                                        variant="outline" 
                                                        className="font-mono text-xs border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                                                    >
                                                        #{record.id}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium text-slate-900 dark:text-white">
                                                    {record.user}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                                                        {record.action}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                                        {record.date}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Stats Card Component
function StatsCard({ icon, title, value, gradient, trend }) {
    return (
        <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {title}
                        </p>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                                {value}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {trend}
                            </p>
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}