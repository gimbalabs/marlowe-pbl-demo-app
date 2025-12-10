import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { SendLovelace } from "@/components/SendLovelace";

const NETWORK_NAMES: Record<number, string> = {
  0: "Testnet",
  1: "Mainnet",
};

const TABS = [
  { id: "101.1", label: "Lesson 101.1", title: "Connect a Wallet" },
  { id: "101.2", label: "Lesson 101.2", title: "Get Test ADA" },
  { id: "101.3", label: "Lesson 101.3", title: "Inspect Transactions" },
];

export default function Module101() {
  const { connected, wallet } = useWallet();
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("101.1");

  useEffect(() => {
    if (connected && wallet) {
      wallet.getNetworkId().then(setNetworkId).catch(() => setNetworkId(null));
      wallet.getLovelace().then((lovelace) => {
        const ada = (parseInt(lovelace) / 1_000_000).toFixed(2);
        setBalance(ada);
      }).catch(() => setBalance(null));
    } else {
      setNetworkId(null);
      setBalance(null);
    }
  }, [connected, wallet]);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Head>
        <title>Module 101 | Marlowe PBL</title>
        <meta name="description" content="Marlowe PBL Module 101 - Getting Started" />
      </Head>

      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm font-mono">
            ← Home
          </Link>
          <CardanoWallet />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-light text-gray-900 mb-2">Module 101</h1>
        <p className="text-gray-500 mb-8">Getting Started with Cardano Preprod</p>

        <p className="text-gray-500 mb-8">
          This interactive demo accompanies{" "}
          <Link href="https://app.andamio.io/course/b48c3718f2175f05cdb2767a4721d03e2df2f69f9302241ba200b792/101">
          Marlowe PBL, Module 101
          </Link>
        </p>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 border-b-2 font-mono text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="block">{tab.label}</span>
                <span className={`text-xs font-sans ${activeTab === tab.id ? "text-gray-600" : "text-gray-400"}`}>
                  {tab.title}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* SLT 101.1 */}
          {activeTab === "101.1" && (
            <section>
              <h2 className="font-medium text-gray-900 mb-2 text-xl">
                Connect a Wallet to Cardano Preprod
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                I can connect a wallet to Cardano preprod and interact with the example application.
              </p>

              <div className="bg-gray-50 rounded-md p-6">
                {connected ? (
                  <div className="text-sm">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-2 text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Wallet connected
                      </span>
                      {networkId !== null && (
                        <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-mono ${
                          networkId === 0 ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {NETWORK_NAMES[networkId] ?? `Network ${networkId}`}
                          {networkId === 0 && " (Preprod/Preview)"}
                        </span>
                      )}
                    </div>
                    {networkId === 1 && (
                      <p className="text-orange-600 mt-2">
                        Warning: You&apos;re connected to Mainnet. Switch to Preprod for this course.
                      </p>
                    )}
                    {networkId === 0 && (
                      <p className="text-gray-500 mt-2">
                        You&apos;re on a testnet. Make sure it&apos;s Preprod (not Preview) in your wallet settings.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <p>Use the wallet button in the header to connect your wallet.</p>
                    <p className="mt-2 text-xs">
                      Tip: Make sure your wallet is set to Cardano Preprod testnet.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SLT 101.2 */}
          {activeTab === "101.2" && (
            <section>
              <h2 className="font-medium text-gray-900 mb-2 text-xl">
                Get Test ADA from the Faucet
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                I can get some test ada from the Cardano Preprod Faucet.
              </p>

              <div className="bg-gray-50 rounded-md p-6">
                {connected && balance !== null && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-400 mb-1">Current Balance</p>
                    <p className="text-2xl font-light text-gray-900">
                      {balance} <span className="text-sm text-gray-500">ADA</span>
                    </p>
                    {parseFloat(balance) >= 1000 && (
                      <div className="mt-3 flex items-center gap-2 text-green-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">You have enough test ADA to proceed!</span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-500 mb-3">
                  The Cardano Faucet provides free test ADA for development on testnets.
                </p>
                <a
                  href="https://docs.cardano.org/cardano-testnets/tools/faucet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  Open Cardano Faucet
                  <span className="text-xs">↗</span>
                </a>
                <p className="text-xs text-gray-400 mt-3">
                  Select &quot;Preprod Testnet&quot; and paste your wallet address to receive test ADA.
                </p>
              </div>
            </section>
          )}

          {/* SLT 101.3 */}
          {activeTab === "101.3" && (
            <section>
              <h2 className="font-medium text-gray-900 mb-2 text-xl">
                Inspect Transaction Previews
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                I can inspect a transaction preview from the example app.
              </p>

              {/* Demo Transaction */}
              <div className="mb-8">
                <h3 className="text-sm font-mono text-gray-400 mb-3">Demo: Send ADA</h3>
                <SendLovelace variant="1013example" />
              </div>

              {/* Mystery Transactions */}
              <div className="mb-4">
                <h2 className="font-medium text-gray-900 mb-2 text-xl">Your Task: Find the Corrupt Transaction</h2>
                <p className="text-sm text-gray-500 mb-4">
                  One of these four transactions is malicious. Inspect the transaction preview in your wallet before signing. Can you identify which one is trying to steal your funds?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SendLovelace variant="1013a" title="Example A" />
                <SendLovelace variant="1013b" title="Example B" />
                <SendLovelace variant="1013c" title="Example C" />
                <SendLovelace variant="1013d" title="Example D" />
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="py-8 border-t border-gray-100 mt-12">
        <p className="text-center text-xs text-gray-400 font-mono">
          Marlowe PBL by Gimbalabs
        </p>
      </footer>
    </div>
  );
}
