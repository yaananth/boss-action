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
