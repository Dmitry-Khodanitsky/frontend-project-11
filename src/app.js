import onChange from "on-change"
import * as yup from 'yup'

export default () => {

    const state = {
        url: 'https://lorem-rss.hexlet.app/',
        status: '',
        previousValidURL: 'https://lorem-rss.hexlet.app/feed'
    }
    const proxyState = onChange(state, (path, value, previousValue) => {
        if (path === 'url') {
            //renderUI()
        }   
    })
    const isDublicate = proxyState.url === proxyState.previousValidURL

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
