import type { NextApiRequest, NextApiResponse } from 'next'
import {
    MaestroProvider,
    MeshTxBuilder,
    UTxO,
    ForgeScript,
    resolveScriptHash,
    stringToHex
} from '@meshsdk/core'

// MINT: Create a new token and send it to the connected wallet
// This is a legitimate minting transaction

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

        // Create a simple native script that requires the user's signature
        const forgingScript = ForgeScript.withOneSignature(changeAddress)
        const policyId = resolveScriptHash(forgingScript)
        const tokenName = 'MarlowePBLToken'
        const tokenNameHex = stringToHex(tokenName)

        const txBuilder = new MeshTxBuilder({
            fetcher: provider,
            verbose: true,
        })

        // Mint 1 token and send it to the user along with min ADA
        const unsignedTx = await txBuilder
            .mint('1', policyId, tokenNameHex)
            .mintingScript(forgingScript)
            .txOut(changeAddress, [
                { unit: 'lovelace', quantity: '2000000' },
                { unit: policyId + tokenNameHex, quantity: '1' }
            ])
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
