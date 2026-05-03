import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-60 shrink-0 border-r border-border bg-sidebar overflow-y-auto p-4">
        <h2 className="text-lg font-semibold">Sidebar</h2>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-lg font-semibold">Main</h2>
        </main>
      </div>
    </div>
  );
}
