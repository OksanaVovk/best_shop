# Capstone Project Template

**Suitcase Shop** – a responsive, multi-page web project built with plain JavaScript and SCSS.

Features include:

- **Responsive design** implemented according to three breakpoints:
  - Mobile: < 768px
  - Tablet: 768–1023px
  - Desktop: 1024–1439px
  - Large screens: ≥ 1440px

- **Multi-page layout** with consistent header, footer, and navigation.
- **Shopping cart logic** implemented in **pure JavaScript**.
- **Mock data** stored as JSON objects.
- Cart data is persisted in **localStorage**, so items remain between page reloads.
- **Responsive grid layout** for product listing.
- **Hamburger menu** for mobile devices.

This project demonstrates the ability to build a fully functional e-commerce front-end **without frameworks**, focusing on vanilla JS, SCSS, and responsive design principles.

## Setup & Run

1. **Install dependencies**

```bash
npm install
```

2. **Start development server (with live reload and SCSS watcher)**

```bash
npm run dev
```

This command will automatically compile SCSS on changes and serve src/index.html in your browser.

## Available Scripts

```bash
npm run dev        # start live server with SCSS watcher
npm run compile    # compile SCSS once
npm run watch:sass # watch SCSS and compile on changes
npm run serve      # serve index.html with live reload
npm run lint       # lint JS and CSS/SCSS
npm run lint:js    # lint JS only
npm run lint:css   # lint CSS/SCSS only
```

[Completed 64/64](docs/Final_Project_Implementation_Checklist_template.docx)
