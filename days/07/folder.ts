import { File } from './types'
export const folders: Folder[] = []

export class Folder {
  public name: string
  public parent: Folder | null
  public contents: (File | Folder)[] = []

  public constructor(name: string, parent?: Folder) {
    this.name = name
    this.parent = parent ?? null

    folders.push(this)
  }

  public find(name: string): File | Folder | undefined {
    return this.contents.find(item => item.name === name)
  }

  public get size(): number {
    return this.contents.reduce((sum, item) => sum + item.size, 0)
  }
}