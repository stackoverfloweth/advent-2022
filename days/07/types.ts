export type ChangeDir = {
  type: 'cd',
  args: string,
}

export type ListDir = {
  type: 'ls',
}

export type Command = ChangeDir | ListDir
export type CommandResponse = [Command, string[]]
export type CommandType = Command['type']
export function isCommandType(value: unknown): value is CommandType {
  return value === 'cd' || value === 'ls'
}

export type File = {
  name: string,
  size: number,
}