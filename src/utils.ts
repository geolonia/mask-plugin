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

export const parseGeoJSONAtt = async (att: string | void) => {
    if (att) {
        let json
        const el = isCssSelector(att)
        if (el && el.textContent) {
            json = JSON.parse(el.textContent)
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

export const getBbox = (coordinates: any) => {
    const [firstX, firstY] = coordinates[0];
    const initialBbox = [firstX, firstY, firstX, firstY]

    return coordinates.reduce(
        // @ts-ignore
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