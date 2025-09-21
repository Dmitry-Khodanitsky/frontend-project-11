import onChange from 'on-change'
import { createState } from './state'
import i18next from 'i18next'

export const elements = {
  submitButton: document.querySelector('button[type="submit"]'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
}

const state = createState()

export const proxyState = onChange(state, (path) => {
  if (path === 'formState.status') {
    renderUI(proxyState, elements)
  }
})

export const renderUI = (proxyState, elements) => {
  elements.feedback.textContent = i18next.t(
    `statusMessage.${proxyState.formState.status}`
  )

  if (proxyState.formState.status !== 'success') {
    elements.feedback.classList.add('text-danger')
    elements.feedback.classList.remove('text-success')
    elements.input.classList.add('is-invalid')
    return
  }

  elements.input.focus()
  elements.input.value = ''
  elements.feedback.classList.add('text-success')
  elements.feedback.classList.remove('text-danger')
  elements.input.classList.remove('is-invalid')
}
