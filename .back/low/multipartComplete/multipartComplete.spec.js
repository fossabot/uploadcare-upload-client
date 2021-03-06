/* eslint-disable max-statements */

import {multipartComplete} from './multipartComplete'
import {multipartStart} from '../multipartStart'
import {multipartUpload} from '../multipartUpload'
import * as factory from '../../../test/fixtureFactory'

describe('multipartComplete', () => {
  let originalTimeout

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000
  })

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  it('should return UCRequest', () => {
    const ucRequest = multipartComplete(factory.uuid('image'), {})

    expect(ucRequest).toBeInstanceOf(Promise)
  })

  it('should upload some file via multipart', async() => {
    const file = factory.file(16)
    const filename = 'test'
    const publicKey = factory.publicKey('demo')

    // start multipart uploading: get uuid and url parts
    const {data: {uuid, parts}} = await multipartStart({
      filename,
      publicKey,
      size: file.size,
    })

    // upload files as single part to the first url
    const {code: uploadCode} = await multipartUpload(parts[0], file.data).promise

    expect(uploadCode).toBe(200)

    // complete multipart: get uploaded file info
    const {code, data} = await multipartComplete(uuid, {publicKey})

    expect(code).toBe(200)
    expect(data.uuid).toBe(uuid)
    expect(data.total).toBe(file.size)
    expect(data.size).toBe(file.size)
    expect(data.done).toBe(file.size)
    expect(data.filename).toBe(filename)
  })
})
