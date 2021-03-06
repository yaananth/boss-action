import {IAdditionalPayload, IOrchestratorData} from './Types'
import {Yaml} from './Yaml'
import {createHash} from 'crypto'

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
        `Regular expression check for comment ${this._data.command} with ${workerObj.command}: `,
        regExResult
      )
      if (regExResult.length >= 1) {
        const command = regExResult[0]
        const params = regExResult.slice(2) || []

        let payload: IAdditionalPayload = {
          commentId: this._data.additionalPayload.commentId
        }
        let counter = 0
        if (params.length > 0) {
          payload = payload || {}
          for (const p of params) {
            payload[this._bossEnv(counter++)] = p
          }
        }
        workerObjFound = true
        this._id = createHash('md5')
          .update(workerObj.command)
          .digest('hex')

        console.log(`Found worker ${workerObj.worker} for command ${command}!`)
        const workFlowResult = await this._data.helper.getWorkerYml({
          id: this._id,
          nwo: this._data.nwo,
          worker: workerObj.worker
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
  private _id: string | undefined
  private _bossEnv = (i: number) => `boss_payload_${i}`
}
