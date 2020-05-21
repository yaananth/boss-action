import {JSON_SCHEMA, safeDump, safeLoad} from 'js-yaml'
import {IJob, IWorkflow, IYamlData} from './Types'

export class Yaml {
  constructor(data: IYamlData) {
    this._data = data
    this._steps = safeLoad(data.content, {
      schema: JSON_SCHEMA
    })
  }

  getTransformedContent(): string {
    const workflowJson: IWorkflow = JSON.parse(
      this.JSON_TEMPLATE(this._jobName, this._data.name, this._data.id)
    )
    workflowJson['jobs'][this._jobName]['steps'] = this._steps.steps
    return safeDump(workflowJson)
  }

  private readonly _steps: IJob
  private readonly _data: IYamlData
  private readonly _jobName = 'boss-at-work'
  private JSON_TEMPLATE = (jobName: string, name: string, id: string) => `
{
  "name": "${name}",
  "on": {
    "repository_dispatch": {
      "types": ["${id}"]
    }
  },
  "jobs": {
    "${jobName}": {
      "runs-on": "ubuntu-latest"
    }      
  }
}
  `
}
