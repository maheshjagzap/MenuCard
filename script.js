const categories = [
  {
    name: "🍛 Main Course",
    dishes: ["Paneer Butter Masala", "Chicken Curry", "Mutton Masala", "Veg Kolhapuri", "Dal Fry", "Egg Curry", "Bhindi Masala"]
  },
  {
    name: "🥘 Starters",
    dishes: ["Chicken Lollipop", "Paneer Tikka", "Veg Crispy", "Fish Fry", "Mutton Seekh", "Veg Manchurian", "Hara Bhara Kebab"]
  },
  {
    name: "🍲 Soups",
    dishes: ["Tomato Soup", "Sweet Corn Soup", "Hot & Sour", "Chicken Clear", "Veg Clear", "Manchow Soup", "Lemon Coriander"]
  },
  {
    name: "🍹 Beverages",
    dishes: ["Coca Cola", "Pepsi", "Sprite", "Masala Soda", "Sweet Lassi", "Butter Milk", "Fresh Lime"]
  },
  {
    name: "🍞 Breads",
    dishes: ["Roti", "Butter Roti", "Naan", "Butter Naan", "Lachha Paratha", "Missi Roti", "Tandoori Roti"]
  },
  {
    name: "🍚 Rice",
    dishes: ["Plain Rice", "Jeera Rice", "Veg Pulao", "Chicken Biryani", "Egg Fried Rice", "Schezwan Rice", "Curd Rice"]
  },
  {
    name: "🍧 Desserts",
    dishes: ["Gulab Jamun", "Ice Cream", "Rasgulla", "Kheer", "Jalebi", "Brownie", "Fruit Salad"]
  },
  {
    name: "🥗 Salads",
    dishes: ["Green Salad", "Russian Salad", "Cucumber Salad", "Onion Salad", "Fruit Salad", "Sprouts", "Mix Veg"]
  },
  {
    name: "🧁 Bakery",
    dishes: ["Cup Cake", "Pastry", "Puffs", "Muffins", "Donut", "Cheese Sandwich", "Garlic Bread"]
  },
  {
    name: "☕ Hot Drinks",
    dishes: ["Tea", "Coffee", "Hot Chocolate", "Green Tea", "Lemon Tea", "Espresso", "Latte"]
  }
];

// Price map in localStorage, generate once
const priceMapKey = "priceMap";
let priceMap = JSON.parse(localStorage.getItem(priceMapKey)) || {};

function generatePriceMap() {
  if (Object.keys(priceMap).length === 0) {
    categories.forEach(cat => {
      cat.dishes.forEach(dish => {
        priceMap[dish] = Math.floor(Math.random() * 100 + 50);
      });
    });
    localStorage.setItem(priceMapKey, JSON.stringify(priceMap));
  }
}
generatePriceMap();

const basketKey = "basket";
let basket = JSON.parse(localStorage.getItem(basketKey)) || {};

function saveBasket() {
  localStorage.setItem(basketKey, JSON.stringify(basket));
  updateBasketCount();
}

function updateBasketCount() {
  const basketCount = Object.keys(basket).length;
  const badge = document.getElementById("basketCount");
  if (!badge) return;

  if (basketCount > 0) {
    badge.style.display = "inline-block";
    badge.textContent = basketCount;
  } else {
    badge.style.display = "none";
  }
}

function renderMenu() {
  const menuContainer = document.getElementById("menu");
  if (!menuContainer) return; // skip if on basket page

  menuContainer.innerHTML = "";
  categories.forEach(category => {
    const catDiv = document.createElement("div");
    catDiv.className = "category";

    const title = document.createElement("h2");
    title.textContent = category.name;
    catDiv.appendChild(title);

    category.dishes.forEach(dish => {
      const dishDiv = document.createElement("div");
      dishDiv.className = "dish";

      // Create checkbox with unique id
      const checkboxId = "chk_" + dish.replace(/\s+/g, "_");

      dishDiv.innerHTML = `
        <label for="${checkboxId}">
          <input type="checkbox" id="${checkboxId}" ${basket[dish] ? "checked" : ""} />
          <a href="#" onclick="return false;">${dish} - ₹${priceMap[dish]}</a>
        </label>
      `;

      catDiv.appendChild(dishDiv);

      const checkbox = dishDiv.querySelector("input[type=checkbox]");
      checkbox.addEventListener("change", () => toggleItem(dish));
    });

    menuContainer.appendChild(catDiv);
  });

  updateBasketCount();
}

function toggleItem(dish) {
  if (basket[dish]) {
    delete basket[dish];
  } else {
    basket[dish] = { qty: 1, price: priceMap[dish] };
  }
  saveBasket();
  renderMenu();
}

function renderBasket() {
  const basketContainer = document.getElementById("basketContainer");
  const totalEl = document.getElementById("total");
  if (!basketContainer || !totalEl) return;

  basketContainer.innerHTML = "";
  let total = 0;

  Object.keys(basket).forEach(dish => {
    const item = basket[dish];
    total += item.qty * item.price;

    const itemDiv = document.createElement("div");
    itemDiv.className = "basket-item";
    itemDiv.innerHTML = `
      <span>${dish} - ₹${item.price}</span>
      <span class="quantity-controls">
        <button class="qty-btn" data-dish="${dish}" data-change="-1">-</button>
        ${item.qty}
        <button class="qty-btn" data-dish="${dish}" data-change="1">+</button>
      </span>
    `;

    basketContainer.appendChild(itemDiv);
  });

  totalEl.textContent = total;

  basketContainer.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const dish = e.target.dataset.dish;
      const change = parseInt(e.target.dataset.change);
      updateQuantity(dish, change);
    });
  });
}

function updateQuantity(dish, change) {
  if (basket[dish]) {
    basket[dish].qty += change;
    if (basket[dish].qty <= 0) delete basket[dish];
  }
  saveBasket();
  renderBasket();
}

function init() {
  // If menu page
  if (document.getElementById("menu")) {
    renderMenu();

    // Basket emoji button click leads to basket.html
    const basketBtn = document.getElementById("basketBtn");
    if (basketBtn) {
      basketBtn.addEventListener("click", () => {
        window.location.href = "basket.html";
      });
    }
  }

  // If basket page
  if (document.getElementById("basketContainer")) {
    renderBasket();

    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }
  }
}

window.onload = init;
