# ChaiTailwind - Custom CSS Engine
**Web Dev Cohort 2026**

ChaiTailwind is a lightweight, utility-first CSS engine built entirely in vanilla JavaScript. It allows developers to style HTML elements rapidly by writing custom utility classes prefixed with `chai-` (e.g., `chai-bg-red`, `chai-p-4`). The engine scans the DOM and dynamically converts these classes into inline CSS styles.

---

## 🚀 How It Works

Instead of relying on complex string parsing or regular expressions, this engine uses a highly stable, beginner-friendly **Dictionary Mapping** approach. 



### The 3-Step Process:
1. **The Dictionary Object:** The `chai.js` file contains a large object called `chaiStyles`. This acts as our source of truth, mapping our custom classes directly to real CSS properties and values (e.g., `"chai-color-blue": { property: "color", value: "#3b82f6" }`).
2. **DOM Traversal:** The script uses `document.getElementsByTagName("*")` to grab every single HTML element rendered on the page. 
3. **Loop & Apply:** It loops through every element, and then loops through that element's `classList`. If it finds a class that matches a key in our `chaiStyles` dictionary, it applies that exact property and value directly to the element's inline `style` attribute.

---

## 🛠️ Supported Utilities

The engine supports a wide range of utility classes for building modern, responsive layouts:

* **Spacing:** Padding (`chai-p-*`, `chai-px-*`, `chai-py-*`) and Margin (`chai-m-*`, `chai-mt-*`, `chai-mx-auto`)
* **Colors:** Backgrounds (`chai-bg-red`, `chai-bg-gray`, etc.) and Text Colors (`chai-color-blue`, `chai-color-muted`, etc.)
* **Typography:** Font sizes (`chai-text-sm`, `chai-text-3xl`), Font weights (`chai-font-bold`), Font families (`chai-font-sans`, `chai-font-poppins`), and Alignment (`chai-text-center`)
* **Layout & Flexbox:** Display (`chai-flex`, `chai-block`), Direction (`chai-flex-col`), Justify/Align (`chai-justify-center`, `chai-items-center`), and Gaps (`chai-gap-2`)
* **Borders & Radius:** Border styles (`chai-border`, `chai-border-none`) and Border radius (`chai-rounded-md`, `chai-rounded-full`)
* **Sizing:** Width (`chai-w-full`, `chai-w-half`) and Height (`chai-h-screen`)
* **Effects:** Shadows (`chai-shadow-lg`) and Opacity (`chai-opacity-50`)

---

## 📂 Project Structure

* `index.html` - A premium, modern landing page built *entirely* using ChaiTailwind utility classes. It serves as both the demo and the visual documentation.
* `chai.js` - The core JavaScript engine containing the dictionary map and the DOM traversal loop.
* `README.md` - Project documentation and architecture explanation.

---

## 💻 How to Run Locally

1. Clone or download this repository to your local machine.
2. Ensure `index.html` and `chai.js` are in the same folder.
3. Open `index.html` in any modern web browser.
4. *Note: Because this uses a simple bottom-of-body execution script instead of an event listener, the `<script src="chai.js"></script>` tag must always remain at the very end of the HTML `<body>`.*

---

## 🔍 Verifying the Output

To see the engine in action:
1. Open the project in your browser.
2. Right-click on any styled element (like a button or a card) and select **"Inspect"**.
3. Look at the HTML in the Elements panel. You will see that the `chai-*` classes have been successfully translated into inline `style="..."` attributes by the JavaScript engine!