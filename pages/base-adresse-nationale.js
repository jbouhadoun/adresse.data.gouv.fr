import React, {useState, useCallback, useEffect, useMemo} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import {getAddress} from '@/lib/api-ban'

import Page from '@/layouts/main'
import {Desktop, Mobile} from '@/layouts/base-adresse-nationale'

const MOBILE_WIDTH = 900

function BaseAdresseNationale({address}) {
  const [viewHeight, setViewHeight] = useState('100vh')
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [hash, setHash] = useState({z: null, center: null})
  const [BBoxAddress, setBBoxAddress] = useState(null)
  const Layout = isMobileDevice ? Mobile : Desktop

  const router = useRouter()

  const handleResize = () => {
    setViewHeight(`${window.innerWidth}px`)
    setIsMobileDevice(window.innerWidth < MOBILE_WIDTH)
  }

  const {title, description} = useMemo(() => {
    let title = 'Base Adresse Nationale'
    let description = 'Consultez les adresses de la Base Adresse Nationale'

    if (address) {
      const {type} = address
      if (type === 'commune') {
        const {nomCommune, codeCommune, nbNumeros, nbVoies} = address
        title = `${nomCommune} (${codeCommune}) - Base Adresse Nationale`
        description = `Consultez les ${nbVoies > 1 ? `${nbVoies} ` : ''} voies et ${nbNumeros > 1 ? `${nbNumeros} ` : ''} adresses de la commune de ${nomCommune}`
      } else if (type === 'voie') {
        const {nomVoie, commune, nbNumeros} = address
        title = `${nomVoie}, ${commune.nom} (${commune.code}) - Base Adresse Nationale`
        description = `Consultez les ${nbNumeros > 1 ? `${nbNumeros} ` : ''}adresses de la voie "${nomVoie}" de la commune de ${commune.nom}`
      } else if (type === 'lieu-dit') {
        const {nomVoie, commune} = address
        title = `${nomVoie}, ${commune.nom} (${commune.code}) - Base Adresse Nationale`
        description = `${nomVoie}, lieu-dit de la commune de ${commune.nom}`
      } else if (type === 'numero') {
        const {numero, voie, commune} = address
        const suffixe = address.suffixe || ''
        title = `${numero}${suffixe} ${voie.nomVoie}, ${commune.nom} (${commune.code}) - Base Adresse Nationale`
        description = `Consultez le numéro ${numero}${suffixe} ${voie.nomVoie}, à ${commune.nom} (${commune.code})`
      }
    }

    return {title, description}
  }, [address])

  const selectAddress = useCallback(({id}) => {
    router.push(`/base-adresse-nationale?id=${id}`, `/base-adresse-nationale/${id}`)
  }, [router])

  useEffect(() => {
    const {hash} = window.location

    if (hash) {
      const [z, lat, lng] = hash.slice(1, hash.lenght).split('/')
      setHash({zoom: Number.parseFloat(z), center: [lng, lat]})
    } else if (!hash && address) {
      setBBoxAddress(address.displayBBox)
    }
  }, [address])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Page title={title} description={description} hasFooter={false}>
      <Layout
        address={address}
        bbox={BBoxAddress}
        viewHeight={viewHeight}
        handleSelect={selectAddress}
        hash={hash}
      />
    </Page>
  )
}

BaseAdresseNationale.defaultProps = {
  address: null
}

BaseAdresseNationale.propTypes = {
  address: PropTypes.shape({
    type: PropTypes.oneOf(['commune', 'voie', 'lieu-dit', 'numero']).isRequired,
    nomVoie: PropTypes.string,
    numero: PropTypes.string,
    suffixe: PropTypes.string,
    nomCommune: PropTypes.string,
    codeCommune: PropTypes.string,
    nbNumeros: PropTypes.number,
    nbVoies: PropTypes.number,
    commune: PropTypes.shape({
      nom: PropTypes.string,
      code: PropTypes.string
    }),
    voie: PropTypes.shape({
      nomVoie: PropTypes.string
    }),
    displayBBox: PropTypes.array.isRequired
  })
}

export async function getServerSideProps({query}) {
  const {id} = query

  if (!id) {
    return {props: {}}
  }

  try {
    const address = await getAddress(id)

    if (!address) {
      return {
        notFound: true
      }
    }

    return {
      props: {address}
    }
  } catch {
    return {
      notFound: true
    }
  }
}

export default BaseAdresseNationale
