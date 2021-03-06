import * as factory from './_fixtureFactory'
import fileFrom from '../src/fileFrom'
import {sleep} from './_helpers'

describe('fileFrom', () => {
  const fileToUpload = factory.image('blackSquare')

  it('should resolves when file is ready on CDN', async() => {
    const filePromise = fileFrom('object', fileToUpload.data, {publicKey: factory.publicKey('demo')})

    const file = await filePromise

    expect(filePromise.progress.state).toBe('ready')
    expect(file.cdnUrl).toBeTruthy()
  })

  it('should accept doNotStore setting', async() => {
    const filePromise = fileFrom('object', fileToUpload.data, {
      publicKey: factory.publicKey('demo'),
      doNotStore: true,
    })

    await expectAsync(filePromise).toBeResolvedTo(jasmine.objectContaining({isStored: false}))
  })

  it('should be able to cancel uploading', (done) => {
    const filePromise = fileFrom('object', fileToUpload.data, {publicKey: factory.publicKey('demo')})

    setTimeout(() => {
      filePromise.cancel()
    }, 10)

    filePromise
      .then(() => done.fail())
      .catch((error) => error.name === 'CancelError' ? done() : done.fail(error))
  })

  describe('should be able to handle', () => {
    /* Wait to bypass the requests limits */
    beforeEach((done) => {
      sleep(1000).then(() => done())
    })

    it('cancel uploading', (done) => {
      const filePromise = fileFrom('object', fileToUpload.data, {publicKey: factory.publicKey('demo')})

      setTimeout(() => {
        filePromise.cancel()
      }, 10)

      filePromise.onCancel = () => {
        done()
      }

      filePromise
        .then(() => done.fail())
        .catch((error) => {
          if (error.name !== 'CancelError') {
            done.fail(error)
          }
        })
    })

    it('progress', (done) => {
      let progress = 0
      const filePromise = fileFrom('object', fileToUpload.data, {publicKey: factory.publicKey('demo')})

      filePromise.onProgress = () => {
        progress += 1
      }

      filePromise
        .then(() => progress ? done() : done.fail())
        .catch(error => done.fail(error))
    })

    it('uploaded', (done) => {
      const filePromise = fileFrom('object', fileToUpload.data, {publicKey: factory.publicKey('demo')})

      filePromise.onUploaded = () => {
        done()
      }

      filePromise
        .then(() => done.fail())
        .catch(error => done.fail(error))
    })

    it('ready', (done) => {
      const filePromise = fileFrom('object', fileToUpload.data, {publicKey: factory.publicKey('demo')})

      filePromise.onReady = () => {
        done()
      }

      filePromise
        .catch(error => done.fail(error))
    })
  })
})
