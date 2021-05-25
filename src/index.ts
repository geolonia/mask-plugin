import * as Geolonia from '@geolonia/embed'
import mapboxgl from 'mapbox-gl'
import bboxPolygon from '@turf/bbox-polygon'
import difference from '@turf/difference'
import { parseGeoJSONAtt, getBbox } from './utils'

const HelloGeoloniaPlugin: Geolonia.EmbedPlugin = (map, target, atts) => {

  map.on('load', async (e: mapboxgl.MapSourceDataEvent) => {
    const maskGeojsonObject = await parseGeoJSONAtt(atts.maskGeojson)

    if (!maskGeojsonObject) {
      return
    }
    const maskFeature = maskGeojsonObject.features[0]
    if (
      !maskFeature ||
      !maskFeature.geometry ||
      maskFeature.geometry.type.toLowerCase() !== 'polygon'
    ) {
      return
    }
    // @ts-ignore
    const geojsonBounds = getBbox(maskGeojsonObject.features[0].geometry.coordinates[0])
    map.fitBounds(geojsonBounds, {
      duration: 0,
      padding: 30,
    })

    const extBounds = map.getBounds()
    console.log({ extBounds })
    map.setMaxBounds(extBounds)
    console.log()
    const bbox = extBounds.toArray()
    const donut = difference(
      bboxPolygon([bbox[0][0], bbox[0][1], bbox[1][0], bbox[1][1]]),
      // @ts-ignore
      maskFeature)
    console.log(donut)
    if (!donut) {
      return
    }

    map.addSource('geolonia-mask-plugin', {
      type: "geojson",
      data: donut
    });

    map.addLayer({
      id: "geolonia-mask-plugin-fill",
      source: "geolonia-mask-plugin",
      type: "fill",
      filter: ['==', '$type', 'Polygon'],
      paint: {
        "fill-color": "white",
        'fill-opacity': 0.9,
        'fill-outline-color': '#aaa'
      }
    });
  })
}

window.geolonia.registerPlugin(HelloGeoloniaPlugin)
