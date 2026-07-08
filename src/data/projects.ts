import type { Project } from "@/types";

const personalGithub = "https://github.com/GenesisIPolotan";
const sphrGithub = "https://github.com/SPHR-ph";

export const projects: Project[] = [
  {
    id: "agl-can-dashboard",
    title: "Automotive Grade Linux CAN Dashboard Integration",
    category: "Automotive / Embedded Linux / CAN Bus",
    description:
      "Built and configured an Automotive Grade Linux environment on Raspberry Pi for a vehicle dashboard prototype. Integrated CAN bus tools and analyzed real vehicle and bench CAN traffic using PCAN-USB FD, SocketCAN, can-utils, candump, cansniffer, and custom decoding workflows.",
    highlights: [
      "Configured AGL on Raspberry Pi",
      "Used PCAN-USB FD and SocketCAN for CAN interface setup",
      "Captured and analyzed CAN frames",
      "Worked with speed, RPM, turn signal, and hazard signal behavior",
      "Documented setup, configuration, debugging, and dashboard integration",
      "Explored CAN spoofing, replay, and anomaly concepts"
    ],
    techStack: [
      "Automotive Grade Linux",
      "Raspberry Pi",
      "Linux",
      "SocketCAN",
      "PCAN-USB FD",
      "can-utils",
      "Python",
      "CAN Bus"
    ],
    overview:
      "A hands-on automotive Linux and CAN bus integration project focused on building a dashboard prototype using Raspberry Pi, Automotive Grade Linux, and real CAN tooling.",
    problemSolved:
      "Connected embedded Linux, CAN interface configuration, vehicle signal capture, and dashboard behavior into one practical workflow for automotive systems learning and prototyping.",
    role:
      "Worked on setup, configuration, CAN interface testing, signal capture, decoder workflow, debugging, and documentation.",
    toolsUsed: [
      "Automotive Grade Linux",
      "Raspberry Pi 4",
      "PCAN-USB FD",
      "SocketCAN",
      "can-utils",
      "candump",
      "cansniffer",
      "cansend",
      "Python"
    ],
    technicalWork: [
      "Configured CAN interface settings on Linux",
      "Captured CAN frames from bench and vehicle-related test environments",
      "Analyzed speed, RPM, turn signal, and hazard signal behavior",
      "Prepared decoding workflows for signal interpretation",
      "Documented setup, debugging steps, and integration progress"
    ],
    result:
      "Built strong practical experience in automotive Linux, CAN bus workflows, embedded debugging, and dashboard integration.",
    links: [
      {
        label: "GitHub",
        href: sphrGithub
      },
      {
        label: "Documentation",
        href: "#",
        isPlaceholder: true
      }
    ]
  },
  {
    id: "wifi-mesh-localization",
    title: "Resilient Real-Time Edge Device Localization in Wi-Fi Mesh Networks",
    category: "Thesis / AI / Cybersecurity / Edge Computing",
    description:
      "Developed a Raspberry Pi-based indoor localization system using RSSI fingerprinting, Weighted KNN, and Random Forest Regression. The project focused on improving localization resilience in Wi-Fi mesh environments while considering security risks such as Evil Twin and multi-access-point signal injection.",
    highlights: [
      "Built a Wi-Fi RSSI fingerprinting-based localization system",
      "Used WKNN and Random Forest Regression",
      "Worked with Raspberry Pi edge devices",
      "Applied SSID/BSSID filtering and whitelisting",
      "Studied localization security against spoofing-style Wi-Fi threats",
      "Created a research-driven system with real-world edge deployment relevance"
    ],
    techStack: [
      "Python",
      "Raspberry Pi",
      "Wi-Fi Mesh",
      "RSSI Fingerprinting",
      "WKNN",
      "Random Forest",
      "Cybersecurity",
      "Edge Computing"
    ],
    overview:
      "A thesis project focused on real-time indoor localization using edge devices, Wi-Fi RSSI data, and machine learning models.",
    problemSolved:
      "Improved practical localization reliability in Wi-Fi mesh environments while considering spoofing-style risks and trusted access point filtering.",
    role:
      "Worked on system design, data collection, model workflow, Raspberry Pi setup, localization logic, and security-focused analysis.",
    toolsUsed: [
      "Python",
      "Raspberry Pi",
      "Wi-Fi scanning tools",
      "RSSI datasets",
      "Weighted KNN",
      "Random Forest Regression"
    ],
    technicalWork: [
      "Collected RSSI fingerprinting data",
      "Implemented localization workflows using WKNN and Random Forest Regression",
      "Applied SSID/BSSID filtering and whitelisting concepts",
      "Tested real-world edge deployment behavior",
      "Analyzed localization resilience against Wi-Fi spoofing-style threats"
    ],
    result:
      "Produced a research-driven edge localization system connecting AI, networking, cybersecurity awareness, and embedded deployment.",
    links: [
      {
        label: "GitHub",
        href: sphrGithub
      },
      {
        label: "Documentation",
        href: "#",
        isPlaceholder: true
      }
    ]
  },
  {
    id: "hybrid-wood-detection",
    title: "Hybrid Wood Detection and Classification Mobile Application",
    category: "AI / Mobile / Machine Learning",
    description:
      "Developed and trained an AI model for wood classification, identifying wood type and infestation status using image-based machine learning. Integrated the trained model into a mobile application for on-device inference.",
    highlights: [
      "Built image classification workflow",
      "Trained model for wood type and infestation detection",
      "Integrated AI model into mobile app",
      "Used TensorFlow Lite for edge/mobile inference",
      "Focused on practical AI usage for inspection and detection"
    ],
    techStack: [
      "Machine Learning",
      "TensorFlow Lite",
      "Image Classification",
      "Mobile App Development",
      "Python"
    ],
    overview:
      "An AI-powered mobile application project for detecting wood type and infestation status using image classification.",
    problemSolved:
      "Helped transform visual inspection into a practical mobile AI workflow that can run inference on-device.",
    role:
      "Worked on AI model development, classification workflow, and mobile inference integration.",
    toolsUsed: [
      "Python",
      "TensorFlow Lite",
      "Image datasets",
      "Mobile app tools",
      "Machine learning workflow"
    ],
    technicalWork: [
      "Prepared image classification workflow",
      "Trained a model for wood and infestation categories",
      "Converted or integrated the model for mobile inference",
      "Focused on practical detection and inspection use cases"
    ],
    result:
      "Built practical experience in applied AI, mobile inference, and real-world image classification systems.",
    links: [
      {
        label: "GitHub",
        href: sphrGithub
      },
      {
        label: "Documentation",
        href: "#",
        isPlaceholder: true
      }
    ]
  },
  {
    id: "secure-captive-portal",
    title: "Secure Captive Portal and Anti-Phishing System for Peso WiFi Networks",
    category: "Cybersecurity / Networking",
    description:
      "Recreated a captive portal-based WiFi system and performed authorized security testing to identify redirection and phishing risks. Designed protective measures to help reduce fake splash page attacks and improve user safety in public WiFi environments.",
    highlights: [
      "Studied captive portal behavior",
      "Tested phishing and redirection risks in an authorized environment",
      "Designed anti-phishing protection concepts",
      "Improved awareness of public WiFi security weaknesses"
    ],
    techStack: [
      "Networking",
      "Cybersecurity",
      "Captive Portal",
      "Linux",
      "Web Security"
    ],
    overview:
      "A cybersecurity and networking project focused on understanding captive portal redirection behavior and public WiFi phishing risks.",
    problemSolved:
      "Identified how fake splash pages and redirection flows can create risk for users, then proposed protection concepts for safer public WiFi usage.",
    role:
      "Worked on authorized testing, security analysis, portal behavior study, and protection concept design.",
    toolsUsed: [
      "Linux",
      "Networking tools",
      "Captive portal setup",
      "Web security testing workflow"
    ],
    technicalWork: [
      "Recreated captive portal behavior",
      "Tested redirection and phishing-style risks in an authorized environment",
      "Studied user safety weaknesses in public WiFi flows",
      "Designed anti-phishing protection concepts"
    ],
    result:
      "Built practical experience in cybersecurity testing, network behavior analysis, and defensive design thinking.",
    links: [
      {
        label: "GitHub",
        href: sphrGithub
      },
      {
        label: "Documentation",
        href: "#",
        isPlaceholder: true
      }
    ]
  },
  {
    id: "smart-bin",
    title: "Smart Bin with Fill Detection System",
    category: "Embedded Systems / Automation",
    description:
      "Built a PIC16F877A-based contactless waste bin using ultrasonic and IR sensors with motor control for automated lid operation and fill-level detection.",
    highlights: [
      "Used PIC microcontroller",
      "Integrated sensors and motor control",
      "Built an automated embedded prototype",
      "Focused on practical automation and hardware behavior"
    ],
    techStack: [
      "PIC16F877A",
      "Embedded C",
      "Sensors",
      "Motor Control",
      "Automation"
    ],
    overview:
      "An embedded automation prototype using a PIC microcontroller, sensors, and motor control.",
    problemSolved:
      "Automated bin interaction and fill-level detection using low-cost embedded hardware and sensor integration.",
    role:
      "Worked on microcontroller logic, sensor integration, motor control behavior, and prototype testing.",
    toolsUsed: [
      "PIC16F877A",
      "Embedded C",
      "Ultrasonic sensor",
      "IR sensor",
      "Motor driver",
      "Prototype hardware"
    ],
    technicalWork: [
      "Programmed embedded control behavior",
      "Integrated contactless sensing",
      "Controlled lid movement through motor actuation",
      "Tested fill-level detection behavior"
    ],
    result:
      "Gained hands-on experience in microcontroller-based automation, sensor behavior, and hardware debugging.",
    links: [
      {
        label: "GitHub",
        href: sphrGithub
      },
      {
        label: "Documentation",
        href: "#",
        isPlaceholder: true
      }
    ]
  },
  {
    id: "smart-classroom-controller",
    title: "Smart Classroom Controller",
    category: "Assembly / Embedded Simulation",
    description:
      "Simulated an 8086-based automation system in Proteus for controlling AC units, lights, and outlets through relay logic.",
    highlights: [
      "Used 8086 Assembly",
      "Simulated control logic in Proteus",
      "Designed classroom automation behavior",
      "Applied low-level programming concepts"
    ],
    techStack: [
      "8086 Assembly",
      "Proteus",
      "Relay Logic",
      "Automation"
    ],
    overview:
      "A low-level embedded simulation project for classroom automation using 8086 Assembly and Proteus.",
    problemSolved:
      "Modeled classroom device control behavior through relay-based automation logic.",
    role:
      "Worked on assembly logic, simulation setup, and automation behavior design.",
    toolsUsed: [
      "8086 Assembly",
      "Proteus",
      "Relay logic simulation"
    ],
    technicalWork: [
      "Created low-level automation logic",
      "Simulated control behavior for AC units, lights, and outlets",
      "Applied relay-based control concepts",
      "Tested system behavior through Proteus simulation"
    ],
    result:
      "Strengthened low-level programming, embedded simulation, and automation design fundamentals.",
    links: [
      {
        label: "GitHub",
        href: sphrGithub
      },
      {
        label: "Documentation",
        href: "#",
        isPlaceholder: true
      }
    ]
  }
];

export const projectLinks = {
  personalGithub,
  sphrGithub
};
