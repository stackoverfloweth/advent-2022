import { buildCommandResponses, buildFileStructure } from './01'
import { Folder, folders } from './folder'
import { input } from './input'

function solve(): void {
  const root = new Folder('/')
  const commandResponses = buildCommandResponses(input)

  let currentFolder = root
  for (const command of commandResponses) {
    currentFolder = buildFileStructure(command, currentFolder)
  }

  const totalMemory = 70000000
  const thresholdToInstall = 30000000
  const memoryNeededToInstall = thresholdToInstall + root.size - totalMemory

  const [answer] = folders
    .filter(({ size }) => size > memoryNeededToInstall)
    .sort((folder1, folder2) => folder1.size - folder2.size)
    .map(folder => folder.size)

  console.log(answer)
}

solve()