import * as yup from 'yup'
import { elements, proxyState } from './view'
import i18next from 'i18next'
import { elements, proxyState, proxyFeedDataState } from './view'
import { fetchRRS, parseFeedData } from './rrs-service'

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

  const schema = yup.string().url().trim().required()

  const validate = (url) => {
    return schema
      .validate(url)
      .then((validData) => {
        const isDublicate =
          proxyState.formState.url === proxyState.formState.previousValidURL
        if (isDublicate) {
          return {
            status: 'dublicate',
            message: i18next.t('statusMessage.dublicate'),
          }
        }
        return { status: 'success', data: validData }
      })
      .catch((error) => {
        return { status: 'error', message: error.message }
      })
  }

  const { submitButton, input } = elements

  input.addEventListener('input', (e) => {
    e.preventDefault()
    const inputData = input.value.trim()
    proxyState.formState.url = inputData
  })

  submitButton.addEventListener('click', (e) => {
    e.preventDefault()

    validate(proxyState.formState.url)
      .then((result) => {
        proxyState.formState.status = result.status
        if (result.status === 'success') {
          proxyState.formState.previousValidURL = proxyState.formState.url
        } else {
          console.log('Ошибка:', result.message)
        }
        console.log(proxyState.formState)
      })
      .catch((error) => {
        proxyState.formState.status = error.name
        console.log('Непредвиденная ошибка')
      })
  })
}
