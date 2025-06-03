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
 * Advanced resource and storage management utilities
 */
class ResourceStorageManager {
  constructor() {
    this.supabase = supabase;
    this.defaultBucket = 'free-resources';
  }

  /**
   * Get all resources from the database with optional filtering
   * @param {Object} filters - Optional filters for resources
   * @param {string[]} filters.allowedTiers - Filter by allowed tiers
   * @param {boolean} filters.isActive - Filter by active status
   * @param {string} filters.searchTerm - Search in name or description
   * @returns {Promise<Array>} Array of resource objects
   */
  async getAllResourcesFromDatabase(filters = {}) {
    try {
      let query = this.supabase
        .from('resources')
        .select('*');

      // Apply filters
      if (filters.allowedTiers && filters.allowedTiers.length > 0) {
        query = query.overlaps('allowed_tiers', filters.allowedTiers);
      }

      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

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
   * Get all files from Supabase storage bucket with metadata
   * @param {string} bucketName - Name of the storage bucket
   * @param {string} folderPath - Path within the bucket
   * @param {Object} options - Additional options
   * @param {string[]} options.fileTypes - Filter by file extensions
   * @param {number} options.maxSize - Maximum file size in bytes
   * @returns {Promise<Array>} Array of file objects with paths and metadata
   */
  async getAllFilesFromStorage(bucketName = this.defaultBucket, folderPath = '', options = {}) {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .list(folderPath, {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        throw new Error(`Failed to list files from storage: ${error.message}`);
      }

      const allFiles = [];
      
      for (const item of data || []) {
        const itemPath = folderPath ? `${folderPath}/${item.name}` : item.name;
        
        if (item.id === null) {
          // This is a folder, recursively get its contents
          const subFiles = await this.getAllFilesFromStorage(bucketName, itemPath, options);
          allFiles.push(...subFiles);
        } else {
          const fileInfo = {
            name: item.name,
            fullPath: itemPath,
            size: item.metadata?.size || 0,
            lastModified: item.updated_at,
            contentType: item.metadata?.mimetype || 'unknown',
            bucket: bucketName,
            extension: path.extname(item.name).toLowerCase()
          };

          // Apply filters
          let includeFile = true;

          if (options.fileTypes && options.fileTypes.length > 0) {
            includeFile = includeFile && options.fileTypes.includes(fileInfo.extension);
          }

          if (options.maxSize && fileInfo.size > options.maxSize) {
            includeFile = false;
          }

          if (includeFile) {
            allFiles.push(fileInfo);
          }
        }
      }

      return allFiles;
    } catch (error) {
      console.error(`Error fetching files from storage bucket '${bucketName}':`, error.message);
      throw error;
    }
  }

  /**
   * Get all available storage buckets
   * @returns {Promise<Array>} Array of bucket names
   */
  async getAllBuckets() {
    try {
      const { data, error } = await this.supabase.storage.listBuckets();
      console.log("📦 Listing all storage buckets...");
      

      if (error) {
        throw new Error(`Failed to list buckets: ${error.message}`);
      }

      return data.map(bucket => ({
        name: bucket.name,
        id: bucket.id,
        public: bucket.public,
        created_at: bucket.created_at,
        updated_at: bucket.updated_at
      }));
    } catch (error) {
      console.error('Error fetching buckets:', error.message);
      throw error;
    }
  }

  /**
   * Get comprehensive storage statistics
   * @returns {Promise<Object>} Storage statistics object
   */
  async getStorageStatistics() {
    try {
      const buckets = await this.getAllBuckets();
      const stats = {
        totalBuckets: buckets.length,
        buckets: {},
        totalFiles: 0,
        totalSize: 0
      };

      for (const bucket of buckets) {
        const files = await this.getAllFilesFromStorage(bucket.name);
        const bucketSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
        
        stats.buckets[bucket.name] = {
          fileCount: files.length,
          totalSize: bucketSize,
          formattedSize: this.formatFileSize(bucketSize),
          public: bucket.public,
          files: files
        };

        stats.totalFiles += files.length;
        stats.totalSize += bucketSize;
      }

      stats.formattedTotalSize = this.formatFileSize(stats.totalSize);
      return stats;
    } catch (error) {
      console.error('Error calculating storage statistics:', error.message);
      throw error;
    }
  }

  /**
   * Generate signed URLs for multiple files
   * @param {Array} filePaths - Array of file paths
   * @param {string} bucketName - Storage bucket name
   * @param {number} expiresIn - URL expiration time in seconds
   * @returns {Promise<Array>} Array of objects with file path and signed URL
   */
  async generateSignedUrls(filePaths, bucketName = this.defaultBucket, expiresIn = 3600) {
    const results = [];

    for (const filePath of filePaths) {
      try {
        const { data, error } = await this.supabase.storage
          .from(bucketName)
          .createSignedUrl(filePath, expiresIn);

        if (error) {
          results.push({
            filePath,
            signedUrl: null,
            error: error.message
          });
        } else {
          results.push({
            filePath,
            signedUrl: data.signedUrl,
            error: null
          });
        }
      } catch (error) {
        results.push({
          filePath,
          signedUrl: null,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Sync database resources with storage files
   * @param {Object} options - Sync options
   * @param {boolean} options.dryRun - If true, only show what would be done
   * @returns {Promise<Object>} Sync results
   */
  async syncResourcesWithStorage(options = { dryRun: true }) {
    try {
      const [dbResources, storageFiles] = await Promise.all([
        this.getAllResourcesFromDatabase(),
        this.getAllFilesFromStorage()
      ]);

      const results = {
        matched: [],
        missingInStorage: [],
        orphanedInStorage: [],
        suggestedActions: []
      };

      // Create lookup maps
      const storageFileMap = new Map(storageFiles.map(file => [file.fullPath, file]));
      const dbResourceMap = new Map(dbResources.map(resource => [resource.file_path, resource]));

      // Find matches and missing files
      for (const resource of dbResources) {
        const storageFile = storageFileMap.get(resource.file_path);
        if (storageFile) {
          results.matched.push({ resource, storageFile });
        } else {
          results.missingInStorage.push(resource);
          results.suggestedActions.push({
            type: 'upload_missing_file',
            resource: resource,
            message: `Upload file for resource: ${resource.name} (${resource.file_path})`
          });
        }
      }

      // Find orphaned files
      for (const file of storageFiles) {
        if (!dbResourceMap.has(file.fullPath)) {
          results.orphanedInStorage.push(file);
          results.suggestedActions.push({
            type: 'create_db_entry',
            file: file,
            message: `Create database entry for file: ${file.fullPath}`
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error syncing resources with storage:', error.message);
      throw error;
    }
  }

  /**
   * Format file size in human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Generate a comprehensive report
   * @returns {Promise<Object>} Comprehensive report object
   */
  async generateComprehensiveReport() {
    try {
      console.log('🔍 Generating comprehensive resource and storage report...\n');

      const [storageStats, syncResults] = await Promise.all([
        this.getStorageStatistics(),
        this.syncResourcesWithStorage()
      ]);

      const report = {
        timestamp: new Date().toISOString(),
        storageStatistics: storageStats,
        syncResults: syncResults,
        summary: {
          totalBuckets: storageStats.totalBuckets,
          totalFiles: storageStats.totalFiles,
          totalStorageSize: storageStats.formattedTotalSize,
          matchedResources: syncResults.matched.length,
          missingFiles: syncResults.missingInStorage.length,
          orphanedFiles: syncResults.orphanedInStorage.length,
          suggestedActions: syncResults.suggestedActions.length
        }
      };

      return report;
    } catch (error) {
      console.error('Error generating comprehensive report:', error.message);
      throw error;
    }
  }
}

/**
 * Main demonstration function
 */
async function main() {
  try {
    const manager = new ResourceStorageManager();
    
    console.log('🏠 NextGen MedPrep - Resource & Storage Manager');
    console.log('=' .repeat(50));

    // Generate comprehensive report
    const report = await manager.generateComprehensiveReport();
    
    console.log('📊 STORAGE STATISTICS');
    console.log('-'.repeat(30));
    console.log(`Total Buckets: ${report.summary.totalBuckets}`);
    console.log(`Total Files: ${report.summary.totalFiles}`);
    console.log(`Total Storage: ${report.summary.totalStorageSize}`);
    
    console.log('\n🗂️  BUCKETS BREAKDOWN');
    console.log('-'.repeat(30));
    for (const [bucketName, bucketInfo] of Object.entries(report.storageStatistics.buckets)) {
      console.log(`${bucketName}: ${bucketInfo.fileCount} files (${bucketInfo.formattedSize})`);
    }

    console.log('\n🔗 SYNC STATUS');
    console.log('-'.repeat(30));
    console.log(`✅ Matched Resources: ${report.summary.matchedResources}`);
    console.log(`❌ Missing Files: ${report.summary.missingFiles}`);
    console.log(`🗂️  Orphaned Files: ${report.summary.orphanedFiles}`);

    if (report.syncResults.missingInStorage.length > 0) {
      console.log('\n⚠️  RESOURCES WITH MISSING FILES');
      console.log('-'.repeat(30));
      report.syncResults.missingInStorage.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.name}`);
        console.log(`   File: ${resource.file_path}`);
        console.log(`   Tiers: ${resource.allowed_tiers.join(', ')}`);
      });
    }

    if (report.syncResults.orphanedInStorage.length > 0) {
      console.log('\n📂 ORPHANED FILES IN STORAGE');
      console.log('-'.repeat(30));
      report.syncResults.orphanedInStorage.forEach((file, index) => {
        console.log(`${index + 1}. ${file.fullPath} (${manager.formatFileSize(file.size)})`);
      });
    }

    if (report.syncResults.suggestedActions.length > 0) {
      console.log('\n💡 SUGGESTED ACTIONS');
      console.log('-'.repeat(30));
      report.syncResults.suggestedActions.forEach((action, index) => {
        console.log(`${index + 1}. ${action.message}`);
      });
    }

    // Demonstrate signed URL generation for matched resources
    const matchedFiles = report.syncResults.matched.slice(0, 3); // First 3 matches
    if (matchedFiles.length > 0) {
      console.log('\n🔗 SAMPLE SIGNED URLS');
      console.log('-'.repeat(30));
      const filePaths = matchedFiles.map(match => match.storageFile.fullPath);
      const signedUrls = await manager.generateSignedUrls(filePaths);
      
      signedUrls.forEach(result => {
        if (result.error) {
          console.log(`❌ ${result.filePath}: Error - ${result.error}`);
        } else {
          console.log(`✅ ${result.filePath}`);
          console.log(`   URL: ${result.signedUrl.substring(0, 80)}...`);
        }
      });
    }

    console.log('\n✨ Report completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in main function:', error.message);
    process.exit(1);
  }
}

// Export the ResourceStorageManager class and utility functions
module.exports = {
  ResourceStorageManager,
  main
};

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}
