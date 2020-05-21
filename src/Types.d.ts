export interface IIssuePayload {
  comment: IIssueComment
}

export interface IIssueComment {
  body: string
}

export interface IWorkerJson {
  command: string
  worker: string
}
