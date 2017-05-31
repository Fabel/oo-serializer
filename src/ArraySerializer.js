import _ from 'lodash'
import Serializer from './Serializer'
export default class ArraySerializer {
  attributes = []

  constructor (objects, serializer, opts) {
    this.serializer = serializer || Serializer
    this.objects = objects
    this.opts = opts
  }

  toJSON () {
    return _.map(this.objects, (object) => {
      return new this.serializer(object, this.opts).toJSON()
    })
  }
}
