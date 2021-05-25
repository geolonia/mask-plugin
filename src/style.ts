import mapboxgl from "mapbox-gl"

export const maskStyle = ({ id, source }: { id: string, source: string }): mapboxgl.FillLayer => {
    return {
        id,
        source,
        type: "fill",
        filter: ['==', '$type', 'Polygon'],
        paint: {
            "fill-color": "white",
            'fill-opacity': 0.9,
            'fill-outline-color': '#aaa'
        }
    }
}