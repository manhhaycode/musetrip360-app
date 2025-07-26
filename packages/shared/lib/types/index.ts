/**
 * @fileoverview Shared Type Definitions
 *
 * Common TypeScript types used across the shared package
 */

export interface UploadFile {
  name: string;
}

export type BaseParams = {
  page: number;
  pageSize: number;
  search?: string;
};
