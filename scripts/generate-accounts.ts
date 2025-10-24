import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import crypto from 'crypto'

console.log('🔐 Private Key Generation Methods\n')

// Method 1: Generate a random private key using crypto
console.log('Method 1: Random Private Key Generation')
const randomPrivateKey = crypto.randomBytes(32).toString('hex')
console.log(`Private Key: 0x${randomPrivateKey}`)

// Create account from the private key
const account = privateKeyToAccount(`0x${randomPrivateKey}` as `0x${string}`)
console.log(`Address: ${account.address}`)
console.log(`Public Key: ${account.publicKey}`)
console.log('')

// Method 2: Generate multiple accounts (useful for testing)
console.log('Method 2: Multiple Test Accounts')
for (let i = 0; i < 3; i++) {
  const pk = crypto.randomBytes(32).toString('hex')
  const acc = privateKeyToAccount(`0x${pk}` as `0x${string}`)
  console.log(`Account ${i + 1}:`)
  console.log(`  Private Key: 0x${pk}`)
  console.log(`  Address: ${acc.address}`)
  console.log('')
}

// Method 3: Generate from a seed phrase (deterministic)
console.log('Method 3: Deterministic Generation from Seed')
const seed = 'test-seed-phrase-for-hardhat-development'
const hash = crypto.createHash('sha256').update(seed).digest('hex')
const deterministicAccount = privateKeyToAccount(`0x${hash}` as `0x${string}`)
console.log(`Seed: ${seed}`)
console.log(`Private Key: 0x${hash}`)
console.log(`Address: ${deterministicAccount.address}`)
console.log('')

console.log('⚠️  IMPORTANT SECURITY NOTES:')
console.log('1. Never use these private keys for mainnet or real funds')
console.log('2. These are for development and testing only')
console.log('3. Keep your private keys secure and never share them')
console.log('4. Use a hardware wallet for production deployments')
