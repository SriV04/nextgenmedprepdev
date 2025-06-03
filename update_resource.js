const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration. Please check SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get all resources from the database with their metadata
 * @returns {Promise<Array>} Array of resource objects with metadata
 */
async function getAllResourcesFromDatabase() {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch resources from database: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching resources from database:', error.message);
    throw error;
  }
}

/**
 * Get all files from Supabase storage bucket
 * @param {string} bucketName - Name of the storage bucket
 * @param {string} folderPath - Path within the bucket (optional)
 * @returns {Promise<Array>} Array of file objects with paths and metadata
 */
async function getAllFilesFromStorage(bucketName = 'free-resources', folderPath = '') {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath, {
        limit: 1000, // Increase limit to get more files
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      throw new Error(`Failed to list files from storage: ${error.message}`);
    }

    // Recursively get files from subdirectories
    const allFiles = [];
    
    for (const item of data || []) {
      const itemPath = folderPath ? `${folderPath}/${item.name}` : item.name;
      
      if (item.id === null) {
        // This is a folder, recursively get its contents
        const subFiles = await getAllFilesFromStorage(bucketName, itemPath);
        allFiles.push(...subFiles);
      } else {
        // This is a file
        allFiles.push({
          name: item.name,
          fullPath: itemPath,
          size: item.metadata?.size || 0,
          lastModified: item.updated_at,
          contentType: item.metadata?.mimetype || 'unknown',
          bucket: bucketName
        });
      }
    }

    return allFiles;
  } catch (error) {
    console.error(`Error fetching files from storage bucket '${bucketName}':`, error.message);
    throw error;
  }
}

/**
 * Get a signed URL for a file in storage
 * @param {string} filePath - Path to the file in storage
 * @param {string} bucketName - Name of the storage bucket
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} Signed URL for the file
 */
async function getSignedUrl(filePath, bucketName = 'free-resources', expiresIn = 3600) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(`Failed to create signed URL for ${filePath}: ${error.message}`);
    }

    return data.signedUrl;
  } catch (error) {
    console.error(`Error creating signed URL for ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Cross-reference database resources with storage files
 * @returns {Promise<Object>} Object containing matched resources and orphaned files
 */
async function crossReferenceResourcesAndFiles() {
  try {
    const [dbResources, storageFiles] = await Promise.all([
      getAllResourcesFromDatabase(),
      getAllFilesFromStorage()
    ]);

    // Create maps for easy lookup
    const dbResourcesByPath = new Map();
    const storageFilesByPath = new Map();

    // Map database resources by file path
    dbResources.forEach(resource => {
      dbResourcesByPath.set(resource.file_path, resource);
    });

    // Map storage files by path
    storageFiles.forEach(file => {
      storageFilesByPath.set(file.fullPath, file);
    });

    // Find matched resources (exist in both DB and storage)
    const matchedResources = [];
    const missingFiles = [];

    for (const [filePath, resource] of dbResourcesByPath) {
      const storageFile = storageFilesByPath.get(filePath);
      if (storageFile) {
        matchedResources.push({
          ...resource,
          storageInfo: storageFile
        });
      } else {
        missingFiles.push(resource);
      }
    }

    // Find orphaned files (exist in storage but not in DB)
    const orphanedFiles = [];
    for (const [filePath, file] of storageFilesByPath) {
      if (!dbResourcesByPath.has(filePath)) {
        orphanedFiles.push(file);
      }
    }

    return {
      matchedResources,
      missingFiles,
      orphanedFiles,
      summary: {
        totalDbResources: dbResources.length,
        totalStorageFiles: storageFiles.length,
        matchedCount: matchedResources.length,
        missingFilesCount: missingFiles.length,
        orphanedFilesCount: orphanedFiles.length
      }
    };
  } catch (error) {
    console.error('Error cross-referencing resources and files:', error.message);
    throw error;
  }
}

/**
 * Main function to demonstrate usage
 */
async function main() {
  try {
    console.log('🔍 Fetching all resources and files...\n');

    // Get database resources
    console.log('📊 Database Resources:');
    const dbResources = await getAllResourcesFromDatabase();
    console.log(`Found ${dbResources.length} resources in database`);
    dbResources.forEach((resource, index) => {
      console.log(`  ${index + 1}. ${resource.name} (${resource.file_path})`);
    });

    console.log('\n📁 Storage Files:');
    const storageFiles = await getAllFilesFromStorage();
    console.log(`Found ${storageFiles.length} files in storage`);
    storageFiles.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name} (${file.fullPath}) - ${(file.size / 1024).toFixed(2)} KB`);
    });

    console.log('\n🔗 Cross-Reference Analysis:');
    const crossRef = await crossReferenceResourcesAndFiles();
    console.log(`✅ Matched resources: ${crossRef.matchedResources.length}`);
    console.log(`❌ Missing files: ${crossRef.missingFiles.length}`);
    console.log(`🗂️  Orphaned files: ${crossRef.orphanedFiles.length}`);

    if (crossRef.missingFiles.length > 0) {
      console.log('\n⚠️  Resources with missing files:');
      crossRef.missingFiles.forEach(resource => {
        console.log(`  - ${resource.name} (${resource.file_path})`);
      });
    }

    if (crossRef.orphanedFiles.length > 0) {
      console.log('\n📂 Orphaned files in storage:');
      crossRef.orphanedFiles.forEach(file => {
        console.log(`  - ${file.fullPath}`);
      });
    }

    // Example: Generate signed URLs for the first few files
    if (storageFiles.length > 0) {
      console.log('\n🔗 Sample signed URLs:');
      const sampleFiles = storageFiles.slice(0, 3);
      for (const file of sampleFiles) {
        try {
          const signedUrl = await getSignedUrl(file.fullPath);
          console.log(`  ${file.name}: ${signedUrl}`);
        } catch (error) {
          console.log(`  ${file.name}: Error generating URL - ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error in main function:', error.message);
    process.exit(1);
  }
}

// Export functions for use in other modules
module.exports = {
  getAllResourcesFromDatabase,
  getAllFilesFromStorage,
  getSignedUrl,
  crossReferenceResourcesAndFiles
};

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}