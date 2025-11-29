"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Mail, Phone, Calendar, Check, X, UserPlus, Users, Trash2, MessageSquare, Filter } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

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
import { format, set } from "date-fns"
import { delay, motion } from "framer-motion"
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { ContactMessageResponse } from "@/lib/types/contact"
import { deleteMessage, GetMessages, markMessageAsRead } from "@/lib/services/ContactService"
import { MemberFull, PendingUser } from "@/lib/types/member"
import { approveUser, getPaginatedMembers, getPendingUsersPaginated, rejectUser, searchMembers } from "@/lib/services/UserService"
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { AuthModal } from "@/components/auth-modal"
import { getAllMembers } from "@/lib/services/member-service"
import { mapMemberToAthlete } from "@/lib/mappers"

export default function AdminDashboard() {

  useEffect(() => {

  const token = localStorage.getItem("token");
  if(!token){
    router.push("/");
    toast.info("Please log in!")
  }},[]);


const FILTER_OPTIONS = [
  { value: "all", label: "All Members" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]
  const [messageFilterInterest, setMessageFilterInterest] = useState("all")
const [selectedPendingUsers, setSelectedPendingUsers] = useState<(string | number|any)[]>([]);
const [pendingSearch, setPendingSearch] = useState("");
const [loadingMembers, setLoadingMembers] = useState(true);
const [loadingPending, setLoadingPending] = useState(true);
const [loadingMessages, setLoadingMessages] = useState(true);
const [pendingTotalCount, setPendingTotalCount] = useState(0);

  const [messageFilterStatus, setMessageFilterStatus] = useState("all")
  const [currentMessagePage, setCurrentMessagePage] = useState(1)
  const [activeTab, setActiveTab] = useState("athletes")
  const [searchTerm, setSearchTerm] = useState("")
const [searchResults, setSearchResults] = useState<Athlete[] | null>(null);
const [loadingSearch, setLoadingSearch] = useState(false);
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [pendingAthletes, setPendingAthletes] = useState<Athlete[]>([])
  // const [messages, setMessages] = useState<Message[]>([])
  const [filterStatus, setFilterStatus] = useState("all")

  const [messages,setMessages] = useState<ContactMessageResponse[]>([]);

  const [allMembers, setAllMembers] = useState<MemberFull[]>([])
const [memberPage, setMemberPage] = useState(1);
const [memberTotalPages, setMemberTotalPages] = useState(1);
const [totalApplicationMembers, settotalApplicationMembers] = useState(1);


  const [currentPage, setCurrentPage] = useState(1)
const [pendingPage, setPendingPage] = useState(1);
const [pendingTotalPages, setPendingTotalPages] = useState(1);

  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
const [loadingAction, setLoadingAction] = useState<{id: string, type: "approve" | "reject"} | null>(null);
const [selectedMessages, setSelectedMessages] = useState<(string | number)[]>([]);
const [messageSearchTerm, setMessageSearchTerm] = useState("");

// const ITEMS_PER_PAGE = 6
const MESSAGES_PER_PAGE = 5

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



// async function LoadAllMembers(){
//   try{
//     const data = await getAllMembers();
//     setAllMembers(data);
//   }catch(err){
//     console.error("Failed to load message",err)
//   }
// }
  /* ==========================================================
     🔥 LOAD PAGINATED MEMBERS (MAIN CHANGE)
     ========================================================== */
 const MEMBERS_PER_PAGE = 9;

async function loadPaginatedMembers(page = 1) {
  try {
    setLoadingMembers(true);

    const res: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      data: MemberFull[];
    } = await getPaginatedMembers(page, MEMBERS_PER_PAGE);

    const paginatedMembers = res.data;
    const totalPages = res.totalPages;
    const totalMembers = res.total;
    setAthletes(paginatedMembers.map(mapMemberToAthlete));
    setMemberTotalPages(totalPages);
    setMemberPage(page);
settotalApplicationMembers(totalMembers);
  } finally {
    setLoadingMembers(false);
  }
}
const searchDelay = useRef<NodeJS.Timeout | null>(null);
async function executeSearch(value: string) {
  searchRequests.current++;
  setLoadingSearch(true);

  try {
    const res = await searchMembers(value);
    const formatted = res.data.map(mapMemberToAthlete);
    setSearchResults(formatted);
  } catch (err) {
    console.log("Search error:", err);
  } finally {
    searchRequests.current--;

    // Spinner OFF ONLY when all searches are done
    if (searchRequests.current === 0) {
      setLoadingSearch(false);
    }
  }
}

const searchRequests = useRef(0); 
function handleSearchInput(value: string) {
  setSearchTerm(value);

  // Clear previous debounce timer
  if (searchDelay.current) {
    clearTimeout(searchDelay.current);
  }

  // If empty -> cancel search
  if (!value.trim()) {
    setSearchResults(null);
    setLoadingSearch(false);
    return;
  }

  // Debounce actual API call
  searchDelay.current = setTimeout(() => {
    executeSearch(value);
  }, 350);
}





  // async function loadPendingUsers() {
  //   try {
  //     setLoadingPending(true)
  //     const users = await getPendingUsers()
  //     setPendingUsers(users)
  //   } catch (err) {
  //     console.error("Failed pending users", err)
  //   } finally {
  //     setLoadingPending(false)
  //   }
  // }
async function loadPendingUsers(page = 1) {
  try {
    setLoadingPending(true);

    const res = await getPendingUsersPaginated(page, PENDING_PER_PAGE);

    setPendingUsers(res.data);
    setPendingTotalPages(res.totalPages);
    setPendingPage(page);
    setPendingTotalCount(res.total)

  } catch (err) {
    console.error("Failed loading pending users:", err);
  } finally {
    setLoadingPending(false);
  }
}




  async function loadMessages() {
    try {
      setLoadingMessages(true)
      const data = await GetMessages()
      setMessages(data)
    } catch (err) {
      console.error("Failed messages", err)
    } finally {
      setLoadingMessages(false)
    }
  }



//   const refreshData = async () => {
//     // const allAthletes = getAthletes()
//     // console.log("[v0] Total athletes:", allAthletes.length)
//     // console.log("[v0] Approved athletes:", allAthletes.filter((a) => a.isApproved).length)
//     // console.log("[v0] Pending athletes:", allAthletes.filter((a) => !a.isApproved).length)

//     // setAthletes(allAthletes.filter((a) => a.isApproved))
//     // setPendingAthletes(getPendingAthletes())
//     // setMessages(getMessages())
//   try {
//     const members = await getAllMembers(); // backend data

//     const approved = members.filter(m => m.isApproved === true);

//     const converted = approved.map(mapMemberToAthlete);

//     setAthletes(converted);

//     console.log("Loaded athletes: ", converted);
//   } catch (error) {
//     console.error(error);
//   }
// };
const refreshData = async () => {
  await loadPaginatedMembers(memberPage);
};

  const router = useRouter();

 useEffect(() => {

  // const token = localStorage.getItem("token");
  // if(!token){
  //   router.push("/");
  //   toast.info("Please log in!")
  // }


  let connection: HubConnection | null = null;

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
  const hubUrl = `${apiBase.replace("/api", "")}/hubs/notifications`;

  const init = async () => {
    // Charger données initiales
await loadPaginatedMembers(1); 
  await  loadMessages();
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
connection.on("UserApproved", async (data: { id: string }) => {
  console.log("User approved:", data.id);
  setPendingUsers(prev => prev.filter(u => u.id !== data.id));

  await loadPaginatedMembers(memberPage); 
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

const togglePendingSelection = (id: string | number) => {
  setSelectedPendingUsers(prev =>
    prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
  );
};

const toggleSelectAllPending = () => {
  if (selectedPendingUsers.length === paginatedPending.length) {
    setSelectedPendingUsers([]);
  } else {
    setSelectedPendingUsers(paginatedPending.map(u => u.id));
  }
};

const approveSelected = () => {
  if (selectedPendingUsers.length === 0) return;

  setConfirmDialog({
    isOpen: true,
    title: "Approve Selected Users",
    description: `Are you sure you want to approve ${selectedPendingUsers.length} users?`,
    variant: "warning",
    onConfirm: async () => {
      for (const id of selectedPendingUsers) {
        await approveUser(id);

                loadPendingUsers(pendingPage);

      }
                toast.success(`Users Approved successfully.`);

      setPendingUsers(prev => prev.filter(u => !selectedPendingUsers.includes(u.id)));
      setSelectedPendingUsers([]);
    }
  });
};

const rejectSelected = () => {
  if (selectedPendingUsers.length === 0) return;

  setConfirmDialog({
    isOpen: true,
    title: "Reject Selected Users",
    description: `Are you sure you want to reject ${selectedPendingUsers.length} users?`,
    variant: "danger",
    onConfirm: async () => {
      for (const id of selectedPendingUsers) {
        await rejectUser(id);
        loadPendingUsers(pendingPage);
      }
        toast.success(`Users rejected successfully.`);

      setPendingUsers(prev => prev.filter(u => !selectedPendingUsers.includes(u.id)));
      setSelectedPendingUsers([]);
    }
  });
};
const filteredPending = pendingUsers.filter((u) => {
  const text = (
    u.fullName +
    " " +
    u.email +
    " " +
    u.phoneNumber
  ).toLowerCase();

  return text.includes(pendingSearch.toLowerCase());
});

// 2️⃣ Pagination for pending users (same logic as athletes)
const PENDING_PER_PAGE = 10;

const totalPendingPages = Math.ceil(filteredPending.length / PENDING_PER_PAGE);

const paginatedPending = filteredPending.slice(
  (currentPage - 1) * PENDING_PER_PAGE,
  currentPage * PENDING_PER_PAGE
);


//  const filteredAthletes = athletes
//     .filter((athlete) => athlete.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
//     .filter((athlete) => {
//       if (filterStatus === "active") return athlete.isMembershipActive
//       if (filterStatus === "inactive") return !athlete.isMembershipActive
//       return true
//     })

const displayAthletes = searchResults ?? athletes;

const normalizedSearch = searchTerm.trim().toLowerCase();

const filteredAthletes = displayAthletes
  .filter((athlete) => {
    if (!normalizedSearch) return true;

    const fullName = athlete.fullName?.toLowerCase() ?? "";
    const email = athlete.email?.toLowerCase() ?? "";
    const phone = athlete.phoneNumber?.toLowerCase() ?? "";

    return (
      fullName.includes(normalizedSearch) ||
      email.includes(normalizedSearch) ||
      phone.includes(normalizedSearch)
    );
  })
  .filter((athlete) => {
    if (filterStatus === "active") return athlete.isMembershipActive;
    if (filterStatus === "inactive") return !athlete.isMembershipActive;
    return true;
  });





  // const totalPages = Math.ceil(filteredAthletes.length / ITEMS_PER_PAGE)
  // const paginatedAthletes = filteredAthletes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  // useEffect(() => {
  //   setCurrentPage(1)
  // }, [searchTerm, filterStatus])
  const paginatedAthletes = filteredAthletes; // DON’T RE-PAGINATE
const totalPages = memberTotalPages;        // Use backend pagination

const filteredMessages = messages
    .filter((message) =>
      `${message.firstName} ${message.lastName}`.toLowerCase().includes(messageSearchTerm.toLowerCase()),
    )
    .filter((message) => {
      if (messageFilterStatus === "read") return message.isRead
      if (messageFilterStatus === "unread") return !message.isRead
      return true
    })
    .filter((message) => {
      if (messageFilterInterest === "all") return true
      return message.interest.toLowerCase() === messageFilterInterest.toLowerCase()
    })

  const totalMessagePages = Math.ceil(filteredMessages.length / MESSAGES_PER_PAGE)
  const paginatedMessages = filteredMessages.slice(
    (currentMessagePage - 1) * MESSAGES_PER_PAGE,
    currentMessagePage * MESSAGES_PER_PAGE,
  )

  useEffect(() => {
    setCurrentMessagePage(1)
  }, [messageSearchTerm, messageFilterStatus, messageFilterInterest])

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
await loadPaginatedMembers(memberPage); // 🔥 refresh UI

        // 3️⃣ Toast succès
      //  toast.success("$`{user.fullName} has been approved.`");
    toast.success(` ${user.fullName} has been approved.`, {
         
        })

      } catch (err) {
        // 4️⃣ Gestion erreur
        // console.error(err);
        // toast({
        //   title: "Error",
        //   description: "Failed to approve user.",
        //   className: "bg-red-900 border-red-700 text-white"
        // });
        toast.warning("Failed to approve user.")
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
                toast.success(`${user.fullName} rejected successfully.`);


        setPendingUsers(prev => prev.filter(u => u.id !== user.id));
await loadPaginatedMembers(memberPage); // 🔥 refresh UI

        // toast({
        //   title: "User Rejected",
        //   description: `${user.fullName}'s application has been removed.`,
        //   className: "bg-red-900 border-red-700 text-white",
        // });
      } catch (err) {
        // toast({
        //   title: "Error",
        //   description: "Failed to reject user.",
        //   className: "bg-zinc-900 border-zinc-800 text-white",
        // });
      } finally {
        setLoadingAction(null);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    }
  });
};

const toggleMessageSelection = (id: string |number) => {
  setSelectedMessages(prev =>
    prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
  );
};

const toggleSelectAllMessages = () => {
  if (selectedMessages.length === paginatedMessages.length) {
    setSelectedMessages([]);
  } else {
    setSelectedMessages(paginatedMessages.map((m) => m.id));
  }
};

const deleteSelectedMessages = async () => {
  if (selectedMessages.length === 0) return;

  setConfirmDialog({
    isOpen: true,
    title: "Delete Selected Messages",
    description: `Are you sure you want to delete ${selectedMessages.length} message(s)?`,
    variant: "danger",
    onConfirm: async () => {
      try {
        for (const id of selectedMessages) {
          await deleteMessage(id);

        }
                  toast.info(`Messages deleted successfully.`);

        setMessages(prev => prev.filter(m => !selectedMessages.includes(m.id)));
        setSelectedMessages([]);
      } catch (error) {
        console.error(error);
      }
    },
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
      toast.success(`Message deleted successfully.`);


        // 2️⃣ Mise à jour immédiate du state
        setMessages(prev => prev.filter(m => m.id !== message.id))

        // 3️⃣ Toast UI
        // toast({
        //   title: "Message Deleted",
        //   description: "The message has been permanently deleted.",
        //   className: "bg-red-900 border-red-800 text-white",
        // })
      } catch (error) {
        console.error(error)
        // toast({
        //   title: "Error",
        //   description: "Failed to delete message.",
        //   className: "bg-zinc-900 border-zinc-800 text-white",
        // })
      }
    },
  })
}

const isLoading = (userId: string, actionType: "approve" | "reject" | "delete") => {
  return loadingAction?.id === userId && loadingAction?.type === actionType;
};


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
                <Users className="w-4 h-4 mr-2 text-orange-500" />
                Members
              </TabsTrigger>
              <TabsTrigger
                value="approvals"
                className="data-[state=active]:bg-primary data-[state=active]:text-white font-heading tracking-wider px-6 py-2.5 relative transition-all"
              >
                <UserPlus className="w-4 h-4 mr-2 text-orange-500" />
                Approvals
                {pendingTotalCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-900"
                  >
                    {pendingTotalCount }
                  </motion.span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="data-[state=active]:bg-primary data-[state=active]:text-white font-heading tracking-wider px-6 py-2.5 relative transition-all"
              >
                <MessageSquare className="w-4 h-4 mr-2 text-orange-500" />
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
              <div className="flex gap-3 w-full md:w-auto flex-col sm:flex-row">
                <div className="relative flex-1 sm:flex-initial">
                  <Filter className="absolute left-3 top-3.5 h-4 w-4 text-orange-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-white/10 text-white rounded hover:border-primary/30 focus:border-primary transition-colors appearance-none cursor-pointer text-sm font-medium"
                  >
                    {FILTER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-zinc-900  text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
<div className="relative flex-1 sm:flex-initial sm:w-80">
  <Search className="absolute left-3 top-3 h-4 w-4 text-orange-500" />

  <Input
    placeholder="Looking for a member ?"
    className="pl-10 pr-10 bg-zinc-900/50 border-white/10 text-white focus:border-primary h-11 text-sm"
    value={searchTerm}
    onChange={(e) => handleSearchInput(e.target.value)}
  />

  {loadingSearch && (
    <div className="absolute right-3 top-3">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )}
</div>

              </div>
            )}
          </div>
 <TabsContent value="athletes" className="mt-0">
            <div className="space-y-6">
{loadingMembers ? (
  <div className="flex justify-center py-20">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
) : paginatedAthletes.length > 0 ? (
                <>
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                    {paginatedAthletes.map((athlete, idx) => (
                      <motion.div
                        key={athlete.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => {
                          setSelectedAthlete(athlete)
                          setIsModalOpen(true)
                        }}
                        className="group
                         relative overflow-hidden bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 border border-white/10 p-6 hover:border-primary/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-primary/10 rounded-lg"
                      >
                        <div className="flex items-start gap-4 h-full">
                          <div className="relative h-24 w-24 rounded-full border-2 border-primary/30 overflow-hidden shrink-0 group-hover:border-primary transition-colors bg-zinc-800 flex items-center justify-center">
                           {athlete.imageUrl ? (
    <img
      src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${athlete.imageUrl}`}
      alt={athlete.fullName}
      className="h-full w-full object-cover"
    />
  ) : (
    <span className="text-white font-heading text-3xl">
      {athlete.fullName.charAt(0).toUpperCase()}
    </span>
  )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading font-bold text-lg text-white group-hover:text-primary transition-colors mb-2 truncate">
                              {athlete.fullName}
                            </h3>
                            <p className="text-xs text-zinc-400 flex items-center gap-1.5 mb-3">
                              <Phone className="h-3 w-3 shrink-0" />
                              {athlete.phoneNumber}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
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
{memberTotalPages > 1 && (
  <div className="flex justify-center mt-8 pt-6 border-t border-white/10">
    <Pagination>
      <PaginationContent>

        <PaginationItem>
          <PaginationPrevious
            onClick={() => memberPage > 1 && loadPaginatedMembers(memberPage - 1)}
            className={`${memberPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
          />
        </PaginationItem>

        {Array.from({ length: memberTotalPages }, (_, i) => {
          const pageNum = i + 1;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                isActive={memberPage === pageNum}
                onClick={() => loadPaginatedMembers(pageNum)}
                className="cursor-pointer"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => memberPage < memberTotalPages && loadPaginatedMembers(memberPage + 1)}
            className={`${memberPage === memberTotalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  </div>
)}
                  {/* {totalPages > 1 && (
                    <div className="flex justify-center mt-8 pt-6 border-t border-white/10">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                              className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                            />
                          </PaginationItem>

                          {Array.from({ length: totalPages }, (_, i) => {
                            const pageNum = i + 1
                            const isActive = pageNum === currentPage
                            const isVisible =
                              pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1

                            if (!isVisible && i > 0 && i < totalPages - 1) {
                              if (i === 1) {
                                return (
                                  <PaginationItem key="ellipsis-start">
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                )
                              }
                              return null
                            }

                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink
                                  isActive={isActive}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className="cursor-pointer"
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          })}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                              className={`${
                                currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                              }`}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )} */}

                  <div className="text-center text-sm text-zinc-400 mt-4">
                    Showing {paginatedAthletes.length} of {totalApplicationMembers} members
                    {filterStatus !== "all" && ` (${filterStatus})`}
                  </div>
                </>
              ) : (
                <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-white/10">
                  <Users className="h-16 w-16 mx-auto mb-4 text-zinc-700" />
                  <p className="text-zinc-500 text-lg font-heading">No Members found</p>
                  <p className="text-zinc-600 text-sm mt-2">
                    {searchTerm ? "" : ""}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approvals" className="mt-0">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">

  {/* Search */}
  <div className="relative w-full sm:w-80">
    <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
    <Input
      placeholder="Search pending users..."
      className="pl-10 bg-zinc-900/50 border-white/10 text-white"
      value={pendingSearch}
      onChange={(e) => setPendingSearch(e.target.value)}
    />
  </div>

  {/* Bulk Actions */}
  <div className="flex items-center gap-3">
    <Button
      onClick={toggleSelectAllPending}
      variant="outline"
      className="border-white/20 text-white"
    >
      {selectedPendingUsers.length === paginatedPending.length
        ? "Unselect All"
        : "Select All"}
    </Button>

    <Button
      onClick={approveSelected}
      className="bg-green-600 hover:bg-green-700 text-white"
      disabled={selectedPendingUsers.length === 0}
    >
      <Check className="w-4 h-4 mr-2" />
      Approve Selected
    </Button>

    <Button
      onClick={rejectSelected}
      className="bg-red-600 hover:bg-red-700 text-white"
      disabled={selectedPendingUsers.length === 0}
    >
      <X className="w-4 h-4 mr-2" />
      Reject Selected
    </Button>
  </div>
</div>

            <div className="space-y-4">
              {pendingUsers.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-white/10">
                  <UserPlus className="h-16 w-16 mx-auto mb-4 text-zinc-700 " />
                  <p className="text-zinc-500 text-lg font-heading">No pending approvals</p>
                </div>
              ) : (
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                  {pendingUsers.map((user, idx) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 border  border-white/10 p-6 rounded-lg hover:border-primary/30 transition-all"
                    >
    
                      <div className="flex items-center gap-6 w-full lg:w-auto">
                                     <input
    type="checkbox"
    checked={selectedPendingUsers.includes(user.id)}
    onChange={() => togglePendingSelection(user.id)}
    className=" top-4  left-4 h-5 w-5 accent-primary cursor-pointer"
  />    
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
<div className="flex items-center gap-3 mt-4  ">
  {/* APPROVE */}
  <Button
    disabled={isLoading(user.id, "approve")}
    onClick={() => {handleApprove(user) ; loadPaginatedMembers(memberPage - 1)}}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 min-w-[110px] justify-center"
  >
    {isLoading(user.id, "approve") ? (
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
    ) : (
      <>
        <Check className="h-4 w-4" />
        <span className="font-heading text-sm">Approve</span>
      </>
    )}
  </Button>

  {/* REJECT */}
  <Button
    disabled={isLoading(user.id, "reject")}
    onClick={() => handleReject(user)}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 min-w-[110px] justify-center"
  >
    {isLoading(user.id, "reject") ? (
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
    ) : (
      <>
        <X className="h-4 w-4" />
        <span className="font-heading text-sm">Reject</span>
      </>
    )}
  </Button>
</div>


                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {/* PAGINATION ICI */}
{pendingTotalPages > 1 && (
  <div className="flex justify-center mt-8 pt-6 border-t border-white/10">
    <Pagination>
      <PaginationContent>

        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              pendingPage > 1 && loadPendingUsers(pendingPage - 1)
            }
            className={`${pendingPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
          />
        </PaginationItem>

        {Array.from({ length: pendingTotalPages }, (_, i) => {
          const pageNum = i + 1;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                isActive={pendingPage === pageNum}
                onClick={() => loadPendingUsers(pageNum)}
                className="cursor-pointer"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              pendingPage < pendingTotalPages && loadPendingUsers(pendingPage + 1)
            }
            className={`${pendingPage === pendingTotalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  </div>
)}
          </TabsContent>


     <TabsContent value="messages" className="mt-0">
            <div className="space-y-4">
              {/* SEARCH + ACTIONS */}
<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
  
  {/* Search */}
  <div className="relative w-full sm:w-80">
    <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
    <Input
      placeholder="Search messages..."
      className="pl-10 bg-zinc-900/50 border-white/10 text-white"
      value={messageSearchTerm}
      onChange={(e) => setMessageSearchTerm(e.target.value)}
    />
  </div>

  <div className="flex items-center gap-3">
    <Button
      onClick={toggleSelectAllMessages}
      variant="outline"
      className="border-white/20 text-white"
    >
      {selectedMessages.length === paginatedMessages.length
        ? "Unselect All"
        : "Select All"}
    </Button>

    <Button
      onClick={deleteSelectedMessages}
      className="bg-red-600 hover:bg-red-700 text-white"
      disabled={selectedMessages.length === 0}
    >
      <Trash2 className="w-4 h-4 mr-2" />
      Delete Selected
    </Button>
  </div>
</div>
              {paginatedMessages.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-white/10">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-zinc-700" />
                  <p className="text-zinc-500 text-lg font-heading">No messages yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedMessages.map((message, idx) => (
                     <motion.div
  key={message.id}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: idx * 0.05 }}
  className={`relative p-6 border rounded-lg transition-all ${
    message.isRead
      ? "bg-zinc-900/20 border-white/5"
      : "bg-zinc-900/60 border-primary/30 shadow-lg shadow-primary/5"
  }`}
>

  {/* Checkbox */}
 

                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-heading font-bold text-xl text-white">
                               <input
    type="checkbox"
    checked={selectedMessages.includes(message.id)}
    onChange={() => toggleMessageSelection(message.id)}
    className=" top-4 mr-2 left-4 h-4 w-4 accent-primary cursor-pointer"
  />
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
                          <a className="text-sm text-zinc-400 hover:text-primary flex items-center gap-2 transition-colors font-heading tracking-wide">
                            <Phone className="h-4 w-4" />
                            {message.phoneNumber}
                          </a>
                          {!message.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                markMessageAsRead(message.id)
                                setMessages((prev) =>
                                  prev.map((m) =>
                                    m.id === message.id
                                      ? {
                                          ...m,
                                          isRead: true,
                                        }
                                      : m,
                                  ),
                                )
                              }}
                              className="text-xs text-primary hover:text-primary hover:bg-primary/10 font-heading tracking-wider cursor-pointer"
                            >
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {totalMessagePages > 1 && (
                    <div className="flex justify-center mt-8 pt-6 border-t border-white/10">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentMessagePage((prev) => Math.max(1, prev - 1))}
                              className={`${currentMessagePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                            />
                          </PaginationItem>

                          {Array.from({ length: totalMessagePages }, (_, i) => {
                            const pageNum = i + 1
                            const isActive = pageNum === currentMessagePage
                            const isVisible =
                              pageNum === 1 ||
                              pageNum === totalMessagePages ||
                              Math.abs(pageNum - currentMessagePage) <= 1

                            if (!isVisible && i > 0 && i < totalMessagePages - 1) {
                              if (i === 1) {
                                return (
                                  <PaginationItem key="ellipsis-start">
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                )
                              }
                              return null
                            }

                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink
                                  isActive={isActive}
                                  onClick={() => setCurrentMessagePage(pageNum)}
                                  className="cursor-pointer"
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          })}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentMessagePage((prev) => Math.min(totalMessagePages, prev + 1))}
                              className={`${currentMessagePage === totalMessagePages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}

                  <div className="text-center text-sm text-zinc-400 mt-4">
                    Showing {paginatedMessages.length} of {filteredMessages.length} messages
                    {messageFilterStatus !== "all" && ` (${messageFilterStatus})`}
                    {messageFilterInterest !== "all" && ` (${messageFilterInterest})`}
                  </div>
                </>
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
