import * as path from 'path'
import {Octokit} from '@octokit/rest'
import {IWorkerJson} from './Types'

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

  async getWorkerYml(nwo: string, worker: string): Promise<string> {
    const workersYmlPath = path.join(
      this.BOSS_DIR,
      this.BOSS_WORKERS_DIR,
      `${worker}${this.YML_EXT}`
    )
    return JSON.parse(await this.getFileAsync(nwo, workersYmlPath))
  }

  private static _decode(encoded: string): string {
    const buff = Buffer.from(encoded, 'base64')
    return buff.toString('utf-8')
  }

  private async getFileAsync(nwo: string, filePath: string): Promise<string> {
    const nwoData = nwo.split('/')
    const owner = nwoData[0]
    const repo = nwoData[1]
    console.log(`Fetching ${filePath} for Owner: ${owner} Repo: ${repo}`)
    //https://developer.github.com/v3/repos/contents/#get-contents
    const result = await this._actionScopedGitHubClient.repos.getContents({
      owner,
      repo,
      path: filePath
    })
    return Helper._decode(result.data.content)
  }

  private BOSS_DIR = '.boss'
  private BOSS_WORKERS_JSON = 'workers.json'
  private BOSS_WORKERS_DIR = 'workers'
  private YML_EXT = '.yml'
  private _actionScopedGitHubClient: Octokit
  private _privateScopedGitHubClient: Octokit
}
