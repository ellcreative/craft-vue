import { now } from './_lib/now'
import { gqlRedirect } from '~/gql/redirect.graphql'

const domainRe = /https?:\/\/([A-Za-z0-9-.:]+)\/?/

const addClass = (className, el) => {
  if (typeof el === 'object' && el.tagName) {
    if (el.classList) el.classList.add(className)
    else el.className += ' ' + className
  } else if (typeof el === 'object') {
    Object.values(el).forEach(element => {
      addClass(className, element)
    })
  }
}

const closest = (query, el) => {
  if (matches(query, el)) {
    return el
  } else if (el && el.parentNode !== document) {
    if (matches(query, el.parentNode)) {
      return el.parentNode
    } else {
      return closest(query, el.parentNode)
    }
  }
}

const query = (selector, context = document) => {
  // Redirect simple selectors to the more performant function
  if (/^(#?[\w-]+|\.[\w-.]+)$/.test(selector)) {
    let element, classes
    switch (selector.charAt(0)) {
      case '#':
        // Handle ID-based selectors
        element = context.getElementById(selector.substr(1))
        return element ? [...[element]] : []
      case '.':
        // Handle class-based selectors
        // Query by multiple classes by converting the selector
        // string into single spaced class names
        classes = selector.substr(1).replace(/\./g, ' ')
        return [...context.getElementsByClassName(classes)]
      default:
        // Handle tag-based selectors
        return [...context.getElementsByTagName(selector)]
    }
  }
  // Default to `querySelectorAll`
  return [...context.querySelectorAll(selector)]
}

const matches = (selector, el) => {
  return (
    el.matches ||
    el.matchesSelector ||
    el.msMatchesSelector ||
    el.mozMatchesSelector ||
    el.webkitMatchesSelector ||
    el.oMatchesSelector
  ).call(el, selector)
}

export default (context, inject) => {
  const requestHost = process.server ? context.req.headers.host : window.location.host

  inject('now', now)
  inject('closest', closest)
  inject('query', query)
  inject('addClass', addClass)

  const thisDomain = url => {
    if (url) {
      const match = url.match(domainRe)
      if (match) {
        const host = match[1]
        if (host !== requestHost) {
          return false
        }
      }
    }
    return true
  }
  inject('thisDomain', thisDomain)

  const stripDomain = url => {
    if (url) {
      return `/${url.replace(domainRe, '')}`.replace(/\/\//, '/')
    }
    return ''
  }
  inject('stripDomain', stripDomain)

  const checkRedirect = async (context, uri = false) => {
    if (uri === false) {
      uri = context.$route.fullPath
    }
    const client = context.$apolloProvider.defaultClient
    context.$timeStart('graphqlRedirect')
    const { data: redirectData } = await client.query({
      query: gqlRedirect,
      variables: { ...client.defaultOptions.$query.variables, uri },
    })
    context.$timeEnd('graphql Redirect', '[GQL] Redirect Query')

    if (redirectData.redirect) {
      const { httpCode, destUrl } = redirectData.redirect
      context.$nuxt.context.redirect(httpCode, destUrl)
      return true
    }

    return false
  }
  inject('checkRedirect', checkRedirect)

  const pictureProps = (image, oiField = '') => {
    let props = {
      alt: image.alt,
      caption: image.caption,
    }

    if (image[oiField]) {
      props = {
        ...props,
        srcWebp: image[oiField].srcWebp,
        srcsetWebp: image[oiField].srcsetWebp,
        src: image[oiField].src,
        srcset: image[oiField].srcset,
        srcType: image[oiField].srcType,
        placeholder: image[oiField].placeholderImage,
        placeholderWidth: image[oiField].placeholderWidth,
        placeholderHeight: image[oiField].placeholderHeight,
      }
    } else {
      props.src = image.url
    }

    return props
  }
  inject('pictureProps', pictureProps)
}
