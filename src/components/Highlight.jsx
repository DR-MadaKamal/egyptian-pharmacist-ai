export default function Highlight({ text, query }) {
  if (!query || !text) return text
  const q = query.toLowerCase().trim()
  const str = String(text)
  const idx = str.toLowerCase().indexOf(q)
  if (idx === -1) return text
  return (
    <>
      {str.slice(0, idx)}
      <mark className="bg-gold-light rounded px-0.5">{str.slice(idx, idx + q.length)}</mark>
      {str.slice(idx + q.length)}
    </>
  )
}
