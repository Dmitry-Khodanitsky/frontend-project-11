import onChange from 'on-change'
import { createState } from './state'

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
  if (proxyState.formState.status !== 'success') {
    elements.feedback.classList.add('text-danger')
    elements.feedback.classList.remove('text-success')
    elements.input.classList.add('is-invalid')

    proxyState.formState.status === 'error'
      ? (elements.feedback.textContent = 'Ресурс не содержит валидный RSS')
      : (elements.feedback.textContent = 'RSS уже существует')
    return
  }

  elements.input.focus()
  elements.input.value = ''
  elements.feedback.textContent = 'RSS успешно загружен'
  elements.feedback.classList.add('text-success')
  elements.feedback.classList.remove('text-danger')
  elements.input.classList.remove('is-invalid')
}
