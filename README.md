# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

# Google Drive Module

This module provides functionality for interacting with Google Drive, specifically for handling file uploads and creating shortcuts.

## Features

- File upload to Google Drive
- Automatic folder structure creation
- Support for creating shortcuts to files
- Organization by patient name, visit date, and ailments

## Installation

```bash
npm install
```

## Configuration

The module requires the following environment variables:

- `DRIVE_ROOT_DIR`: The root directory path in Google Drive where files will be stored

## Usage

```typescript
import { UploadService } from "./modules/google-drive";

const uploadService = new UploadService();

// Example usage
const result = await uploadService.uploadFile(req, res, oauth2Client);
```

## File Structure

Files are organized in the following structure:

```
{DRIVE_ROOT_DIR}/
  {patientName}/
    monthwise/
      {YYYY-MM-MMM}/
        {day}-{fileType}{extension}
    ailments/
      {ailment}/
        {YYYY-MM-MMM}/
          {fileShortcut}
    hospital/
      {hospital}/
        {YYYY-MM-MMM}/
          {fileShortcut}
```

## Dependencies

- googleapis: ^128.0.0
- moment: ^2.30.1

## Development

```bash
# Build the project
npm run build

# Run in development mode
npm run dev
```
