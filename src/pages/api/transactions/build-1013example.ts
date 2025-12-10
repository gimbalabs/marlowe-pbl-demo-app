import type { NextApiRequest, NextApiResponse } from 'next'
import { MaestroProvider, MeshTxBuilder, UTxO } from '@meshsdk/core'

type RequestBody = {
    utxos: UTxO[]
    changeAddress: string
    recipientAddress: string
    lovelaceAmount: string
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

    const { utxos, changeAddress, recipientAddress, lovelaceAmount } = req.body as RequestBody

    if (!utxos || !changeAddress || !recipientAddress || !lovelaceAmount) {
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

        const unsignedTx = await txBuilder
            .txOut(recipientAddress, [{ unit: 'lovelace', quantity: lovelaceAmount }])
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
