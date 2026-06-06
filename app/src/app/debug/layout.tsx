import { DebugAdminGate } from '@/components/debug/DebugAdminGate';

export const dynamic = 'force-dynamic';

export default function DebugLayout({ children }: { children: React.ReactNode }) {
  return <DebugAdminGate>{children}</DebugAdminGate>;
}
