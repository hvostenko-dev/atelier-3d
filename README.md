# 👕 3D AI Shirt Designer & Configurator

An interactive 3D web configurator that enables real-time customization of apparel. Users can dynamically modify shirt color palettes, upload custom graphics, and generate AI-driven textures and logos directly onto 3D mesh surfaces using generative models.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

---

## 🎯 Features

- **Real-Time 3D Rendering:** Interactive 3D model manipulation (rotation, zoom, camera framing) powered by Three.js and React Three Fiber.
- **Dynamic Mesh Retexturing:** Seamless color swapping and texture mapping applied across UV coordinates in real time.
- **AI-Powered Assets:** Integration with generative AI APIs (DALL·E / Midjourney-style endpoints) to synthesize custom logos and full-coverage patterns on demand.
- **Custom Uploads:** Support for local image uploads as targeted decal stickers or full-surface textures.
- **State Management:** Reactive global state controlling 3D scene properties, canvas overlays, and UI panels.
- **Responsive Interface:** Modern, responsive control deck built with Tailwind CSS and animated transitions.

---

## 🛠 Tech Stack

- **Client Runtime:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **3D & Graphics:** [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **Animation & Transitions:** [Framer Motion](https://www.framer.com/motion/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Valtio](https://github.com/pmndrs/valtio)
- **AI Generation Backend:** Node.js / Express proxy integrating the OpenAI API

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (`v18.0.0` or higher recommended)
- Package manager: `npm`, `pnpm`, or `yarn`
- OpenAI API Key (required for prompt-based image generation)

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/ilyajavadeveloper/threejs-shirt-designer.git](https://github.com/ilyajavadeveloper/threejs-shirt-designer.git)
   cd threejs-shirt-designer
