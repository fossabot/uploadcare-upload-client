import {multipartUpload} from './multipartUpload'
import {multipartStart} from '../multipartStart'
import * as factory from '../../../test/fixtureFactory'

describe('multipartUpload', () => {
  let originalTimeout

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000
  })

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  it('should return UCRequest', () => {
    const ucRequest = multipartUpload('', factory.file(0.1).data, {})

    expect(ucRequest.promise).rejects.toBeTruthy()
    expect(ucRequest).toBeTruthy()
    expect(ucRequest.promise).toBeInstanceOf(Promise)
    expect(ucRequest.cancel).toBeInstanceOf(Function)
    expect(ucRequest.progress).toBeInstanceOf(Function)
  })

  it('should upload file part to the url', async() => {
    const publicKey = factory.publicKey('demo')

    const file = factory.file(16)

    const {code, data} = await multipartStart({
      publicKey,
      filename: 'test',
      size: file.size,
    })

    const firstPart = data.parts[0]

    expect.assertions(3)

    expect(code).toBe(200)
    expect(firstPart).toBeTruthy()

    const {code: uploadCode} = await multipartUpload(
      firstPart,
      file.data.slice(0, 5242880),
    ).promise

    expect(uploadCode).toBe(200)
  })
})
