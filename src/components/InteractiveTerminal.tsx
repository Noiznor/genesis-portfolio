"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { AdminPanel } from "@/components/AdminPanel";
import type { SiteProfile } from "@/lib/portfolio-data";
import type { Achievement, Certification, Experience, Project, SkillCategory } from "@/types";

type TerminalLine = {
  type: "system" | "command" | "output" | "error";
  text: string;
};

type InteractiveTerminalProps = {
  siteProfile: SiteProfile;
  projects: Project[];
  skillCategories: SkillCategory[];
  experiences: Experience[];
  achievements: Achievement[];
  certifications: Certification[];
  links: {
    personalGithub: string;
    sphrGithub: string;
  };
};

const initialLines: TerminalLine[] = [
  { type: "system", text: "initializing portfolio..." },
  { type: "system", text: "loading CAN/AGL projects..." },
  { type: "system", text: "cybersecurity profile active..." },
  { type: "system", text: "AI edge systems ready..." },
  { type: "output", text: "type 'help' to list available commands." }
];

const sectionCommands: Record<string, string> = {
  home: "#home",
  about: "#about",
  skills: "#skills",
  projects: "#projects",
  project: "#projects",
  experience: "#experience",
  achievements: "#achievements",
  achievement: "#achievements",
  contact: "#contact"
};

const publicCommands = [
  "help",
  "ls",
  "clear",
  "home",
  "about",
  "skills",
  "projects",
  "experience",
  "achievements",
  "contact",
  "github",
  "sphr",
  "whoami",
  "pwd",
  "date"
];

function scrollToSection(selector: string) {
  const target = document.querySelector(selector);

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function getLineClass(type: TerminalLine["type"]) {
  if (type === "command") return "text-slate-200";
  if (type === "error") return "text-red-300";
  if (type === "output") return "text-slate-300";
  return "text-emerald-400";
}

export function InteractiveTerminal({
  siteProfile,
  projects,
  skillCategories,
  experiences,
  achievements,
  certifications,
  links
}: InteractiveTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [input, setInput] = useState("");
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isWaitingForAdminPassword, setIsWaitingForAdminPassword] =
    useState(false);
  const [isVerifyingAdminPassword, setIsVerifyingAdminPassword] =
    useState(false);
  const [adminSessionPassword, setAdminSessionPassword] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [lines]);

  function addLines(newLines: TerminalLine[]) {
    setLines((current) => [...current, ...newLines]);
  }

  async function handleAdminPasswordAttempt(rawPassword: string) {
    const maskedCommandLine: TerminalLine = {
      type: "command",
      text: "$ ********"
    };

    setIsVerifyingAdminPassword(true);

    try {
      const response = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: rawPassword
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Invalid admin password.");
      }

      setIsWaitingForAdminPassword(false);
      setAdminSessionPassword(rawPassword);
      setIsAdminPanelOpen(true);

      addLines([
        maskedCommandLine,
        {
          type: "output",
          text: "access granted. opening portfolio content editor..."
        },
        {
          type: "output",
          text: "admin password verified server-side using ADMIN_PASSWORD."
        }
      ]);
    } catch (error) {
      setIsWaitingForAdminPassword(false);

      addLines([
        maskedCommandLine,
        {
          type: "error",
          text:
            error instanceof Error
              ? `access denied. ${error.message}`
              : "access denied. unexpected password verification error."
        }
      ]);
    } finally {
      setIsVerifyingAdminPassword(false);
    }
  }

  function runCommand(rawCommand: string) {
    const command = rawCommand.trim().toLowerCase();

    if (isWaitingForAdminPassword) {
      void handleAdminPasswordAttempt(rawCommand.trim());
      return;
    }

    if (!command) return;

    if (command === "clear") {
      setLines([]);
      return;
    }

    const commandLine: TerminalLine = {
      type: "command",
      text: `$ ${rawCommand}`
    };

    if (command === "help") {
      addLines([
        commandLine,
        {
          type: "output",
          text: `available commands: ${publicCommands.join(", ")}`
        }
      ]);
      return;
    }

    if (command === "ls") {
      addLines([
        commandLine,
        {
          type: "output",
          text: "home  about  skills  projects  experience  achievements  contact  github  sphr"
        }
      ]);
      return;
    }

    if (command === "whoami") {
      addLines([
        commandLine,
        {
          type: "output",
          text: "Genesis I. Polotan — Computer Engineering Graduate | Cybersecurity • CAN/AGL • AI Edge • Embedded Systems"
        }
      ]);
      return;
    }

    if (command === "pwd") {
      addLines([
        commandLine,
        {
          type: "output",
          text: "/portfolio/genesis-polotan"
        }
      ]);
      return;
    }

    if (command === "date") {
      addLines([
        commandLine,
        {
          type: "output",
          text: new Date().toLocaleString()
        }
      ]);
      return;
    }

    if (command === "github") {
      window.open(links.personalGithub, "_blank", "noopener,noreferrer");
      addLines([
        commandLine,
        {
          type: "output",
          text: "opening personal GitHub profile..."
        }
      ]);
      return;
    }

    if (command === "sphr") {
      window.open(links.sphrGithub, "_blank", "noopener,noreferrer");
      addLines([
        commandLine,
        {
          type: "output",
          text: "opening SPHR GitHub organization..."
        }
      ]);
      return;
    }

    if (command === "sudo edit") {
      setIsWaitingForAdminPassword(true);
      addLines([
        commandLine,
        {
          type: "output",
          text: "password required. enter admin password:"
        }
      ]);
      return;
    }

    if (sectionCommands[command]) {
      scrollToSection(sectionCommands[command]);
      addLines([
        commandLine,
        {
          type: "output",
          text: `navigating to ${command} section...`
        }
      ]);
      return;
    }

    addLines([
      commandLine,
      {
        type: "error",
        text: `command not found: ${rawCommand}. type 'help' to see available commands.`
      }
    ]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isVerifyingAdminPassword) return;

    runCommand(input);
    setInput("");
  }

  return (
    <>
      <div
        className="rounded-2xl border border-emerald-400/20 bg-slate-950/85 shadow-2xl shadow-emerald-500/10 backdrop-blur"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-emerald-400/10 px-5 py-4">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-3 font-mono text-xs font-semibold text-slate-400">
            system.sh
          </span>
        </div>

        <div
          ref={scrollRef}
          className="h-[260px] space-y-3 overflow-y-auto p-6 font-mono text-sm"
        >
          {lines.map((line, index) => (
            <p key={`${line.text}-${index}`} className={getLineClass(line.type)}>
              {line.text}
            </p>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <span className="text-slate-300">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              aria-label={
                isWaitingForAdminPassword
                  ? "Admin password input"
                  : "Interactive portfolio terminal command input"
              }
              type={isWaitingForAdminPassword ? "password" : "text"}
              className="w-full bg-transparent text-emerald-300 outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder={
                isVerifyingAdminPassword
                  ? "verifying..."
                  : isWaitingForAdminPassword
                    ? "enter password..."
                    : "type a command..."
              }
              autoComplete="off"
              spellCheck={false}
              disabled={isVerifyingAdminPassword}
            />
          </form>
        </div>
      </div>

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        siteProfile={siteProfile}
        projects={projects}
        skillCategories={skillCategories}
        experiences={experiences}
        achievements={achievements}
        certifications={certifications}
        adminPassword={adminSessionPassword}
      />
    </>
  );
}
