import _ from 'lodash'

export default function observeStore (store, property, onChange) {
  let currentState

  function handleChange () {
    let state = store.getState()
    let nextState = _.get(state, property)
    if (nextState !== currentState) {
      currentState = nextState
      onChange(currentState)
    }
  }

  let unsubscribe = store.subscribe(handleChange)
  handleChange()
  return unsubscribe
}
