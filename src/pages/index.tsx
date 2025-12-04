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
        <h2 className="text-2xl my-6">Built with</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <a
            href="https://www.gimbalabs.com"
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
          >
            <h2 className="font-medium text-gray-900 mb-2">Gimbalabs</h2>
            <p className="text-gray-500 text-sm">
              Project-Based Learning courses for Cardano developers.
            </p>
          </a>

          <a
            href="https://meshjs.dev/apis"
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
          >
            <h2 className="font-medium text-gray-900 mb-2">MeshJS</h2>
            <p className="text-gray-500 text-sm">
              APIs, guides, and tools for building on Cardano.
            </p>
          </a>

          <a
            href="https://docs.marlowe.iohk.io/"
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
          >
            <h2 className="font-medium text-gray-900 mb-2">Marlowe</h2>
            <p className="text-gray-500 text-sm">
              Documentation for the Marlowe smart contract language.
            </p>
          </a>
        </div>
      </main>

      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col items-center gap-4 mb-6">
            <p className="text-sm text-gray-500 text-center">
              This is open source software. Inspect the code before connecting your wallet.
            </p>
            <a
              href="https://github.com/gimbalabs/marlowe-pbl-demo-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              View Source on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
