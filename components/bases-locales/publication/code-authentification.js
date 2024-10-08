import {useCallback, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Check, ArrowLeft, Mail} from 'react-feather'

import {submitAuthentificationCode, getHabilitation} from '@/lib/proxy-api-depot'

import theme from '@/styles/theme'

import Button from '@/components/button'
import Notification from '@/components/notification'
import ActionButtonNeutral from '@/components/action-button-neutral'

function CodeAuthentification({habilitation, handleValidCode, sendBackCode, cancel}) {
  const [code, setCode] = useState('')
  const [codeMask, setCodeMask] = useState('______')
  const [error, setError] = useState(null)

  const submitCode = useCallback(async () => {
    try {
      const response = await submitAuthentificationCode(habilitation._id, code)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      const validatedHabilitation = await getHabilitation(habilitation._id)
      handleValidCode(validatedHabilitation)
    } catch (error) {
      setError(error.message)
    }
  }, [habilitation, code, handleValidCode])

  const handleInput = event => {
    // Récupérer la valeur de l'input
    const {value} = event.target

    // Supprimer tout ce qui n'est pas un chiffre dans l'input (lettres et caractères spéciaux)
    const input = value.replaceAll('_', '').replace(/\D/, '')

    if (input.length < 7) {
      // Si on efface, supprimer la dernière valeur de l'input
      const hasMissingNumbers = value.length < 6 && code.length < 6
      const newCode = input.slice(0, hasMissingNumbers ? -1 : 6)

      // On set code avec la bonne valeur, cleané de tout caractères spéciaux
      setCode(newCode)
      // On set codeMask avec les bonnes valeurs + les underscores pour les chiffres encore manquants
      setCodeMask(newCode.padEnd(6, '_'))
    }
  }

  useEffect(() => {
    setError(null)
  }, [code])

  return (
    <>
      <div className='code-container'>
        <h3>Entrez le code qui vous a été envoyé à l’adresse : </h3>
        <div className='email-info'>
          <Mail size={50} color={theme.primary} />
          {habilitation.emailCommune}
        </div>

        <div className='form'>
          <div className='input-container'>
            <input
              autoFocus
              name='code'
              type='text'
              value={codeMask}
              placeholder='Entrez votre code ici'
              onChange={handleInput}
            />
            <ActionButtonNeutral
              type='submit'
              label='Soumettre le code d’authentification'
              disabled={code.length !== 6}
              onClick={submitCode}
            >
              <div className='submit-button'><Check /></div>
            </ActionButtonNeutral>
          </div>
          {error && <Notification message={error} type='error' />}

          <div>
            <div>Vous n’avez pas reçu votre code ?</div>
            <ActionButtonNeutral onClick={sendBackCode} label=''>
              <div className='send-code'>Renvoyer un code à l’adresse {habilitation.emailCommune}</div>
            </ActionButtonNeutral>
          </div>
        </div>
      </div>

      <Button onClick={cancel} color='secondary'><ArrowLeft style={{verticalAlign: 'top'}} /> Retour</Button>

      <style jsx>{`
        .code-container {
          margin: 2em 0;
          padding: 1em;
          background-color: ${theme.backgroundGrey};
          text-align: center;
        }

        .email-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          margin-bottom: 2em;
          font-size: 20px;
          font-weight: bolder;
          font-style: italic;
        }

        .form {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 100%;
        }

        .input-container {
          display: flex;
          margin-bottom: 1em;
        }

        .input-container input {
          width: 100%;
          max-width: 400px;
          height: 60px;
          font-size: x-large;
          border-radius: 3px 0 0 3px;
          border-right-width: 0;
          color: ${theme.primary};
          letter-spacing: 10px;
          text-align: center;
          font-weight: bold;
          font-size: 30px;
          caret-color: transparent;
        }

        /* Chrome, Safari, Edge, Opera */
        .input-container input::-webkit-outer-spin-button,
        .input-container input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        .input-container input[type=number] {
          -moz-appearance: textfield;
        }

        .submit-button {
          height: 60px;
          width: 50px;
          border-radius: 0 3px 3px 0;
          border: none;
          background-color: #0053b3;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .submit-button:disabled {
          background-color: ${theme.borderLighter};
        }

        .send-code {
          font-style: italic;
          color: ${theme.primary};
          text-decoration: underline;
        }
        `}</style>
    </>
  )
}

CodeAuthentification.propTypes = {
  habilitation: PropTypes.object.isRequired,
  handleValidCode: PropTypes.func.isRequired,
  sendBackCode: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
}

export default CodeAuthentification
