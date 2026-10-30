/* =========================================================
   CROP LAND - CORE APPLICATION SCRIPT
   Full Backend (Supabase PostgreSQL & Auth) Connection
   across all pages with robust offline/local fallback.
========================================================= */

// --- DEFAULT SEED DATA ---
const DEFAULT_PRODUCTS = [
    {
        id: "prod-1",
        name: "Sharbati Wheat",
        quantity: "1200",
        price: "32",
        location: "Sehore, Madhya Pradesh",
        quality: "A Grade",
        description: "Premium Sharbati wheat, famous for golden grains, high protein, and soft rotis. Freshly harvested from organic fields.",
        farmer: "Ramesh Kumar"
    },
    {
        id: "prod-2",
        name: "Basmati Rice (1121)",
        quantity: "850",
        price: "78",
        location: "Karnal, Haryana",
        quality: "A Grade",
        description: "Authentic extra long grain aromatic 1121 Basmati rice. Naturally aged 12 months for non-sticky fluffy cooking.",
        farmer: "Gurpreet Singh"
    },
    {
        id: "prod-3",
        name: "Organic Turmeric",
        quantity: "350",
        price: "115",
        location: "Erode, Tamil Nadu",
        quality: "A Grade",
        description: "Pure GI-tagged Erode turmeric fingers with >4.5% natural curcumin. Sun-dried, unpolished, and pesticide-free.",
        farmer: "M. Selvam"
    },
    {
        id: "prod-4",
        name: "Fresh Red Tomatoes",
        quantity: "500",
        price: "24",
        location: "Nashik, Maharashtra",
        quality: "A Grade",
        description: "Plump, ripe hybrid red tomatoes picked at dawn. Firm skin with excellent 5-7 days shelf life for retail.",
        farmer: "Sachin Patil"
    },
    {
        id: "prod-5",
        name: "Jyoti Potatoes",
        quantity: "2200",
        price: "18",
        location: "Agra, Uttar Pradesh",
        quality: "B Grade",
        description: "Graded medium-to-large table potatoes. Ideal for grocery retailers, stored in humidity-controlled bins.",
        farmer: "Virendra Yadav"
    },
    {
        id: "prod-6",
        name: "Alphonso Mangoes (Hapus)",
        quantity: "400",
        price: "180",
        location: "Ratnagiri, Maharashtra",
        quality: "A Grade",
        description: "Certified GI Ratnagiri Alphonso mangoes. Naturally ripened in grass, rich aroma, and unmatched sweetness.",
        farmer: "Dattaram Sawant"
    }
];

const DEFAULT_ORDERS = [
    {
        id: "ORD-101",
        productId: "prod-1",
        productName: "Sharbati Wheat",
        quantity: 200,
        price: 32,
        orderValue: 6400,
        location: "Sehore, Madhya Pradesh",
        quality: "A Grade",
        description: "Premium Sharbati wheat, famous for golden grains.",
        farmerName: "Ramesh Kumar",
        shopkeeperName: "FreshMart Store",
        status: "Pending",
        date: "Today, 10:15 AM",
        commissionRate: null,
        commission: null,
        farmerAmount: null
    },
    {
        id: "ORD-102",
        productId: "prod-4",
        productName: "Fresh Red Tomatoes",
        quantity: 150,
        price: 24,
        orderValue: 3600,
        location: "Nashik, Maharashtra",
        quality: "A Grade",
        description: "Plump, ripe hybrid red tomatoes picked at dawn.",
        farmerName: "Sachin Patil",
        shopkeeperName: "FreshMart Store",
        status: "Ready for Delivery",
        date: "Yesterday, 04:30 PM",
        commissionRate: 1.5,
        commission: 54,
        farmerAmount: 3546
    }
];

const DEFAULT_FARMERS = [
    {
        name: "Ramesh Kumar",
        email: "ramesh@cropland.example",
        password: "password123",
        mobile: "9876543210",
        location: "Sehore, MP"
    }
];

const DEFAULT_SHOPKEEPERS = [
    {
        shopName: "FreshMart Store",
        email: "freshmart@cropland.example",
        password: "password123",
        mobile: "9876501234",
        location: "Pune, MH"
    }
];

// --- SEED INITIALIZER ---
function initializeCropLandData() {
    try {
        if (!localStorage.getItem("farm2landProducts") || JSON.parse(localStorage.getItem("farm2landProducts") || "[]").length === 0) {
            localStorage.setItem("farm2landProducts", JSON.stringify(DEFAULT_PRODUCTS));
        }
        if (!localStorage.getItem("farm2landOrders") || JSON.parse(localStorage.getItem("farm2landOrders") || "[]").length === 0) {
            localStorage.setItem("farm2landOrders", JSON.stringify(DEFAULT_ORDERS));
            localStorage.setItem("farm2landOrderRequest", JSON.stringify(DEFAULT_ORDERS[0]));
        }
        if (!localStorage.getItem("farm2landFarmers")) {
            localStorage.setItem("farm2landFarmers", JSON.stringify(DEFAULT_FARMERS));
            localStorage.setItem("farm2landFarmer", JSON.stringify(DEFAULT_FARMERS[0]));
        }
        if (!localStorage.getItem("farm2landShopkeepers")) {
            localStorage.setItem("farm2landShopkeepers", JSON.stringify(DEFAULT_SHOPKEEPERS));
            localStorage.setItem("farm2landShopkeeper", JSON.stringify(DEFAULT_SHOPKEEPERS[0]));
        }
    } catch (e) {
        console.warn("Storage initialization issue:", e);
    }
}
initializeCropLandData();

// --- DATA ACCESS HELPERS ---
function getProducts() {
    try {
        const stored = localStorage.getItem("farm2landProducts");
        return stored ? JSON.parse(stored) : DEFAULT_PRODUCTS;
    } catch {
        return DEFAULT_PRODUCTS;
    }
}

function saveProducts(products) {
    localStorage.setItem("farm2landProducts", JSON.stringify(products));
}

function getOrders() {
    try {
        const stored = localStorage.getItem("farm2landOrders");
        return stored ? JSON.parse(stored) : DEFAULT_ORDERS;
    } catch {
        return DEFAULT_ORDERS;
    }
}

function saveOrders(orders) {
    localStorage.setItem("farm2landOrders", JSON.stringify(orders));
    if (orders.length > 0) {
        localStorage.setItem("farm2landOrderRequest", JSON.stringify(orders[0]));
    }
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("farm2landCurrentUser") || "null");
    } catch {
        return null;
    }
}

function setCurrentUser(user) {
    localStorage.setItem("farm2landCurrentUser", JSON.stringify(user));
}

function logout() {
    localStorage.removeItem("farm2landCurrentUser");
    if (window.cropLandSupabase) {
        window.cropLandSupabase.auth.signOut().catch(() => {});
    }
    alert("You have been logged out.");
    window.location.href = "registration.html";
}
window.logout = logout;

// --- COMMISSION CALCULATOR ---
function calculateCommission(orderValue) {
    let rate = 0.05; // 5%
    if (orderValue < 10000) {
        rate = 0.015; // 1.5%
    } else if (orderValue <= 20000) {
        rate = 0.03; // 3%
    }
    const commission = orderValue * rate;
    const farmerAmount = orderValue - commission;
    return {
        ratePercent: (rate * 100).toFixed(1),
        commission: Math.round(commission * 100) / 100,
        farmerAmount: Math.round(farmerAmount * 100) / 100
    };
}

// --- DEMO FILL HELPERS FOR LOGIN ---
function fillFarmerDemo() {
    const nameInput = document.getElementById("loginFarmerName");
    const passInput = document.getElementById("loginFarmerPassword");
    if (nameInput) nameInput.value = "Ramesh Kumar";
    if (passInput) passInput.value = "password123";
}
window.fillFarmerDemo = fillFarmerDemo;

function fillShopkeeperDemo() {
    const shopInput = document.getElementById("loginShopName");
    const passInput = document.getElementById("loginShopPassword");
    if (shopInput) shopInput.value = "FreshMart Store";
    if (passInput) passInput.value = "password123";
}
window.fillShopkeeperDemo = fillShopkeeperDemo;

// --- SAFE SUPABASE CALL WRAPPER ---
async function withSupabaseTimeout(promise, timeoutMs = 2500) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Supabase timeout")), timeoutMs);
    });
    try {
        return await Promise.race([promise, timeout]);
    } finally {
        clearTimeout(timer);
    }
}

// --- BACKEND SYNC HELPERS ---
async function syncProductsFromBackend() {
    if (!window.cropLandSupabase) return null;
    try {
        const { data, error } = await withSupabaseTimeout(
            window.cropLandSupabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false })
        );
        if (!error && Array.isArray(data) && data.length > 0) {
            const mapped = data.map(item => ({
                id: item.id,
                name: item.name,
                quantity: String(item.quantity),
                price: String(item.price),
                location: item.location,
                quality: item.quality || "A Grade",
                description: item.description || "",
                farmer: item.farmer_name || "Crop Land Farmer"
            }));
            saveProducts(mapped);
            return mapped;
        }
    } catch (e) {
        // Backend offline or unreachable
    }
    return null;
}

async function syncOrdersFromBackend() {
    if (!window.cropLandSupabase) return null;
    try {
        const { data, error } = await withSupabaseTimeout(
            window.cropLandSupabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false })
        );
        if (!error && Array.isArray(data) && data.length > 0) {
            const mapped = data.map(o => ({
                id: o.id,
                productId: o.product_id,
                productName: o.product_name,
                quantity: Number(o.quantity),
                price: Number(o.price),
                orderValue: Number(o.order_value || (o.quantity * o.price)),
                farmerName: o.farmer_name || "Crop Land Farmer",
                shopkeeperName: o.shopkeeper_name || "Local Shopkeeper",
                status: o.status || "Pending",
                date: o.created_at ? new Date(o.created_at).toLocaleDateString() : "Recent",
                commissionRate: o.commission_rate,
                commission: o.commission,
                farmerAmount: o.farmer_amount
            }));
            saveOrders(mapped);
            return mapped;
        }
    } catch (e) {
        // Backend offline or unreachable
    }
    return null;
}

/* =========================================================
   DOM READY INITIALIZATIONS
========================================================= */
document.addEventListener("DOMContentLoaded", async function () {

    // --- 0. UPDATE HEADER WITH USER SESSION ---
    const currentUser = getCurrentUser();
    const navs = document.querySelectorAll("header nav");
    navs.forEach(nav => {
        if (currentUser) {
            const accountLinks = nav.querySelectorAll("a[href='registration.html']");
            accountLinks.forEach(link => {
                link.textContent = `${currentUser.name} (${currentUser.role})`;
                link.href = currentUser.role === "farmer" ? "farmer-dashboard.html" : "shopkeeper-dashboard.html";
            });
        }
    });

    // Background sync from backend if online
    syncProductsFromBackend().then(remoteProducts => {
        if (remoteProducts && productContainer) renderProductListing();
        if (remoteProducts && (farmerProductCount || farmerProductListContainer)) renderFarmerListedProducts();
        // Refresh map markers if map is open
        if (remoteProducts && typeof refreshListingMapMarkers === "function") {
            refreshListingMapMarkers();
        }
    });

    syncOrdersFromBackend().then(remoteOrders => {
        if (remoteOrders && farmerOrderContainer) renderFarmerOrders();
        if (remoteOrders && myOrdersContainer) renderShopkeeperMyOrders();
    });

    // --- 1. FARMER DASHBOARD ---
    const farmerProductCount = document.getElementById("farmerProductCount");
    const farmerOrderContainer = document.getElementById("orderRequestContainer");
    const farmerProductListContainer = document.getElementById("farmerProductListContainer");

    function renderFarmerOrders() {
        if (!farmerOrderContainer) return;
        const orders = getOrders();
        if (orders.length === 0) {
            farmerOrderContainer.innerHTML = `<p class="empty-state">No incoming order requests at this moment.</p>`;
            return;
        }

        farmerOrderContainer.innerHTML = orders.map(order => {
            const isPending = order.status === "Pending";
            const isAccepted = order.status === "Accepted";
            const isReady = order.status === "Ready for Delivery";
            const isDelivered = order.status === "Delivered";
            const isRejected = order.status === "Rejected";

            let badgeClass = "badge-pending";
            if (isAccepted) badgeClass = "badge-accepted";
            if (isReady) badgeClass = "badge-ready";
            if (isDelivered) badgeClass = "badge-delivered";
            if (isRejected) badgeClass = "badge-rejected";

            return `
                <div class="order-request-card" style="margin-bottom: 20px;" data-order-id="${order.id}">
                    <span class="status-badge ${badgeClass}">${order.status}</span>
                    <h3>${order.productName}</h3>
                    <p><strong>Order ID:</strong> #${order.id} <small style="color:#80654d;">(${order.date || "Recent"})</small></p>
                    <p><strong>Buyer / Shopkeeper:</strong> ${order.shopkeeperName || "Local Shopkeeper"}</p>
                    <p><strong>Requested Quantity:</strong> ${order.quantity} kg</p>
                    <p><strong>Price per kg:</strong> ₹${order.price}</p>
                    <p><strong>Total Order Value:</strong> ₹${order.orderValue || (order.quantity * order.price)}</p>

                    ${isPending ? `
                        <div class="order-buttons">
                            <button type="button" class="action-btn btn-success" onclick="acceptOrder('${order.id}')">Accept Order</button>
                            <button type="button" class="action-btn btn-danger" onclick="rejectOrder('${order.id}')">Reject</button>
                        </div>
                    ` : ""}

                    ${(isAccepted || isReady || isDelivered) ? `
                        <div class="confirmed-order">
                            <h4>✅ Order Confirmed</h4>
                            <p><strong>CROPLAND Commission (${order.commissionRate || 3}%):</strong> ₹${order.commission != null ? order.commission : 'Calculated'}</p>
                            <p><strong>Farmer Payout:</strong> ₹${order.farmerAmount != null ? order.farmerAmount : (order.orderValue - (order.commission || 0))}</p>
                            ${isAccepted ? `
                                <button type="button" class="action-btn btn-primary" style="margin-top: 10px; width: 100%;" onclick="readyForDelivery('${order.id}')">
                                    Mark Ready for Delivery 🚚
                                </button>
                            ` : ""}
                            ${isReady ? `
                                <p style="color: #0c5460; font-weight: bold; margin-top: 10px;">🚚 Waiting for Shopkeeper delivery confirmation</p>
                            ` : ""}
                            ${isDelivered ? `
                                <p style="color: #155724; font-weight: bold; margin-top: 10px;">📦 Order successfully delivered & settled!</p>
                            ` : ""}
                        </div>
                    ` : ""}

                    ${isRejected ? `
                        <div class="rejected-summary">
                            <p>❌ You rejected this order request.</p>
                        </div>
                    ` : ""}
                </div>
            `;
        }).join("");
    }

    function renderFarmerListedProducts() {
        const products = getProducts();
        if (farmerProductCount) {
            farmerProductCount.textContent = `${products.length} ${products.length === 1 ? "product" : "products"} listed`;
        }
        if (farmerProductListContainer) {
            if (products.length === 0) {
                farmerProductListContainer.innerHTML = `<p class="empty-state">No products listed yet. Use the form below to list your harvest!</p>`;
                return;
            }
            farmerProductListContainer.innerHTML = products.map((prod, idx) => `
                <div class="farmer-product-card">
                    <span class="status-badge badge-accepted">${prod.quality || 'A Grade'}</span>
                    <h3>${prod.name}</h3>
                    <p><strong>Quantity:</strong> ${prod.quantity} kg available</p>
                    <p><strong>Price:</strong> ₹${prod.price} / kg</p>
                    <p><strong>Location:</strong> ${prod.location}</p>
                    <p style="font-size: 12px; color: #777;">${prod.description || ''}</p>
                    <button type="button" class="delete-btn" onclick="deleteFarmerProduct(${idx}, '${prod.id}')">Remove Listing</button>
                </div>
            `).join("");
        }
    }

    if (farmerOrderContainer) {
        renderFarmerOrders();
    }
    if (farmerProductCount || farmerProductListContainer) {
        renderFarmerListedProducts();
    }

    // Window global action handlers for Farmer Orders
    window.acceptOrder = function (orderId) {
        const orders = getOrders();
        const targetOrder = orders.find(o => o.id === orderId) || orders[0];
        if (!targetOrder) return;

        const quantity = Number(targetOrder.quantity);
        const price = Number(targetOrder.price);
        const orderValue = targetOrder.orderValue || (quantity * price);
        const commissionCalc = calculateCommission(orderValue);

        // Update product inventory in stock
        const products = getProducts();
        const prodIndex = products.findIndex(p => p.name.toLowerCase() === targetOrder.productName.toLowerCase());
        if (prodIndex !== -1) {
            const currentStock = Number(products[prodIndex].quantity);
            products[prodIndex].quantity = Math.max(0, currentStock - quantity);
            saveProducts(products);
            // Sync updated stock to backend
            if (window.cropLandSupabase) {
                withSupabaseTimeout(
                    window.cropLandSupabase.from("products").update({ quantity: products[prodIndex].quantity }).eq("name", targetOrder.productName)
                ).catch(() => {});
            }
        }

        // Update Order
        targetOrder.status = "Accepted";
        targetOrder.orderValue = orderValue;
        targetOrder.commissionRate = commissionCalc.ratePercent;
        targetOrder.commission = commissionCalc.commission;
        targetOrder.farmerAmount = commissionCalc.farmerAmount;

        saveOrders(orders);

        // Sync to backend orders table
        if (window.cropLandSupabase) {
            withSupabaseTimeout(
                window.cropLandSupabase.from("orders").update({
                    status: "Accepted",
                    commission_rate: Number(commissionCalc.ratePercent),
                    commission: commissionCalc.commission,
                    farmer_amount: commissionCalc.farmerAmount
                }).eq("id", targetOrder.id)
            ).catch(() => {});
        }

        alert(`Order #${targetOrder.id} accepted! Commission: ₹${commissionCalc.commission}. Net Payout: ₹${commissionCalc.farmerAmount}`);
        renderFarmerOrders();
        renderFarmerListedProducts();
    };

    window.rejectOrder = function (orderId) {
        const orders = getOrders();
        const targetOrder = orders.find(o => o.id === orderId) || orders[0];
        if (!targetOrder) return;

        targetOrder.status = "Rejected";
        saveOrders(orders);

        if (window.cropLandSupabase) {
            withSupabaseTimeout(
                window.cropLandSupabase.from("orders").update({ status: "Rejected" }).eq("id", targetOrder.id)
            ).catch(() => {});
        }

        alert(`Order #${targetOrder.id} marked as rejected.`);
        renderFarmerOrders();
    };

    window.readyForDelivery = function (orderId) {
        const orders = getOrders();
        const targetOrder = orders.find(o => o.id === orderId) || orders[0];
        if (!targetOrder) return;

        targetOrder.status = "Ready for Delivery";
        saveOrders(orders);

        if (window.cropLandSupabase) {
            withSupabaseTimeout(
                window.cropLandSupabase.from("orders").update({ status: "Ready for Delivery" }).eq("id", targetOrder.id)
            ).catch(() => {});
        }

        alert(`Order #${targetOrder.id} marked as Ready for Delivery! 🚚`);
        renderFarmerOrders();
    };

    window.deleteFarmerProduct = function (productIndex, productId) {
        if (!confirm("Are you sure you want to remove this product listing?")) return;
        const products = getProducts();
        products.splice(productIndex, 1);
        saveProducts(products);

        if (window.cropLandSupabase && productId) {
            withSupabaseTimeout(
                window.cropLandSupabase.from("products").delete().eq("id", productId)
            ).catch(() => {});
        }

        renderFarmerListedProducts();
    };

    // --- 2. ADD PRODUCT (FARMER DASHBOARD & LISTING PAGE) ---
    const addProductBtn = document.getElementById("addProductBtn");
    if (addProductBtn) {
        addProductBtn.addEventListener("click", async function () {
            const nameEl = document.getElementById("listingProductName") || document.querySelector(".product-form input[type='text']");
            const qtyEl = document.getElementById("listingQuantity") || document.querySelector(".product-form input[type='number']");
            const priceEl = document.getElementById("listingPrice") || document.querySelectorAll(".product-form input[type='number']")[1];
            const locEl = document.getElementById("listingLocation") || document.querySelectorAll(".product-form input[type='text']")[1];
            const qualEl = document.getElementById("listingQuality") || document.querySelector(".product-form select");
            const descEl = document.getElementById("listingDescription") || document.querySelector(".product-form textarea");

            const productName = nameEl ? nameEl.value.trim() : "";
            const quantity = qtyEl ? qtyEl.value.trim() : "";
            const price = priceEl ? priceEl.value.trim() : "";
            const location = locEl ? locEl.value.trim() : "";
            const quality = qualEl ? qualEl.value : "A Grade";
            const description = descEl ? descEl.value.trim() : "";

            if (!productName || !quantity || !price || !location) {
                alert("Please fill all required product details: Name, Quantity, Price, and Location.");
                return;
            }

            const currentUser = getCurrentUser();
            const newProduct = {
                id: "prod-" + Date.now(),
                name: productName,
                quantity: quantity,
                price: price,
                location: location,
                quality: quality === "Select quality grade" ? "A Grade" : quality,
                description: description || "Fresh harvest from local farm.",
                farmer: currentUser ? currentUser.name : "Crop Land Farmer"
            };

            const products = getProducts();
            products.unshift(newProduct);
            saveProducts(products);
            localStorage.setItem("farm2landProduct", JSON.stringify(newProduct));

            // Backend Supabase insert
            if (window.cropLandSupabase) {
                withSupabaseTimeout(
                    window.cropLandSupabase.from("products").insert({
                        name: newProduct.name,
                        quantity: Number(newProduct.quantity),
                        price: Number(newProduct.price),
                        location: newProduct.location,
                        quality: newProduct.quality,
                        description: newProduct.description,
                        farmer_name: newProduct.farmer
                    })
                ).catch(() => {});
            }

            alert(`Product "${productName}" added successfully to the marketplace!`);

            if (nameEl) nameEl.value = "";
            if (qtyEl) qtyEl.value = "";
            if (priceEl) priceEl.value = "";
            if (locEl) locEl.value = "";
            if (descEl) descEl.value = "";

            if (window.location.pathname.includes("farmer-dashboard.html")) {
                renderFarmerListedProducts();
            } else if (window.location.pathname.includes("product-listing.html")) {
                renderProductListing();
            } else {
                window.location.href = "product-listing.html";
            }
        });
    }

    // --- 3. PRODUCT LISTING PAGE ---
    const productContainer = document.getElementById("productContainer");
    const searchInput = document.getElementById("productSearchInput");
    const qualityFilter = document.getElementById("qualityFilterSelect");

    function renderProductListing() {
        if (!productContainer) return;
        const products = getProducts();
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const selectedQuality = qualityFilter ? qualityFilter.value : "";

        const filtered = products.filter(item => {
            const matchesSearch = !searchTerm ||
                item.name.toLowerCase().includes(searchTerm) ||
                item.location.toLowerCase().includes(searchTerm) ||
                (item.description && item.description.toLowerCase().includes(searchTerm));
            const matchesQuality = !selectedQuality || item.quality === selectedQuality;
            return matchesSearch && matchesQuality;
        });

        if (filtered.length === 0) {
            productContainer.innerHTML = `<p class="empty-state">No products match your search. Try different keywords or reset filters.</p>`;
            return;
        }

        productContainer.innerHTML = filtered.map((product) => `
            <div class="product-card">
                <span class="status-badge badge-accepted">${product.quality || "A Grade"}</span>
                <h2>${product.name}</h2>
                <p><strong>Available:</strong> ${product.quantity} kg</p>
                <p><strong>Price:</strong> ₹${product.price} / kg</p>
                <p><strong>Location:</strong> ${product.location}</p>
                <p><strong>Farmer:</strong> ${product.farmer || "Direct Farmer"}</p>
                <p style="color: #66503c; font-size: 13px; line-height: 1.4;">${product.description || "Farm fresh harvest."}</p>
                <button type="button" class="view-product-button" data-product-id="${product.id}">
                    View Details &amp; Order
                </button>
            </div>
        `).join("");

        productContainer.querySelectorAll(".view-product-button").forEach(button => {
            button.addEventListener("click", function () {
                const prodId = button.dataset.productId;
                const selected = products.find(p => p.id === prodId) || products[0];
                localStorage.setItem("farm2landProduct", JSON.stringify(selected));
                window.location.href = `product-details.html?id=${encodeURIComponent(selected.id)}`;
            });
        });
    }

    if (productContainer) {
        renderProductListing();
        if (searchInput) searchInput.addEventListener("input", renderProductListing);
        if (qualityFilter) qualityFilter.addEventListener("change", renderProductListing);
    }

    // --- 4. PRODUCT DETAILS PAGE ---
    const productDetailsContainer = document.getElementById("productDetails");
    if (productDetailsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const paramId = urlParams.get("id");
        const products = getProducts();

        let product = null;
        if (paramId) {
            product = products.find(p => p.id === paramId);
        }
        if (!product) {
            const saved = localStorage.getItem("farm2landProduct");
            if (saved) {
                try { product = JSON.parse(saved); } catch {}
            }
        }
        if (!product && products.length > 0) {
            product = products[0];
        }

        if (product) {
            localStorage.setItem("farm2landProduct", JSON.stringify(product));
            const inStock = Number(product.quantity) > 0;
            const related = products.filter(p => p.id !== product.id).slice(0, 3);

            productDetailsContainer.innerHTML = `
                <div class="details-card">
                    <div class="details-info">
                        <span class="details-badge">Direct from Crop Land Verified Farmer</span>
                        <h1>${product.name}</h1>
                        <p><strong>Farmer:</strong> ${product.farmer || "Crop Land Farmer"}</p>
                        <p><strong>Location:</strong> ${product.location}</p>
                        <p><strong>Available Quantity:</strong> ${product.quantity} kg</p>
                        <p><strong>Stock Status:</strong> ${inStock ? "🟢 In Stock" : "🔴 Out of Stock"}</p>
                        <p><strong>Price per kg:</strong> ₹${product.price}</p>
                        <p><strong>Quality Grade:</strong> ${product.quality || "A Grade"}</p>
                        <p><strong>Description:</strong> ${product.description || "Fresh local harvest."}</p>

                        ${inStock ? `
                            <div style="margin-top: 25px; padding: 20px; background: #fffaf2; border: 1px solid #dfc9aa; border-radius: 12px;">
                                <label for="requiredQuantity" style="font-weight: bold; color: #4b2e17; display: block; margin-bottom: 8px;">
                                    Required Quantity (kg)
                                </label>
                                <input type="number" id="requiredQuantity" placeholder="Enter quantity (e.g. 100)"
                                       min="1" max="${product.quantity}" style="width: 100%; padding: 12px; border: 1px solid #d5bea0; border-radius: 7px; font-size: 15px;"
                                       oninput="calculateEstimatedOrderValue(${product.price})">
                                
                                <p id="estimatedOrderValue" style="margin-top: 15px; font-size: 16px; color: #28543f;">
                                    <strong>Estimated Order Value:</strong> ₹0
                                </p>

                                <button type="button" class="action-btn btn-primary" style="width: 100%; margin-top: 15px; padding: 14px; font-size: 16px;" onclick="requestOrder()">
                                    Request Order Directly &rarr;
                                </button>
                            </div>
                        ` : `
                            <p style="padding: 15px; background: #fff3f0; border: 1px solid #d8b0a8; border-radius: 8px; color: #721c24;">
                                ⚠️ This product is currently out of stock. Check back later or browse other listings.
                            </p>
                        `}

                        <!-- LOCATION MAP -->
                        <span class="map-label">📍 Farm Location Map</span>
                        <div id="productMap"></div>

                        ${related.length > 0 ? `
                            <section class="related-products">
                                <h2>More fresh harvest from marketplace</h2>
                                <div class="related-product-list">
                                    ${related.map(item => `
                                        <a href="product-details.html?id=${encodeURIComponent(item.id)}" class="related-product">
                                            <strong>${item.name}</strong>
                                            <span>₹${item.price} / kg · ${item.location}</span>
                                        </a>
                                    `).join("")}
                                </div>
                            </section>
                        ` : ""}
                    </div>
                </div>
            `;

            // Init map after HTML is injected (map.js handles geocoding)
            if (typeof initProductDetailMap === "function") {
                initProductDetailMap(product.location, product.name, product.price, product.farmer);
            }
        } else {
            productDetailsContainer.innerHTML = `
                <div class="details-card empty-details">
                    <h1>No product selected</h1>
                    <p>Choose a product from the marketplace to view details and start an order.</p>
                    <a href="product-listing.html" class="back-link">Browse Marketplace &rarr;</a>
                </div>
            `;
        }
    }

    // --- 5. REQUEST ORDER FUNCTION ---
    window.calculateEstimatedOrderValue = function (price) {
        const qtyInput = document.getElementById("requiredQuantity");
        const qty = qtyInput ? Number(qtyInput.value) : 0;
        const total = qty > 0 ? (qty * Number(price)) : 0;
        const valEl = document.getElementById("estimatedOrderValue");
        if (valEl) {
            valEl.innerHTML = `<strong>Estimated Order Value:</strong> ₹${total.toLocaleString()}`;
        }
    };

    window.requestOrder = function () {
        const saved = localStorage.getItem("farm2landProduct");
        if (!saved) {
            alert("Product information not found.");
            return;
        }
        const product = JSON.parse(saved);
        const qtyInput = document.getElementById("requiredQuantity");
        const reqQty = qtyInput ? Number(qtyInput.value) : 0;

        if (!reqQty || reqQty <= 0) {
            alert("Please enter a valid quantity greater than zero.");
            return;
        }
        if (reqQty > Number(product.quantity)) {
            alert(`Requested quantity (${reqQty} kg) exceeds available stock (${product.quantity} kg).`);
            return;
        }

        const currentUser = getCurrentUser();
        const buyerName = currentUser ? currentUser.name : "FreshMart Store";
        const orderValue = reqQty * Number(product.price);

        const newOrder = {
            id: "ORD-" + Math.floor(100 + Math.random() * 900),
            productId: product.id,
            productName: product.name,
            quantity: reqQty,
            price: Number(product.price),
            orderValue: orderValue,
            location: product.location,
            quality: product.quality,
            description: product.description,
            farmerName: product.farmer || "Crop Land Farmer",
            shopkeeperName: buyerName,
            status: "Pending",
            date: "Just now",
            commissionRate: null,
            commission: null,
            farmerAmount: null
        };

        const orders = getOrders();
        orders.unshift(newOrder);
        saveOrders(orders);

        // Backend sync for order creation
        if (window.cropLandSupabase) {
            withSupabaseTimeout(
                window.cropLandSupabase.from("orders").insert({
                    id: newOrder.id,
                    product_name: newOrder.productName,
                    quantity: newOrder.quantity,
                    price: newOrder.price,
                    order_value: newOrder.orderValue,
                    farmer_name: newOrder.farmerName,
                    shopkeeper_name: newOrder.shopkeeperName,
                    status: "Pending"
                })
            ).catch(() => {});
        }

        alert(`Order request for ${reqQty} kg of ${product.name} has been sent to the farmer! You can track it under My Orders.`);
        window.location.href = "my-orders.html";
    };

    // --- 6. SHOPKEEPER DASHBOARD & MY ORDERS ---
    const shopkeeperWelcome = document.getElementById("shopkeeperWelcome");
    const shopkeeperOrderStats = document.getElementById("shopkeeperOrderStats");
    const shopkeeperRecentOrders = document.getElementById("shopkeeperRecentOrders");

    if (shopkeeperWelcome && currentUser) {
        shopkeeperWelcome.textContent = `Welcome, ${currentUser.name}! 🏪`;
    }

    if (shopkeeperOrderStats || shopkeeperRecentOrders) {
        const orders = getOrders();
        const pendingCount = orders.filter(o => o.status === "Pending").length;
        const deliveredCount = orders.filter(o => o.status === "Delivered").length;
        const totalSpend = orders
            .filter(o => o.status === "Accepted" || o.status === "Ready for Delivery" || o.status === "Delivered")
            .reduce((sum, o) => sum + (o.orderValue || 0), 0);

        if (shopkeeperOrderStats) {
            shopkeeperOrderStats.innerHTML = `
                <strong>${orders.length}</strong> total orders · 
                <span style="color:#b8860b;">${pendingCount} pending</span> · 
                <span style="color:#28a745;">${deliveredCount} delivered</span><br>
                Total volume: ₹${totalSpend.toLocaleString()}
            `;
        }

        if (shopkeeperRecentOrders) {
            if (orders.length === 0) {
                shopkeeperRecentOrders.innerHTML = `<p class="empty-state">No orders placed yet. Browse products to make your first order.</p>`;
            } else {
                shopkeeperRecentOrders.innerHTML = orders.slice(0, 3).map(order => `
                    <div class="my-order-card" style="width: 100%; max-width: 100%;">
                        <span class="status-badge badge-${order.status === 'Delivered' ? 'delivered' : order.status === 'Ready for Delivery' ? 'ready' : order.status === 'Accepted' ? 'accepted' : order.status === 'Rejected' ? 'rejected' : 'pending'}">${order.status}</span>
                        <h2>${order.productName}</h2>
                        <p><strong>Quantity:</strong> ${order.quantity} kg @ ₹${order.price}/kg</p>
                        <p><strong>Total Value:</strong> ₹${order.orderValue}</p>
                        <p><strong>Farmer:</strong> ${order.farmerName || 'Crop Land Farmer'}</p>
                    </div>
                `).join("");
            }
        }
    }

    const myOrdersContainer = document.getElementById("myOrdersContainer");
    function renderShopkeeperMyOrders() {
        if (!myOrdersContainer) return;
        const orders = getOrders();
        if (orders.length === 0) {
            myOrdersContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No orders placed yet</h3>
                    <p>Start connecting with farmers and order direct produce.</p>
                    <a href="product-listing.html" class="dashboard-action-primary" style="display:inline-block; margin-top: 15px;">Explore Products &rarr;</a>
                </div>
            `;
            return;
        }

        myOrdersContainer.innerHTML = orders.map(order => {
            const isPending = order.status === "Pending";
            const isAccepted = order.status === "Accepted";
            const isReady = order.status === "Ready for Delivery";
            const isDelivered = order.status === "Delivered";
            const isRejected = order.status === "Rejected";

            let badgeClass = "badge-pending";
            if (isAccepted) badgeClass = "badge-accepted";
            if (isReady) badgeClass = "badge-ready";
            if (isDelivered) badgeClass = "badge-delivered";
            if (isRejected) badgeClass = "badge-rejected";

            return `
                <div class="my-order-card" style="margin-bottom: 25px; width: 100%; max-width: 600px;" data-order-id="${order.id}">
                    <span class="status-badge ${badgeClass}">${order.status}</span>
                    <h2>${order.productName}</h2>
                    <p><strong>Order ID:</strong> #${order.id} <span style="color:#80654d; font-size:12px;">(${order.date || "Recent"})</span></p>
                    <p><strong>Farmer:</strong> ${order.farmerName || "Crop Land Farmer"} · ${order.location || ""}</p>
                    <p><strong>Quantity:</strong> ${order.quantity} kg</p>
                    <p><strong>Unit Price:</strong> ₹${order.price} / kg</p>
                    <p><strong>Total Order Value:</strong> ₹${order.orderValue || (order.quantity * order.price)}</p>

                    ${isPending ? `
                        <div style="background: #fffdf5; border-left: 4px solid #f0ad4e; padding: 12px; margin-top: 15px; border-radius: 4px;">
                            <p style="margin: 0; font-size: 14px; color: #8a6d3b;">⏳ Request sent. Waiting for farmer acceptance.</p>
                        </div>
                    ` : ""}

                    ${isAccepted ? `
                        <div style="background: #f4faf4; border-left: 4px solid #5cb85c; padding: 12px; margin-top: 15px; border-radius: 4px;">
                            <p style="margin: 0; font-size: 14px; color: #3c763d;">✅ Farmer has accepted your order. Produce is being packed.</p>
                        </div>
                    ` : ""}

                    ${isReady ? `
                        <div style="background: #eef9fc; border: 1px solid #bce8f1; padding: 16px; margin-top: 15px; border-radius: 8px;">
                            <h4 style="color: #31708f; margin-bottom: 8px;">🚚 Out for Delivery</h4>
                            <p style="margin-bottom: 12px; font-size: 14px; color: #31708f;">The harvest is on the way to your shop. Once received, please confirm below:</p>
                            <button type="button" class="action-btn btn-success" style="width: 100%;" onclick="markAsDelivered('${order.id}')">
                                Mark as Received &amp; Delivered ✅
                            </button>
                        </div>
                    ` : ""}

                    ${isDelivered ? `
                        <div class="delivered-summary" style="margin-top: 15px;">
                            <h3>📦 Order Delivered Successfully! ✅</h3>
                            <p>You received ${order.quantity} kg of ${order.productName}.</p>
                            <p><strong>Total Paid:</strong> ₹${order.orderValue}</p>
                        </div>
                    ` : ""}

                    ${isRejected ? `
                        <div class="rejected-summary" style="margin-top: 15px;">
                            <h3>❌ Order Rejected</h3>
                            <p>The farmer was unable to fulfill this request. Please browse other available products.</p>
                            <a href="product-listing.html" style="font-weight: bold; color: #7b4a21;">Find alternatives &rarr;</a>
                        </div>
                    ` : ""}
                </div>
            `;
        }).join("");
    }

    if (myOrdersContainer) {
        renderShopkeeperMyOrders();
    }

    window.markAsDelivered = function (orderId) {
        const orders = getOrders();
        const targetOrder = orders.find(o => o.id === orderId) || orders[0];
        if (!targetOrder) return;

        targetOrder.status = "Delivered";
        saveOrders(orders);

        if (window.cropLandSupabase) {
            withSupabaseTimeout(
                window.cropLandSupabase.from("orders").update({ status: "Delivered" }).eq("id", targetOrder.id)
            ).catch(() => {});
        }

        alert(`Order #${targetOrder.id} marked as delivered! Thank you for trading on Crop Land.`);
        renderShopkeeperMyOrders();
    };

    // --- 7. AUTHENTICATION: REGISTRATION & LOGIN ---
    const farmerRegForm = document.getElementById("farmerRegistrationForm");
    if (farmerRegForm) {
        farmerRegForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const name = document.getElementById("farmerName").value.trim();
            const email = document.getElementById("farmerEmail").value.trim();
            const password = document.getElementById("farmerPassword").value;
            const mobileInput = farmerRegForm.querySelector("input[type='tel']");
            const mobile = mobileInput ? mobileInput.value.trim() : "";

            if (!name || !email || !password) {
                alert("Please fill all required fields.");
                return;
            }

            let farmers = JSON.parse(localStorage.getItem("farm2landFarmers") || "[]");
            farmers.push({ name, email, password, mobile });
            localStorage.setItem("farm2landFarmers", JSON.stringify(farmers));
            localStorage.setItem("farm2landFarmer", JSON.stringify({ name, email, password, mobile }));
            setCurrentUser({ role: "farmer", name, email });

            // Backend Supabase auth & profile creation
            if (window.cropLandSupabase) {
                withSupabaseTimeout(window.cropLandSupabase.auth.signUp({ email, password }))
                    .then(res => {
                        if (res?.data?.user) {
                            window.cropLandSupabase.from("profiles").upsert({
                                id: res.data.user.id,
                                role: "farmer",
                                display_name: name,
                                email
                            }).catch(() => {});
                        }
                    })
                    .catch(() => {});
            }

            alert(`Welcome to Crop Land, ${name}! Your farmer account has been created.`);
            window.location.href = "farmer-dashboard.html";
        });
    }

    const shopkeeperRegForm = document.getElementById("shopkeeperRegistrationForm");
    if (shopkeeperRegForm) {
        shopkeeperRegForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const shopName = document.getElementById("shopName").value.trim();
            const email = document.getElementById("shopEmail").value.trim();
            const password = document.getElementById("shopPassword").value;
            const mobileInput = shopkeeperRegForm.querySelector("input[type='tel']");
            const mobile = mobileInput ? mobileInput.value.trim() : "";

            if (!shopName || !email || !password) {
                alert("Please fill all required fields.");
                return;
            }

            let shopkeepers = JSON.parse(localStorage.getItem("farm2landShopkeepers") || "[]");
            shopkeepers.push({ shopName, email, password, mobile });
            localStorage.setItem("farm2landShopkeepers", JSON.stringify(shopkeepers));
            localStorage.setItem("farm2landShopkeeper", JSON.stringify({ shopName, email, password, mobile }));
            setCurrentUser({ role: "shopkeeper", name: shopName, email });

            // Backend Supabase auth & profile creation
            if (window.cropLandSupabase) {
                withSupabaseTimeout(window.cropLandSupabase.auth.signUp({ email, password }))
                    .then(res => {
                        if (res?.data?.user) {
                            window.cropLandSupabase.from("profiles").upsert({
                                id: res.data.user.id,
                                role: "shopkeeper",
                                display_name: shopName,
                                email
                            }).catch(() => {});
                        }
                    })
                    .catch(() => {});
            }

            alert(`Welcome to Crop Land, ${shopName}! Your shopkeeper account has been created.`);
            window.location.href = "shopkeeper-dashboard.html";
        });
    }

    const farmerLoginForm = document.getElementById("farmerLoginForm");
    if (farmerLoginForm) {
        farmerLoginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const name = document.getElementById("loginFarmerName").value.trim();
            const password = document.getElementById("loginFarmerPassword").value;
            const msgEl = document.getElementById("farmerLoginMessage");

            const farmers = JSON.parse(localStorage.getItem("farm2landFarmers") || "[]");
            const matched = farmers.find(f => f.name.toLowerCase() === name.toLowerCase() && f.password === password) ||
                (DEFAULT_FARMERS[0].name.toLowerCase() === name.toLowerCase() && DEFAULT_FARMERS[0].password === password ? DEFAULT_FARMERS[0] : null);

            if (matched) {
                setCurrentUser({ role: "farmer", name: matched.name, email: matched.email });
                if (msgEl) msgEl.textContent = "";
                window.location.href = "farmer-dashboard.html";
                return;
            }

            // Backend Supabase login attempt
            if (window.cropLandSupabase) {
                try {
                    const { data: profile } = await withSupabaseTimeout(
                        window.cropLandSupabase.from("profiles").select("email").eq("display_name", name).eq("role", "farmer").maybeSingle()
                    );
                    if (profile?.email) {
                        const { error } = await withSupabaseTimeout(
                            window.cropLandSupabase.auth.signInWithPassword({ email: profile.email, password })
                        );
                        if (!error) {
                            setCurrentUser({ role: "farmer", name, email: profile.email });
                            window.location.href = "farmer-dashboard.html";
                            return;
                        }
                    }
                } catch {}
            }

            if (msgEl) {
                msgEl.textContent = "Farmer account not found or password incorrect. Try Demo: Ramesh Kumar / password123";
            } else {
                alert("Farmer account not found or password incorrect.");
            }
        });
    }

    const shopkeeperLoginForm = document.getElementById("shopkeeperLoginForm");
    if (shopkeeperLoginForm) {
        shopkeeperLoginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const shopName = document.getElementById("loginShopName").value.trim();
            const password = document.getElementById("loginShopPassword").value;
            const msgEl = document.getElementById("shopkeeperLoginMessage");

            const shopkeepers = JSON.parse(localStorage.getItem("farm2landShopkeepers") || "[]");
            const matched = shopkeepers.find(s => s.shopName.toLowerCase() === shopName.toLowerCase() && s.password === password) ||
                (DEFAULT_SHOPKEEPERS[0].shopName.toLowerCase() === shopName.toLowerCase() && DEFAULT_SHOPKEEPERS[0].password === password ? DEFAULT_SHOPKEEPERS[0] : null);

            if (matched) {
                setCurrentUser({ role: "shopkeeper", name: matched.shopName, email: matched.email });
                if (msgEl) msgEl.textContent = "";
                window.location.href = "shopkeeper-dashboard.html";
                return;
            }

            // Backend Supabase login attempt
            if (window.cropLandSupabase) {
                try {
                    const { data: profile } = await withSupabaseTimeout(
                        window.cropLandSupabase.from("profiles").select("email").eq("display_name", shopName).eq("role", "shopkeeper").maybeSingle()
                    );
                    if (profile?.email) {
                        const { error } = await withSupabaseTimeout(
                            window.cropLandSupabase.auth.signInWithPassword({ email: profile.email, password })
                        );
                        if (!error) {
                            setCurrentUser({ role: "shopkeeper", name: shopName, email: profile.email });
                            window.location.href = "shopkeeper-dashboard.html";
                            return;
                        }
                    }
                } catch {}
            }

            if (msgEl) {
                msgEl.textContent = "Shopkeeper account not found or password incorrect. Try Demo: FreshMart Store / password123";
            } else {
                alert("Shopkeeper account not found or password incorrect.");
            }
        });
    }

});
