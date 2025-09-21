import * as yup from 'yup'
import { elements, proxyState } from './view'
import i18next from 'i18next'

export default () => {

  i18next.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: {
          statusMessage: {
            error: 'Ссылка должна быть валидным URL',
            dublicate: 'RSS уже существует',
            success: 'RSS успешно загружен',
            invalidRSS: 'Ресурс не содержит валидный RSS',
          },
        },
      },
    },
  })

  yup.setLocale({
    mixed: {
      default: 'Ссылка должна быть валидным URL',
      required: 'Введите ссылку RRS',
    },
    string: {
      url: 'Ссылка должна быть валидным URL',
    },
  })
  
  const schema = yup.object().shape({
    url: yup.string().url().trim().required(),
  })

  const validate = (url) => {
    return schema.validate({url})
      .then((validData) => {
        return { isValid: true, data: validData }
      })
      .catch(error => {
        return { isValid: false, error: error.message }
      })
  }

  const { submitButton, input } = elements
  
  input.addEventListener('input', (e) => {
    e.preventDefault()
    const inputData = input.value
    proxyState.formState.url = inputData
  })

  submitButton.addEventListener('click', (e) => {
    e.preventDefault()

    validate(proxyState.formState.url)
    .then(validationResult => {
        if(!validationResult.isValid) {
            proxyState.formState.status = 'error'
            return
        }
        const isDublicate = proxyState.formState.url === proxyState.formState.previousValidURL
        if (isDublicate) {
            proxyState.formState.status = 'dublicate'
            return
        }
        proxyState.formState.status = 'success'
        proxyState.formState.previousValidURL = proxyState.formState.url
    })
    .catch(() => proxyState.formState.status = 'error')
  })
}
