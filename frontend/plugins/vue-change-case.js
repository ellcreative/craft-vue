import { camelCase, paramCase } from 'change-case'

export default (context, inject) => {
  inject('camelCase', camelCase)
  inject('paramCase', paramCase)
}
