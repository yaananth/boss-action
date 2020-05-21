import * as path from 'path'
import {Octokit} from '@octokit/rest'

export class Helper {
  constructor(actionToken: string, patToken: string) {
    this._actionScopedGitHubClient = new Octokit({
      auth: actionToken
    })
    this._privateScopedGitHubClient = new Octokit({
      auth: patToken
    })
  }

  async getWorkersAsync(nwo: string): Promise<string> {
    const workersJsonPath = path.join(this.BOSS_DIR, this.BOSS_WORKERS_JSON)
    const nwoData = nwo.split('/')
    const owner = nwoData[0]
    const repo = nwoData[1]
    console.log(`Fetching ${workersJsonPath} for Owner: ${owner} Repo: ${repo}`)
    //https://developer.github.com/v3/repos/contents/#get-contents
    const jsonResult = await this._actionScopedGitHubClient.repos.getContents({
      owner,
      repo,
      path: workersJsonPath
    })
    return jsonResult.data.content
  }

  private BOSS_DIR = '.boss'
  private BOSS_WORKERS_JSON = 'workers.json'
  private BOSS_WORKERS_DIR = 'workers'
  private YML_EXT = 'yml'
  private _actionScopedGitHubClient: Octokit
  private _privateScopedGitHubClient: Octokit
}
