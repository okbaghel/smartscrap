"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeCheck, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SupervisorDashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchPendingTickets() {
      try {
        const response = await fetch("/api/pending-tickets");
        const data = await response.json();
        setTickets(data.tickets || []); 
      } catch (error) {
        console.error("Error fetching pending tickets:", error);
        setTickets([]); 
      }
    }
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
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Supervisor Dashboard - Pending Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <TableRow key={ticket._id}>
                    <TableCell>{ticket.ticketId}</TableCell>
                    <TableCell>{ticket.userId}</TableCell>
                    <TableCell>
                      <img src={ticket.imageUrl} alt="Waste" className="w-16 h-16 object-cover" />
                    </TableCell>
                    <TableCell>{ticket.weight} kg</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline"
                        onClick={() => handleStatusUpdate(ticket.ticketId, "Approved")}
                        className="mr-2"
                      >
                        <BadgeCheck className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleStatusUpdate(ticket.ticketId, "Rejected")}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No pending tickets</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
