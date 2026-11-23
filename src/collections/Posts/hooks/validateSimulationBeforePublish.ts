import { realpathSync, statSync } from 'node:fs'
import path from 'node:path'
import type { CollectionBeforeChangeHook } from 'payload'

import type { Post } from '../../../payload-types'
import { validateSimulationHTMLPath } from '../../../utilities/simulationHTMLPath'

export const validateSimulationBeforePublish: CollectionBeforeChangeHook<Post> = ({
  data,
  originalDoc,
}) => {
  const pathWasProvided = Object.prototype.hasOwnProperty.call(data, 'simulationHtmlPath')
  const simulationHTMLPath = pathWasProvided
    ? data.simulationHtmlPath
    : originalDoc?.simulationHtmlPath

  const validationResult = validateSimulationHTMLPath(simulationHTMLPath)

  if (validationResult !== true) {
    throw new Error(validationResult)
  }

  const isPublishing =
    data._status === 'published' ||
    (data._status === undefined && originalDoc?._status === 'published')

  if (!isPublishing || !simulationHTMLPath) return data

  const simulationsDirectory = path.resolve(process.cwd(), 'public', 'sims')
  const candidatePath = path.resolve(process.cwd(), 'public', simulationHTMLPath.slice(1))

  try {
    const realDirectory = realpathSync(simulationsDirectory)
    const realFile = realpathSync(candidatePath)
    const relativePath = path.relative(realDirectory, realFile)

    if (
      relativePath === '..' ||
      relativePath.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relativePath)
    ) {
      throw new Error('The simulation HTML file must be inside public/sims.')
    }

    if (!statSync(realFile).isFile()) {
      throw new Error('The simulation path must reference an HTML file.')
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      throw new Error(`Simulation file "${simulationHTMLPath}" does not exist in public/sims.`)
    }

    throw error
  }

  return data
}
