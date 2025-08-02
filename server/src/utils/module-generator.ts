// src/module-generator.ts
import fs from "fs";
import path from "path";

// Use CommonJS __filename and __dirname directly
// __filename and __dirname are available by default in CommonJS modules

const moduleName = process.argv[2];

if (!moduleName) {
  console.error(
    "❌ Please provide a module name.\nExample: npm run module:User"
  );
  process.exit(1);
}

const srcDir = path.resolve(__dirname, "..");
const baseDir = path.join(srcDir, "modules", moduleName);

// Create module folder
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
  console.log(`📁 Created folder: ${baseDir}`);
} else {
  console.log("⚠️ Module folder already exists!");
}

// Template for the files
const createFile = (filename: string, content: string) => {
  const filePath = path.join(baseDir, `${moduleName}.${filename}.ts`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content.trim());
    console.log(`✅ Created: ${filePath}`);
  } else {
    console.log(`⚠️ File already exists: ${filePath}`);
  }
};

// File templates
createFile("route", `// ${moduleName} routes`);
createFile("controller", `// ${moduleName} controller`);
createFile("service", `// ${moduleName} service`);
createFile("model", `// ${moduleName} model`);
createFile("interface", `// ${moduleName} interface`);
