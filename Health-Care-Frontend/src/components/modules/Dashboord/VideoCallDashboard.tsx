"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Maximize2,
  Pause,
  Play,
  MonitorUp,
  Settings,
  Phone,
  MoreVertical,
  ChevronRight,
  Send,
  Sliders,
  Volume2,
  Power,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMe?: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  time: string;
  text: string;
  isMe?: boolean;
}

export default function VideoCallDashboard() {
  // Interactive States
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [callEnded, setCallEnded] = useState(false);

  // Participants list
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: "Me",
      avatar: "/dashboard/participant1.png",
      isMe: true,
      isMuted: false,
      isVideoOff: false,
    },
    {
      id: "2",
      name: "Laura Williams",
      avatar: "/dashboard/participant2.png",
      isMuted: true,
      isVideoOff: false,
    },
    {
      id: "3",
      name: "Smith Brookline",
      avatar: "/dashboard/participant3.png",
      isMuted: false,
      isVideoOff: false,
    },
  ]);

  // Messages list
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Galaviz Llama",
      avatar: "/dashboard/participant2.png",
      time: "05:00",
      text: "Hi Guys, How are you?",
    },
    {
      id: "2",
      sender: "Williams Bruk",
      avatar: "/dashboard/participant3.png",
      time: "05:05",
      text: "non Tellus dignissim",
    },
    {
      id: "3",
      sender: "You",
      avatar: "/dashboard/participant1.png",
      time: "05:15",
      text: "Viramas sed dictum ligula, cursus bandit rises",
      isMe: true,
    },
    {
      id: "4",
      sender: "Smith Brookline",
      avatar: "/dashboard/participant3.png",
      time: "05:20",
      text: "Viramas sed dictum dictums ligula, cursus bandit.",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      avatar: "/dashboard/participant1.png",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: inputMessage,
      isMe: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
  };

  const toggleParticipantMute = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isMuted: !p.isMuted } : p))
    );
  };

  const toggleParticipantVideo = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isVideoOff: !p.isVideoOff } : p))
    );
  };

  return (
    <div className="w-full space-y-5">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-sm text-[#7a8c87]">
        <span className="font-semibold text-[#1a2d29]">App</span>
        <ChevronRight className="h-4 w-4 text-[#a0b0aa]" />
        <span className="text-[#647873]">Calls</span>
      </div>

      {/* Main Grid: Left Sidebar Panel + Right Active Call View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT SIDEBAR PANEL (4 cols) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Participants Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5ebe7] shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#1a2d29]">Participants</h3>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1f5c4b] text-[11px] font-bold text-white">
                  0{participants.length}
                </span>
              </div>
              <button className="text-xs font-semibold text-[#1f5c4b] hover:underline">
                Show All
              </button>
            </div>

            <div className="space-y-3.5">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#f7faf8] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-100 shadow-sm bg-gray-100">
                      <Image
                        src={participant.avatar}
                        alt={participant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#1a2d29]">
                      {participant.name}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleParticipantMute(participant.id)}
                      className={`p-2 rounded-xl text-xs transition ${
                        participant.isMuted
                          ? "bg-red-50 text-red-500"
                          : "bg-[#f2f7f4] text-[#4a5c57] hover:bg-[#e4ede7]"
                      }`}
                      title={participant.isMuted ? "Unmute" : "Mute"}
                    >
                      {participant.isMuted ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleParticipantVideo(participant.id)}
                      className={`p-2 rounded-xl text-xs transition ${
                        participant.isVideoOff
                          ? "bg-red-50 text-red-500"
                          : "bg-[#f2f7f4] text-[#4a5c57] hover:bg-[#e4ede7]"
                      }`}
                      title={participant.isVideoOff ? "Turn Video On" : "Turn Video Off"}
                    >
                      {participant.isVideoOff ? (
                        <VideoOff className="h-4 w-4" />
                      ) : (
                        <Video className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chats Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5ebe7] shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#1a2d29]">Chats</h3>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1f5c4b] text-[11px] font-bold text-white">
                  0{messages.length}
                </span>
              </div>
              <button className="text-xs font-semibold text-[#1f5c4b] hover:underline">
                Show All
              </button>
            </div>

            {/* Chat message stream */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 flex-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.isMe ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-100 flex-shrink-0 bg-gray-100">
                    <Image
                      src={msg.avatar}
                      alt={msg.sender}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div
                    className={`max-w-[80%] flex flex-col ${
                      msg.isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-xs font-semibold text-[#2c3e38]">
                        {msg.sender}
                      </span>
                      <span className="text-[10px] text-[#8a9c96]">
                        {msg.time}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.isMe
                          ? "bg-[#1f5c4b] text-white rounded-tr-none shadow-sm"
                          : "bg-[#f4f7f5] text-[#2c3e38] rounded-tl-none border border-[#e3eae6]"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Send message input */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-[#f4f7f5] border border-gray-200 rounded-full px-4 py-2 text-xs text-[#1a2d29] focus:outline-none focus:border-[#1f5c4b]"
              />
              <button
                type="submit"
                className="h-8 w-8 rounded-full bg-[#1f5c4b] text-white flex items-center justify-center hover:bg-[#184b3d] transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* ================= RIGHT MAIN AREA (8 cols) ================= */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Main Call Card Header */}
          <div className="bg-white rounded-3xl p-4 border border-[#e5ebe7] shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full border border-emerald-100 shadow-sm bg-gray-100">
                <Image
                  src="/dashboard/doctor_video_call.png"
                  alt="forest Kroch"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-bold text-base text-[#1a2d29]">forest Kroch</h2>
                <p className="text-xs text-[#82948e]">Lorem ipsum dolor sit amet...</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="h-10 w-10 rounded-2xl bg-[#edf4f0] text-[#1f5c4b] flex items-center justify-center hover:bg-[#e0ede6] transition">
                <Video className="h-4 w-4" />
              </button>
              <button className="h-10 w-10 rounded-2xl bg-[#edf4f0] text-[#1f5c4b] flex items-center justify-center hover:bg-[#e0ede6] transition">
                <Phone className="h-4 w-4" />
              </button>
              <button className="h-10 w-10 rounded-2xl bg-[#edf4f0] text-[#1f5c4b] flex items-center justify-center hover:bg-[#e0ede6] transition">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Main Video Call Frame */}
          <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-gray-200 shadow-xl group aspect-[16/9] min-h-[380px] lg:min-h-[440px]">
            {callEnded ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-white space-y-4">
                <div className="h-16 w-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
                  <PhoneOff className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Call Ended</h3>
                <button
                  onClick={() => setCallEnded(false)}
                  className="px-6 py-2.5 bg-[#1f5c4b] hover:bg-[#184b3d] text-white rounded-xl text-sm font-semibold transition"
                >
                  Rejoin Call
                </button>
              </div>
            ) : (
              <>
                {/* Active Speaker Video Image */}
                {!isVideoOff ? (
                  <Image
                    src="/dashboard/doctor_video_call.png"
                    alt="Active Speaker"
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-20 w-20 rounded-full bg-[#1f5c4b] flex items-center justify-center text-2xl font-bold">
                        FK
                      </div>
                      <p className="text-sm font-medium text-slate-300">Camera is turned off</p>
                    </div>
                  </div>
                )}

                {/* Top Overlays */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400"></span> W You
                    </span>

                    {isRecording && (
                      <span className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                        Recording in Progress...
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className="h-9 w-9 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center justify-center transition"
                      title={isRecording ? "Pause Recording" : "Start Recording"}
                    >
                      {isRecording ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      className="h-9 w-9 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center justify-center transition"
                      title="Fullscreen"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Center Floating Controls Overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-black/35 backdrop-blur-xl px-5 py-3 rounded-full border border-white/15 shadow-2xl">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`h-11 w-11 rounded-full flex items-center justify-center transition ${
                      isMicMuted
                        ? "bg-red-500 text-white"
                        : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                    title={isMicMuted ? "Unmute" : "Mute"}
                  >
                    {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>

                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`h-11 w-11 rounded-full flex items-center justify-center transition ${
                      isVideoOff
                        ? "bg-red-500 text-white"
                        : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                    title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                  >
                    {isVideoOff ? (
                      <VideoOff className="h-5 w-5" />
                    ) : (
                      <Video className="h-5 w-5" />
                    )}
                  </button>

                  <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`h-11 w-11 rounded-full flex items-center justify-center transition ${
                      isScreenSharing
                        ? "bg-emerald-500 text-white"
                        : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                    title="Share Screen"
                  >
                    <MonitorUp className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => setCallEnded(true)}
                    className="h-11 px-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 font-semibold shadow-lg shadow-red-500/30 transition-all scale-105 hover:scale-110"
                    title="End Call"
                  >
                    <PhoneOff className="h-5 w-5" />
                  </button>
                </div>

                {/* Subtitles Glassmorphism Pill (Bottom Left Overlay) */}
                {subtitlesEnabled && (
                  <div className="absolute bottom-6 left-6 z-10 hidden sm:flex items-center gap-3 bg-black/40 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/15 max-w-[320px] text-white">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Volume2 className="h-4 w-4 animate-pulse" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-300 block">
                        OC/Subtitles
                      </span>
                      <p className="text-xs truncate text-white/90">
                        Hi guys thank you so much for coming - uhh been a long time no...
                      </p>
                    </div>
                    <button
                      onClick={() => setSubtitlesEnabled(false)}
                      className="text-white/60 hover:text-white"
                    >
                      <Power className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Bottom Participant Video Thumbnails Carousel */}
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-3 gap-4 flex-1">
              {/* Participant Thumbnail 1 */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-gray-200 shadow-sm group">
                <Image
                  src="/dashboard/participant1.png"
                  alt="Forest Kroch"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white">
                  Forest Kroch
                </div>
                <div className="absolute top-2 right-2 p-1 rounded-md bg-black/40 backdrop-blur-md text-white">
                  <Mic className="h-3 w-3" />
                </div>
              </div>

              {/* Participant Thumbnail 2 */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-gray-200 shadow-sm group">
                <Image
                  src="/dashboard/participant2.png"
                  alt="Smith Brookline"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white">
                  Smith Brookline
                </div>
                <div className="absolute top-2 right-2 p-1 rounded-md bg-black/40 backdrop-blur-md text-white">
                  <Mic className="h-3 w-3" />
                </div>
              </div>

              {/* Participant Thumbnail 3 */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-gray-200 shadow-sm group">
                <Image
                  src="/dashboard/participant3.png"
                  alt="Bernardo James"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white">
                  Bernardo James
                </div>
                <div className="absolute top-2 right-2 p-1 rounded-md bg-black/40 backdrop-blur-md text-white">
                  <Mic className="h-3 w-3" />
                </div>
              </div>
            </div>

            {/* Next Arrow Button */}
            <button className="h-12 w-12 rounded-2xl bg-[#0f172a] hover:bg-black text-white flex items-center justify-center shadow-lg transition-colors flex-shrink-0">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
