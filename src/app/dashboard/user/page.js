"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { CircleDollarSign, Ticket, Trash, Upload, Brush, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const [showTickets, setShowTickets] = useState(false);
  const { user, isLoaded } = useUser();
  const [credits, setCredits] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch user data for credits and tickets
  useEffect(() => {
    if (isLoaded && user) {
      fetch(`/api/get-tickets?userId=${user.id}`)
      
        .then((response) => response.json())
        .then((data) => setTickets(data.tickets))
        .catch((error) => console.error("Error fetching tickets:", error));
    }
  }, [isLoaded, user]);

  // Raise ticket function (to be called when user uploads a waste image)
  const raiseTicket = async (wasteImageData) => {
    setLoading(true);

    try {
      // Make an API call to raise a new ticket
      const response = await fetch('/api/raise-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, wasteImageData }),
      });

      const newTicket = await response.json();

      // Update the tickets state immediately after a ticket is raised
      setTickets((prevTickets) => [...prevTickets, newTicket]);

      // Optionally update credits or other user data here
    } catch (error) {
      console.error('Error raising ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chatbot message handler
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages);
    setUserMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      setMessages([...newMessages, { sender: "bot", text: data.reply || "Hmm... I couldn't understand that." }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages([...newMessages, { sender: "bot", text: "Sorry, there was an error processing your request." }]);
    } finally {
      setLoading(false);
    }
  };

  

  // Function to handle action card clicks
  const handleActionClick = (action) => {
    if (action === "segregate") router.push("/segregate-waste");
    if (action === "sell") router.push("/sell-waste");
    if (action === "clean") router.push("/clean-and-earn");
  };

  return (
    <div className="min-h-screen p-6 space-y-6 relative">
      {/* Header Section */}
      <Card>
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {isLoaded ? `Welcome, ${user?.fullName || user?.firstName || "User"}! 🌿` : "Loading..."}
            </h1>
            <p className="text-muted-foreground">Manage your waste smartly and earn rewards!</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <CircleDollarSign className="h-10 w-10 text-primary" />
            <div>
              <p className="text-xl font-semibold">{credits}</p>
              <p className="text-muted-foreground">Total Credits</p>
            </div>
          </CardContent>
        </Card>

        <Card onClick={() => setShowTickets(true)} className="cursor-pointer hover:bg-muted transition">
          <CardContent className="p-6 flex items-center space-x-4">
            <Ticket className="h-10 w-10 text-primary" />
            <div>
            <p className="text-xl font-semibold">{tickets ? tickets.length : 0}</p>
            {/* This will show the number of raised tickets */}
              <p className="text-muted-foreground">Tickets Raised</p>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Details Dialog */}
        <Dialog open={showTickets} onOpenChange={setShowTickets}>
  <DialogTrigger asChild>
    <Button className="hidden">View Tickets</Button>
  </DialogTrigger>
  <DialogContent className="max-w-lg">
    <h2 className="text-lg font-semibold">Your Tickets</h2>
    {tickets && Array.isArray(tickets) && tickets.length === 0 ? (
      <p className="text-muted-foreground">No tickets raised yet.</p>
    ) : (
      <div className="max-h-60 overflow-auto">
        {tickets && Array.isArray(tickets) && tickets.map((ticket) => (
          <div key={ticket.tokenId} className="p-2 border-b">
            <p><strong>Token ID:</strong> {ticket.
ticketId}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
          </div>
        ))}
      </div>
    )}
  </DialogContent>
</Dialog>

      </div>

      {/* Action Buttons Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:bg-muted transition" onClick={() => handleActionClick("segregate")}>
          <CardContent className="p-6 flex flex-col items-center cursor-pointer">
            <Trash className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold">Segregate Your Waste</h3>
            <p className="text-muted-foreground text-center mt-2">Scan your waste and get bin recommendations.</p>
          </CardContent>
        </Card>

        <Card className="hover:bg-muted transition" onClick={() => handleActionClick("sell")}>
          <CardContent className="p-6 flex flex-col items-center cursor-pointer">
            <Upload className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold">Sell Your Waste</h3>
            <p className="text-muted-foreground text-center mt-2">Upload waste images, enter weight & generate a ticket.</p>
          </CardContent>
        </Card>

        <Card className="hover:bg-muted transition" onClick={() => handleActionClick("clean")}>
          <CardContent className="p-6 flex flex-col items-center cursor-pointer">
            <Brush className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold">Clean & Earn</h3>
            <p className="text-muted-foreground text-center mt-2">Help clean your surroundings and earn rewards.</p>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot Button */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 rounded-full h-14 w-14 flex items-center justify-center shadow-lg">
            <MessageSquare className="h-8 w-8" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <h2 className="text-lg font-semibold mb-2">Chat with our Assistant 🤖</h2>
          <div className="h-40 bg-gray-100 p-4 rounded-md overflow-auto">
            {messages.map((msg, index) => (
              <p key={index} className={`text-sm ${msg.sender === "user" ? "text-blue-600" : "text-gray-600"}`}>
                {msg.sender === "user" ? "You: " : "Bot: "} {msg.text}
              </p>
            ))}
          </div>
          <Input value={userMessage} onChange={(e) => setUserMessage(e.target.value)} placeholder="Ask me anything..." />
          <Button className="mt-2" onClick={handleSendMessage} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
