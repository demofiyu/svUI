# ShubhViah - Premium Digital Invitation Web App

ShubhViah is a premium digital invitation creator and viewer designed specifically for weddings and special events. It features dynamic animations, background music playback, interactive event timelines, countdown timers, and direct WhatsApp RSVP messaging.

This web application runs entirely serverless by encoding your customized invitation details directly into the URL, allowing you to host the site completely free as a static web app on Render or GitHub Pages!

## ✨ Key Features

- **🌸 Interactive Premium Invitation**: Gorgeous animations like falling flower petals, pulsing buttons, and parallax backgrounds.
- **🎨 Visual Themes**: Four premium visual themes:
  - **Royal Crimson** (Traditional red & gold)
  - **Pastel Sage** (Modern chic floral & rose gold)
  - **Emerald Saffron** (Deep royal green & glittering gold)
  - **Peacock Symphony** (Vibrant blue, teal & mustard)
- **⏳ Countdown Timer**: Live countdown to the wedding ceremony date.
- **📍 Interactive Timeline**: Displays multiple ceremonies (Haldi, Phere, Reception) with dates, times, venue details, and direction buttons linking directly to Google Maps.
- **🎵 Background Music**: Toggleable background music supporting preset traditional sitar, flute, romantic piano, or custom MP3 URLs.
- **📲 Direct WhatsApp RSVP**: Guests fill out the RSVP form, which instantly triggers a pre-formatted WhatsApp message directly to the host's phone.
- **📋 RSVP Tracker**: Builder dashboard features a live statistics panel and table to preview RSVPs stored locally.
- **🔗 Serverless URL Encoding**: Encodes the entire invitation configuration into a Base64 string in the URL hash, allowing you to share unique cards with simple links.

## 🚀 How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🌐 Deploy to Render

This repository is pre-configured with a `render.yaml` file for effortless deployment on Render as a **Static Site**:

1. Push your code to GitHub.
2. Sign in to [Render](https://render.com).
3. Click **New** -> **Blueprint**.
4. Select your repository.
5. Render will automatically detect the settings from `render.yaml` and set up the static web app (build command: `npm install && npm run build`, publish directory: `dist`).
6. Click **Apply** and your digital invitation app will be live on a secure HTTPS Render sub-domain!
