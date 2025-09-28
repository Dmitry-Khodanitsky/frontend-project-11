import { validate } from './utils'
import { elements, proxyState, proxyFeedDataState, feedDataState } from './view'
import { fetchRRS, parseFeedData } from './rrs-service'

export default () => {

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
