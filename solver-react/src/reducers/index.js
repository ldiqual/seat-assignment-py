const _ = require('lodash')

let mainReducer = function(state, action) {
  return _.assign({}, state)
}

module.exports = mainReducer
