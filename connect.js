const ignoreStaticMethods = ['name', 'prototype', 'length', 'propTypes', 'defaultProps']

export default ({ commit, getStore, query }) => {
  let React
  try {
    React = require('react')
  } catch (e) {
    throw new Error("dbjs-connect:connect:can not find React")
  }

  return (name, InitState, init, des) => (C) => {
    class R extends React.Component {
      constructor() {
        super();
        if (typeof InitState == 'function')
          this.$initState = new InitState(name, this.updateView.bind(this))
        else if (typeof InitState == 'object') {
          this.$initState = InitState;
          this.$initState.$updateView = this.updateView.bind(this)
        } else {
          throw new Error("dbjs-connect:connect:initState can not be null")
        }
        this.state = getStore.call(this.$initState)
      }
      componentWillMount() {
        typeof init == 'function' && init();
      }
      componentWillUnmount() {
        this.$initState = null;
        typeof des == 'function' && des();
      }

      updateView(callback, ...keys) {
        typeof callback === 'function' ? this.setState(getStore.call(this.$initState, ...keys), callback) : this.setState(getStore.call(this.$initState, ...keys))
      }
      render() {
        let localCommit = commit.bind(this.$initState);
        return (
          <C
            dispatch={async (args, functionName, context, callback) => { await localCommit(args, functionName, context, callback); }}
            query={query.bind(this.$initState)}
            {...this.props}
            {...this.state}
          />
        )
      }
    }


    Object
      .getOwnPropertyNames(C)
      .forEach((method) => {
        if (!ignoreStaticMethods.includes(method)) {
          R[method] = C[method]
        }
      })

    return R
  }
}
