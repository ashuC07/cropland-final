(() => {
    const products = () => {
        try {
            return JSON.parse(localStorage.getItem("farm2landProducts") || "[]");
        } catch {
            return [];
        }
    };

    const answer = (question) => {
        const text = question.toLowerCase();
        const availableProducts = products();

        if (text.includes("product") || text.includes("available") || text.includes("price")) {
            if (!availableProducts.length) {
                return "No products are listed yet. Farmers can add products from the Products page or Farmer Dashboard.";
            }
            const preview = availableProducts.slice(0, 4).map(product => `${product.name} - ₹${product.price}/kg`).join("\n");
            return `Here are some listed products:\n${preview}\n\nOpen Products to see full quantities, quality, and locations.`;
        }
        if (text.includes("farmer") || text.includes("sell") || text.includes("list")) {
            return "Farmers can create an account, log in to the Farmer Dashboard, and list a harvest with quantity, price, quality, location, and description.";
        }
        if (text.includes("shopkeeper") || text.includes("buy") || text.includes("order")) {
            return "Shopkeepers can browse farmer listings, open product details, enter a required quantity, and send an order request directly to the farmer.";
        }
        if (text.includes("how") || text.includes("work")) {
            return "Crop Land works in three steps: farmers list produce, shopkeepers compare details, and both sides coordinate through a direct order request.";
        }
        if (text.includes("commission") || text.includes("charge") || text.includes("fee") || text.includes("revenue")) {
            return "CROPLAND charges a simple tiered commission on successful orders:\n• 1.5% for orders under ₹10,000\n• 3.0% for orders between ₹10,000 and ₹20,000\n• 5.0% for orders above ₹20,000\nThe remaining amount goes directly to the farmer.";
        }
        if (text.includes("login") || text.includes("account") || text.includes("password")) {
            return "Use Login / Sign Up to choose a Farmer or Shopkeeper workspace. New users can create an account, then sign in with their name and password.";
        }
        if (text.includes("contact") || text.includes("help")) {
            return "You can reach the Crop Land team at hello@cropland.example or use the Contact section on the home page.";
        }
        return "I can help with products, farmer listings, shopkeeper orders, login, and how Crop Land works. What would you like to know?";
    };

    const addMessage = (container, text, type) => {
        const message = document.createElement("div");
        message.className = `crop-chat-message ${type}`;
        message.textContent = text;
        container.appendChild(message);
        container.scrollTop = container.scrollHeight;
    };

    const askAssistant = async (question) => {
        if (window.CROP_LAND_AI_URL) {
            try {
                const response = await fetch(window.CROP_LAND_AI_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        question,
                        context: { products: products().slice(0, 20) }
                    })
                });
                const result = await response.json();
                if (response.ok && result.answer) return result.answer;
            } catch {
                // Use the local assistant if the AI endpoint is unavailable.
            }
        }
        return answer(question);
    };

    const init = () => {
        if (document.getElementById("cropChatPanel")) return;
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <button class="crop-chat-launcher" id="cropChatLauncher" type="button" aria-label="Open Crop Land Assistant" aria-expanded="false">✦</button>
            <section class="crop-chat-panel" id="cropChatPanel" aria-label="Crop Land Assistant" aria-live="polite">
                <header class="crop-chat-header">
                    <div><strong>Crop Land Assistant</strong><small>Marketplace guidance</small></div>
                    <button class="crop-chat-close" id="cropChatClose" type="button" aria-label="Close assistant">&times;</button>
                </header>
                <div class="crop-chat-messages" id="cropChatMessages"></div>
                <div class="crop-chat-suggestions">
                    <button class="crop-chat-suggestion" type="button" data-question="How does Crop Land work?">How it works</button>
                    <button class="crop-chat-suggestion" type="button" data-question="What products are available?">Available products</button>
                    <button class="crop-chat-suggestion" type="button" data-question="How can a farmer sell?">Farmer help</button>
                </div>
                <form class="crop-chat-form" id="cropChatForm">
                    <input class="crop-chat-input" id="cropChatInput" type="text" placeholder="Ask Crop Land..." autocomplete="off" required>
                    <button class="crop-chat-send" type="submit" aria-label="Send message">Send</button>
                </form>
            </section>`;
        document.body.appendChild(wrapper);

        const panel = document.getElementById("cropChatPanel");
        const launcher = document.getElementById("cropChatLauncher");
        const messages = document.getElementById("cropChatMessages");
        const input = document.getElementById("cropChatInput");
        addMessage(messages, "Hello. I am the Crop Land Assistant. Ask me about products, farmer listings, orders, or login.", "assistant");

        const openChat = () => {
            panel.classList.add("is-open");
            launcher.setAttribute("aria-expanded", "true");
            input.focus();
        };
        const closeChat = () => {
            panel.classList.remove("is-open");
            launcher.setAttribute("aria-expanded", "false");
        };
        launcher.addEventListener("click", () => panel.classList.contains("is-open") ? closeChat() : openChat());
        document.getElementById("cropChatClose").addEventListener("click", closeChat);
        document.getElementById("cropChatForm").addEventListener("submit", async event => {
            event.preventDefault();
            const question = input.value.trim();
            if (!question) return;
            addMessage(messages, question, "user");
            input.value = "";
            addMessage(messages, "Thinking...", "assistant");
            const response = await askAssistant(question);
            const thinkingMessage = messages.lastElementChild;
            if (thinkingMessage?.textContent === "Thinking...") {
                thinkingMessage.textContent = response;
            } else {
                addMessage(messages, response, "assistant");
            }
        });
        document.querySelectorAll(".crop-chat-suggestion").forEach(button => {
            button.addEventListener("click", () => {
                input.value = button.dataset.question;
                document.getElementById("cropChatForm").requestSubmit();
            });
        });
    };

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
