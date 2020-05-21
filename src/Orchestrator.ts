import {IOrchestratorData} from './Types'
import {v4 as uuidv4} from 'uuid'

export class Orchestrator {
  constructor(data: IOrchestratorData) {
    this._data = data
  }

  async runAsync(): Promise<void> {
    const workersJson = await this._data.helper.getWorkersAsync(this._data.nwo)
    for (const workerObj of workersJson) {
      if (workerObj.command.toLowerCase() === this._data.command) {
        console.log(`Found worker ${workerObj.worker}!`)
        console.log(
          await this._data.helper.getWorkerYml({
            id: this._id,
            nwo: this._data.nwo,
            worker: workerObj.worker,
            command: this._data.command
          })
        )
      }
    }
  }

  private _data: IOrchestratorData
  private _id: string = uuidv4()
}
