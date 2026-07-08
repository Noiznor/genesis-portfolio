const hackerRows = [
  "root@genesis:~$ initializing secure portfolio // CAN_BUS=active // AGL=ready // EDGE_AI=online //",
  "packet_scan --interface can0 --mode analysis // intrusion_detection=enabled // raspberry_pi=edge_node //",
  "ssh genesis@portfolio --load-projects // cybersecurity_profile=active // embedded_systems=ready //",
  "candump can0 | decode_signals --speed --rpm --turn --hazard // linux_socketcan=stable //",
  "neural_edge_pipeline --wifi-mesh --rssi --random-forest --wknn // inference=optimized //",
  "SPHR_TECH_SOLUTIONS // software + hardware + ai + cybersecurity // founder_mode=technical //"
];

export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#020403]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.16),transparent_28rem),radial-gradient(circle_at_80%_10%,rgba(132,204,22,0.10),transparent_26rem),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.10),transparent_30rem)]" />

      <div className="absolute inset-0 opacity-[0.30]">
        {hackerRows.map((row, index) => (
          <div
            key={row}
            className={`hacker-row hacker-row-${index + 1} absolute left-0 flex w-[240%] gap-10 font-mono text-xs uppercase tracking-[0.25em] text-emerald-300`}
          >
            <span>{row}</span>
            <span>{row}</span>
            <span>{row}</span>
            <span>{row}</span>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,3,0.28),rgba(2,4,3,0.55)_72%,rgba(2,4,3,1))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(2,4,3,0.55))]" />
    </div>
  );
}
