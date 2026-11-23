import { describe, expect, it } from 'vitest'

import { isSimulationHTMLPath, validateSimulationHTMLPath } from '@/utilities/simulationHTMLPath'

describe('simulation HTML path', () => {
  it.each(['/sims/pendulum.html', '/sims/pid.html', '/sims/projectile.html', '/sims/waves.html'])(
    'accepts a local simulation path: %s',
    (value) => {
      expect(validateSimulationHTMLPath(value)).toBe(true)
      expect(isSimulationHTMLPath(value)).toBe(true)
    },
  )

  it('accepts an empty optional value', () => {
    expect(validateSimulationHTMLPath('')).toBe(true)
  })

  it.each(['https://example.com/sim.html', '/sims/../secret.html', '/sims/model.txt'])(
    'rejects an invalid path: %s',
    (value) => {
      expect(validateSimulationHTMLPath(value)).not.toBe(true)
      expect(isSimulationHTMLPath(value)).toBe(false)
    },
  )
})
