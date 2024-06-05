import getConfig from 'next/config'

const {NEXT_PUBLIC_ADRESSE_URL: ADRESSE_URL = '.'} = getConfig().publicRuntimeConfig
const PROXY_API_DEPOT_URL = `${ADRESSE_URL}/proxy-api-depot`

async function _fetch(url, method, body) {
  console.log('fetch', `${PROXY_API_DEPOT_URL}${url}`, method, body)
  const options = {
    method
  }

  if (method === 'POST') {
    console.log('POST PROXY_API_DEPOT_URL', `${PROXY_API_DEPOT_URL}${url}`)
    options.headers = {'Content-Type': 'application/json'}
    if (body) {
      options.body = JSON.stringify(body)
    }
  }

  console.log('line 19 proxy api')
  const response = await fetch(`${PROXY_API_DEPOT_URL}${url}`, options)
  console.log('line 21 proxy api')
  const contentType = response.headers.get('content-type')
  console.log('line 23 proxy api')

  if (!response.ok) {
    throw new Error(response.message)
  }

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

async function uploadFile(revisionId, file) {
  try {
    console.log('line 37 proxy api')
    return fetch(`${PROXY_API_DEPOT_URL}/revisions/${revisionId}/files/bal`, {
      method: 'PUT',
      headers: {'Content-Type': 'text/csv'},
      body: file
    })
  } catch (error) {
    throw new Error(`Impossible de téléverser le fichier : ${error}`)
  }
}

async function computeRevision(revisionId) {
  console.log('line 51 proxy api')
  return _fetch(`/revisions/${revisionId}/compute`, 'POST')
}

export async function publishRevision(revisionId, body) {
  console.log('line 57 proxy api')
  return _fetch(`/revisions/${revisionId}/publish`, 'POST', body)
}

export async function sendAuthenticationCode(habilitationId) {
  console.log('line 62 proxy api')
  return _fetch(`/habilitations/${habilitationId}/authentication/email/send-pin-code`, 'POST')
}

export async function submitAuthentificationCode(habilitationId, code) {
  console.log('line 67 proxy api')
  return _fetch(`/habilitations/${habilitationId}/authentication/email/validate-pin-code`, 'POST', {code})
}

export async function createRevision(codeCommune, file) {
  console.log('line 72 proxy api')
  const revision = await _fetch(`/communes/${codeCommune}/revisions`, 'POST')
  console.log('line 74 proxy api')
  await uploadFile(revision._id, file)

  return computeRevision(revision._id)
}

export async function getRevision(revisionId) {
  console.log('line 82 proxy api')
  return _fetch(`/revisions/${revisionId}`)
}

export async function getHabilitation(habilitationId) {
  console.log('line 87 proxy api')
  return _fetch(`/habilitations/${habilitationId}`)
}

export async function createHabilitation(codeCommune) {
  console.log('line 92 proxy api')
  return _fetch(`/communes/${codeCommune}/habilitations`, 'POST')
}
