import * as core from '@actions/core'
import {JSON_SCHEMA, safeDump, safeLoad} from 'js-yaml'
import {IJob, IWorkflow, IYamlData} from './Types'

export class Yaml {
  constructor(data: IYamlData) {
    this._data = data
    core.debug(`Loading data : ${data.content}`)
    this._steps = safeLoad(data.content, {
      schema: JSON_SCHEMA
    })
  }

  getTransformedContent(): string {
    const template = this.JSON_TEMPLATE(
      this._jobName,
      this._data.name,
      this._data.id
    )
    core.debug(`Injecting template : ${template}`)
    const workflowJson: IWorkflow = JSON.parse(template)
    core.debug(`Workflow JSON waiting to be injected : ${workflowJson}`)
    workflowJson['jobs'][this._jobName]['steps'] = this._steps.steps
    core.debug(`Final Workflow JSON : ${workflowJson}`)
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
