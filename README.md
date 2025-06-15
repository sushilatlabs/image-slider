# Image Slider Assignment

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Solution

A React-based image slider application. It uses single canvas rendering to render the provided list of images with drag to change image feature.

## Features

- Single canvas element rendering
- Drag to change images
- Works on Chrome, Firefox and Safari browser

## Project Structure

```
image-slider/
|-- build/             # Production build
|-- public/            # Static files
|-- src/               # Source code
|   |-- components/    # React components
|   |-- hooks/         # Custom Hooks
|   |-- App.tsx        # Main application component
|   |-- index.tsx      # Application entry point
|-- package.json       # Project dependencies and scripts
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

## Building for Production

1. Create a production build:
```bash
npm run build
```

This will create a `build` directory with optimized production files.

## Running the Production Build

You can serve the production build using `nws` or `serve` static file server. Build release is attached in the repo. If you face any problem simply build it first by using steps above.

1. Using `nws` (Node Web Server):
```bash
npm install -g nws
nws -d build
```
2. Using `serve`:
```bash
npm install -g serve
serve -s build
```

## Browser Support

The application is tested and works on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
