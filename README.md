---

# 3DSimulation-Web | Immersive 3D Virtual Simulation Platform for Field Geology Practice

![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript)
![Cesium](https://img.shields.io/badge/Cesium-JS-orange)
![Vite](https://img.shields.io/badge/Vite-2.x-646CFF?logo=vite)

## 📖 Introduction

**3DSimulation-Web** is an immersive WebGL-based simulation platform developed to address the challenges in traditional field geology teaching, such as spatiotemporal constraints, the irreversibility of geological processes, and the multi-scale complexity of geological phenomena.

This study integrates realistic three-dimensional modeling with virtual reality technology to support the full **"Preview-Teaching-Practice-Assessment"** cycle. By transcending the limitations of traditional 2D views, the platform enables students to visualize dynamic geological evolution and conduct interactive exploration in a virtual environment, fostering systematic geological thinking.

## ✨ Key Features

*   **Immersive 3D Visualization**: Built on the **Cesium** and **Mars3D** engines, the platform renders high-precision terrain imagery and oblique photography models to replicate real-world geological scenes.
*   **Interactive Geological Tools**:
    *   **Virtual Roaming**: Supports navigation in both first-person and third-person perspectives.
    *   **Spatial Analysis**: Includes tools for viewshed analysis, profile cutting, attitude measurement (strike/dip), and distance/area measurement.
    *   **Dynamic Annotation**: Allows plotting and attribute editing for points, polylines, and polygons.
*   **Business Modules**:
    *   **DigSchool**: Visualization of fundamental geological models within a digital campus context.
    *   **Practice**: Built-in geological field routes integrated with GeoJSON data to display stratigraphic boundaries, faults, and functional zones.
*   **Resource Management**: Supports loading diverse GIS data formats (GeoJSON, GLTF, 3DTiles) from local or cloud sources.

## 📂 Project Structure

This project is built using **Vue 3 + TypeScript**. The core directory structure is organized as follows:

```text
3DSimulation-Web/
├── public/
│   ├── data/            # Core GIS data for simulation (GeoJSON/Json)
│   │   ├── geojson/     # Vector data for strata profiles, faults, etc.
│   │   └── config/      # Resource configurations (layertree, resources)
│   └── libs/            # Third-party GIS dependencies (Cesium, Mars3D, Babylon)
├── src/
│   ├── api/             # HTTP requests and backend interfaces
│   ├── config/          # Global configurations
│   │   ├── cesium/      # Cesium scene initialization and map tools config
│   │   └── menu/        # System menu and routing configuration
│   ├── libs/            # Core 3D logic encapsulation
│   │   └── cf3d/        # Custom geological tools (Profile analysis, Mask clipping)
│   ├── store/           # Vuex state management (Map state, Toolbar state)
│   ├── utils/           # Utility functions (Coordinate conversion, Tree handling)
│   └── views/           # UI View Components
│       ├── business/    # Specific business modules
│       │   ├── digSchool/  # Digital Campus module
│       │   └── practice/   # Field Practice module (Annotation, Tree controls)
│       ├── cesium/      # Map container and interaction components
│       └── layout/      # Main layout (Header, Menu, Tools)
├── .env.development     # Development environment variables
└── vite.config.ts       # Vite build configuration
```

## 🛠️ Installation and Usage

Follow these steps to set up the project in your local environment.

### Prerequisites
*   **Node.js**: Recommended version v16.0 or higher.
*   **Git**: For version control.

### 1. Clone the Repository
```bash
git clone https://github.com/LiuYuhang321/3DSimulation-Web.git
cd 3DSimulation-Web
```

### 2. Install Dependencies
Install the required packages using npm or yarn:
```bash
npm install
# OR
yarn install
```

### 3. Run Development Server
Start the project in local development mode with hot-reload:
```bash
npm run dev
```
Access the application at: `http://localhost:3000` (Please check the console for the specific port).

### 4. Build for Production
Compile and minify the code for production deployment:
```bash
npm run build
```

## 🤝 Citation

If you use this platform or code in your research, please cite our paper:

> [Placeholder: Title of your paper, Journal/Conference Name, Year, DOI, etc.]

## 📄 License & Copyright

**© 2023-2025 LiuYuhang321. All Rights Reserved.**

This source code is provided for **academic review and research verification purposes only**.

The following restrictions apply:
1.  **No Copying**: You are not allowed to copy, distribute, or mirror this repository without explicit permission.
2.  **No Modification**: You are not allowed to modify, merge, publish, or sublicense the source code.
3.  **No Commercial Use**: This software is strictly prohibited for commercial use.

For commercial licensing, collaboration, or permission requests, please contact: **tb25010023a41@cumt.edu.cn**
