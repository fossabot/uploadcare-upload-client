/* @flow */
import request, {prepareOptions} from './request'
import type {Settings} from '../types'
import type {RequestOptions} from './request'

export type InfoResponse = {|
  size: number,
  total: number,
  done: number,
  uuid: string,
  file_id: string,
  original_filename: string,
  filename: string,
  mime_type: string,
  is_image: boolean,
  is_stored: boolean,
  is_ready: boolean,
  image_info: null | {|
    height: number,
    width: number,
    geo_location: null | {
      latitude: number,
      longitude: number,
    },
    orientation: null | number,
    dpi: null | Array<number>,
    color_mode: string,
    sequence?: boolean,
  |},
  video_info: null | {},
  s3_bucket?: string
|}

/**
 * Returns a JSON dictionary holding file info
 *
 * @param {string} uuid – UUID of a target file to request its info.
 * @param {Settings} settings
 * @return {Promise<InfoResponse>}
 */
export default function info(uuid: string, settings: Settings = {}): Promise<InfoResponse> {
  const options: RequestOptions = prepareOptions({
    path: '/info/',
    query: {
      pub_key: settings.publicKey || '',
      file_id: uuid,
    },
  }, settings)

  return request(options)
    .then(response => response.data)
}
