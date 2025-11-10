import React, { memo } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';

// URL to a world map "shapefile". This file contains the 2-letter 'ISO_A2' code.
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

// --- Color definitions for our heatmap ---
const NO_DATA_COLOR = "#2D3748"; // Dark blue-grey for countries with no data
const LOW_COLOR = { r: 75, g: 192, b: 192 };  // Teal
const MED_COLOR = { r: 255, g: 206, b: 86 }; // Yellow
const HIGH_COLOR = { r: 255, g: 99, b: 132 }; // Red

// Helper function to blend (interpolate) between two colors
const lerp = (a, b, t) => {
  return a + (b - a) * t;
};

// New color scale function to create the heatmap (Teal -> Yellow -> Red)
const colorScale = (count, maxCount) => {
  if (!count || count === 0) return NO_DATA_COLOR;

  // Calculate percentage (0.0 to 1.0) of how "hot" this country is
  const percent = Math.min(count / (maxCount || 1), 1);
  
  let r, g, b;

  if (percent < 0.5) {
    // 0% - 50%: Scale from LOW (Teal) to MEDIUM (Yellow)
    const t = percent * 2; // Scale 0-0.5 range to 0-1
    r = lerp(LOW_COLOR.r, MED_COLOR.r, t);
    g = lerp(LOW_COLOR.g, MED_COLOR.g, t);
    b = lerp(LOW_COLOR.b, MED_COLOR.b, t);
  } else {
    // 50% - 100%: Scale from MEDIUM (Yellow) to HIGH (Red)
    const t = (percent - 0.5) * 2; // Scale 0.5-1 range to 0-1
    r = lerp(MED_COLOR.r, HIGH_COLOR.r, t);
    g = lerp(MED_COLOR.g, HIGH_COLOR.g, t);
    b = lerp(MED_COLOR.b, HIGH_COLOR.b, t);
  }

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};


const GeoChart = ({ data }) => {
  // Create a simple lookup object for speed (e.g., { "US": 10, "IN": 5 })
  // 'data' is the array from Dashboard.js: [{ country: "US", count: 10 }, ...]
  const dataLookup = data.reduce((acc, { country, count }) => {
    acc[country] = count;
    return acc;
  }, {});

  // Find the max count to set the "hottest" color in the scale
  const maxCount = Math.max(1, ...data.map(d => d.count)); // Ensure maxCount is at least 1

  return (
    <ComposableMap projectionConfig={{ scale: 147 }}>
      {/* Dark globe background & subtle gridlines */}
      <Sphere fill="#090a0f" stroke="#2D3748" strokeWidth={0.5} />
      <Graticule stroke="#2D3748" strokeWidth={0.5} />
      
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => {
            
            // ⭐️⭐️⭐️ THIS IS THE FIX ⭐️⭐️⭐️
            // We get the 2-letter code (e.g., "US") from the map property 'ISO_A2'
            const countryCode = geo.properties.ISO_A2;
            
            // We look up that 2-letter code (e.g., "US") in our data
            const count = dataLookup[countryCode] || 0;
            
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={colorScale(count, maxCount)} // Use new heatmap color
                stroke="#090a0f" // Dark border for countries
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: "#FFF", outline: 'none', cursor: 'pointer' },
                  pressed: { outline: 'none' },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

export default memo(GeoChart);