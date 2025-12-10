import { useState } from 'react'
import { useWallet } from '@meshsdk/react'

type TxStatus = 'idle' | 'building' | 'signing' | 'submitting' | 'success' | 'error'

type Variant = '1013example' | '1013a' | '1013b' | '1013c' | '1013d'

type SendLovelaceProps = {
    variant: Variant
    title?: string
    description?: string
}

// Define which variants need form inputs vs just a button
const SIMPLE_BUTTON_VARIANTS: Variant[] = ['1013a', '1013b', '1013c', '1013d']

const VARIANT_LABELS: Record<Variant, { button: string; description: string }> = {
    '1013example': {
        button: 'Send',
        description: 'Send ADA to any address',
    },
    '1013a': {
        button: 'Split UTxOs',
        description: 'Create 3 UTxOs of 5 ADA each (sent to yourself)',
    },
    '1013b': {
        button: 'Mint Token',
        description: 'Mint a MarlowePBLToken to your wallet',
    },
    '1013c': {
        button: 'Donate 5 ADA',
        description: 'Buy a cup of coffee for the course creators',
    },
    '1013d': {
        button: 'Donate 36 ADA',
        description: 'Donate 12 ADA each to 3 course contributors',
    },
}

export function SendLovelace({ variant, title, description }: SendLovelaceProps) {
    const { wallet, connected } = useWallet()
    const [recipientAddress, setRecipientAddress] = useState('')
    const [lovelaceAmount, setLovelaceAmount] = useState('')
    const [status, setStatus] = useState<TxStatus>('idle')
    const [txHash, setTxHash] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const isSimpleButton = SIMPLE_BUTTON_VARIANTS.includes(variant)
    const labels = VARIANT_LABELS[variant]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setTxHash(null)

        if (!wallet || !connected) {
            setError('Please connect your wallet first')
            return
        }

        try {
            // Step 1: Build transaction on server
            setStatus('building')
            const utxos = await wallet.getUtxos()
            const changeAddress = await wallet.getChangeAddress()

            const bodyData: Record<string, unknown> = {
                utxos,
                changeAddress,
            }

            // Only include these for the example variant that needs them
            if (!isSimpleButton) {
                bodyData.recipientAddress = recipientAddress
                bodyData.lovelaceAmount = lovelaceAmount
            }

            const buildRes = await fetch(`/api/transactions/build-${variant}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData),
            })

            const buildData = await buildRes.json()
            if (!buildRes.ok) {
                throw new Error(buildData.error || 'Failed to build transaction')
            }

            // Step 2: Sign transaction in wallet (client-side)
            setStatus('signing')
            const signedTx = await wallet.signTx(buildData.unsignedTx)

            // Step 3: Submit transaction via server (using Maestro provider)
            setStatus('submitting')
            const submitRes = await fetch('/api/transactions/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signedTx }),
            })

            const submitData = await submitRes.json()
            if (!submitRes.ok) {
                throw new Error(submitData.error || 'Failed to submit transaction')
            }

            setStatus('success')
            setTxHash(submitData.txHash)
            if (!isSimpleButton) {
                setRecipientAddress('')
                setLovelaceAmount('')
            }
        } catch (err) {
            setStatus('error')
            setError(err instanceof Error ? err.message : 'Transaction failed')
        }
    }

    const adaAmount = lovelaceAmount ? (parseInt(lovelaceAmount) / 1_000_000).toFixed(6) : '0'
    const isProcessing = status === 'building' || status === 'signing' || status === 'submitting'

    if (!connected) {
        return (
            <div className="border border-gray-200 rounded-lg p-6">
                <p className="text-gray-500 text-sm">Connect your wallet to continue</p>
            </div>
        )
    }

    return (
        <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-2">{title || labels.button}</h3>
            <p className="text-gray-500 text-sm mb-4">{description || labels.description}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isSimpleButton && (
                    <>
                        <div>
                            <label htmlFor={`recipient-${variant}`} className="block text-sm text-gray-600 mb-1">
                                Recipient Address
                            </label>
                            <input
                                id={`recipient-${variant}`}
                                type="text"
                                value={recipientAddress}
                                onChange={(e) => setRecipientAddress(e.target.value)}
                                placeholder="addr_test1..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-mono focus:outline-none focus:border-gray-400"
                                disabled={isProcessing}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor={`amount-${variant}`} className="block text-sm text-gray-600 mb-1">
                                Amount (lovelace)
                            </label>
                            <input
                                id={`amount-${variant}`}
                                type="number"
                                value={lovelaceAmount}
                                onChange={(e) => setLovelaceAmount(e.target.value)}
                                placeholder="1000000"
                                min="1000000"
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-mono focus:outline-none focus:border-gray-400"
                                disabled={isProcessing}
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">{adaAmount} ADA</p>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-2 px-4 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {status === 'building' && 'Building...'}
                    {status === 'signing' && 'Sign in wallet...'}
                    {status === 'submitting' && 'Submitting...'}
                    {(status === 'idle' || status === 'success' || status === 'error') && labels.button}
                </button>
            </form>

            {status === 'success' && txHash && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800 mb-1">Transaction submitted!</p>
                    <a
                        href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-green-600 hover:underline break-all"
                    >
                        {txHash}
                    </a>
                </div>
            )}

            {status === 'error' && error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}
        </div>
    )
}
