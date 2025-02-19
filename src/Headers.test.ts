/**
 * @jest-environment jsdom
 */
import Headers from './Headers'

describe('constructor()', () => {
  it('can be created without any arguments', () => {
    const headers = new Headers()
    expect(headers.all()).toEqual({})
  })

  it('can be created given a Headers instance', () => {
    const headers = new Headers(new window.Headers({ Accept: '*/*' }))
    expect(headers.all()).toEqual({ accept: '*/*' })
  })

  it('can be created given a polyfilled Headers instance', () => {
    const firstHeaders = new Headers({ Accept: '*/*' })
    const headers = new Headers(firstHeaders)
    expect(headers.all()).toEqual({ accept: '*/*' })
  })

  it('can be created given a ["name", "a"] list', () => {
    const headers = new Headers([['accept', '*/*']])
    expect(headers.get('accept')).toEqual('*/*')
  })

  it('can be created given a ["name", ["a", "b"]] list', () => {
    const headers = new Headers([['accept', ['application/json', 'image/png']]])
    expect(headers.get('accept')).toEqual('application/json, image/png')
  })

  it('can be created given a ["name", "a, b"] list', () => {
    const headers = new Headers([['accept', 'application/json, image/png']])
    expect(headers.get('accept')).toEqual('application/json, image/png')
  })

  it('can be created given an headers object', () => {
    const headers = new Headers({ accept: '*/*' })
    expect(headers.get('accept')).toEqual('*/*')
  })

  it('duplicates values for the same header names with different casing', () => {
    const headers = new Headers({
      'accept-encoding': 'gzip, deflate, br',
      'Accept-Encoding': 'gzip, deflate, br',
    })
    expect(headers.get('accept-encoding')).toEqual(
      'gzip, deflate, br, gzip, deflate, br'
    )
  })
})

describe('[Symbol.iterator]', () => {
  it('returns the iterator with the [name, value] pairs', () => {
    const headers = new Headers({
      accept: '*/*',
      'accept-language': 'en-US',
      'content-type': 'application/json',
    })

    const entries: Array<[string, string]> = []

    for (const entry of headers) {
      entries.push(entry)
    }

    expect(entries).toEqual([
      ['accept', '*/*'],
      ['accept-language', 'en-US'],
      ['content-type', 'application/json'],
    ])
  })

  it('returns an empty iterator when there is no headers', () => {
    const headers = new Headers()
    const entries: Array<[string, string]> = []

    for (const entry of headers) {
      entries.push(entry)
    }

    expect(entries).toEqual([])
  })
})

describe('.keys()', () => {
  it('returns the iterator with the header keys', () => {
    const headers = new Headers({
      accept: '*/*',
      'accept-language': 'en-US',
      'content-type': 'application/json',
    })
    const keys: Array<string> = []

    for (const name of headers.keys()) {
      keys.push(name)
    }

    expect(keys).toEqual(['accept', 'accept-language', 'content-type'])
  })

  it('returns an empty iterator when there is no headers', () => {
    const headers = new Headers()
    const keys: Array<string> = []

    for (const name of headers.keys()) {
      keys.push(name)
    }

    expect(keys).toEqual([])
  })
})

describe('.values()', () => {
  it('returns the iterator with the header values', () => {
    const headers = new Headers({
      accept: '*/*',
      'accept-language': 'en-US',
      'content-type': 'application/json',
    })
    const values: Array<string> = []

    for (const value of headers.values()) {
      values.push(value)
    }

    expect(values).toEqual(['*/*', 'en-US', 'application/json'])
  })

  it('returns an empty iterator when there is no headers', () => {
    const headers = new Headers()
    const values: Array<string> = []

    for (const value of headers.values()) {
      values.push(value)
    }

    expect(values).toEqual([])
  })
})

describe('.entries()', () => {
  it('returns the iterator with the [name, value] pairs', () => {
    const headers = new Headers({
      accept: '*/*',
      'accept-language': 'en-US',
      'content-type': 'application/json',
    })
    const entries: Array<[string, string]> = []

    for (const entry of headers.entries()) {
      entries.push(entry)
    }

    expect(entries).toEqual([
      ['accept', '*/*'],
      ['accept-language', 'en-US'],
      ['content-type', 'application/json'],
    ])
  })

  it('returns an empty iterator when there is no headers', () => {
    const headers = new Headers()
    const entries: Array<[string, string]> = []

    for (const entry of headers.entries()) {
      entries.push(entry)
    }

    expect(entries).toEqual([])
  })
})

describe('.get()', () => {
  it('returns the value of the existing header name', () => {
    const headers = new Headers({ 'Content-Type': 'text/plain' })
    expect(headers.get('Content-Type')).toEqual('text/plain')
    expect(headers.get('content-type')).toEqual('text/plain')
    expect(headers.get('CoNtEnT-TyPe')).toEqual('text/plain')
  })

  it('returns null given a non-existing header name', () => {
    const headers = new Headers({ 'Content-Type': 'text/plain' })
    expect(headers.get('accept')).toBeNull()
    expect(headers.get('Accept')).toBeNull()
    expect(headers.get('AcCePt')).toBeNull()
  })

  it('return an empty string for an empty header value', () => {
    const headers = new Headers({ 'Content-Type': '' })
    expect(headers.get('Content-Type')).toEqual('')
  })
})

describe('.all()', () => {
  it('returns a headers object with normalized names', () => {
    const headers = new Headers({
      Accept: '*/*',
      'Content-Type': ['application/json', 'text/plain'],
    })
    expect(headers.all()).toEqual({
      accept: '*/*',
      'content-type': 'application/json, text/plain',
    })
  })

  it('returns an empty object when there is no headers', () => {
    expect(new Headers().all()).toEqual({})
    expect(new Headers({}).all()).toEqual({})
  })
})

describe('.raw()', () => {
  it('returns a headers objects with the raw names', () => {
    const headers = new Headers({
      Accept: '*/*',
      'ConTent-Type': ['application/json', 'text/plain'],
    })
    expect(headers.raw()).toEqual({
      Accept: '*/*',
      'ConTent-Type': 'application/json, text/plain',
    })
  })

  it('returns an empty object when there is no headers', () => {
    expect(new Headers().raw()).toEqual({})
    expect(new Headers({}).raw()).toEqual({})
  })
})

describe('.set()', () => {
  it('sets a new header', () => {
    const headers = new Headers({ accept: '*/*' })

    headers.set('content-type', 'application/json')
    expect(headers.get('accept')).toEqual('*/*')
    expect(headers.get('content-type')).toEqual('application/json')
  })

  it('overrides an existing header with the same name', () => {
    const headers = new Headers({ accept: '*/*' })

    headers.set('accept', 'image/png')
    expect(headers.get('accept')).toEqual('image/png')

    headers.set('AcCePt', 'text/plain')
    expect(headers.get('accept')).toEqual('text/plain')
  })
})

describe('.append()', () => {
  it('appends a new header', () => {
    const headers = new Headers({ accept: '*/*' })

    headers.append('content-type', 'application/json')
    expect(headers.get('accept')).toEqual('*/*')
    expect(headers.get('content-type')).toEqual('application/json')
  })

  it('joins the values with the existing header', () => {
    const headers = new Headers({ accept: '*/*' })

    headers.append('accept', 'image/png')
    expect(headers.get('accept')).toEqual('*/*, image/png')
  })

  it('duplicates values with the existing header', () => {
    const headers = new Headers({ accept: '*/*' })

    headers.append('Accept', '*/*')
    expect(headers.get('accept')).toEqual('*/*, */*')
  })
})

describe('.has()', () => {
  it('returns true given an existing header name', () => {
    const headers = new Headers({ accept: '*/*' })
    expect(headers.has('accept')).toBe(true)
    expect(headers.has('AcCePt')).toBe(true)
  })

  it('returns false given a non-existing header name', () => {
    const headers = new Headers({ accept: '*/*' })
    expect(headers.has('content-type')).toBe(false)
    expect(headers.has('CoNtEnT-TyPe')).toBe(false)
  })
})

describe('.delete()', () => {
  it('deletes the existing header', () => {
    const headers = new Headers({ accept: '*/*' })

    headers.delete('accept')
    expect(headers.has('accept')).toBe(false)
    expect(headers.has('AcCePt')).toBe(false)
    expect(headers.get('accept')).toBeNull()
    expect(headers.get('AcCePt')).toBeNull()
  })

  it('does nothing given a non-existing header', () => {
    const headers = new Headers({ accept: '*/*' })

    headers.delete('content-type')
    expect(headers.get('accept')).toEqual('*/*')
    expect(headers.get('AcCePt')).toEqual('*/*')
  })
})

describe('.forEach()', () => {
  it('traverses each header once', () => {
    const headers = new Headers({ accept: '*/*', 'user-agent': 'agent' })
    const headerSet = new Set()

    headers.forEach((value, name, headers) => {
      expect(value).toBe(headers.get(name))
      expect(headerSet.has(name)).toBe(false)
      headerSet.add(name)
    })

    // `Headers.forEach` returns normalized lowecase names.
    expect(headerSet).toEqual(new Set(['accept', 'user-agent']))
  })

  it('traverses each header once with a custom "this" argument', () => {
    const headers = new Headers({ accept: '*/*', 'User-Agent': 'agent' })
    const headerSet = new Set()

    headers.forEach(function (value, name, headers) {
      expect(value).toBe(headers.get(name))
      expect(this.has(name)).toBe(false)
      this.add(name)
    }, headerSet)

    expect(headerSet).toEqual(new Set(['accept', 'user-agent']))
  })
})

describe('.getSetCookie()', () => {
  it('returns an empty array given no Set-Cookie headers', () => {
    const headers = new Headers()
    expect(headers.getSetCookie()).toEqual([])
  })

  it('returns empty string if Set-Cookie header was set to empty string', () => {
    const headers = new Headers({ 'Set-Cookie': '' })
    expect(headers.getSetCookie()).toEqual([''])
  })

  it('returns a list of a single existig Set-Cookie header', () => {
    const headers = new Headers({
      'Set-Cookie': 'name=cookie; Expires=Wed, 21 Oct 2015 07:28:00 GMT',
    })
    expect(headers.getSetCookie()).toEqual([
      'name=cookie; Expires=Wed, 21 Oct 2015 07:28:00 GMT',
    ])
  })

  it('returns a list of all existing Set-Cookie headers', () => {
    const headers = new Headers()
    headers.append(
      'Set-Cookie',
      'name=cookie; Expires=Wed, 21 Oct 2015 07:28:00 GMT'
    )
    headers.append(
      'Set-Cookie',
      'name=session; Expires=Wed, 21 Oct 2015 07:28:00 GMT'
    )

    expect(headers.getSetCookie()).toEqual([
      'name=cookie; Expires=Wed, 21 Oct 2015 07:28:00 GMT',
      'name=session; Expires=Wed, 21 Oct 2015 07:28:00 GMT',
    ])
  })
})
