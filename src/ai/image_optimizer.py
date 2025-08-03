from PIL import Image, ImageOps
import io
from typing import Tuple, Optional, Dict
import os

class ImageOptimizer:
    def __init__(self):
        self.default_quality = 85
        self.default_max_size = (800, 800)
        self.supported_formats = {
            'JPEG': 'jpg',
            'PNG': 'png',
            'WEBP': 'webp'
        }

    def optimize_image(
        self,
        image_data: bytes,
        max_size: Optional[Tuple[int, int]] = None,
        quality: Optional[int] = None,
        format: str = 'WEBP'
    ) -> Dict[str, any]:
        """
        Optimize an image by resizing and compressing it.
        
        Args:
            image_data: Raw image bytes
            max_size: Maximum dimensions (width, height)
            quality: Compression quality (1-100)
            format: Output format ('WEBP', 'JPEG', 'PNG')
            
        Returns:
            Dict containing optimized image data and metadata
        """
        if max_size is None:
            max_size = self.default_max_size
        if quality is None:
            quality = self.default_quality

        # Open image
        img = Image.open(io.BytesIO(image_data))
        
        # Convert RGBA to RGB if necessary
        if img.mode == 'RGBA' and format == 'JPEG':
            img = self._remove_transparency(img)
        
        # Auto-orient image based on EXIF
        img = ImageOps.exif_transpose(img)
        
        # Get original size
        original_size = img.size
        original_format = img.format
        
        # Resize if needed
        if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Optimize and save
        output = io.BytesIO()
        
        save_kwargs = {
            'quality': quality,
            'optimize': True
        }
        
        # Format-specific optimizations
        if format == 'WEBP':
            save_kwargs.update({
                'method': 6,  # Highest compression method
                'lossless': False
            })
        elif format == 'JPEG':
            save_kwargs.update({
                'progressive': True
            })
        elif format == 'PNG':
            save_kwargs = {
                'optimize': True,
                'compress_level': 9  # Maximum compression
            }
        
        # Save optimized image
        img.save(output, format=format, **save_kwargs)
        optimized_data = output.getvalue()
        
        # Calculate compression ratio
        original_size_kb = len(image_data) / 1024
        optimized_size_kb = len(optimized_data) / 1024
        compression_ratio = (1 - (optimized_size_kb / original_size_kb)) * 100
        
        return {
            'data': optimized_data,
            'format': format.lower(),
            'original_size': original_size,
            'optimized_size': img.size,
            'original_weight_kb': round(original_size_kb, 2),
            'optimized_weight_kb': round(optimized_size_kb, 2),
            'compression_ratio': round(compression_ratio, 2),
            'quality': quality
        }

    def _remove_transparency(self, img: Image.Image) -> Image.Image:
        """Remove transparency by compositing on white background."""
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1])
            return background
        return img

    def get_supported_formats(self) -> list:
        """Get list of supported image formats."""
        return list(self.supported_formats.keys())

def create_optimizer() -> ImageOptimizer:
    """Helper function to create an image optimizer instance."""
    return ImageOptimizer()
