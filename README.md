# Mata Elang Documentation

Official documentation repository for **Mata Elang - Network Monitoring Platform**, an open-source network security and intrusion detection system (NIDS) built on big data technologies.

## 📋 About Mata Elang

Mata Elang is the evolution of the Mata Garuda Internet Monitoring Project for Indonesia. It is a collaborative research initiative between:
- **Cyber Security Research Group (CSRG)** - Politeknik Elektronika Negeri Surabaya (PENS)
- **Universitas Indonesia (UI)**
- **Badan Riset dan Inovasi Nasional (BRIN)**
- Supported by **Japan International Cooperation Agency (JICA)**

### 🎯 Key Features

- **🚀 Effortless Setup**: Seamless Docker Compose-based deployment for quick installation and management across different environments
- **🔍 Advanced Intrusion Detection**: Integrates Snort (NIDS) with real-time packet inspection and rule-based threat detection
- **📊 Big Data Analytics**: Built on scalable big data platform for processing massive amounts of network traffic data efficiently
- **🏗️ Scalable Architecture**: Distributed deployment enabling monitoring across multiple network nodes without performance bottlenecks
- **🛡️ Real-Time Threat Detection**: Machine learning and behavioral analysis for detecting anomalies and providing proactive security responses

## 📚 About This Repository

This is the **documentation website** for Mata Elang Platform, built using [Docusaurus 3](https://docusaurus.io/), a modern static site generator. It provides comprehensive guides, tutorials, API references, and deployment instructions for users and operators.

### Documentation Versions

The documentation supports multiple versions:
- **2.1.0** (Unreleased) - Latest development version
- **2.0.0** (Latest Stable) - Current production release
- **1.1.0** - Legacy version
- **1.0.0** - Legacy version (unmaintained)

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 22.0
- **Yarn** 1.22.22+
- Git

### Installation

Install dependencies using Yarn:

```bash
yarn install
```

### Local Development

Start the development server with hot-reload:

```bash
yarn start
```

This command:
- Starts a local development server (typically at `http://localhost:3000`)
- Opens the documentation in your default browser
- Automatically reloads on file changes

### Building for Production

Generate optimized static content:

```bash
yarn build
```

This creates a production-ready build in the `build/` directory that can be deployed to any static hosting service.

### Serving Built Content

Preview the production build locally:

```bash
yarn serve
```

## 📦 Deployment

### Docker Deployment

For self-hosted deployments, you can containerize the documentation:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 3000
CMD ["yarn", "serve"]
```

Build and run:

```bash
docker build -t mata-elang-docs .
docker run -p 3000:3000 mata-elang-docs
```

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start development server with hot-reload |
| `yarn build` | Build production-ready static site |
| `yarn serve` | Serve the built site locally |
| `yarn deploy` | Build and deploy to GitHub Pages |
| `yarn lint` | Run ESLint on TypeScript/JavaScript files |
| `yarn format` | Format code with Prettier |
| `yarn format:check` | Check code formatting without changes |
| `yarn typecheck` | Run TypeScript type checking |
| `yarn clear` | Clear Docusaurus cache |

### Code Quality

Ensure code quality before committing:

```bash
# Check formatting
yarn format:check

# Check linting
yarn lint

# Check TypeScript types
yarn typecheck

# Auto-fix formatting
yarn format
```

## 📝 Contributing

### Adding Documentation

1. Create markdown files in the appropriate version directory under `versioned_docs/`
2. Add navigation entries to `versioned_sidebars/`
3. Use the frontmatter to set title and sidebar position:

```markdown
---
title: Your Document Title
sidebar_position: 1
---
```

### Content Guidelines

- Use clear, concise language
- Include examples and code blocks where applicable
- Add diagrams using Mermaid for architecture and process flows
- Link to related documentation
- Keep images optimized and stored in `static/img/`

## 🔗 Resources

- **Official Website**: https://mataelang.net
- **GitHub Organization**: https://github.com/mata-elang-stable
- **Research Paper**: [The Next-Generation NIDS Platform: Cloud-Based Snort NIDS Using Containers and Big Data](https://www.mdpi.com/2504-2289/6/1/19)
- **Community**:
  - Discord: https://discord.gg/csrg
  - CSRG Website: https://c307.pens.ac.id

## 📄 License

This documentation repository is licensed under the MIT License.

## 👥 Community & Support

For issues, questions, or contributions related to the documentation, please:

1. Check existing [GitHub Issues](https://github.com/mata-elang-stable/docs/issues)
2. Create a new issue with detailed information
3. Join our [Discord community](https://discord.gg/csrg) for real-time support

---

**Built with ❤️ by Cyber Security Research Group (CSRG) - PENS**
