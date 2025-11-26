"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Mail, Phone, Calendar, Check, X, UserPlus, Users, Trash2, MessageSquare } from "lucide-react"
import {
  type Athlete,
  type Message,
  getAthletes,
  getMessages,
  approveAthlete,
  rejectAthlete,
  getPendingAthletes,
} from "@/lib/mock-data"
import { AthleteModal } from "@/components/athlete-modal"
import { format } from "date-fns"
import { delay, motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { ContactMessageResponse } from "@/lib/types/contact"
import { deleteMessage, GetMessages, markMessageAsRead } from "@/lib/services/ContactService"
import { PendingUser } from "@/lib/types/member"
import { approveUser, getPendingUsers, rejectUser } from "@/lib/services/UserService"
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("athletes")
  const [searchTerm, setSearchTerm] = useState("")
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [pendingAthletes, setPendingAthletes] = useState<Athlete[]>([])
  // const [messages, setMessages] = useState<Message[]>([])

  const [messages,setMessages] = useState<ContactMessageResponse[]>([]);

  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
const [loadingAction, setLoadingAction] = useState<{id: string, type: "approve" | "reject"} | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
    variant?: "danger" | "warning"
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })
  const { toast } = useToast()

async function loadMessages(){
  try{
    const data = await GetMessages()
    setMessages(data);
  }catch(err){
    console.error("Failed to load message",err)
  }
}
async function loadPendingUsers() {
  try {
    const users = await getPendingUsers(); // PAS .data !!!
    setPendingUsers(users);
  } catch (err) {
    console.error("Failed to load pending users", err);
  }
}




  const refreshData = () => {
    const allAthletes = getAthletes()
    console.log("[v0] Total athletes:", allAthletes.length)
    console.log("[v0] Approved athletes:", allAthletes.filter((a) => a.isApproved).length)
    console.log("[v0] Pending athletes:", allAthletes.filter((a) => !a.isApproved).length)

    setAthletes(allAthletes.filter((a) => a.isApproved))
    setPendingAthletes(getPendingAthletes())
    // setMessages(getMessages())
  }

 useEffect(() => {
  let connection: HubConnection | null = null;

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
  const hubUrl = `${apiBase.replace("/api", "")}/hubs/notifications`;

  const init = async () => {
    // Charger données initiales
    refreshData();
    loadMessages();
    loadPendingUsers();

    // Vérifier l’URL SignalR
    if (!apiBase) {
      console.error("❌ NEXT_PUBLIC_API_URL is missing");
      return;
    }

    // Connexion
    connection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    try {
      await connection.start();
      console.log("✅ Connected to SignalR!");

      // Type correct pour msg
      connection.on("NewMessage", (msg: ContactMessageResponse) => {
        console.log("📩 New message received:", msg);

        setMessages(prev => [msg, ...prev]);
      });
      connection.on("NewPendingUser", (user: PendingUser) => {
  console.log("New pending user received:", user);
  setPendingUsers(prev => [user, ...prev]);
});
connection.on("UserApproved", (data: { id: string }) => {
  console.log("User approved:", data.id);
  // setPendingUsers(prev => prev.filter(u => u.id !== data.id));
});


    } catch (err) {
      console.error("❌ SignalR connection failed:", err);
    }
  };

  init();

  return () => {
    if (connection) connection.stop();
  };
}, []);


  const filteredAthletes = athletes.filter((athlete) =>
    athlete.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  )
const delay = (ms: number) => 
  new Promise(resolve => setTimeout(resolve, ms));
const handleApprove = (user: PendingUser) => {
  setConfirmDialog({
    isOpen: true,
    title: "Approve User",
    description: `Are you sure you want to approve ${user.fullName}? They will gain access to the member dashboard.`,
    variant: "warning",

    onConfirm: async () => {
      try {
        // 1️⃣ Appel 
        setLoadingAction({id:user.id , type :"approve"});
            await delay(700);
        await approveUser(user.id);

        // 2️⃣ Mise à jour UI instantanée
        setPendingUsers(prev => prev.filter(u => u.id !== user.id));

        // 3️⃣ Toast succès
        toast({
          title: "User Approved",
          description: `${user.fullName} is now approved.`,
          className: "bg-green-900 border-green-700 text-white"
        });

      } catch (err) {
        // 4️⃣ Gestion erreur
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to approve user.",
          className: "bg-red-900 border-red-700 text-white"
        });
      } finally {
        // 5️⃣ Fermer la modale
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    }
  });
};


 const handleReject = (user: PendingUser) => {
  setConfirmDialog({
    isOpen: true,
    title: "Reject Application",
    description: `Are you sure you want to reject ${user.fullName}'s application?`,
    variant: "danger",

    onConfirm: async () => {
      try {
        setLoadingAction({ id: user.id, type: "reject" });

        await delay(700);
        await rejectUser(user.id);

        setPendingUsers(prev => prev.filter(u => u.id !== user.id));

        toast({
          title: "User Rejected",
          description: `${user.fullName}'s application has been removed.`,
          className: "bg-red-900 border-red-700 text-white",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to reject user.",
          className: "bg-zinc-900 border-zinc-800 text-white",
        });
      } finally {
        setLoadingAction(null);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    }
  });
};


const handleDeleteMessage = (message: ContactMessageResponse) => {
  setConfirmDialog({
    isOpen: true,
    title: "Delete Message",
    description: `Are you sure you want to delete the message from ${message.firstName} ${message.lastName}? This action cannot be undone.`,
    variant: "danger",

    onConfirm: async () => {
      try {
        // 1️⃣ Appel API vers ton backend
        await deleteMessage(message.id)

        // 2️⃣ Mise à jour immédiate du state
        setMessages(prev => prev.filter(m => m.id !== message.id))

        // 3️⃣ Toast UI
        toast({
          title: "Message Deleted",
          description: "The message has been permanently deleted.",
          className: "bg-red-900 border-red-800 text-white",
        })
      } catch (error) {
        console.error(error)
        toast({
          title: "Error",
          description: "Failed to delete message.",
          className: "bg-zinc-900 border-zinc-800 text-white",
        })
      }
    },
  })
}


  return (
    <>
      <DashboardLayout title="Admin Dashboard" description="">
        <Tabs defaultValue="athletes" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <TabsList className="bg-zinc-900/50 border  border-white/10 p-1.5 space-x-5 backdrop-blur-sm">
              <TabsTrigger
                value="athletes"
                className="data-[state=active]:bg-primary  data-[state=active]:text-white font-heading tracking-wider px-6 py-2.5 transition-all"
              >
                <Users className="w-4 h-4 mr-2" />
                Members
              </TabsTrigger>
              <TabsTrigger
                value="approvals"
                className="data-[state=active]:bg-primary data-[state=active]:text-white font-heading tracking-wider px-6 py-2.5 relative transition-all"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Approvals
                {pendingUsers.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-900"
                  >
                    {pendingUsers.length}
                  </motion.span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="data-[state=active]:bg-primary data-[state=active]:text-white font-heading tracking-wider px-6 py-2.5 relative transition-all"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
                {messages.filter((m) => !m.isRead).length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-900"
                  >
                    {messages.filter((m) => !m.isRead).length}
                  </motion.span>
                )}
              </TabsTrigger>
            </TabsList>

            {activeTab === "athletes" && (
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search athletes by name..."
                  className="pl-10 bg-zinc-900/50 border-white/10 text-white focus:border-primary h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>

          <TabsContent value="athletes" className="mt-0">
            {/* <p className="text-zinc-400 text-sm mb-6 bg-zinc-900/30 p-4 border border-white/10 rounded">
              <strong className="text-primary">Members Management:</strong> Click on any athlete to view their complete
              profile, track their membership status, manage training credits, and visualize their payment history with
              an interactive calendar.
            </p> */}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAthletes.map((athlete, idx) => (
                <motion.div
                  key={athlete.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setSelectedAthlete(athlete)
                    setIsModalOpen(true)
                  }}
                  className="group relative overflow-hidden bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 border border-white/10 p-6 hover:border-primary/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-primary/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white/20 group-hover:border-primary transition-colors">
                      <img
                        src={athlete.imageUrl || "/placeholder.svg"}
                        alt={athlete.fullName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-xl text-white group-hover:text-primary transition-colors mb-1 truncate">
                        {athlete.fullName}
                      </h3>
                      <p className="text-sm text-zinc-400 flex items-center gap-1.5 mb-3">
                        <Phone className="h-3 w-3" />
                        {athlete.phoneNumber}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                            athlete.isMembershipActive
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {athlete.isMembershipActive ? "Active" : "Inactive"}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono bg-zinc-800/50 px-2 py-1 rounded">
                          {athlete.trainingCredits} Credits
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredAthletes.length === 0 && (
              <div className="text-center py-20 mt-8">
                <Users className="h-16 w-16 mx-auto mb-4 text-zinc-700" />
                <p className="text-zinc-500 text-lg ">No Member found</p>
                <p className="text-zinc-600 text-sm mt-2">
                  {searchTerm ? "" : "Approve pending athletes to see them here"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="approvals" className="mt-0">
            <div className="space-y-4">
              {pendingUsers.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-white/10">
                  <UserPlus className="h-16 w-16 mx-auto mb-4 text-zinc-700" />
                  <p className="text-zinc-500 text-lg font-heading">No pending approvals</p>
                  <p className="text-zinc-600 text-sm mt-2">All applications have been processed</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {pendingUsers.map((user, idx) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col lg:flex-row items-center justify-between bg-gradient-to-r from-zinc-900 to-zinc-900/50 border border-white/10 p-6 gap-6 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center gap-6 w-full lg:w-auto">
                        <div className="h-24 w-24 rounded-full border-2 border-primary/30 overflow-hidden shrink-0 group-hover:border-primary transition-colors">
                 <div className="relative h-24 w-24 rounded-full border-2 border-primary/30 overflow-hidden shrink-0 group-hover:border-primary transition-colors bg-zinc-800 flex items-center justify-center">
  {user.imageUrl ? (
    <img
      src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${user.imageUrl}`}
      alt={user.fullName}
      className="h-full w-full object-cover"
    />
  ) : (
    <span className="text-white font-heading text-3xl">
      {user.fullName.charAt(0).toUpperCase()}
    </span>
  )}
</div>

                        </div>
                        <div className="space-y-2 flex-1">
                          <h3 className="text-2xl font-heading font-bold text-white">{user.fullName}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-zinc-400">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-primary" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-primary" />
                              {user.phoneNumber}
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2">
                              <Calendar className="h-3.5 w-3.5 text-primary" />
                              Applied On:  {format(new Date(user.createdAt), "MMMM dd, yyyy")}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
                       <Button
  disabled={loadingAction?.id === user.id && loadingAction.type === "approve"}
  onClick={() => handleApprove(user)}
  className="bg-green-600 hover:bg-green-700 text-white font-heading tracking-wider px-6"
>
  {loadingAction?.id === user.id && loadingAction.type === "approve" ? (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
  ) : (
    <>
      <Check className="mr-2 h-4 w-4" />
      Approve
    </>
  )}
</Button>

<Button
  disabled={loadingAction?.id === user.id && loadingAction.type === "reject"}
  onClick={() => handleReject(user)}
  className="bg-red-600 hover:bg-red-700 text-white font-heading tracking-wider px-6"
>
  {loadingAction?.id === user.id && loadingAction.type === "reject" ? (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
  ) : (
    <>
      <X className="mr-2 h-4 w-4" />
      Reject
    </>
  )}
</Button>

                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-0">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-white/10">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-zinc-700" />
                  <p className="text-zinc-500 text-lg font-heading">No messages yet</p>
                  <p className="text-zinc-600 text-sm mt-2">Contact form submissions will appear here</p>
                </div>
              ) : (
                messages.map((message, idx) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-6 border rounded-lg transition-all ${
                      message.isRead
                        ? "bg-zinc-900/20 border-white/5"
                        : "bg-zinc-900/60 border-primary/30 shadow-lg shadow-primary/5"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-heading font-bold text-xl text-white">
                            {message.firstName} {message.lastName}
                          </h4>
                          {!message.isRead && (
                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full border border-primary/30">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-primary text-sm uppercase tracking-wider font-heading">
                          Interested in: {message.interest}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 font-mono">
                          {format(new Date(message.createdAt), "MMM dd, HH:mm")}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteMessage(message)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-zinc-300 mb-4 font-sans leading-relaxed bg-black/20 p-4 rounded border border-white/5">
                      {message.message}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <a
                        // href={`mailto:${message.email}`}
                        className="text-sm text-zinc-400 hover:text-primary flex items-center gap-2 transition-colors font-heading tracking-wide"
                      >
                        <Phone className="h-4 w-4" />
                        {message.phoneNumber}
                      </a>
                      {!message.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            markMessageAsRead(message.id)
                            // refreshData()
                            setMessages(prev => prev.map(m =>m.id === message.id ? {
                              ...m,isRead:true
                            }:m))
                          }}
                          className="text-xs text-primary hover:text-primary hover:bg-primary/10 font-heading tracking-wider cursor-pointer"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DashboardLayout>

      {selectedAthlete && (
        <AthleteModal
          athlete={selectedAthlete}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedAthlete(null)
          }}
          onUpdate={refreshData}
        />
      )}

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        confirmText={confirmDialog.variant === "danger" ? "Delete" : "Confirm"}
      />
    </>
  )
}
