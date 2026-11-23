'use client'

import { Maximize, Minimize, RotateCw } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { isSimulationHTMLPath } from '@/utilities/simulationHTMLPath'

type SimulationViewerProps = {
  className?: string
  simulationHtmlPath: string
  simulationTitle: string
}

export const SimulationViewer: React.FC<SimulationViewerProps> = ({
  className = 'mx-auto w-full max-w-[96rem] px-4 sm:px-6 lg:px-8',
  simulationHtmlPath,
  simulationTitle,
}) => {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [reloadCount, setReloadCount] = useState(0)
  const [fileAvailable, setFileAvailable] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [controlError, setControlError] = useState<string | null>(null)

  useEffect(() => {
    const updateFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === viewerRef.current)
    }

    document.addEventListener('fullscreenchange', updateFullscreen)
    return () => document.removeEventListener('fullscreenchange', updateFullscreen)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    setFileAvailable(false)
    setIframeLoaded(false)
    setError(null)

    if (!isSimulationHTMLPath(simulationHtmlPath)) {
      setError('This simulation path is invalid.')
      return () => controller.abort()
    }

    fetch(simulationHtmlPath, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`The simulation file could not be loaded (HTTP ${response.status}).`)
        }

        if (active) setFileAvailable(true)
      })
      .catch((cause: unknown) => {
        if (!active || controller.signal.aborted) return

        setError(
          cause instanceof Error ? cause.message : 'The simulation file could not be loaded.',
        )
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [simulationHtmlPath, reloadCount])

  const reload = () => {
    setError(null)
    setReloadCount((current) => current + 1)
  }

  const toggleFullscreen = async () => {
    const viewer = viewerRef.current
    if (!viewer) return

    try {
      setControlError(null)
      if (document.fullscreenElement === viewer) {
        await document.exitFullscreen()
      } else {
        await viewer.requestFullscreen()
      }
    } catch (cause) {
      setControlError(
        cause instanceof Error
          ? `Fullscreen is unavailable: ${cause.message}`
          : 'Fullscreen is unavailable in this browser.',
      )
    }
  }

  return (
    <section aria-label={`${simulationTitle} interactive simulation`} className={className}>
      <div
        ref={viewerRef}
        className={`overflow-hidden border border-border bg-background shadow-lg ${
          isFullscreen ? 'flex h-screen flex-col rounded-none' : 'rounded-xl'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 sm:px-4">
          <h2 className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
              Live model
            </span>
            <span className="truncate">{simulationTitle}</span>
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              aria-label="Reload simulation"
              onClick={reload}
              size="sm"
              type="button"
              variant="outline"
            >
              <RotateCw aria-hidden="true" />
              <span className="hidden sm:inline">Reload</span>
            </Button>
            <Button
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              onClick={toggleFullscreen}
              size="sm"
              type="button"
              variant="outline"
            >
              {isFullscreen ? <Minimize aria-hidden="true" /> : <Maximize aria-hidden="true" />}
              <span className="hidden sm:inline">
                {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              </span>
            </Button>
          </div>
        </div>
        {controlError && (
          <p aria-live="polite" className="px-4 py-2 text-sm text-destructive" role="status">
            {controlError}
          </p>
        )}

        <div
          className={`relative bg-muted ${
            isFullscreen
              ? 'min-h-0 flex-1'
              : 'h-[70vh] min-h-[26rem] max-h-[56rem] sm:min-h-[32rem] md:h-[75vh] md:min-h-[38rem]'
          }`}
        >
          <iframe
            key={reloadCount}
            title={simulationTitle}
            src={simulationHtmlPath}
            sandbox="allow-scripts"
            allow="fullscreen"
            allowFullScreen
            onLoad={() => setIframeLoaded(true)}
            onError={() => setError('The simulation iframe failed to load.')}
            className="size-full border-0"
          />

          {!error && (!fileAvailable || !iframeLoaded) && (
            <div
              aria-live="polite"
              className="absolute inset-0 flex items-center justify-center bg-background/90 text-sm text-muted-foreground"
              role="status"
            >
              Loading simulation…
            </div>
          )}

          {error && (
            <div
              aria-live="assertive"
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background p-6 text-center"
              role="alert"
            >
              <p>{error}</p>
              <Button onClick={reload} type="button" variant="outline">
                <RotateCw aria-hidden="true" />
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
