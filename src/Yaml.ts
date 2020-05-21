import * as JsYaml from 'js-yaml'

export class Yaml {
  constructor(content: string) {
    this._data = JsYaml.safeLoad(content)
  }

  transform(): void {
    console.log(this._data)
  }

  private readonly _data: string
}
