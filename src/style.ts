import mapboxgl from "mapbox-gl"

export const maskStyle = ({ id, source, fillMask }: { id: string, source: string, fillMask: boolean }): mapboxgl.FillLayer => {
    return {
        id,
        source,
        type: "fill",
        filter: ['==', '$type', 'Polygon'],
        paint: {
            "fill-color": "white",
            'fill-opacity': fillMask ? 0.9 : 0,
            'fill-outline-color': '#aaa'
        }
    }
}