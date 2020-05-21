import {IOrchestratorData} from './Types'
import {v4 as uuidv4} from 'uuid'
import {Yaml} from './Yaml'

export class Orchestrator {
  constructor(data: IOrchestratorData) {
    this._data = data
  }

  async runAsync(): Promise<void> {
    const workersJson = await this._data.helper.getWorkersAsync(this._data.nwo)
    for (const workerObj of workersJson) {
      if (workerObj.command.toLowerCase() === this._data.command) {
        console.log(`Found worker ${workerObj.worker}!`)
        const workFlowResult = await this._data.helper.getWorkerYml({
          id: this._id,
          nwo: this._data.nwo,
          worker: workerObj.worker,
          command: this._data.command
        })

        console.log(`Data:${workFlowResult.content}`)
        const yaml = new Yaml(workFlowResult.content)
        yaml.transform()

        console.log(workFlowResult.content)
        await this._data.helper.pushWorkflow(
          this._data.nwo,
          this._data.command,
          workFlowResult.name,
          workFlowResult.content
        )
      }
    }
  }

  private _data: IOrchestratorData
  private _id: string = uuidv4()
}
