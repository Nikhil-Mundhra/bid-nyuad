import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TradeChat } from "@/components/TradeChat";

export default function TradePage({ params }: { params: { tradeId: string } }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/markets" className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink">
        <ArrowLeft size={16} />
        Back to markets
      </Link>
      <div className="mt-4">
        <TradeChat tradeId={params.tradeId} />
      </div>
    </main>
  );
}
