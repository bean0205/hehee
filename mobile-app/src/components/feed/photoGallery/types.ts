export interface PhotoGalleryProps {
  photos: string[];
  onImagePress: (photos: string[], index: number) => void;
}
