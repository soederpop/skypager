import result from 'lodash/result'
import some from 'lodash/some'
import eq from 'lodash/eq'
import isMatch from 'lodash/isMatch'
import isRegExp from 'lodash/isRegExp'
import isEqual from 'lodash/isEqual'
import lt from 'lodash/lt'
import lte from 'lodash/lte'
import gt from 'lodash/gt'
import gte from 'lodash/gte'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import isArray from 'lodash/isArray'

const isRegex = isRegExp
const equals = eq
const not_equals = (...args) => !eq(...args) // eslint-disable-line
const neq = (...args) => !eq(...args)

export const operators = {
  lt,
  gt,
  gte,
  lte,
  eq,
  neq,
  equals,
  not_equals,
}

/**
 * Query an array using a parameters hash which allows for different operators,
 * and which can easily be serialized and sent over the wire
 *
 */

export function query(nodeList = [], params, negate = false) {
  if (typeof nodeList.filter !== 'function') {
    return []
  }

  if (typeof params === 'function') {
    return nodeList.filter(params)
  }

  let items = nodeList || []

  return items.filter(node => {
    let matchesParam = Object.keys(params).every(key => {
      let param = params[key]
      let value = result(node, key)

      if (isRegex(param) && param.test(value)) {
        return true
      }

      if (typeof param === 'string' && value === param) {
        return true
      }

      if (typeof param === 'number' && value === param) {
        return true
      }

      // treat normal arrays to search for some exact matches
      if (isArray(param) && (isString(value) || isNumber(value))) {
        return some(param, val => val === value)
      }

      if (isObject(param) && (param.value || param.val) && (param.op || param.operator)) {
        return testWithOperator(param, value)
      }

      if (isObject(param) && isObject(value)) {
        return isMatch(value, param)
      }
    })

    return negate ? !matchesParam : matchesParam
  })
}

export default query

export function testWithOperator(param, testValue) {
  let operator = param.operator || param.op
  let checkValue = param.value || param.val
  let testFn = operators[operator] || isEqual

  return testFn(testValue, checkValue)
}
