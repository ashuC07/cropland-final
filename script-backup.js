document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       FARMER DASHBOARD
    ========================= */

    const addProductBtn = document.getElementById("addProductBtn");

    if (addProductBtn) {

        addProductBtn.addEventListener("click", function () {

            const inputs =
                document.querySelectorAll(".product-form input");

            const productName = inputs[0].value;
            const quantity = inputs[1].value;
            const price = inputs[2].value;
            const location = inputs[3].value;

            const quality =
                document.querySelector(".product-form select").value;

            const description =
                document.querySelector(".product-form textarea").value;


            if (
                productName === "" ||
                quantity === "" ||
                price === "" ||
                location === ""
            ) {

                alert("Please fill all required product details.");

                return;
            }


            const product = {

                name: productName,

                quantity: quantity,

                price: price,

                location: location,

                quality: quality,

                description: description

            };


            localStorage.setItem(
                "farm2landProduct",
                JSON.stringify(product)
            );


            alert("Product added successfully!");

            window.location.href = "product-listing.html";

        });

    }


    /* =========================
       PRODUCT LISTING
    ========================= */

    const productContainer =
        document.getElementById("productContainer");


    if (productContainer) {

        const savedProduct =
            localStorage.getItem("farm2landProduct");


        if (savedProduct) {

            const product =
                JSON.parse(savedProduct);


            productContainer.innerHTML = `

                <div class="product-card">

                    <h2>${product.name}</h2>

                    <p>
                        <strong>Quantity:</strong>
                        ${product.quantity} kg
                    </p>

                    <p>
                        <strong>Price:</strong>
                        ₹${product.price} / kg
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${product.location}
                    </p>

                    <p>
                        <strong>Quality:</strong>
                        ${product.quality}
                    </p>

                    <p>
                        <strong>Description:</strong>
                        ${product.description}
                    </p>

                    <button
    type="button"
    onclick="window.location.href='product-details.html'">

    View Details

</button>
                    
    

                </div>

            `;

        } else {

            productContainer.innerHTML = `
                <p>No products available yet.</p>
            `;

        }

    }

});
/* =========================
   PRODUCT LISTING
========================= */

const productContainer =
    document.getElementById("productContainer");

if (productContainer) {

    const savedProduct =
        localStorage.getItem("farm2landProduct");

    if (savedProduct) {

        const product =
            JSON.parse(savedProduct);

        productContainer.innerHTML = `

            <div class="product-card">

                <h2>${product.name}</h2>

                <p>
                    <strong>Available:</strong>
                    ${product.quantity} kg
                </p>

                <p>
                    <strong>Price:</strong>
                    ₹${product.price} / kg
                </p>

                <p>
                    <strong>Location:</strong>
                    ${product.location}
                </p>

                <p>
                    <strong>Quality:</strong>
                    ${product.quality}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${product.description}
                </p>

                <button
    type="button"
    onclick="window.location.href='product-details.html'">

    View Details

</button>
            </div>

        `;

    } else {

        productContainer.innerHTML = `
            <p>No products available yet.</p>
        `;

    }

}


   function requestOrder() {

    const savedProduct =
        localStorage.getItem("farm2landProduct");

    if (!savedProduct) {

        alert("Product information not found.");
        return;

    }

    const product = JSON.parse(savedProduct);


    const requiredQuantity =
        document.getElementById("requiredQuantity").value;


    if (
        requiredQuantity === "" ||
        Number(requiredQuantity) <= 0
    ) {

        alert("Please enter a valid quantity.");
        return;

    }


    if (
        Number(requiredQuantity) >
        Number(product.quantity)
    ) {

        alert(
            "Required quantity cannot be greater than available quantity!"
        );

        return;

    }


    const orderRequest = {

        productName: product.name,

        // Shopkeeper requested quantity
        quantity: requiredQuantity,

        price: product.price,

        location: product.location,

        quality: product.quality,

        description: product.description,

        status: "Pending"

    };


    localStorage.setItem(
        "farm2landOrderRequest",
        JSON.stringify(orderRequest)
    );


    alert(
        "Order request sent to the farmer!"
    );


    window.location.href =
        "farmer-dashboard.html";

} 

    



/* =========================
   PRODUCT DETAILS
========================= */

const productDetails =
    document.getElementById("productDetails");

if (productDetails) {

    const savedProduct =
        localStorage.getItem("farm2landProduct");

    if (savedProduct) {

        const product =
            JSON.parse(savedProduct);

        productDetails.innerHTML = `

            <div class="details-card">

                <div class="details-info">

                    <h1>${product.name}</h1>

                    <p>
                        <strong>Farmer:</strong>
                        Farm2Land Farmer
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${product.location}
                    </p>

                    <p>
                        <strong>Quantity Available:</strong>
                        ${product.quantity} kg
                    </p>

                    <p>
    <strong>Stock Status:</strong>

    ${
        Number(product.quantity) > 0
            ? "🟢 In Stock"
            : "🔴 Out of Stock"
    }
</p>


                    <p>
                        <strong>Price per kg:</strong>
                        ₹${product.price}
                    </p>

                    <p>
                        <strong>Quality Grade:</strong>
                        ${product.quality}
                    </p>

                    <p>
                        <strong>Description:</strong>
                        ${product.description}
                    </p>

                    

    ${Number(product.quantity) > 0
    ? `

        <label>
            Required Quantity (kg)
        </label>

        <input
            type="number"
            id="requiredQuantity"
            placeholder="Enter quantity you need"
            min="1"
            max="${product.quantity}"
            oninput="calculateEstimatedOrderValue(${product.price})">

        <p id="estimatedOrderValue">
            <strong>Estimated Order Value:</strong> ₹0
        </p>

        <button
            type="button"
            onclick="requestOrder()">

            Request Order

        </button>

      `

    : `

        <p>
            ⚠️ This product is currently out of stock.
        </p>

      `
}
                    

                </div>

            </div>

        `;

    }

}
/* =========================
   FARMER ORDER REQUEST
========================= */

const orderRequestContainer =
    document.getElementById("orderRequestContainer");

if (orderRequestContainer) {

    const savedRequest =
        localStorage.getItem("farm2landOrderRequest");

    if (savedRequest) {

        const order =
            JSON.parse(savedRequest);

        orderRequestContainer.innerHTML = `

    <div class="order-request-card">

        <h3>${order.productName}</h3>

        <p>
            <strong>Quantity:</strong>
            ${order.quantity} kg
        </p>

        <p>
            <strong>Price:</strong>
            ₹${order.price} / kg
        </p>

        <p>
            <strong>Order Value:</strong>
            ₹${order.orderValue || "Pending"}
        </p>

        <p>
            <strong>Status:</strong>
            ${order.status}
        </p>

        ${
            order.status === "Pending"

            ? `

            <div class="order-buttons">

                <button onclick="acceptOrder()">
                    Accept
                </button>

                <button onclick="rejectOrder()">
                    Reject
                </button>

            </div>

            `

            : `

            <div class="confirmed-order">

                <h4>✅ Order Confirmed</h4>

                <p>
                    <strong>Order Value:</strong>
                    ₹${order.orderValue}
                </p>

                <p>
                    <strong>CROPLAND Commission:</strong>
                    ${order.commissionRate}%
                </p>

                <p>
                    <strong>CROPLAND Revenue:</strong>
                    ₹${order.commission.toFixed(2)}
                </p>

                <p>
                    <strong>Farmer Amount:</strong>
                    ₹${order.farmerAmount.toFixed(2)}
                </p>

                <button onclick="readyForDelivery()">
    Ready for Delivery 🚚
</button>
            </div>

             `
        }

    </div>

`;

                


    }

}
function acceptOrder() {

    const savedRequest =
        localStorage.getItem("farm2landOrderRequest");

    if (!savedRequest) {
        alert("Order information not found.");
        return;
    }

    const order = JSON.parse(savedRequest);

    // Calculate total order value
    const quantity = Number(order.quantity);
    const price = Number(order.price);

    const orderValue = quantity * price;

    // Calculate CROPLAND commission
    let commissionRate;

    if (orderValue < 10000) {

        commissionRate = 0.015;       // 1.5%

    } else if (orderValue <= 20000) {

        commissionRate = 0.03;        // 3%

    } else {

        commissionRate = 0.05;        // 5%

    }

    const commission =
        orderValue * commissionRate;

    const farmerAmount =
        orderValue - commission;

        // Update available product quantity

const savedProduct =
    localStorage.getItem("farm2landProduct");

if (savedProduct) {

    const product =
        JSON.parse(savedProduct);

    const availableQuantity =
        Number(product.quantity);

    const orderedQuantity =
        Number(order.quantity);

    product.quantity =
        availableQuantity - orderedQuantity;


    localStorage.setItem(
        "farm2landProduct",
        JSON.stringify(product)
    );

}


    // Save calculated values
    order.status = "Accepted";

    order.orderValue = orderValue;

    order.commissionRate =
        commissionRate * 100;

    order.commission = commission;

    order.farmerAmount = farmerAmount;


    localStorage.setItem(
        "farm2landOrderRequest",
        JSON.stringify(order)
    );


    alert("Order accepted successfully!");

    location.reload();

}


function rejectOrder() {

    const savedRequest =
        localStorage.getItem("farm2landOrderRequest");

    if (!savedRequest) {
        return;
    }

    const order = JSON.parse(savedRequest);

    order.status = "Rejected";

    localStorage.setItem(
        "farm2landOrderRequest",
        JSON.stringify(order)
    );

    alert("Order request rejected.");

    location.reload();
}

/* =========================
   SHOPKEEPER MY ORDERS
========================= */

const myOrdersContainer =
    document.getElementById("myOrdersContainer");


if (myOrdersContainer) {

    const savedOrder =
        localStorage.getItem("farm2landOrderRequest");


    if (savedOrder) {

        const order =
            JSON.parse(savedOrder);


        myOrdersContainer.innerHTML = `

            <div class="my-order-card">

                <h2>${order.productName}</h2>

                <p>
                    <strong>Quantity:</strong>
                    ${order.quantity} kg
                </p>

                <p>
                    <strong>Price:</strong>
                    ₹${order.price} / kg
                </p>

                <p>
                    <strong>Order Value:</strong>
                    ₹${order.orderValue || 
                    (order.quantity * order.price)}
                </p>

                <p>
    <strong>Status:</strong>
    ${order.status}
</p>

${order.status === "Rejected"
    ? `
        <div class="rejected-summary">

            <h3>❌ Order Rejected</h3>

            <p>
                The farmer is unable to accept this order.
            </p>

            <p>
                Please browse other available products.
            </p>

        </div>
      `
    : ""
}


${order.status === "Ready for Delivery"
    ? `
        <button onclick="markAsDelivered()">
            Mark as Delivered ✅
        </button>
      `
    : ""
}


${order.status === "Delivered"
    ? `

        <div class="delivered-summary">

            <h3>📦 Order Delivered Successfully! ✅</h3>

            <p>
                Your order has been successfully delivered.
            </p>

            <p>
                <strong>Order Value:</strong>
                ₹${order.orderValue}
            </p>

        </div>

      `
    : ""
}  
            

            </div>

        `;

    }

}

function readyForDelivery() {

    const savedRequest =
        localStorage.getItem("farm2landOrderRequest");

    if (!savedRequest) {
        return;
    }

    const order = JSON.parse(savedRequest);

    order.status = "Ready for Delivery";

    localStorage.setItem(
        "farm2landOrderRequest",
        JSON.stringify(order)
    );

    alert("Order is ready for delivery!");

    location.reload();
}

/* =========================
   SHOPKEEPER REGISTRATION
========================= */

const shopkeeperRegistrationForm =
    document.getElementById("shopkeeperRegistrationForm");

if (shopkeeperRegistrationForm) {

    shopkeeperRegistrationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            alert("Shopkeeper account created successfully!");

            window.location.href =
                "shopkeeper-dashboard.html";

        }
    );

}

/* =========================
   MARK ORDER AS DELIVERED
========================= */

function markAsDelivered() {

    const savedRequest =
        localStorage.getItem("farm2landOrderRequest");

    if (!savedRequest) {
        alert("Order information not found.");
        return;
    }

    const order = JSON.parse(savedRequest);

    order.status = "Delivered";

    localStorage.setItem(
        "farm2landOrderRequest",
        JSON.stringify(order)
    );

    alert("Order marked as delivered successfully! ✅");

    location.reload();
}
/* =========================
   ESTIMATED ORDER VALUE
========================= */

function calculateEstimatedOrderValue(price) {

    const quantity =
        document.getElementById("requiredQuantity").value;

    const estimatedValue =
        Number(quantity) * Number(price);

    document.getElementById(
        "estimatedOrderValue"
    ).innerHTML = `
        <strong>Estimated Order Value:</strong>
        ₹${estimatedValue}
    `;
}