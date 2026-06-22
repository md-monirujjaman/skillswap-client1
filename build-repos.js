const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Starting to create separate repos for Client and Server...");

// Directories
const rootDir = __dirname;
const clientRepo = path.join(rootDir, 'skillswap-client');
const serverRepo = path.join(rootDir, 'skillswap-server');

// Clean existing
if (fs.existsSync(clientRepo)) fs.rmSync(clientRepo, { recursive: true, force: true });
if (fs.existsSync(serverRepo)) fs.rmSync(serverRepo, { recursive: true, force: true });

// Create folders
fs.mkdirSync(clientRepo);
fs.mkdirSync(serverRepo);

/** Helper to copy files */
function copyRecursiveSync(src, dest, excludePaths = []) {
  if (excludePaths.some(p => src.endsWith(p))) return;
  
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName), excludePaths);
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// -------------------
// 1. CLIENT REPO
// -------------------
console.log("Building Client Repo...");
copyRecursiveSync(path.join(rootDir, 'src'), path.join(clientRepo, 'src'), ['server']);
copyRecursiveSync(path.join(rootDir, 'public'), path.join(clientRepo, 'public'));
['index.html', 'vite.config.ts', 'tailwind.css', 'tsconfig.json', 'postcss.config.js'].forEach(file => {
  if (fs.existsSync(path.join(rootDir, file))) {
    fs.copyFileSync(path.join(rootDir, file), path.join(clientRepo, file));
  }
});

// Create tailored package.json for Client
const originalPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const clientPkg = {
  name: "skillswap-client",
  version: "1.0.0",
  private: true,
  type: "module",
  scripts: {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  dependencies: { ...originalPkg.dependencies },
  devDependencies: { ...originalPkg.devDependencies }
};
// Remove server-specific stuff
delete clientPkg.dependencies.express;
delete clientPkg.dependencies.mongoose;
delete clientPkg.dependencies.stripe;
delete clientPkg.dependencies.jsonwebtoken;
delete clientPkg.dependencies.bcryptjs;
delete clientPkg.dependencies['cookie-parser'];
delete clientPkg.dependencies.dotenv;

fs.writeFileSync(path.join(clientRepo, 'package.json'), JSON.stringify(clientPkg, null, 2));
fs.writeFileSync(path.join(clientRepo, '.env.example'), "VITE_API_BASE_URL=http://localhost:3001\n");
fs.writeFileSync(path.join(clientRepo, '.gitignore'), "node_modules\ndist\n.env\n.env.local\n");

// -------------------
// 2. SERVER REPO
// -------------------
console.log("Building Server Repo...");
copyRecursiveSync(path.join(rootDir, 'src', 'server'), path.join(serverRepo, 'src'));

// For Vercel/Render, we need an entry point that doesn't use Vite middleware
const serverEntryContent = `
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import apiRouter from './src/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true })); // Important for separated deployment
app.use(express.json());
app.use(cookieParser());

// Database injection will happen in API or here
mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

app.use('/api', apiRouter);

app.get('/', (req, res) => res.send('SkillSwap API is running'));

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
fs.writeFileSync(path.join(serverRepo, 'index.js'), serverEntryContent);

const serverPkg = {
  name: "skillswap-server",
  version: "1.0.0",
  private: true,
  type: "module",
  scripts: {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  dependencies: {
    "express": "^4.19.2",
    "mongoose": "^8.3.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "cookie-parser": "^1.4.6",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "stripe": "^15.4.0",
    "better-auth": "^1.2.3"
  }
};
fs.writeFileSync(path.join(serverRepo, 'package.json'), JSON.stringify(serverPkg, null, 2));

const serverEnv = `PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=your_stripe_secret_key
# Better Auth Keys
BETTER_AUTH_SECRET=your_better_auth_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
`;
fs.writeFileSync(path.join(serverRepo, '.env.example'), serverEnv);
fs.writeFileSync(path.join(serverRepo, '.gitignore'), "node_modules\n.env\n.env.local\n");

console.log("");
console.log("=========================================");
console.log("✅ FINISHED!");
console.log("Your separate client and server repos have been generated.");
console.log(`- Client Code: ${clientRepo}`);
console.log(`- Server Code: ${serverRepo}`);
console.log("You can now download these folders, upload to two separate GitHub repos, and deploy to Vercel/Render.");
console.log("=========================================");
