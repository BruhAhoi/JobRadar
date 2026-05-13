import type { UpcomingDeadline } from "../../services/dashboardService";

function formatDeadline(dateStr: string): { date: string; time: string; urgent: boolean } {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const hoursLeft = diff / 3600000;

  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
  const time = hoursLeft < 24
    ? `${Math.round(hoursLeft)}h left`
    : `${Math.round(hoursLeft / 24)}d left`;

  return { date, time, urgent: hoursLeft < 24 };
}

function UpcomingRow({ item }: { item: UpcomingDeadline }) {
  const { date, time, urgent } = formatDeadline(item.deadlineAt);
  return (
    <div
      className="flex items-center justify-between py-3.5 gap-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className="w-[3px] rounded-full mt-0.5 shrink-0"
          style={{
            height: "36px",
            background: urgent ? "#ef4444" : "#4f7ef8",
          }}
        />
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-white leading-tight truncate">
            {item.companyName}
          </p>
          <p className="text-[12px] text-slate-500 mt-0.5 truncate">
            {item.position}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          {date}
        </p>
        <p
          className="text-[12px] font-medium mt-0.5"
          style={{ color: urgent ? "#ef4444" : "#60a5fa" }}
        >
          {time}
        </p>
      </div>
    </div>
  );
}

interface UpcomingPanelProps {
  deadlines?: UpcomingDeadline[];
}

export default function UpcomingPanel({ deadlines = [] }: UpcomingPanelProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h2 className="text-[14px] font-semibold text-white">Upcoming Deadlines</h2>
      </div>

      <div className="px-5">
        {deadlines.length === 0 ? (
          <div className="py-6 text-center text-[13px] text-slate-500">
            No upcoming deadlines
          </div>
        ) : (
          deadlines.map((item, index) => (
            <div
              key={item.id}
              style={index === deadlines.length - 1 ? { borderBottom: "none" } : undefined}
            >
              <UpcomingRow item={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
