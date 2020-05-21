import {IOrchestratorData} from './Types'
import {v4 as uuidv4} from 'uuid'
import {Yaml} from './Yaml'

export class Orchestrator {
  constructor(data: IOrchestratorData) {
    this._data = data
  }

  async runAsync(): Promise<void> {
    const workersJson = await this._data.helper.getWorkersAsync(this._data.nwo)
    let workerObjFound = false
    for (const workerObj of workersJson) {
      const regEx = new RegExp(workerObj.command, 'igm')
      const regExResult = regEx.exec(this._data.command) || []
      console.log(
        `Regular expression check for ${workerObj.command}: `,
        regExResult
      )
      if (regExResult.length >= 1) {
        const command = regExResult[0]
        const params = regExResult.slice(2) || []

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let payload: any
        let counter = 0
        if (params.length > 0) {
          payload = payload || {}
          for (const p of params) {
            payload[this._bossEnv(counter++)] = p
          }
        }
        workerObjFound = true
        console.log(`Found worker ${workerObj.worker} for command ${command}!`)
        const workFlowResult = await this._data.helper.getWorkerYml({
          id: this._id,
          nwo: this._data.nwo,
          worker: workerObj.worker,
          command: this._data.command
        })

        const yaml = new Yaml({
          id: this._id,
          name: workFlowResult.name,
          content: workFlowResult.content
        })
        const yamlContent = yaml.getTransformedContent()

        await this._data.helper.pushWorkflow(
          this._data.nwo,
          this._data.command,
          workFlowResult.name,
          yamlContent
        )

        await this._data.helper.triggerDispatch(
          this._data.nwo,
          this._id,
          payload
        )

        break
      }
    }

    if (!workerObjFound) {
      console.log(
        `No worker found for command ${this._data.command}, check workers.json`
      )
    }
  }

  private _data: IOrchestratorData
  private _id: string = uuidv4()
  private _bossEnv = (i: number) => `boss_payload_${i}`
}
