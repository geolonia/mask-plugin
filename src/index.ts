import * as Geolonia from '@geolonia/embed'
import mapboxgl from 'mapbox-gl'
import bboxPolygon from '@turf/bbox-polygon'
import difference from '@turf/difference'
import { parseGeoJSONAtt, isPolygonFeature, getBbox } from './utils'
import { maskStyle } from './style'

const maskPlugin: Geolonia.EmbedPlugin = (map, target, atts) => {

  map.on('load', async (e: mapboxgl.MapSourceDataEvent) => {
    const maskGeojsonObject = await parseGeoJSONAtt(atts.maskGeojson)
    if (!maskGeojsonObject) {
      return
    }

    const inner = maskGeojsonObject.features[0]
    if (!isPolygonFeature(inner)) {
      return
    }

    // @ts-ignore
    const coords = maskGeojsonObject.features[0].geometry.coordinates[0]
    const geojsonBounds = getBbox(coords)

    // TODO: 非同期処理を確認
    map.fitBounds(geojsonBounds, { duration: 0, padding: 30 })
    const fittedBounds = map.getBounds()
    map.setMaxBounds(fittedBounds)

    const [[left, bottom], [right, top]] = fittedBounds.toArray()
    const outer = bboxPolygon([left, bottom, right, top])
    const donut = difference(outer, inner)
    if (!donut) {
      return
    }

    map.addSource('geolonia-mask-plugin', { type: "geojson", data: donut });
    map.addLayer(maskStyle({ id: "geolonia-mask-plugin-fill", source: "geolonia-mask-plugin" }));
  })
}

window.geolonia.registerPlugin(maskPlugin)
