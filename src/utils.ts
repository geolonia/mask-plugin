const isCssSelector = (str: string) => {
    if (/^https?:\/\//.test(str)) {
        return false
    } else if (/^\//.test(str)) {
        return false
    } else if (/^\.\//.test(str)) {
        return false
    } else if (/^\.\.\//.test(str)) {
        return false
    } else {
        try {
            return document.querySelector(str)
        } catch (e) {
            return false
        }
    }
}

const isGeoJSON = (obj: any): obj is GeoJSON.FeatureCollection => {
    if (!obj || obj.type !== 'FeatureCollection' || !Array.isArray(obj.features)) {
        return false
    } else {
        return true
    }
}

export const isPolygonFeature = (feature: any): feature is GeoJSON.Feature<GeoJSON.Polygon> => {
    return !!feature &&
        !!feature.geometry &&
        !!feature.geometry.type &&
        feature.geometry.type.toLowerCase() === 'polygon'
}

/**
 * Parse Geolonia Embed attribute like data-geojson 
 * @param att attribute
 * @returns GeoJSON object if exists
 */
export const parseGeoJSONAtt = async (att: string | void) => {
    if (att) {
        let json
        const el = isCssSelector(att)
        if (el && el.textContent) {
            try {
                json = JSON.parse(el.textContent)
            } catch (error) {
                console.error(error)
                return null
            }
        } else {
            const res = await fetch(att)
            json = await res.json()
        }
        if (isGeoJSON(json)) {
            return json
        } else {
            return null
        }
    } else {
        return null
    }
}

type BBox2D = [east: number, south: number, west: number, north: number]

export const getBbox = (coordinates: [firstX: number, firstY: number][]) => {
    const [firstX, firstY] = coordinates[0];
    const initialBbox: BBox2D = [firstX, firstY, firstX, firstY]

    return coordinates.reduce<BBox2D>(
        (prev, [x, y]) => {
            return ([
                Math.min(prev[0], x),
                Math.min(prev[1], y),
                Math.max(prev[2], x),
                Math.max(prev[3], y),
            ])
        },
        initialBbox,
    );
};
