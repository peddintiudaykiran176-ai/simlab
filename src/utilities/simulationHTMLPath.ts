const simulationHTMLPathPattern = /^\/sims\/[A-Za-z0-9][A-Za-z0-9._/-]*\.html$/

export const validateSimulationHTMLPath = (value: unknown): true | string => {
  if (value === undefined || value === null || value === '') return true

  if (typeof value !== 'string' || !value.startsWith('/sims/')) {
    return 'Enter a path beginning with /sims/.'
  }

  if (!value.endsWith('.html')) {
    return 'The simulation path must end with .html.'
  }

  const segments = value.slice('/sims/'.length).split('/')

  if (
    value.includes('\\') ||
    segments.some((segment) => segment === '' || segment === '.' || segment === '..') ||
    !simulationHTMLPathPattern.test(value)
  ) {
    return 'Enter a valid HTML file path inside public/sims.'
  }

  return true
}

export const isSimulationHTMLPath = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && validateSimulationHTMLPath(value) === true
