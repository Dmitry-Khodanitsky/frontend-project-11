import * as yup from 'yup'
import i18next from 'i18next'
import { elements, proxyState, proxyFeedDataState, feedDataState } from './view'
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
            networkError: 'Ошибка сети',
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

  const checkDublicate = (url) => {
    let isDublicate = false
    proxyFeedDataState.feeds.forEach((feed) => {
      if (feed.url === url) {
        isDublicate = true
      }
    })
    return isDublicate
  }

  const schema = yup.string().url().trim().required()

  const validate = (url) => {
    return schema
      .validate(url)
      .then((validUrl) => {
        const isDublicate = checkDublicate(validUrl)
        if (isDublicate) {
          return {
            status: 'dublicate',
            message: i18next.t('statusMessage.dublicate'),
          }
        }
        return { status: 'success', data: validUrl }
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
    proxyState.formState.status = null
  })

  submitButton.addEventListener('click', (e) => {
    e.preventDefault()

    proxyState.processState.isLoading = true
    proxyState.processState.processError = null

    validate(proxyState.formState.url)
      .then((result) => {
        proxyState.formState.status = result.status

        if (result.status === 'success') {
          return fetchRRS(proxyState.formState.url)
            .then((data) => {
              try {
                const feedData = parseFeedData(data, proxyState.formState.url)
                console.log('Данные распарсены:', feedData)

                proxyFeedDataState.feeds = [
                  feedData.feed,
                  ...proxyFeedDataState.feeds,
                ]
                proxyFeedDataState.posts.unshift(...feedData.posts)
          
                console.log('Состояние обновлено: ', feedDataState)
                
              } catch (parseError) {
                console.error('Ошибка парсинга:', parseError)
                throw parseError // Пробрасываем ошибку в catch
              }
            })
            .catch(() => {
              console.log('Ошибка сети')
              proxyState.processState.processError = 'networkError'
              proxyState.formState.status = 'networkError'
            })
        } else {
          console.log('Ошибка: ', result.message)
        }
      })
      .catch((error) => {
        proxyState.formState.status = error.name
        proxyState.processState.processError = error.message
        console.log('Непредвиденная ошибка')
      })
      .finally(() => {
        proxyState.processState.isLoading = false
      })
  })
}
