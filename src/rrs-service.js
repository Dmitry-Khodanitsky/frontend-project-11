import axios from 'axios'

export const fetchRRS = (url) => {

    const parserXML = (data) => {
      const parser = new DOMParser()
      return parser.parseFromString(data, 'text/xml')
    } 

    const proxy = 'https://allorigins.hexlet.app/get?disableCache=true&url='
    return axios.get(`${proxy}${url}`).then((response) => {
      return parserXML(response.data.contents)
    })
  }

export const parseFeedData = (dataXml) => {
    const title = dataXml.querySelector('title').textContent
    const description = dataXml.querySelector('description').textContent
    const feedId = crypto.randomUUID().split('-')[0]

    const xmlItems = dataXml.querySelectorAll('item') 
    const posts = Array.from(xmlItems).map(item => ({
        feedID: feedId,
        id: crypto.randomUUID().split('-')[0],
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').textContent,
        publishTime: item.querySelector('pubDate').textContent,
        link: item.querySelector('link').textContent,
    }))
    return {
        feed: {feedId, title, description},
        posts: posts
    }
}

