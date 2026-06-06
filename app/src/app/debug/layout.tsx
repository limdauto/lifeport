import { DebugAdminGate } from '@/components/debug/DebugAdminGate';

export default function DebugLayout({ children }: { children: React.ReactNode }) {
  return <DebugAdminGate>{children}</DebugAdminGate>;
}
