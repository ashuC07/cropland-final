/* =========================================================
   CROP LAND INTERACTIVE MAPS (Leaflet.js & OpenStreetMap)
   100% Free Open-Source Tiles — ZERO API KEY REQUIRED.
   Bulletproof initialization with built-in coordinates,
   interactive pill badges, and automatic size invalidation.
========================================================= */

// --- 1. DEFAULT SEED PRODUCTS WITH EXACT LAT/LON ---
const DEFAULT_MAP_PRODUCTS = [
    {
        id: "prod-1",
        name: "Sharbati Wheat",
        quantity: "1200",
        price: "32",
        location: "Sehore, Madhya Pradesh",
        quality: "A Grade",
        farmer: "Ramesh Kumar",
        lat: 23.2053,
        lon: 77.0850
    },
    {
        id: "prod-2",
        name: "Basmati Rice (1121)",
        quantity: "850",
        price: "78",
        location: "Karnal, Haryana",
        quality: "A Grade",
        farmer: "Gurpreet Singh",
        lat: 29.6857,
        lon: 76.9905
    },
    {
        id: "prod-3",
        name: "Organic Turmeric",
        quantity: "350",
        price: "115",
        location: "Erode, Tamil Nadu",
        quality: "A Grade",
        farmer: "M. Selvam",
        lat: 11.3410,
        lon: 77.7172
    },
    {
        id: "prod-4",
        name: "Fresh Red Tomatoes",
        quantity: "500",
        price: "24",
        location: "Nashik, Maharashtra",
        quality: "A Grade",
        farmer: "Sachin Patil",
        lat: 19.9975,
        lon: 73.7898
    },
    {
        id: "prod-5",
        name: "Jyoti Potatoes",
        quantity: "2200",
        price: "18",
        location: "Agra, Uttar Pradesh",
        quality: "B Grade",
        farmer: "Virendra Yadav",
        lat: 27.1767,
        lon: 78.0081
    },
    {
        id: "prod-6",
        name: "Alphonso Mangoes",
        quantity: "400",
        price: "180",
        location: "Ratnagiri, Maharashtra",
        quality: "A Grade",
        farmer: "Dattaram Sawant",
        lat: 16.9944,
        lon: 73.3000
    }
];

// Comprehensive lookup dictionary for Indian cities & states
const KNOWN_INDIAN_COORDS = {
    "sehore": { lat: 23.2053, lon: 77.0850 },
    "karnal": { lat: 29.6857, lon: 76.9905 },
    "erode": { lat: 11.3410, lon: 77.7172 },
    "nashik": { lat: 19.9975, lon: 73.7898 },
    "agra": { lat: 27.1767, lon: 78.0081 },
    "ratnagiri": { lat: 16.9944, lon: 73.3000 },
    "latur": { lat: 18.4088, lon: 76.5604 },
    "pune": { lat: 18.5204, lon: 73.8567 },
    "nagpur": { lat: 21.1458, lon: 79.0882 },
    "bhopal": { lat: 23.2599, lon: 77.4126 },
    "indore": { lat: 22.7196, lon: 75.8577 },
    "mumbai": { lat: 19.0760, lon: 72.8777 },
    "delhi": { lat: 28.6139, lon: 77.2090 },
    "jaipur": { lat: 26.9124, lon: 75.7873 },
    "ahmedabad": { lat: 23.0225, lon: 72.5714 },
    "varanasi": { lat: 25.3176, lon: 82.9739 },
    "patna": { lat: 25.5941, lon: 85.1376 },
    "amritsar": { lat: 31.6340, lon: 74.8723 },
    "ludhiana": { lat: 30.9010, lon: 75.8573 },
    "bengaluru": { lat: 12.9716, lon: 77.5946 },
    "bangalore": { lat: 12.9716, lon: 77.5946 },
    "hyderabad": { lat: 17.3850, lon: 78.4867 },
    "chennai": { lat: 13.0827, lon: 80.2707 },
    "kolkata": { lat: 22.5726, lon: 88.3639 },
    "madhya pradesh": { lat: 23.4736, lon: 77.9473 },
    "haryana": { lat: 29.0588, lon: 76.0856 },
    "tamil nadu": { lat: 11.1271, lon: 78.6569 },
    "maharashtra": { lat: 19.7515, lon: 75.7139 },
    "uttar pradesh": { lat: 26.8467, lon: 80.9462 },
    "punjab": { lat: 31.1471, lon: 75.3412 },
    "rajasthan": { lat: 27.0238, lon: 74.2179 },
    "gujarat": { lat: 22.2587, lon: 71.1924 },
    "karnataka": { lat: 15.3173, lon: 75.7139 }
};

function getCropEmoji(name) {
    const n = (name || "").toLowerCase();
    if (n.includes("wheat") || n.includes("atta")) return "🌾";
    if (n.includes("rice") || n.includes("basmati")) return "🍚";
    if (n.includes("tomato")) return "🍅";
    if (n.includes("turmeric") || n.includes("haldi")) return "🟡";
    if (n.includes("potato") || n.includes("aloo")) return "🥔";
    if (n.includes("mango") || n.includes("aam")) return "🥭";
    if (n.includes("onion") || n.includes("pyaz")) return "🧅";
    if (n.includes("corn") || n.includes("maize")) return "🌽";
    return "🌱";
}

function resolveCoordinates(locationString) {
    if (!locationString) return { lat: 22.5, lon: 78.5 };
    const lower = locationString.toLowerCase();
    for (const [key, coords] of Object.entries(KNOWN_INDIAN_COORDS)) {
        if (lower.includes(key)) return coords;
    }
    return { lat: 22.5, lon: 78.5 };
}

// --- 2. ENSURE LEAFLET IS LOADED ---
function ensureLeaflet(callback) {
    if (typeof L !== "undefined" && typeof L.map === "function") {
        callback();
        return;
    }

    // Ensure CSS is loaded
    if (!document.querySelector("link[href*='leaflet']")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(link);
    }

    // Ensure JS is loaded
    if (!document.querySelector("script[src*='leaflet']")) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        script.onload = () => callback();
        document.head.appendChild(script);
        return;
    }

    // Poll until window.L is ready
    let attempts = 0;
    const poller = setInterval(() => {
        attempts++;
        if (typeof L !== "undefined" && typeof L.map === "function") {
            clearInterval(poller);
            callback();
        } else if (attempts > 80) { // 8 seconds
            clearInterval(poller);
            console.warn("Leaflet timed out. Rendering fallback view.");
            renderFallbackCards();
        }
    }, 100);
}

// Add 100% free tile layer (ZERO API KEY REQUIRED)
function addTileLayer(mapInstance) {
    // OpenStreetMap standard tile layer — completely free, open-source, NO API KEY
    const osmLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // ESRI World Street Map fallback — completely free, NO API KEY
    const esriLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: '&copy; Esri, DeLorme, NAVTEQ'
    });

    osmLayer.on("tileerror", function () {
        if (!mapInstance.hasLayer(esriLayer)) {
            esriLayer.addTo(mapInstance);
        }
    });

    osmLayer.addTo(mapInstance);
}

// --- 3. HOMEPAGE MAP (index.html) ---
let homeMap = null;

function initHomeMap() {
    const mapEl = document.getElementById("homeLandMap");
    if (!mapEl) return;

    ensureLeaflet(() => {
        if (homeMap) {
            homeMap.invalidateSize();
            return;
        }

        try {
            homeMap = L.map("homeLandMap", {
                center: [22.8, 79.0],
                zoom: 5,
                zoomControl: true,
                scrollWheelZoom: false
            });

            addTileLayer(homeMap);
            populateMapMarkers(homeMap);

            // Invalidate size multiple times to ensure full box is covered
            setTimeout(() => homeMap && homeMap.invalidateSize(), 150);
            setTimeout(() => homeMap && homeMap.invalidateSize(), 500);
            setTimeout(() => homeMap && homeMap.invalidateSize(), 1200);
        } catch (e) {
            console.error("Error creating homeMap:", e);
        }
    });
}
window.initHomeMap = initHomeMap;

// --- 4. PRODUCT LISTING MAP (product-listing.html) ---
let listingMap = null;
let listingMapOpen = true;

function initProductListingMap() {
    const mapEl = document.getElementById("cropLandMap");
    if (!mapEl) return;

    ensureLeaflet(() => {
        if (listingMap) {
            listingMap.invalidateSize();
            return;
        }

        try {
            listingMap = L.map("cropLandMap", {
                center: [22.8, 79.0],
                zoom: 5,
                zoomControl: true,
                scrollWheelZoom: false
            });

            addTileLayer(listingMap);
            populateMapMarkers(listingMap);

            setTimeout(() => listingMap && listingMap.invalidateSize(), 150);
            setTimeout(() => listingMap && listingMap.invalidateSize(), 500);
            setTimeout(() => listingMap && listingMap.invalidateSize(), 1200);
        } catch (e) {
            console.error("Error creating listingMap:", e);
        }
    });
}
window.initProductListingMap = initProductListingMap;

// --- 5. POPULATE MARKERS ---
function populateMapMarkers(targetMap) {
    if (!targetMap || typeof L === "undefined") return;

    // Clear any prior markers
    targetMap.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
            targetMap.removeLayer(layer);
        }
    });

    let products = [];
    try {
        const stored = localStorage.getItem("farm2landProducts");
        products = stored ? JSON.parse(stored) : [];
    } catch {}

    if (!products || products.length === 0) {
        products = DEFAULT_MAP_PRODUCTS;
    }

    const bounds = [];

    products.forEach((product, idx) => {
        const coords = product.lat && product.lon ? { lat: product.lat, lon: product.lon } : resolveCoordinates(product.location);

        // Small offset so crops in same state don't sit on exact same pixel
        const jitterLat = ((idx % 3) - 1) * 0.08;
        const jitterLon = (((idx * 2) % 3) - 1) * 0.08;
        const lat = coords.lat + jitterLat;
        const lon = coords.lon + jitterLon;

        bounds.push([lat, lon]);

        const emoji = getCropEmoji(product.name);
        const inStock = Number(product.quantity) > 0;

        // Custom HTML Pill Marker
        const customIcon = L.divIcon({
            className: "crop-marker-wrapper",
            html: `
                <div class="crop-pill-marker" title="${product.name} - ${product.location}">
                    <span>${emoji}</span>
                    <span>${product.name}</span>
                    <span class="pill-price">₹${product.price}/kg</span>
                </div>
            `,
            iconSize: [140, 32],
            iconAnchor: [70, 16]
        });

        const marker = L.marker([lat, lon], { icon: customIcon }).addTo(targetMap);

        const popupContent = `
            <div style="min-width: 190px;">
                <div class="map-popup-title">${emoji} ${product.name}</div>
                <div style="color: #66503c; font-size: 12px; margin-bottom: 3px;">📍 ${product.location}</div>
                <div style="color: #80654d; font-size: 12px;">👨‍🌾 ${product.farmer || "Direct Farmer"} · <strong>${product.quality || "A Grade"}</strong></div>
                <div class="map-popup-price">₹${product.price} / kg</div>
                <div style="font-size: 12px; color: ${inStock ? '#28a745' : '#dc3545'}; font-weight: bold; margin-bottom: 8px;">
                    ${inStock ? `🟢 ${product.quantity} kg available` : "🔴 Out of stock"}
                </div>
                <a class="map-popup-link" href="product-details.html?id=${encodeURIComponent(product.id || '')}">
                    View Details &amp; Order &rarr;
                </a>
            </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 260 });
    });

    if (bounds.length > 0) {
        targetMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
}
window.populateMapMarkers = populateMapMarkers;

function toggleListingMap() {
    const mapSection = document.getElementById("cropland-map-section");
    const toggleBtn = document.getElementById("mapToggleBtn");
    if (!mapSection) return;

    listingMapOpen = !listingMapOpen;

    if (listingMapOpen) {
        mapSection.style.display = "block";
        if (toggleBtn) {
            toggleBtn.textContent = "🗺 Collapse Map";
            toggleBtn.classList.add("map-open");
        }
        initProductListingMap();
    } else {
        mapSection.style.display = "none";
        if (toggleBtn) {
            toggleBtn.textContent = "🗺 Show Harvest Map";
            toggleBtn.classList.remove("map-open");
        }
    }
}
window.toggleListingMap = toggleListingMap;

// --- 6. PRODUCT DETAIL MAP (product-details.html) ---
let detailMap = null;

function initProductDetailMap(locationString, productName, price, farmerName) {
    const mapEl = document.getElementById("productMap");
    if (!mapEl) return;

    ensureLeaflet(() => {
        if (detailMap) {
            detailMap.remove();
            detailMap = null;
        }

        const coords = resolveCoordinates(locationString);
        const emoji = getCropEmoji(productName);

        try {
            detailMap = L.map("productMap", {
                center: [coords.lat, coords.lon],
                zoom: 11,
                zoomControl: true,
                scrollWheelZoom: false
            });

            addTileLayer(detailMap);

            const customIcon = L.divIcon({
                className: "crop-marker-wrapper",
                html: `
                    <div class="crop-pill-marker" style="background:#28543f; color:white; border-color:#fff; transform:scale(1.15);">
                        <span>${emoji}</span>
                        <span>${productName}</span>
                        <span class="pill-price" style="background:#fff; color:#28543f;">₹${price}/kg</span>
                    </div>
                `,
                iconSize: [160, 36],
                iconAnchor: [80, 18]
            });

            const marker = L.marker([coords.lat, coords.lon], { icon: customIcon }).addTo(detailMap);

            L.circle([coords.lat, coords.lon], {
                radius: 6000,
                color: "#28543f",
                fillColor: "#28543f",
                fillOpacity: 0.12,
                weight: 1.5
            }).addTo(detailMap);

            marker.bindPopup(`
                <div style="min-width: 170px;">
                    <div class="map-popup-title">📍 ${locationString}</div>
                    <div style="font-weight: bold; color: #28543f; margin: 4px 0;">${emoji} ${productName}</div>
                    <div style="color: #66503c; font-size: 12px;">👨‍🌾 ${farmerName || "Crop Land Farmer"}</div>
                    <div class="map-popup-price">₹${price} / kg</div>
                </div>
            `, { maxWidth: 220 }).openPopup();

            setTimeout(() => detailMap && detailMap.invalidateSize(), 200);
            setTimeout(() => detailMap && detailMap.invalidateSize(), 600);
        } catch (e) {
            console.error("Error creating detailMap:", e);
        }
    });
}
window.initProductDetailMap = initProductDetailMap;

// --- 7. FALLBACK IF CDN FAILS COMPLETELY ---
function renderFallbackCards() {
    const containers = [document.getElementById("homeLandMap"), document.getElementById("cropLandMap")];
    containers.forEach(container => {
        if (!container) return;
        container.innerHTML = `
            <div style="padding: 25px; height: 100%; box-sizing: border-box; overflow-y: auto;">
                <h3 style="color: #4b2e17; margin-bottom: 10px;">🌾 Active Harvest Hubs Across India</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
                    ${DEFAULT_MAP_PRODUCTS.map(p => `
                        <div style="background: white; border: 1px solid #dfc9aa; border-radius: 8px; padding: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
                            <div style="font-weight: bold; color: #28543f;">${getCropEmoji(p.name)} ${p.name}</div>
                            <div style="color: #66503c; font-size: 12px;">📍 ${p.location}</div>
                            <div style="font-weight: bold; color: #7b4a21; margin: 4px 0;">₹${p.price} / kg · ${p.quantity} kg</div>
                            <a href="product-details.html?id=${p.id}" style="color: #c96b45; font-size: 12px; font-weight: bold; text-decoration: none;">Order Harvest &rarr;</a>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    });
}

// --- 8. STATUS CHECKER ---
async function checkAndDisplayBackendStatus() {
    const indicators = document.querySelectorAll(".backend-status");
    if (!indicators.length) return;

    if (!window.cropLandSupabase) {
        indicators.forEach(el => {
            el.className = "backend-status offline";
            el.innerHTML = '<span class="backend-status-dot"></span> Local Database Active';
        });
        return;
    }

    try {
        const { error } = await Promise.race([
            window.cropLandSupabase.from("products").select("id").limit(1),
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000))
        ]);
        if (!error) {
            indicators.forEach(el => {
                el.className = "backend-status connected";
                el.innerHTML = '<span class="backend-status-dot"></span> Connected to Supabase Cloud';
            });
        } else {
            throw new Error(error.message);
        }
    } catch {
        indicators.forEach(el => {
            el.className = "backend-status offline";
            el.innerHTML = '<span class="backend-status-dot"></span> Local Database Active';
        });
    }
}
window.checkAndDisplayBackendStatus = checkAndDisplayBackendStatus;

// --- 9. STARTUP DISPATCHER ---
function autoInitCropLandMaps() {
    if (document.getElementById("homeLandMap")) {
        initHomeMap();
    }
    if (document.getElementById("cropLandMap")) {
        initProductListingMap();
    }
    if (document.getElementById("productMap") && !detailMap) {
        let savedProd = null;
        try {
            savedProd = JSON.parse(localStorage.getItem("farm2landProduct"));
        } catch {}
        if (!savedProd && DEFAULT_MAP_PRODUCTS.length > 0) {
            savedProd = DEFAULT_MAP_PRODUCTS[0];
        }
        if (savedProd) {
            initProductDetailMap(savedProd.location, savedProd.name, savedProd.price, savedProd.farmer);
        }
    }
    checkAndDisplayBackendStatus();
}

// Fire on DOM ready AND window load
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(autoInitCropLandMaps, 50);
} else {
    document.addEventListener("DOMContentLoaded", () => setTimeout(autoInitCropLandMaps, 50));
}
window.addEventListener("load", () => setTimeout(autoInitCropLandMaps, 150));
