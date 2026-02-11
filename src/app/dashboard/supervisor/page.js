"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeCheck, XCircle, Package, User, Weight, Image as ImageIcon, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SupervisorDashboard() {
  const [tickets, setTickets] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPendingTickets = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/pending-tickets");
      const data = await response.json();
      setTickets(data.tickets || []); 
    } catch (error) {
      console.error("Error fetching pending tickets:", error);
      setTickets([]); 
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendingTickets();
  }, []);

  const handleStatusUpdate = async (ticketId, status) => {
    // **Optimistic UI Update**
    setTickets((prevTickets) =>
      prevTickets.filter((ticket) => ticket.ticketId !== ticketId)
    );

    try {
      const response = await fetch(`/api/update-ticket`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, status }),
      });

      if (response.ok) {
        toast.success(`Ticket ${ticketId} ${status.toLowerCase()} successfully!`);
      } else {
        toast.error("Failed to update ticket status");
        // **Rollback on Failure**
        fetchPendingTickets();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating ticket status");
      // **Rollback on Error**
      fetchPendingTickets();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Supervisor Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Review and manage pending waste tickets</p>
          </div>
          <Button
            onClick={fetchPendingTickets}
            disabled={isRefreshing}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Tickets</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{tickets.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Weight</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {tickets.reduce((sum, ticket) => sum + (ticket.weight || 0), 0).toFixed(1)} kg
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Weight className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Unique Users</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {new Set(tickets.map(t => t.userId)).size}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tickets Table */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <CardTitle className="text-xl md:text-2xl font-semibold">Pending Tickets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Ticket ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">User</TableHead>
                    <TableHead className="font-semibold text-slate-700">Image</TableHead>
                    <TableHead className="font-semibold text-slate-700">Weight</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <TableRow key={ticket._id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-slate-400" />
                            {ticket.ticketId}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700">{ticket.userId}</TableCell>
                        <TableCell>
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                            <img 
                              src={ticket.imageUrl} 
                              alt="Waste" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                            <Weight className="w-3 h-3" />
                            {ticket.weight} kg
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline"
                              onClick={() => handleStatusUpdate(ticket.ticketId, "Approved")}
                              className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-400 shadow-sm"
                            >
                              <BadgeCheck className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => handleStatusUpdate(ticket.ticketId, "Rejected")}
                              className="shadow-sm"
                            >
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Package className="w-16 h-16 mb-4 opacity-50" />
                          <p className="text-lg font-medium">No pending tickets</p>
                          <p className="text-sm mt-1">All tickets have been processed</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <Card key={ticket._id} className="shadow-md border border-slate-200 overflow-hidden">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Package className="w-4 h-4 text-indigo-600" />
                            {ticket.ticketId}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <User className="w-3 h-3" />
                            {ticket.userId}
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          <Weight className="w-3 h-3" />
                          {ticket.weight} kg
                        </span>
                      </div>
                      
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-slate-200">
                        <img 
                          src={ticket.imageUrl} 
                          alt="Waste" 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => handleStatusUpdate(ticket.ticketId, "Approved")}
                          className="flex-1 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-400"
                        >
                          <BadgeCheck className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleStatusUpdate(ticket.ticketId, "Rejected")}
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Package className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No pending tickets</p>
                  <p className="text-sm mt-1">All tickets have been processed</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}