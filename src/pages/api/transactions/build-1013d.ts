import type { NextApiRequest, NextApiResponse } from 'next'
import { MaestroProvider, MeshTxBuilder, UTxO } from '@meshsdk/core'

// DONATE: Send 12 ADA each to 3 hardcoded addresses (36 ADA total)
// This is a legitimate donation transaction

const DONATION_ADDRESSES = [
    "addr_test1qp43lca8a458jp8trhh8ne4ghgwucrk43segawr6wqfp2mfupw667k0qg82c8l472nmeqtmn8lwcpmux8csr6jp9j4xsxh3mq2",
    "addr_test1qpxdq6pskv3qt4xumfjfqhrld2drlcv7yj554ap6aufz06a6jtmyf6278df53zuljuwrd6drdv250kjm6wxf82a4mkqsckja3g",
    "addr_test1qz8ef8xraq7yk4l7c4xwkeh83fy06gwp26y94hp6k5skyduna85k9xqre75hrmdrge9r2gd4kh5rzqwu609ulzxamqcqc0jhd3",
]

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

        // Send 12 ADA to each of the 3 donation addresses
        const unsignedTx = await txBuilder
            .txOut(DONATION_ADDRESSES[0], [{ unit: 'lovelace', quantity: '12000000' }])
            .txOut(DONATION_ADDRESSES[1], [{ unit: 'lovelace', quantity: '12000000' }])
            .txOut(DONATION_ADDRESSES[2], [{ unit: 'lovelace', quantity: '12000000' }])
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
