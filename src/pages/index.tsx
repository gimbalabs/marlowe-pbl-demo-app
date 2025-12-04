import Head from "next/head";
import Link from "next/link";
import { CardanoWallet, MeshBadge } from "@meshsdk/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Head>
        <title>Marlowe PBL Demo</title>
        <meta name="description" content="Marlowe Project-Based Learning Demo App by Gimbalabs" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <h1 className="text-4xl font-light text-gray-900 mb-2">
          Marlowe PBL
        </h1>
        <p className="text-gray-500 mb-12 font-mono text-sm">
          by Gimbalabs
        </p>

        <div className="mb-16">
          <CardanoWallet />
        </div>

        {/* Course Modules */}
        <div className="w-full max-w-4xl mb-16">
          <h2 className="text-sm font-mono text-gray-400 mb-4">Course Modules</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link
              href="/module/101"
              className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors text-left"
            >
              <h3 className="font-medium text-gray-900 mb-1">Module 101</h3>
              <p className="text-gray-500 text-sm">
                Getting Started with Cardano Preprod
              </p>
            </Link>
          </div>
        </div>

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <a
            href="https://www.gimbalabs.com/pbl"
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
          >
            <h2 className="font-medium text-gray-900 mb-2">Gimbalabs PBL</h2>
            <p className="text-gray-500 text-sm">
              Project-Based Learning courses for Cardano developers.
            </p>
          </a>

          <a
            href="https://meshjs.dev/apis"
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
          >
            <h2 className="font-medium text-gray-900 mb-2">MeshJS Docs</h2>
            <p className="text-gray-500 text-sm">
              APIs, guides, and tools for building on Cardano.
            </p>
          </a>

          <a
            href="https://docs.marlowe.iohk.io/"
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
          >
            <h2 className="font-medium text-gray-900 mb-2">Marlowe Docs</h2>
            <p className="text-gray-500 text-sm">
              Documentation for the Marlowe smart contract language.
            </p>
          </a>
        </div>
      </main>

      <footer className="py-8 border-t border-gray-100 flex justify-center">
        <MeshBadge isDark={false} />
      </footer>
    </div>
  );
}
