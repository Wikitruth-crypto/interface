import { FormEvent, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { useRuntimeContractEvents } from './app/hooks/useRuntimeContractEvents'
import { RuntimeScope } from './types/searchScope'
import { ContractName } from '../contractsConfig/types'
import { getContractEventSignatures } from '../contractsConfig/eventSignatures'

const DEFAULT_SCOPE: RuntimeScope = {
  network: 'testnet',
  layer: 'sapphire',
}

const extractEventNames = (signatures: readonly string[]) => {
  const names = signatures
    .map(signature => {
      const match = /^event\s+([^(]+)\(/.exec(signature.trim())
      return match ? match[1] : signature
    })
    .filter(Boolean)
  return Array.from(new Set(names))
}

const TruthBoxEventsApp = () => {
  const eventSignatures = getContractEventSignatures(ContractName.TRUTH_BOX) ?? []
  const availableEventNames = useMemo(() => extractEventNames(eventSignatures), [eventSignatures])

  const [limitInput, setLimitInput] = useState('10')
  const [offsetInput, setOffsetInput] = useState('0')
  const [selectedEvent, setSelectedEvent] = useState<string>('')

  const [queryParams, setQueryParams] = useState(() => ({
    limit: 10,
    offset: 0,
    eventNames: [] as string[],
  }))

  const { address: resolvedAddress, events, query } = useRuntimeContractEvents({
    scope: DEFAULT_SCOPE,
    contract: ContractName.TRUTH_BOX,
    limit: queryParams.limit,
    offset: queryParams.offset,
    eventNames: queryParams.eventNames.length ? queryParams.eventNames : undefined,
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsedLimit = Number.parseInt(limitInput, 10)
    const parsedOffset = Number.parseInt(offsetInput, 10)

    setQueryParams({
      limit: Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10,
      offset: Number.isFinite(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0,
      eventNames: selectedEvent ? [selectedEvent] : [],
    })
  }

  const handleReset = () => {
    setLimitInput('10')
    setOffsetInput('0')
    setSelectedEvent('')
    setQueryParams({
      limit: 10,
      offset: 0,
      eventNames: [],
    })
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={{ margin: 0 }}>TruthBox Events Explorer</h1>
        <p style={{ margin: '8px 0 0' }}>
          从 Sapphire Testnet 查询 TruthBox 合约事件，支持限制条数、偏移量以及事件类型过滤。
        </p>
      </header>

      <section style={cardStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formRowStyle}>
            <label style={labelStyle}>
              Limit
              <input
                type="number"
                min={1}
                step={1}
                value={limitInput}
                onChange={event => setLimitInput(event.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Offset
              <input
                type="number"
                min={0}
                step={1}
                value={offsetInput}
                onChange={event => setOffsetInput(event.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Event
              <select
                value={selectedEvent}
                onChange={event => setSelectedEvent(event.target.value)}
                style={inputStyle}
              >
                <option value="">全部事件</option>
                {availableEventNames.map(name => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div style={buttonRowStyle}>
            <button type="submit" style={primaryButtonStyle} disabled={query.isFetching}>
              {query.isFetching ? '查询中...' : '查询'}
            </button>
            <button type="button" style={secondaryButtonStyle} onClick={handleReset}>
              重置
            </button>
          </div>
        </form>
      </section>

      <section style={cardStyle}>
      {query.isLoading ? (
        <p>加载中…</p>
      ) : query.isError ? (
        <p style={{ color: '#c62828' }}>
          查询失败：{(query.error as Error)?.message ?? 'Unexpected error'}
        </p>
      ) : events.length === 0 ? (
        <div>
          <p>暂无符合条件的事件。</p>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            调试信息：address = {resolvedAddress ?? '(未解析)'}, offset = {queryParams.offset}, limit ={' '}
            {queryParams.limit}
          </p>
          <pre style={{ ...codeStyle, display: 'block', maxWidth: '100%' }}>
            {JSON.stringify(query.data, null, 2)}
          </pre>
        </div>
      ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>事件名称</th>
                  <th style={thStyle}>区块高度</th>
                  <th style={thStyle}>时间</th>
                  <th style={thStyle}>交易哈希</th>
                  <th style={thStyle}>参数</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr key={`${event.raw.tx_hash}-${event.raw.round}-${index}`}>
                    <td style={tdStyle}>{queryParams.offset + index + 1}</td>
                    <td style={tdStyle}>{event.eventName}</td>
                    <td style={tdStyle}>{event.raw.round}</td>
                    <td style={tdStyle}>
                      {new Date(event.raw.timestamp).toLocaleString('zh-CN', {
                        hour12: false,
                      })}
                    </td>
                    <td style={tdStyle}>
                      <code style={codeStyle}>{event.raw.tx_hash ?? event.raw.eth_tx_hash ?? '-'}</code>
                    </td>
                    <td style={tdStyle}>
                      <code style={codeStyle}>
                        {JSON.stringify(event.args, (_, value) =>
                          typeof value === 'bigint' ? value.toString() : value,
                        )}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

const containerStyle: CSSProperties = {
  fontFamily: `'SF Pro SC', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
  padding: '24px',
  backgroundColor: '#f5f7fb',
  minHeight: '100vh',
  color: '#1f2933',
}

const headerStyle: CSSProperties = {
  marginBottom: '24px',
}

const cardStyle: CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
  marginBottom: '24px',
}

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

const formRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
}

const labelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  fontSize: '14px',
  color: '#334155',
  minWidth: '160px',
  gap: '6px',
}

const inputStyle: CSSProperties = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5f5',
  fontSize: '14px',
}

const buttonRowStyle: CSSProperties = {
  display: 'flex',
  gap: '12px',
}

const primaryButtonStyle: CSSProperties = {
  padding: '10px 18px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  color: '#fff',
  fontWeight: 600,
}

const secondaryButtonStyle: CSSProperties = {
  padding: '10px 18px',
  borderRadius: '8px',
  border: '1px solid #cbd5f5',
  cursor: 'pointer',
  background: '#fff',
  color: '#4f46e5',
  fontWeight: 600,
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
}

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '12px',
  backgroundColor: '#eef2ff',
  color: '#3730a3',
  borderBottom: '1px solid #cbd5f5',
}

const tdStyle: CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid #e2e8f0',
  verticalAlign: 'top',
}

const codeStyle: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, SFMono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: '12px',
  backgroundColor: '#f1f5f9',
  padding: '4px 6px',
  borderRadius: '6px',
  display: 'inline-block',
  maxWidth: '360px',
  overflowWrap: 'anywhere',
}

export default TruthBoxEventsApp
