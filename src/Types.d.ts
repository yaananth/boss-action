import {Helper} from './Helper'

// https://developer.github.com/webhooks/event-payloads/#issue_comment or https://developer.github.com/webhooks/event-payloads/#pull_request_review_comment
export interface IEventPayload {
  comment: IEventComment
}

export interface IAdditionalPayload {
  commentId: string
  [key: string]: string
}

export interface IEventComment {
  id: string
  body: string
}

export interface IOrchestratorData {
  helper: Helper
  nwo: string
  command: string
  additionalPayload: IAdditionalPayload
}

export interface IWorkerJson {
  command: string
  worker: string
}

export interface IWorkflowYmlData {
  id: string
  nwo: string
  worker: string
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
