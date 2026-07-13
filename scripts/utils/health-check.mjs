export async function healthCheck(url, label, options = {}) {
  const timeout = options.timeout || 10000
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const start = Date.now()
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': 'Egyptian-Pharmacist-AI/1.0' },
    })
    const elapsed = Date.now() - start
    clearTimeout(timer)
    return {
      reachable: true,
      statusCode: res.status,
      statusText: res.statusText,
      elapsed,
      url,
    }
  } catch (err) {
    clearTimeout(timer)
    if (err.name === 'AbortError') {
      return { reachable: false, error: 'timeout', elapsed: timeout, url }
    }
    return { reachable: false, error: err.message, url }
  }
}

export async function healthCheckWithBody(url, label, options = {}) {
  const timeout = options.timeout || 15000
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const start = Date.now()
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'User-Agent': 'Egyptian-Pharmacist-AI/1.0', Accept: 'application/json,text/html' },
    })
    const elapsed = Date.now() - start
    const body = await res.text()
    clearTimeout(timer)
    return {
      reachable: true,
      statusCode: res.status,
      statusText: res.statusText,
      bodyLength: body.length,
      elapsed,
      body: body.slice(0, 5000),
      url,
    }
  } catch (err) {
    clearTimeout(timer)
    if (err.name === 'AbortError') {
      return { reachable: false, error: 'timeout', elapsed: timeout, url }
    }
    return { reachable: false, error: err.message, url }
  }
}
