
import {
  Document,
  Link,
  Page,
  Text,
  StyleSheet,
  Font,
  Image,
  View} from '@react-pdf/renderer'
import PropTypes from 'prop-types'
import getConfig from 'next/config'

const fontSource = './public/dsfr/fonts/Marianne-Regular.woff'
const fontFamily = 'Marianne' // Devrait etre Arial Regular mais pas de source
const {NEXT_PUBLIC_ADRESSE_URL} = getConfig().publicRuntimeConfig

Font.register({
  family: 'Marianne',
  fonts: [
    {src: fontSource}, // Font-style: normal, font-weight: normal
    {src: './public/dsfr/fonts/Marianne-Regular_Italic.woff', fontStyle: 'italic'},
    {src: './public/dsfr/fonts/Marianne-Bold_Italic.woff', fontStyle: 'italic', fontWeight: 700}
  ]})

const stylesDSFR = StyleSheet.create({
  page: {padding: '17mm', fontFamily, fontSize: '10pt'},
  titre: {paddingTop: '20mm', paddingBottom: '12mm', textAlign: 'center', fontSize: '12pt', fontWeight: 'bold'},
  contenu: {},
  blocMarque: {marginBottom: '20mm'},
  signature: {textAlign: 'right', fontSize: '8pt', margin: '10'},
  qrCode: {width: '25mm', height: '25mm', alignSelf: 'flex-end'},
  footer: {position: 'absolute', bottom: '20mm', left: '20mm', right: '20mm', fontSize: 10, flexDirection: 'column', alignItems: 'flex-start'},
  footerText: {marginBottom: '5mm', textAlign: 'left'},
  logoBloc: {width: '20mm', height: '20mm'},
  logoContainer: {flexDirection: 'row', alignItems: 'center'}
})
function CertificatNumerotation({data, qrCodeDataURL, mairie}) {
  const nomCommune = data.full_address.district
  const libelleVoie = data.full_address.common_toponym
  const numero = data.full_address.number
  const {insee_code} = data.full_address

  const parcelleCadastral = data.parcelles.join(', ') || '123456'

  const dateObj = new Date(data.createdAt)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString('default', {month: 'long'})
  const year = dateObj.getFullYear()
  const etabliLe = `${day} ${month} ${year}`
  const certificatUrl = `${NEXT_PUBLIC_ADRESSE_URL}/certificat/${data.id}`
  return (
    <Document tile="Certificat d'adressage">
      <Page size='A4' style={stylesDSFR.page}>
        <Image src='public/images/logos/partners/communes/64102.png' style={stylesDSFR.logoBloc} />
        <Text>Commune de {nomCommune}</Text>
        <Text>{mairie.telephone}</Text>
        <Text>{mairie.email}</Text>
        <Text style={stylesDSFR.titre}>Certificat d&apos;adressage (version Beta)</Text>
        <View style={stylesDSFR.contenu}>
          <Text>
            La commune de {nomCommune} atteste que l&apos;adresse ci-dessous est certifiée dans la Base Adresse
            Nationale le {etabliLe}
          </Text>
          <Text> {'\n'}</Text>
          <Text>
            Section(s) et N° de cadastre :
          </Text>
          <Text>
            {parcelleCadastral}
          </Text>
          <Text> {'\n'}</Text>
          <Text>
            N° de voirie et désignation de la voie :
          </Text>
          <Text>{numero} {libelleVoie}</Text>
          <Text>{insee_code} (code insee), {nomCommune}</Text>
          <Text> {'\n'}</Text>

          <Text>
            En foi de quoi, le présent certificat est délivré au demandeur pour servir et valoir ce que de droit.
          </Text>
        </View>
        <Text> {'\n\n\n\n'}</Text>
        <Text>Consulter l&apos;authenticité de ce certificat : <Link src={certificatUrl}>{certificatUrl}</Link></Text>
        <Image src={qrCodeDataURL} style={stylesDSFR.qrCode} />
        <View style={stylesDSFR.footer}>
          <Text style={stylesDSFR.footerText}>
            Ce document n&apos;a aucune valeur juridique.
          </Text>
          <Text style={stylesDSFR.footerText}>
            Émis par les services de la Base Adresse Nationale, mandataire pour la commune de {nomCommune}.
          </Text>

          <View style={stylesDSFR.logoContainer}>
            <Image src='public/images/logos/partners/communes/64102.png' style={stylesDSFR.logoBloc} />
            <View style={{width: '2mm'}} />
            <Image src='public/images/logos/BAN.png' style={stylesDSFR.logoBloc} />
          </View>
        </View>
      </Page>
    </Document>
  )
}

export {CertificatNumerotation}

CertificatNumerotation.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    address_id: PropTypes.string.isRequired,
    full_address: PropTypes.shape({
      number: PropTypes.number.isRequired,
      common_toponym: PropTypes.string.isRequired,
      suffix: PropTypes.string,
      district: PropTypes.string.isRequired,
      insee_code: PropTypes.string.isRequired,
    }).isRequired,
    parcelles: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  qrCodeDataURL: PropTypes.string.isRequired,
  mairie: PropTypes.object.isRequired
}
