import type { NextApiRequest, NextApiResponse } from 'next'
import { MaestroProvider } from '@meshsdk/core'

type RequestBody = {
    signedTx: string
}

type ResponseData = {
    txHash?: string
    error?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { signedTx } = req.body as RequestBody

    if (!signedTx) {
        return res.status(400).json({ error: 'Missing signed transaction' })
    }

    try {
        const provider = new MaestroProvider({
            network: 'Preprod',
            apiKey: process.env.MAESTRO_API_KEY!,
        })

        const txHash = await provider.submitTx(signedTx)

        return res.status(200).json({ txHash })
    } catch (error) {
        console.error('Transaction submit error:', error)
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to submit transaction'
        })
    }
}
