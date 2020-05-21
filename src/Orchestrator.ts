import {IOrchestratorData} from './Types'

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
          await this._data.helper.getWorkerYml(this._data.nwo, workerObj.worker)
        )
      }
    }
  }

  private _data: IOrchestratorData
}
