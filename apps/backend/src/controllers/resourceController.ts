import { Request, Response } from 'express';
import supabaseService from '@/services/supabaseService';
import { AppError, ApiResponse } from '@nextgenmedprep/common-types';

export interface ResourceDownloadResponse {
  downloadUrl: string;
  expiresIn: number;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  file_path: string;
  allowed_tiers: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class ResourceController {
  // Generate signed URL for resource download
  async getResourceDownloadUrl(req: Request, res: Response): Promise<void> {
    const { email, resourceId } = req.params;
    const { source } = req.query;

    // Verify subscription exists and has access
    const subscription = await supabaseService.getSubscriptionByEmail(email);
    
    if (!subscription || subscription.unsubscribed_at) {
      throw new AppError('No active subscription found', 403);
    }

    console.log('Resource Controller: subscription found', {
      email,
      subscription_tier: subscription.subscription_tier,
    });

    // Check if user has access to this resource type
    const hasAccess = await this.checkResourceAccess(subscription.subscription_tier, resourceId);
    if (!hasAccess) {
      throw new AppError('Insufficient access level for this resource', 403);
    }

    // Get resource info to validate it exists
    const resource = await supabaseService.getResourceById(resourceId);
    if (!resource || !resource.is_active) {
      throw new AppError('Resource not found or inactive', 404);
    }

    console.log('Resource Controller: resource found', {
      resource_id: resource.id,
      resource_name: resource.name,
      resource_file_path: resource.file_path,
    });

    // Get signed URL from Supabase Storage
    const downloadUrl = await supabaseService.getResourceSignedUrl(resource.file_path);

    
    // Log download for analytics (optional)
    await supabaseService.logResourceDownload(email, resourceId, source as string);

    const response: ApiResponse<ResourceDownloadResponse> = {
      success: true,
      data: {
        downloadUrl,
        expiresIn: 3600, // 1 hour
      },
      message: 'Download URL generated successfully',
    };

    res.json(response);
  }

  // Check resource access based on subscription tier
  private async checkResourceAccess(subscriptionTier: string, resourceId: string): Promise<boolean> {
    const resource = await supabaseService.getResourceById(resourceId);
    
    if (!resource) {
      return false;
    }

    return resource.allowed_tiers.includes(subscriptionTier);
  }

  // List available resources for user
  async getUserResources(req: Request, res: Response): Promise<void> {
    const { email } = req.params;

    const subscription = await supabaseService.getSubscriptionByEmail(email);
    
    if (!subscription || subscription.unsubscribed_at) {
      throw new AppError('No active subscription found', 403);
    }

    const availableResources = await supabaseService.getResourcesForTier(subscription.subscription_tier);

    const response: ApiResponse<Resource[]> = {
      success: true,
      data: availableResources,
    };

    res.json(response);
  }

  // Get all resources (admin endpoint)
  async getAllResources(req: Request, res: Response): Promise<void> {
    const resources = await supabaseService.getAllResources();

    const response: ApiResponse<Resource[]> = {
      success: true,
      data: resources,
    };

    res.json(response);
  }

  // Create new resource (admin endpoint)
  async createResource(req: Request, res: Response): Promise<void> {
    const { id, name, description, file_path, allowed_tiers } = req.body;

    const resource = await supabaseService.createResource({
      id,
      name,
      description,
      file_path,
      allowed_tiers,
    });

    const response: ApiResponse<Resource> = {
      success: true,
      data: resource,
      message: 'Resource created successfully',
    };

    res.json(response);
  }

  // Update resource (admin endpoint)
  async updateResource(req: Request, res: Response): Promise<void> {
    const { resourceId } = req.params;
    const updates = req.body;

    const resource = await supabaseService.updateResource(resourceId, updates);

    const response: ApiResponse<Resource> = {
      success: true,
      data: resource,
      message: 'Resource updated successfully',
    };

    res.json(response);
  }

  // Delete resource (admin endpoint)
  async deleteResource(req: Request, res: Response): Promise<void> {
    const { resourceId } = req.params;

    await supabaseService.deleteResource(resourceId);

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Resource deleted successfully',
    };

    res.json(response);
  }
}
