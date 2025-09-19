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

    const validate =  (state) => {
        schema.validate(state)
        .then(validData => {
            if (!isDublicate) {
                proxyState.previousValidURL = validData.url
                proxyState.status = 'RSS успешно загружен'
            } 
            else {
                proxyState.status = 'RSS уже существует'
            }
        })
        .catch(error => {
            console.log(error.message)
            proxyState.status = 'Ресурс не содержит валидный RSS'
        })
    }
    
    
    
//console.log(validate(proxyState))
//console.log(state)

    
    //const check = schema.validate('https://lorem-rss.hexlet.app/feed')
    //console.log(check)
}