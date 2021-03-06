/* @flow */
import defaultSettings from './default-settings'
import UploadAPI from './api'
import fileFrom from './fileFrom'
import type {FileData, Settings} from './types'
import type {FilePromise} from './fileFrom'

export default class UploadClient {
  settings: Settings
  updateSettingsListeners: Array<Function>
  api: UploadAPI

  constructor(settings: Settings = {}): void {
    this.settings = {
      ...defaultSettings,
      ...settings,
    }
    this.updateSettingsListeners = []
    this.api = new UploadAPI(this)
  }

  setSettings(newSettings: Settings = {}): void {
    const prevSettings = {...this.settings}

    this.settings = {
      ...prevSettings,
      ...newSettings,
    }

    this.updateSettingsListeners.forEach(listener => {
      listener(prevSettings)
    })
  }

  addUpdateSettingsListener(listener: Function): void {
    this.updateSettingsListeners.push(listener)
  }

  removeUpdateSettingsListener(listener: Function): void {
    for (let index = 0; index < this.updateSettingsListeners.length; index++) {
      if (this.updateSettingsListeners[index] === listener) {
        this.updateSettingsListeners.splice(index, 1)

        break
      }
    }
  }

  fileFrom(from: string, data: FileData, settings: Settings = {}): FilePromise {
    return fileFrom(from, data, {
      ...this.settings,
      ...settings,
    })
  }
}
