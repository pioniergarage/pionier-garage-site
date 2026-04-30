import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

const CMS_CONFIG_PATH = './.pages.yml';
const ASTRO_CONFIG_PATH = './src/content/config.ts';
const OUT_DIR = './src/schemas';
const OUT_FILE = path.join(OUT_DIR, 'generated-pages.ts');

console.log('📖 Parsing pages.yml...');

try {
  const file = fs.readFileSync(CMS_CONFIG_PATH, 'utf8');
  const config = yaml.parse(file);
  const astroConfigText = fs.existsSync(ASTRO_CONFIG_PATH) 
    ? fs.readFileSync(ASTRO_CONFIG_PATH, 'utf8') 
    : '';

  let generatedFileContent = `// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.\n`;
  generatedFileContent += `// These schemas mirror the 'type: file' models in pages.yml\n`;
  generatedFileContent += `import { z } from 'astro:content';\n\n`;

  let missingFieldsWarning = false;

  // Helper to map CMS field types to Zod types
  const getZodType = (field) => {
    let zType = 'z.any()';
    if (['string', 'text', 'rich-text'].includes(field.type)) zType = 'z.string()';
    if (field.type === 'date') zType = 'z.date()';
    if (field.type === 'boolean') zType = 'z.boolean()';
    if (field.type === 'number') zType = 'z.number()';
    
    if (!field.required) zType += '.optional()';
    return zType;
  };

  config.content.forEach(item => {
    // ==========================================
    // 1. VALIDATE COLLECTIONS
    // ==========================================
    if (item.type === 'collection') {
      console.log(`\n🔍 Validating '${item.name}' collection against config.ts...`);
      
      item.fields.forEach(field => {
        if (field.name === 'body') return;

        const regex = new RegExp(`\\b${field.name}\\b\\s*:`, 'i');
        if (!regex.test(astroConfigText)) {
          console.warn(`  ⚠️  WARNING: Field '${field.name}' is defined in pages.yml but missing in config.ts!`);
          missingFieldsWarning = true;
        }
      });
    }

    // // ==========================================
    // // 2. GENERATE SCHEMAS FOR STANDALONE FILES
    // // ==========================================
    // if (item.type === 'file') {
    //   console.log(`\n⚙️  Generating standalone schema for '${item.name}'...`);
      
    //   const fields = item.fields
    //     .filter(f => f.name !== 'body' && f.name !== 'layout')
    //     .map(f => {
    //       let zType = getZodType(f);
          
    //       // Handle complex blocks (like blocks array)
    //       if (f.type === 'block' && f.list && f.blocks) {
    //         const blockSchemas = f.blocks.map(b => {
    //           let blockFields = [];

    //           // Check if fields are inline
    //           if (b.fields) {
    //             blockFields = b.fields;
    //           } 
    //           // Check if it references a global component
    //           else if (b.component && config.components && config.components[b.component]) {
    //             blockFields = config.components[b.component].fields || [];
    //           }

    //           // Map resolved fields to Zod
    //           const bFieldsMapped = blockFields
    //             .map(bf => `${bf.name}: ${getZodType(bf)}`)
    //             .join(', ');

    //           return `z.object({ type: z.literal('${b.name}')${bFieldsMapped ? `, ${bFieldsMapped}` : ''} })`;
    //         });
            
    //         zType = `z.array(z.discriminatedUnion('type', [\n        ${blockSchemas.join(',\n        ')}\n      ]))`;
    //         // Blocks shouldn't have .optional() appended twice, handle carefully
    //         if (!f.required) zType += '.optional()'; 
    //       }

    //       return `  ${f.name}: ${zType},`;
    //     })
    //     .join('\n');

    //   const schemaName = `${item.name}PageSchema`;
    //   generatedFileContent += `export const ${schemaName} = z.object({\n${fields}\n});\n\n`;
    //   generatedFileContent += `export type ${item.name.charAt(0).toUpperCase() + item.name.slice(1)}PageProps = z.infer<typeof ${schemaName}>;\n\n`;
    // }
  });

  // if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  // fs.writeFileSync(OUT_FILE, generatedFileContent);
  // console.log(`\n✅ Generated standalone schemas at ${OUT_FILE}`);

  if (missingFieldsWarning) {
    console.log(`\n🚨 ACTION REQUIRED: Please update src/content/config.ts to include the missing fields listed above.`);
  } else {
    console.log(`\n✅ All collection fields map successfully to config.ts.`);
  }

} catch (error) {
  console.error('\n❌ Error syncing types:', error.message);
  process.exit(1);
}