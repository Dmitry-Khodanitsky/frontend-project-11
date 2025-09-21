export const createState = () => {
    return {
    formState: {
        url: null,
        status: null, // success, dublicate, error
        previousValidURL: null,
    },
    processState: {
        processStatus: 'filling', //sent, error
        processError: null,
    }
  }
}
