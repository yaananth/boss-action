import * as path from 'path'
import {Octokit} from '@octokit/rest'
import {
  IRepoData,
  IWorkerJson,
  IWorkflowYmlData,
  IWorkflowYmlResult
} from './Types'

export class Helper {
  constructor(actionToken: string, patToken: string) {
    this._actionScopedGitHubClient = new Octokit({
      auth: actionToken
    })
    this._privateScopedGitHubClient = new Octokit({
      auth: patToken
    })
  }

  async getWorkersAsync(nwo: string): Promise<IWorkerJson[]> {
    const workersJsonPath = path.join(this.BOSS_DIR, this.BOSS_WORKERS_JSON)

    return JSON.parse(await this.getFileAsync(nwo, workersJsonPath))
  }

  async getWorkerYml(data: IWorkflowYmlData): Promise<IWorkflowYmlResult> {
    const workersYmlPath = path.join(
      this.BOSS_DIR,
      this.BOSS_WORKERS_DIR,
      this.YML_EXT(data.worker)
    )
    const name = `BOSS_${data.command}_${data.id}`
    const content = await this.getFileAsync(data.nwo, workersYmlPath)
    return {
      name,
      content
    }
  }

  async pushWorkflow(
    nwo: string,
    command: string,
    name: string,
    content: string
  ): Promise<void> {
    const repoData = Helper.getRepoData(nwo)
    const workFlowPath = path.join(this.GHUB_WORKFLOW_DIR, this.YML_EXT(name))
    console.log(
      `Pushing ${workFlowPath} for Owner: ${repoData.owner} Repo: ${repoData.repo}`
    )
    // https://developer.github.com/v3/repos/contents/#create-or-update-a-file
    await this._privateScopedGitHubClient.repos.createOrUpdateFile({
      owner: repoData.owner,
      repo: repoData.repo,
      path: workFlowPath,
      content: Helper._encode(content),
      message: this.BOSS_MESSAGE(command)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async triggerDispatch(nwo: string, id: string, payload?: any): Promise<void> {
    // https://developer.github.com/v3/repos/#create-a-repository-dispatch-event
    const repoData = Helper.getRepoData(nwo)
    console.log(
      `Trigger dispatch event with event_type ${id} and payload ${JSON.stringify(
        payload || ''
      )}!`
    )
    this._privateScopedGitHubClient.repos.createDispatchEvent({
      owner: repoData.owner,
      repo: repoData.repo,
      // eslint-disable-next-line @typescript-eslint/camelcase
      event_type: id,
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_payload: payload
    })
  }

  private static _decode(encoded: string): string {
    const buff = Buffer.from(encoded, 'base64')
    return buff.toString('utf-8')
  }

  private static _encode(decoded: string): string {
    const buff = Buffer.alloc(decoded.length, decoded)
    return buff.toString('base64')
  }

  private async getFileAsync(nwo: string, filePath: string): Promise<string> {
    const repoData = Helper.getRepoData(nwo)
    console.log(
      `Fetching ${filePath} for Owner: ${repoData.owner} Repo: ${repoData.repo}`
    )
    //https://developer.github.com/v3/repos/contents/#get-contents
    const result = await this._actionScopedGitHubClient.repos.getContents({
      owner: repoData.owner,
      repo: repoData.repo,
      path: filePath
    })
    return Helper._decode(result.data.content)
  }

  private static getRepoData(nwo: string): IRepoData {
    const nwoData = nwo.split('/')
    return {
      owner: nwoData[0],
      repo: nwoData[1]
    }
  }

  private BOSS_DIR = '.boss'
  private BOSS_WORKERS_JSON = 'workers.json'
  private BOSS_MESSAGE = (command: string) => `boss response to ${command}`
  private BOSS_WORKERS_DIR = 'workers'
  private GHUB_WORKFLOW_DIR = path.join('.github', 'workflows')
  private YML_EXT = (name: string) => `${name}.yml`
  private _actionScopedGitHubClient: Octokit
  private _privateScopedGitHubClient: Octokit
}
