import getConfig from 'next/config'
import { customFetch } from './fetch'

// Récupération des variables depuis next.config.js
// const { publicRuntimeConfig } = getConfig()

if (!process.env.NEXT_PUBLIC_API_BAN_URL) {
  throw new Error('NEXT_PUBLIC_API_BAN_URL is not defined')
}

export function getStats() {
  return customFetch(`${process.env.NEXT_PUBLIC_API_BAN_URL}/ban/stats`)
}
