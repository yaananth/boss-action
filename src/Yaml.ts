import {JSON_SCHEMA, safeLoad} from 'js-yaml'

export class Yaml {
  constructor(content: string) {
    this._data = safeLoad(content, {
      schema: JSON_SCHEMA
    })
  }

  transform(): void {
    console.log(this._data)
  }

  private readonly _data: string
}
