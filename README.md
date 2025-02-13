# Streamify

Streamify is a music streaming analytics dashboard built using TypeScript and Next.js, with styling provided by Tailwind CSS. It utilizes the Last.fm API to fetch and display key metrics and data visualizations, providing insights into user activity, revenue, and content performance. The dashboard is designed to be functional, visually appealing, responsive, and user-friendly.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **Dashboard Overview**: A single-page application (SPA) that includes:
  - **Key Metrics**: Display cards for total users, active users, total streams, revenue, and top artist.
  - **Data Visualization**: Charts for user growth, revenue distribution, and top 5 streamed songs.
  - **Data Table**: Detailed information about recent streams.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **User-Friendly Interface**: Intuitive and easy to navigate.

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed:

- Node.js
- pnpm (Preferred Node Package Manager)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Byte-Vortex/Streamify.git
    ```

2. Navigate to the project directory:
    ```sh
    cd Streamify
    ```

3. Install the dependencies:
    ```sh
    pnpm install
    ```

---

## Usage

To start the development server, run:
```sh
pnpm dev
```

---

## API Integration

This project uses the Last.fm API to fetch data. To use the API, you need to obtain an API key from Last.fm and add it to your environment variables.

---

## Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

```env
NEXT_PUBLIC_LAST_FM_API_KEY=your_api_key_here
NEXT_PUBLIC_LAST_FM_BASE_URL=https://ws.audioscrobbler.com/2.0/
```

Replace `your_api_key_here` with your actual Last.fm API key.

---

## Deployment

This project is hosted on Vercel. You can visit the live application at [streamify-bytevortex.vercel.app](https://streamify-bytevortex.vercel.app).

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project.
2. Create your Feature Branch:
   ```sh
   git checkout -b feature/AmazingFeature
   ```
3. Commit your Changes:
   ```sh
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the Branch:
   ```sh
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request.

---

## Contact

**Byte-Vortex**  
GitHub: [@ByteVortex](https://github.com/Byte-Vortex)  
Email: email@example.com  

Project Link: [https://github.com/Byte-Vortex/Streamify](https://github.com/Byte-Vortex/Streamify)

