import {JSON_SCHEMA, safeDump, safeLoad} from 'js-yaml'
import {IYamlData} from './Types'

export class Yaml {
  constructor(data: IYamlData) {
    this._data = data
    this._steps = safeLoad(data.content, {
      schema: JSON_SCHEMA
    })
  }

  transform(): void {
    console.log(safeDump(this.YML_TEMPLATE(this._data.name, this._data.id)))
    console.log(this._steps)
  }

  private readonly _steps: string
  private readonly _data: IYamlData
  private YML_TEMPLATE = (name: string, id: string) => `
{
  name: "${name}"
  on: {
    repository_dispatch: {
      types: ["${id}"]
    }
  }
  jobs: {
    build: {
      runs-on: "ubuntu-latest"
    }      
  }
}
  `
}
