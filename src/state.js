export const createState = () => {
    return {
    formState: {
        url: '',
        status: '', // success, dublicate, error
        previousValidURL: '',
    },
    processState: {
        processStatus: 'filling', //sent, error
        processError: null,
    }
  }
}
