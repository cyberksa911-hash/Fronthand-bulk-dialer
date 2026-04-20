import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import API from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Users, BarChart3, LogOut, Play, CheckCircle, XCircle, Clock } from "lucide-react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [isCalling, setIsCalling] = useState(false);
  const [stats, setStats] = useState({ total: 1200, answered: 850, failed: 200, converted: 150 });

  useEffect(() => {
    socket.on("call_update", (data) => {
      setLogs((prev) => [data, ...prev.slice(0, 49)]);
      if (data.status === "answered") {
        setStats(s => ({ ...s, answered: s.answered + 1 }));
      } else if (data.status === "failed") {
        setStats(s => ({ ...s, failed: s.failed + 1 }));
      }
    });

    return () => socket.off("call_update");
  }, []);

  const handleStartCalling = async () => {
    setIsCalling(true);
    try {
      // Mock numbers for demo
      const numbers = ["+966500000001", "+966500000002", "+966500000003", "+966500000004", "+966500000005"];
      await API.post("/start", { numbers });
    } catch (err) {
      console.error("Failed to start calling", err);
    } finally {
      setIsCalling(false);
    }
  };

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Answered Calls",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgb(59, 130, 246)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-gray-900 text-white flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Phone size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">DIALER PRO</h1>
          </div>

          <nav className="space-y-2">
            <NavItem icon={<BarChart3 size={20} />} label="Dashboard" active />
            <NavItem icon={<Users size={20} />} label="Leads" />
            <NavItem icon={<Phone size={20} />} label="Campaigns" />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
              {user?.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.email}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.plan} Plan</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition w-full"
          >
            <LogOut size={18} /> <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 py-6 px-10 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <div className="flex gap-4">
            <button 
              onClick={handleStartCalling}
              disabled={isCalling}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition shadow-sm ${
                isCalling ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              <Play size={18} /> {isCalling ? 'Process Started...' : 'Start New Campaign'}
            </button>
          </div>
        </header>

        <main className="p-10 max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Calls" value={stats.total} color="blue" />
            <StatCard title="Answered" value={stats.answered} color="green" />
            <StatCard title="Failed" value={stats.failed} color="red" />
            <StatCard title="Converted" value={stats.converted} color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Analytics Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Call Performance</h3>
                <select className="bg-gray-50 border-none text-sm rounded-lg px-3 py-1 text-gray-500 focus:ring-0">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-80">
                <Line data={chartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                Live Activity <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {logs.length === 0 ? (
                    <p className="text-gray-400 text-center py-20 italic">No recent activity</p>
                  ) : (
                    logs.map((log, i) => (
                      <motion.div 
                        key={`${log.number}-${i}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            log.status === 'answered' ? 'bg-green-100 text-green-600' :
                            log.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {log.status === 'answered' ? <CheckCircle size={16} /> :
                             log.status === 'failed' ? <XCircle size={16} /> : <Clock size={16} />}
                          </div>
                          <span className="font-bold text-sm text-gray-700">{log.number}</span>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          log.status === 'answered' ? 'text-green-600' :
                          log.status === 'failed' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {log.status}
                        </span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
      active ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    purple: "text-purple-600 bg-purple-50"
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
    >
      <h4 className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">{title}</h4>
      <p className={`text-3xl font-black ${colors[color].split(' ')[0]}`}>{value.toLocaleString()}</p>
      <div className={`mt-4 inline-flex items-center px-2 py-1 rounded text-xs font-bold ${colors[color]}`}>
        +12.5% from last week
      </div>
    </motion.div>
  );
}
