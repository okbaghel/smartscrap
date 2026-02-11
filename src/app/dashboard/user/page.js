"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { CircleDollarSign, Ticket, Trash, Upload, Brush, MessageSquare, Sparkles, TrendingUp, Send, Bot, User as UserIcon, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 container mx-auto max-w-7xl">
        
        {/* Header Section */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          <CardContent className="p-6 sm:p-8 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 text-xs sm:text-sm font-medium mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>User Dashboard</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  {isLoaded ? `Welcome back, ${user?.fullName || user?.firstName || "User"}! 🌿` : "Loading..."}
                </h1>
                <p className="text-emerald-100 text-sm sm:text-base">
                  Manage your waste smartly and earn rewards while making a positive impact!
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <TrendingUp className="h-12 w-12" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {/* Credits Card */}
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Credits
                  </p>
                  <div className="space-y-1">
                    <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                      {credits}
                    </h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <TrendingUp className="w-3 h-3" />
                      Keep earning!
                    </p>
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <CircleDollarSign className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Card */}
          <Card 
            onClick={() => setShowTickets(true)} 
            className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer bg-white dark:bg-slate-800/50 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Tickets Raised
                  </p>
                  <div className="space-y-1">
                    <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                      {tickets ? tickets.length : 0}
                    </h3>
                    <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 font-medium">
                      Click to view details
                    </p>
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Ticket className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Details Dialog */}
        <Dialog open={showTickets} onOpenChange={setShowTickets}>
          <DialogContent className="max-w-lg sm:max-w-2xl bg-white dark:bg-slate-900 border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                <Ticket className="w-6 h-6 text-purple-600" />
                Your Tickets
              </DialogTitle>
            </DialogHeader>
            {tickets && Array.isArray(tickets) && tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                  <Ticket className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">No tickets raised yet</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Start by selling your waste!</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-auto space-y-3 pr-2">
                {tickets && Array.isArray(tickets) && tickets.map((ticket) => (
                  <div 
                    key={ticket.tokenId} 
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-purple-50/30 dark:from-slate-800 dark:to-purple-900/10 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Ticket ID</p>
                        <p className="font-mono font-bold text-slate-900 dark:text-white">#{ticket.ticketId}</p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold">
                        {ticket.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Action Buttons Section */}
        <div className="space-y-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quick Actions</h2>
            <p className="text-slate-600 dark:text-slate-400">Choose an action to get started</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {/* Segregate Waste Card */}
            <ActionCard
              icon={<Trash className="h-10 w-10 sm:h-12 sm:w-12" />}
              title="Segregate Your Waste"
              description="Scan your waste and get bin recommendations instantly."
              gradient="from-blue-500 to-cyan-500"
              onClick={() => handleActionClick("segregate")}
            />

            {/* Sell Waste Card */}
            <ActionCard
              icon={<Upload className="h-10 w-10 sm:h-12 sm:w-12" />}
              title="Sell Your Waste"
              description="Upload waste images, enter weight & generate a ticket."
              gradient="from-emerald-500 to-teal-500"
              onClick={() => handleActionClick("sell")}
            />

            {/* Clean & Earn Card */}
            <ActionCard
              icon={<Brush className="h-10 w-10 sm:h-12 sm:w-12" />}
              title="Clean & Earn"
              description="Help clean your surroundings and earn rewards."
              gradient="from-amber-500 to-orange-500"
              onClick={() => handleActionClick("clean")}
            />
          </div>
        </div>
      </div>

      {/* Chatbot Button */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogTrigger asChild>
          <Button 
            size="lg"
            className="fixed bottom-6 right-6 rounded-full h-16 w-16 shadow-2xl bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-4 border-white dark:border-slate-900 hover:scale-110 transition-all duration-300 z-50 group"
          >
            <MessageSquare className="h-7 w-7 group-hover:scale-110 transition-transform" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md sm:max-w-lg bg-white dark:bg-slate-900 border-0 shadow-2xl p-0 gap-0">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Bot className="w-6 h-6" />
                </div>
                SmartScrap Assistant
              </DialogTitle>
              <p className="text-emerald-100 text-sm mt-2">Ask me anything about waste management!</p>
            </DialogHeader>
          </div>

          {/* Chat Messages */}
          <div className="h-80 sm:h-96 bg-slate-50 dark:bg-slate-800/50 p-4 overflow-auto space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
                  <Bot className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Start a conversation</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">I'm here to help!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-sm"
                        : "bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  {msg.sender === "user" && (
                    <div className="p-2 bg-emerald-600 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex gap-2">
              <Input
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !userMessage.trim()}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-6"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Action Card Component
function ActionCard({ icon, title, description, gradient, onClick }) {
  return (
    <Card 
      className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer bg-white dark:bg-slate-800/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center relative z-10">
        <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </CardContent>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
    </Card>
  );
}