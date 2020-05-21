import {JSON_SCHEMA, safeDump, safeLoad} from 'js-yaml'
import {IJob, IWorkflow, IYamlData} from './Types'

export class Yaml {
  constructor(data: IYamlData) {
    this._data = data
    this._steps = safeLoad(data.content, {
      schema: JSON_SCHEMA
    })
  }

  transform(): void {
    console.log(this.JSON_TEMPLATE(this._data.name, this._data.id))
    const workflowJson: IWorkflow = JSON.parse(
      this.JSON_TEMPLATE(this._data.name, this._data.id)
    )
    const workflow = safeDump(workflowJson)
    console.log(this._steps)
    console.log(workflowJson)
    console.log(workflow)
  }

  private readonly _steps: IJob
  private readonly _data: IYamlData
  private JSON_TEMPLATE = (name: string, id: string) => `
{
  "name": "${name}",
  "on": {
    "repository_dispatch": {
      "types": ["${id}"]
    }
  },
  "jobs": {
    "boss-at-work": {
      "runs-on": "ubuntu-latest"
    }      
  }
}
  `
}
