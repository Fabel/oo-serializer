import _ from 'lodash'
import ArraySerializer from './ArraySerializer'

export default class Serializer {
  attributes = []

  constructor (object, opts) {
    this._associates = []
    this.object = object
    this.opts = opts || {}
    this.scope = this.opts.scope || {}
  }

  hasMany (name, resolver, opts) {
    opts = opts || {}
    if (!resolver || typeof resolver === 'object') {
      opts = resolver || {}
      resolver = () => {return _.result(this.object, name)}
    }
    this._associates.push({
      type: 'array',
      name,
      resolver,
      opts,
      serializer: opts.serializer
    })
  }

  _serializeAssociates (obj) {
    for (let i = 0; i < this._associates.length;i++) {
      let association = this._associates[i]
      let data = association.resolver()
      obj[association.name] = new ArraySerializer(data, association.serializer).toJSON()
    }
    return obj
  }

  toJSON () {
    let obj = {}
    if (!this.attributes.length) {
      return this.object
    }
    _.each(this.attributes, (attr) => {
      if (this[attr]) {
        obj[attr] = this[attr]()
      } else {
        obj[attr] = _.result(this.object, attr)
      }
    })

    this._serializeAssociates(obj)
    return obj
  }
}
