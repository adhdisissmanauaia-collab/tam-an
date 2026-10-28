import React, { useState, useEffect } from "react";
import { TabType } from "./types";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomeTab } from "./components/HomeTab";
import { ChatTab } from "./components/ChatTab";
import { BreathingTab } from "./components/BreathingTab";
import { ExamPlannerTab } from "./components/ExamPlannerTab";
import { ResourcesTab } from "./components/ResourcesTab";
import { EmergencyModal } from "./components/EmergencyModal";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ configured: boolean; mode: string } | null>(null);

  // Check backend Gemini API status
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/status");
        if (res.ok) {
          const data = await res.json();
          setApiStatus(data);
        }
      } catch (err) {
        console.warn("Chưa kết nối được với API status:", err);
        setApiStatus({ configured: false, mode: "demo" });
      }
    }
    checkStatus();
  }, []);

  const handleStartChatWithPrompt = (prompt: string) => {
    setInitialPrompt(prompt);
    setActiveTab("chat");
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          apiStatus={apiStatus}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {activeTab === "home" && (
            <HomeTab
              setActiveTab={setActiveTab}
              onStartChatWithPrompt={handleStartChatWithPrompt}
            />
          )}

          {activeTab === "chat" && (
            <ChatTab
              initialPrompt={initialPrompt}
              onClearInitialPrompt={() => setInitialPrompt(null)}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              apiStatus={apiStatus}
            />
          )}

          {activeTab === "breathing" && <BreathingTab />}

          {activeTab === "exam" && <ExamPlannerTab />}

          {activeTab === "resources" && (
            <ResourcesTab onOpenEmergency={() => setIsEmergencyOpen(true)} />
          )}
        </main>

        {/* Emergency Modal */}
        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
        />

        {/* Footer */}
        <Footer
          setActiveTab={setActiveTab}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
        />
      </div>
    </ThemeProvider>
  );
}
