'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CloudSun, Wind, Droplets, Gauge, AlertTriangle } from 'lucide-react'

interface WeatherPanelProps {
  lat: number
  lon: number
  elevationMetres: number
}

interface CurrentWeather {
  temperature: number
  feelsLike: number
  windSpeed: number
  windGusts: number
  precipitation: number
  weatherCode: number
  isDay: boolean
}

interface DayForecast {
  date: string
  tempMax: number
  tempMin: number
  windGusts: number
  precipitationSum: number
  weatherCode: number
}

interface WeatherData {
  current: CurrentWeather
  daily: DayForecast[]
}

// WMO weather codes -> short label
const WEATHER_LABELS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Freezing fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light showers',
  81: 'Showers',
  82: 'Violent showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm, hail',
  99: 'Severe thunderstorm, hail',
}

function weatherLabel(code: number) {
  return WEATHER_LABELS[code] ?? 'Unknown'
}

function dayName(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short' })
}

export default function WeatherPanel({ lat, lon, elevationMetres }: WeatherPanelProps) {
  const [data, setData] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&elevation=${elevationMetres}&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_gusts_10m,precipitation,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,wind_gusts_10m_max,precipitation_sum,weather_code&timezone=auto&forecast_days=5`

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Weather service unavailable')
        return res.json()
      })
      .then(json => {
        if (cancelled) return
        setData({
          current: {
            temperature: json.current.temperature_2m,
            feelsLike: json.current.apparent_temperature,
            windSpeed: json.current.wind_speed_10m,
            windGusts: json.current.wind_gusts_10m,
            precipitation: json.current.precipitation,
            weatherCode: json.current.weather_code,
            isDay: json.current.is_day === 1,
          },
          daily: json.daily.time.map((date: string, i: number) => ({
            date,
            tempMax: json.daily.temperature_2m_max[i],
            tempMin: json.daily.temperature_2m_min[i],
            windGusts: json.daily.wind_gusts_10m_max[i],
            precipitationSum: json.daily.precipitation_sum[i],
            weatherCode: json.daily.weather_code[i],
          })),
        })
      })
      .catch(e => {
        if (!cancelled) setError(e.message || 'Could not load weather')
      })

    return () => {
      cancelled = true
    }
  }, [lat, lon, elevationMetres])

  if (error) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-6 flex items-center gap-3">
        <AlertTriangle size={18} className="text-[#e8702a] shrink-0" />
        <p className="text-white/60 text-sm">Weather data is unavailable right now. Always check the Met Office mountain forecast before heading out.</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-6">
        <div className="h-5 w-40 rounded bg-white/10 animate-pulse" />
        <div className="h-10 w-28 rounded bg-white/10 animate-pulse mt-4" />
      </div>
    )
  }

  const { current, daily } = data
  const gustWarning = current.windGusts >= 50 || daily.some(d => d.windGusts >= 60)

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-white/40 font-semibold">Summit-level now · ~{elevationMetres}m</p>
          <div className="flex items-baseline gap-3 mt-1.5">
            <span className="text-white text-4xl font-medium">{Math.round(current.temperature)}°</span>
            <span className="text-white/60 text-sm">feels like {Math.round(current.feelsLike)}°</span>
          </div>
          <p className="text-white/70 text-sm mt-1 flex items-center gap-1.5">
            <CloudSun size={15} className="text-[#ffd9a0]" /> {weatherLabel(current.weatherCode)}
          </p>
        </div>
        <div className="flex gap-5">
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-white/40 font-semibold flex items-center justify-end gap-1"><Wind size={12} /> Wind</p>
            <p className="text-white text-lg font-medium mt-0.5">{Math.round(current.windSpeed)} <span className="text-xs text-white/50">km/h</span></p>
            <p className="text-white/45 text-xs">gusts {Math.round(current.windGusts)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-white/40 font-semibold flex items-center justify-end gap-1"><Droplets size={12} /> Precip</p>
            <p className="text-white text-lg font-medium mt-0.5">{current.precipitation.toFixed(1)} <span className="text-xs text-white/50">mm</span></p>
          </div>
        </div>
      </div>

      {gustWarning && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#e8702a]/40 bg-[#e8702a]/10 px-3.5 py-2.5">
          <Gauge size={15} className="text-[#ffd9a0] mt-0.5 shrink-0" />
          <p className="text-[#ffd9a0] text-xs leading-relaxed">Strong gusts forecast this week — exposed ridges may be unsafe. Check the Met Office mountain forecast before committing.</p>
        </div>
      )}

      <div className="grid grid-cols-5 gap-2 mt-6">
        {daily.map((d, i) => (
          <motion.div
            key={d.date}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
          >
            <p className="text-white/50 text-[11px] font-semibold uppercase">{i === 0 ? 'Today' : dayName(d.date)}</p>
            <p className="text-white text-sm font-medium mt-1.5">{Math.round(d.tempMax)}° <span className="text-white/40">{Math.round(d.tempMin)}°</span></p>
            <p className="text-white/45 text-[11px] mt-1">{Math.round(d.windGusts)} km/h</p>
            {d.precipitationSum > 0.2 && (
              <p className="text-[#7fb8e0] text-[11px] mt-0.5">{d.precipitationSum.toFixed(1)}mm</p>
            )}
          </motion.div>
        ))}
      </div>

      <p className="text-white/30 text-[11px] mt-4">Forecast via Open-Meteo, elevation-adjusted to the summit. Not a substitute for a dedicated mountain forecast.</p>
    </div>
  )
}
