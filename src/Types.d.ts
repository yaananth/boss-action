import {Helper} from './Helper'

export interface IIssuePayload {
  comment: IIssueComment
}

export interface IIssueComment {
  body: string
}

export interface IOrchestratorData {
  helper: Helper
  nwo: string
  command: string
}

export interface IWorkerJson {
  command: string
  worker: string
}

export interface IWorkflowYmlData {
  id: string
  nwo: string
  worker: string
  command: string
}

export interface IWorkflowYmlResult {
  content: string
  name: string
}

export interface IRepoData {
  owner: string
  repo: string
}

export interface IYamlData {
  content: string
  name: string
  id: string
}

export interface IStep {
  id?: string
  name?: string
}

export interface IJob {
  name?: string
  'runs-on': string | string[]
  steps: IStep[]
}

export interface IJobMap {
  [jobId: string]: IJob
}

export interface IWorkflow {
  name?: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: any

  jobs: IJobMap
}
