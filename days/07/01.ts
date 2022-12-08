import { Folder, folders } from './folder'
import { input } from './input'
import { CommandResponse, File, isCommandType } from './types'

export function buildCommandResponses(value: string): CommandResponse[] {
  const [, ...lines] = value.split('\n')

  return lines.reduce<CommandResponse[]>((value, line) => {
    const commandRegex = /\$ (cd|ls)\s?(\S*?)?$/g
    const match = commandRegex.exec(line)

    if (match) {
      const [, type, args] = match

      if (!isCommandType(type)) {
        throw 'invalid command'
      }

      value.push([{ type, args }, []])
    } else {
      const lastCommand = value[value.length -1]
      const [, response] = lastCommand

      response.push(line)
    }

    return value
  }, [])
}

export function buildFileStructure([command, response]: CommandResponse, currentFolder: Folder): Folder {
  switch (command.type) {
    case 'cd':
      return changeFolder(command.args, currentFolder)
    case 'ls':
      return setContents(response, currentFolder)
  }
}

export function changeFolder(name: string, currentFolder: Folder): Folder {
  if (name === '..' && currentFolder.parent) {
    return currentFolder.parent
  }

  const subFolder = currentFolder.find(name)

  if (subFolder instanceof Folder) {
    return subFolder
  }

  throw 'invalid cd argument'
}

export function setContents(response: string[], currentFolder: Folder): Folder {
  for (const content of response) {
    const fileOrFolder = parseFile(content) ?? parseFolder(content, currentFolder)

    if (!fileOrFolder) {
      throw 'invalid ls response'
    }

    currentFolder.contents.push(fileOrFolder)
  }

  return currentFolder
}

export function parseFile(value: string): File | undefined {
  const commandRegex = /(\d+) (\S*?)$/g
  const match = commandRegex.exec(value)

  if (!match) {
    return undefined
  }

  const [, size, name] = match

  return {
    name,
    size: Number(size),
  }
}

export function parseFolder(value: string, currentFolder: Folder): Folder | undefined {
  const commandRegex = /dir (\S*?)$/g
  const match = commandRegex.exec(value)

  if (!match) {
    return undefined
  }

  const [, name] = match

  return new Folder(name, currentFolder)
}

function solve(): void {
  const root = new Folder('/')
  const commandResponses = buildCommandResponses(input)

  let currentFolder = root
  for (const command of commandResponses) {
    currentFolder = buildFileStructure(command, currentFolder)
  }

  const maxFolderSize = 100000
  const answer = folders
    .filter(({ size }) => size < maxFolderSize)
    .reduce((sum, folder) => sum + folder.size, 0)

  console.log(answer)
}
