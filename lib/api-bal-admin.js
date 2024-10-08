
import getConfig from 'next/config'

const {NEXT_PUBLIC_BAL_ADMIN_API_URL: BAL_ADMIN_API_URL} = getConfig().publicRuntimeConfig

if (!BAL_ADMIN_API_URL) {
  throw new Error('BAL_ADMIN_API_URL is not defined in the environment')
}

export async function getOnePartenairesDeLaCharte(id) {
  const url = new URL(`${BAL_ADMIN_API_URL}/partenaires-de-la-charte/${id}`)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error while fetching partners')
  }

  return response.json()
}

export async function getPartenairesDeLaCharte(queryObject) {
  const url = new URL(`${BAL_ADMIN_API_URL}/partenaires-de-la-charte`)
  Object.keys(queryObject).forEach(key => url.searchParams.append(key, queryObject[key]))

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error while fetching partners')
  }

  return response.json()
}

export const getPartenairesDeLaCharteServices = async () => {
  const response = await fetch(`${BAL_ADMIN_API_URL}/partenaires-de-la-charte/services`)
  const services = await response.json()

  if (!response.ok) {
    throw new Error('Error while fetching partners services')
  }

  return services
}

export async function getRandomPartenairesDeLaCharte(limit) {
  const url = new URL(`${BAL_ADMIN_API_URL}/partenaires-de-la-charte/random`)
  if (limit) {
    url.searchParams.append('limit', limit)
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error while fetching random partners')
  }

  return response.json()
}

export async function candidateToPartenairesDeLaCharte(candidacy) {
  const request = `${BAL_ADMIN_API_URL}/partenaires-de-la-charte/candidate`

  const response = await fetch(request, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(candidacy)
  })

  if (!response.ok) {
    throw new Error('Error while submitting candidacy')
  }

  return response.json()
}

export async function getBalEvents() {
  try {
    const response = await fetch(`${BAL_ADMIN_API_URL}/events`)
    if (!response.ok) {
      throw new Error('Error while fetching bal events')
    }

    return response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}
