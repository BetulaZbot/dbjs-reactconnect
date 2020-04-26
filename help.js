
const recover = function (object) {
  if (object && !object.$isPure) {
    return object;
  } else if (object && object.$isPure) {
    return this.recover(object);
  } else {
    return this;
  }
}
const setParam = function (args, context, callback) {
  let mContext = recover.call(this, context)
  mContext && Object.keys(args).map((key) => { mContext[key] = args[key] })
  this.$updateView(callback, mContext);
}
const commit = async function (args, functionName, context, callback) {
  if (functionName)
    await this.commit(recover.call(this, context), functionName, callback, args)
  else
    setParam.call(this, args, context, callback)
}
const query = async function (functionName, args, context) {
  return await this.query(recover.call(this, context), functionName, args)
}
const getStore = function (context) {
  return this.produceState(recover.call(this, context))
}

export {
  commit, query, getStore
}
