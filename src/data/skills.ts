import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    id: "cybersecurity-networking",
    title: "Cybersecurity & Networking",
    description:
      "Security-focused networking, CAN security research, Wi-Fi systems, and defensive analysis.",
    skills: [
      { name: "CAN Bus Security" },
      { name: "Vulnerability Analysis" },
      { name: "Intrusion Detection Research" },
      { name: "Linux Networking" },
      { name: "Wi-Fi Mesh Networks" },
      { name: "Anti-Phishing Systems" },
      { name: "Network Configuration" }
    ]
  },
  {
    id: "automotive-ev-can",
    title: "Automotive / EV / CAN",
    description:
      "Automotive Linux, CAN interface setup, signal capture, decoding, and dashboard integration.",
    skills: [
      { name: "Automotive Grade Linux" },
      { name: "SocketCAN" },
      { name: "can-utils" },
      { name: "PCAN-USB FD" },
      { name: "CAN Frame Capture" },
      { name: "CAN Signal Decoding" },
      { name: "candump" },
      { name: "cansniffer" },
      { name: "cansend" },
      { name: "Dashboard Integration" }
    ]
  },
  {
    id: "ai-machine-learning",
    title: "AI / Machine Learning",
    description:
      "Applied machine learning for edge intelligence, localization, inspection, and classification systems.",
    skills: [
      { name: "Random Forest Regression" },
      { name: "Weighted K-Nearest Neighbor" },
      { name: "RSSI Fingerprinting" },
      { name: "TensorFlow Lite" },
      { name: "Image Classification" },
      { name: "Edge AI" },
      { name: "Data Collection and Analysis" }
    ]
  },
  {
    id: "embedded-hardware",
    title: "Embedded Systems / Hardware",
    description:
      "Hands-on embedded prototyping, sensor integration, Linux device configuration, and hardware debugging.",
    skills: [
      { name: "Raspberry Pi" },
      { name: "Arduino" },
      { name: "PIC Microcontrollers" },
      { name: "Sensor Integration" },
      { name: "PCB Design Basics" },
      { name: "Hardware Debugging" },
      { name: "Real-time Testing" },
      { name: "Linux Device Configuration" }
    ]
  },
  {
    id: "programming",
    title: "Programming",
    description:
      "Programming and tooling used across software, embedded systems, automation, and research workflows.",
    skills: [
      { name: "Python" },
      { name: "C" },
      { name: "C++" },
      { name: "Java" },
      { name: "Assembly" },
      { name: "MATLAB" },
      { name: "Git" },
      { name: "Shell Commands" }
    ]
  }
];
