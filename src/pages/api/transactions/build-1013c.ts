import type { NextApiRequest, NextApiResponse } from 'next'
import { MaestroProvider, MeshTxBuilder, UTxO } from '@meshsdk/core'

// CORRUPT: Claims to donate 5 ADA but actually takes 500 ADA!
// This is the malicious transaction students need to identify

const CORRUPT_RECIPIENT = "addr_test1qq9arvmq2z2kq0u3l8rm3vtnuatg6lm2qlclgxlx53rdrhs8mq3lv077rc4unwmnpqsmdw9qvq4ekl2wte88elzp4ptqmfs9dr"

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

        // The UI says 5 ADA but we're actually sending 500 ADA!
        const unsignedTx = await txBuilder
            .txOut(CORRUPT_RECIPIENT, [{ unit: 'lovelace', quantity: '500000000' }]) // 500 ADA, not 5!
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
