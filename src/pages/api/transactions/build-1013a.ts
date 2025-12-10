import type { NextApiRequest, NextApiResponse } from 'next'
import { MaestroProvider, MeshTxBuilder, UTxO } from '@meshsdk/core'

// SPLIT PAYMENT: Send 3 UTxOs back to yourself
// This is a legitimate transaction for UTxO management

type RequestBody = {
    utxos: UTxO[]
    changeAddress: string
}

type ResponseData = {
    unsignedTx?: string
    error?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { utxos, changeAddress } = req.body as RequestBody

    if (!utxos || !changeAddress) {
        return res.status(400).json({ error: 'Missing required fields' })
    }

    try {
        const provider = new MaestroProvider({
            network: 'Preprod',
            apiKey: process.env.MAESTRO_API_KEY!,
        })

        const txBuilder = new MeshTxBuilder({
            fetcher: provider,
            verbose: true,
        })

        // Create 3 UTxOs of 5 ADA each, sent back to the user
        const unsignedTx = await txBuilder
            .txOut(changeAddress, [{ unit: 'lovelace', quantity: '5000000' }])
            .txOut(changeAddress, [{ unit: 'lovelace', quantity: '5000000' }])
            .txOut(changeAddress, [{ unit: 'lovelace', quantity: '5000000' }])
            .changeAddress(changeAddress)
            .selectUtxosFrom(utxos)
            .complete()

        return res.status(200).json({ unsignedTx })
    } catch (error) {
        console.error('Transaction build error:', error)
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to build transaction'
        })
    }
}
