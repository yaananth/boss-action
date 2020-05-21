import {JSON_SCHEMA, safeLoad} from 'js-yaml'

export class Yaml {
  constructor(content: string) {
    this._data = safeLoad(content, {
      schema: JSON_SCHEMA
    })
  }

  transform(): void {
    console.log(this._data)
  }

  private readonly _data: string
  private YML_TEMPLATE = (name: string, id: string, content: string) => `
name: ${name}
on: 
  repository_dispatch:
    types: [${id}]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    ${content}
  `
}
