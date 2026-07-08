import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "soonchunhyang-agl-intern",
    title: "Automotive CAN Bus / AGL Intern",
    organization: "Soonchunhyang University – R&D Center for Security & Safety Industries",
    location: "Asan, South Korea",
    period: "2026",
    description:
      "Worked on Automotive Grade Linux setup, CAN bus configuration, signal capture, CAN decoding workflow, and dashboard integration using Raspberry Pi, PCAN-USB FD, SocketCAN, and can-utils. Researched CAN security concepts including spoofing, replay, and anomaly detection.",
    highlights: [
      "Configured Automotive Grade Linux workflows on Raspberry Pi",
      "Set up CAN interface testing with SocketCAN and PCAN-USB FD",
      "Captured and analyzed CAN traffic using can-utils",
      "Worked with speed, RPM, turn signal, and hazard signal behavior",
      "Documented setup, debugging, and dashboard integration progress",
      "Studied CAN security concepts including spoofing, replay, and anomaly detection"
    ]
  },
  {
    id: "sphr-founder-technical-lead",
    title: "Founder / Technical Lead",
    organization: "SPHR Tech Solutions",
    location: "Cebu City, Philippines",
    period: "2024 – Present",
    description:
      "Founded and led a technology startup focused on software, hardware, AI-assisted systems, cybersecurity-related solutions, and practical engineering products. Worked on project planning, technical development, prototype direction, and team coordination.",
    highlights: [
      "Led planning and technical direction for software and hardware projects",
      "Worked on AI-assisted systems, cybersecurity-related solutions, and practical prototypes",
      "Coordinated project development and technical decision-making",
      "Connected engineering ideas with startup execution and product direction"
    ]
  },
  {
    id: "meister-pcb-hardware-intern",
    title: "PCB / Hardware Design Intern",
    organization: "Meister PCB",
    location: "Philippines",
    period: "2020",
    description:
      "Worked on schematic capture, component placement, PCB routing, prototype testing, and design revisions, gaining practical experience in electronics and hardware development.",
    highlights: [
      "Assisted with schematic capture and PCB layout work",
      "Worked on component placement and routing revisions",
      "Supported prototype testing and hardware review",
      "Built practical understanding of electronics design workflows"
    ]
  }
];
