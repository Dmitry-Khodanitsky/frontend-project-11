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

export const parseFeedData = (dataXml, url, existingFeedId = null) => {
  const getTitle = (parent) => {
    const titleEl = parent.querySelector('title')
    return titleEl ? titleEl.textContent : ''
  }

  const getDescription = (parent) => {
    const descEl = parent.querySelector('description')
    return descEl ? descEl.textContent : ''
  }


  const feedId = existingFeedId || crypto.randomUUID().split('-')[0]
    const xmlItems = dataXml.querySelectorAll('item') 
  const posts = Array.from(xmlItems).map((item) => ({
        feedID: feedId,
        id: crypto.randomUUID().split('-')[0],
    title: getTitle(item),
    description: getDescription(item),
        publishTime: item.querySelector('pubDate').textContent,
        link: item.querySelector('link').textContent,
    }))
    return {
    feed: { feedId, title: getTitle(dataXml), description: getDescription(dataXml), url },
    posts: posts,
  }
}

const getUpdatePosts = (oldPosts, newDataXML, existingFeedId = null) => {
  const newData = parseFeedData(newDataXML, existingFeedId)
  const currentTitles = new Set(oldPosts.map((post) => post.title))
  const newPosts = newData.posts.filter(
    (post) => !currentTitles.has(post.title)
  )
  return [...newPosts, ...oldPosts]
}

const updateFeedData = (dataXML, feedId) => {
  const oldPosts = proxyFeedDataState.posts
  const oldFeed = feedId
  console.log('Фид', oldFeed)
  console.log(oldFeed, 'Отслеживание обновлений')

  const updatedPosts = getUpdatePosts(oldPosts, dataXML, oldFeed)

  if (updatedPosts.length > oldPosts.length) {
    proxyFeedDataState.posts = updatedPosts

    // Логирование, можно удалить
    const newPosts = updatedPosts.slice(
      0,
      updatedPosts.length - oldPosts.length
    )
    console.log(feedId, ' Добавлены новые посты', newPosts)
  } else {
    console.log(feedId, ' Новых постов не было')
  }
}
    }
}

